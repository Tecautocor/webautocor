import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";
import { normalizarAgencia } from "../../../../lib/agenciaAliases";

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const anioActual = new Date().getFullYear();

  // Comparativa interanual: carga historica real de Pilot (VentaHistoricoImport,
  // cubre 2023-2026 completo, sin huecos, tras la importacion del 2026-09-17
  // desde el export "sin filtro" de Pilot) combinada con el webhook en vivo
  // (VentaWebhookLog, estado "Registrado") desde el 20-ago-2026.
  // Se agrupa por fechaAlta (fecha en que se registro la venta), NO por
  // fechaAprobacion - verificado contra el Tablero de control del cliente
  // (2026-09-17): fechaAprobacion puede quedar varios dias/semanas despues de
  // fechaAlta y corre ventas al mes siguiente, lo que descuadraba el conteo
  // mensual contra lo que el cliente lleva. Con fechaAlta el match es cercano
  // en todos los meses (dentro de un ~5%, salvo febrero).
  // OJO: algunas ventas creadas antes del 20-ago llegan al webhook DESPUES de
  // esa fecha (el webhook agrupa por fechaAlta, no por receivedAt) - por eso el
  // historico excluye explicitamente cualquier ventaId que ya este en el
  // webhook, para no contar la misma venta dos veces.
  const [historicoPorAnioMes, enVivoPorAnioMes] = await Promise.all([
    db.$queryRawUnsafe(
      `SELECT YEAR(h.fechaAlta) AS anio, MONTH(h.fechaAlta) AS mes, COUNT(*) AS n
       FROM VentaHistoricoImport h
       LEFT JOIN (SELECT DISTINCT ventaId FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO') w
         ON w.ventaId = h.ventaId
       WHERE h.fechaAlta IS NOT NULL AND w.ventaId IS NULL
       GROUP BY anio, mes`
    ),
    db.$queryRawUnsafe(
      `SELECT YEAR(fechaAlta) AS anio, MONTH(fechaAlta) AS mes, COUNT(DISTINCT ventaId) AS n
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'REGISTRADO' AND fechaAlta IS NOT NULL
       GROUP BY anio, mes`
    ),
  ]);
  const ventasPorAnioMesMap = new Map();
  for (const r of [...historicoPorAnioMes, ...enVivoPorAnioMes]) {
    const key = `${r.anio}-${r.mes}`;
    ventasPorAnioMesMap.set(key, (ventasPorAnioMesMap.get(key) || 0) + Number(r.n));
  }
  const ventasPorAnioMes = [...ventasPorAnioMesMap.entries()]
    .map(([key, n]) => {
      const [anio, mes] = key.split("-").map(Number);
      return { anio, mes, n };
    })
    .sort((a, b) => a.anio - b.anio || a.mes - b.mes);

  // Vendedores: SOLO el anio en curso (a proposito - un ranking con todo el
  // historico mezclaria vendedores que ya no trabajan ahi con el equipo
  // actual). Combina la carga historica con el webhook en vivo en estado
  // "Registrado" (desde el 20-ago-2026), agrupando por fechaAlta igual que
  // arriba.
  const [porVendedorHistorico, porVendedorEnVivo] = await Promise.all([
    db.$queryRawUnsafe(
      `SELECT h.vendedorNombre AS vendedor, h.sucursal AS agencia, COUNT(*) AS n
       FROM VentaHistoricoImport h
       LEFT JOIN (SELECT DISTINCT ventaId FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO') w
         ON w.ventaId = h.ventaId
       WHERE YEAR(h.fechaAlta) = ? AND w.ventaId IS NULL
         AND h.vendedorNombre IS NOT NULL AND h.vendedorNombre != ''
       GROUP BY vendedor, agencia`,
      anioActual
    ),
    db.$queryRawUnsafe(
      `SELECT vendedorNombre AS vendedor, TRIM(sucursal) AS agencia, COUNT(DISTINCT ventaId) AS n
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'REGISTRADO' AND YEAR(fechaAlta) = ?
         AND vendedorNombre IS NOT NULL AND vendedorNombre != ''
       GROUP BY vendedor, agencia`,
      anioActual
    ),
  ]);
  const porVendedorMap = new Map();
  for (const r of [...porVendedorHistorico, ...porVendedorEnVivo]) {
    const agencia = normalizarAgencia(r.agencia);
    const key = `${r.vendedor}|${agencia}`;
    porVendedorMap.set(key, {
      vendedor: r.vendedor,
      agencia,
      n: (porVendedorMap.get(key)?.n || 0) + Number(r.n),
    });
  }
  const porVendedor = [...porVendedorMap.values()].sort((a, b) => b.n - a.n).slice(0, 30);

  // Rentabilidad: baseline historico (para tener con que comparar) + eventos
  // reales en vivo del webhook (VentaWebhookLog) que se van acumulando desde
  // que se activo la regla en Pilot.
  const historicoAgg = await db.$queryRawUnsafe(
    `SELECT COUNT(*) AS n,
            AVG(h.pctDescuento) AS descuentoProm,
            SUM(CASE WHEN h.montoFinanciado > 0 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS pctFinanciadas,
            AVG(NULLIF(h.usadoRentabilidadEstimada, 0)) AS usadoRentabilidadProm,
            AVG(h.totalTransaccion) AS ticketPromedio
     FROM VentaHistoricoImport h
     LEFT JOIN (SELECT DISTINCT ventaId FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO') w
       ON w.ventaId = h.ventaId
     WHERE w.ventaId IS NULL`
  );

  const enVivo = await db.ventaWebhookLog.findMany({
    // El dato crudo trae un espacio al final ("Registrado "). La collation de
    // esta columna (utf8mb4_0900_ai_ci) no lo ignora en comparaciones exactas,
    // asi que un `estado: "Registrado"` literal nunca matchea nada - se usa
    // startsWith para que sea robusto a eso, igual que el resto del archivo
    // usa TRIM() en las consultas SQL crudas.
    where: { estado: { startsWith: "Registrado" } },
    select: {
      ventaId: true,
      precioLista: true,
      totalTransaccion: true,
      descuentoVendedor: true,
      descuentoGerente: true,
      montoFinanciado: true,
      banco: true,
      usadoValorEstimado: true,
      usadoCostoReparacion: true,
      usadoRentabilidadEstimada: true,
      comisionVendedor: true,
      sucursal: true,
      receivedAt: true,
    },
    orderBy: { receivedAt: "desc" },
    take: 500,
  });

  const h = historicoAgg[0];

  return res.status(200).json({
    anioActual,
    ventasPorAnioMes: ventasPorAnioMes.map((r) => ({ anio: Number(r.anio), mes: Number(r.mes), n: Number(r.n) })),
    porVendedor: porVendedor.map((r) => ({ vendedor: r.vendedor, agencia: r.agencia, n: Number(r.n) })),
    rentabilidadHistorico: {
      n: Number(h.n),
      descuentoProm: h.descuentoProm !== null ? Number(h.descuentoProm) : null,
      pctFinanciadas: h.pctFinanciadas !== null ? Number(h.pctFinanciadas) : null,
      usadoRentabilidadProm: h.usadoRentabilidadProm !== null ? Number(h.usadoRentabilidadProm) : null,
      ticketPromedio: h.ticketPromedio !== null ? Number(h.ticketPromedio) : null,
    },
    rentabilidadEnVivo: enVivo,
  });
}

export default handler;
