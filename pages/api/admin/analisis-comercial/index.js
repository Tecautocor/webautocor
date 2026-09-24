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

  // Comparativas "al dia": mismo rango de fechas este anio vs el anterior
  // (1-ene a hoy, y 1ro del mes a hoy). La comparativa por meses de arriba
  // cuenta el mes en curso completo del anio anterior contra el mes a medias
  // de este anio; estas no. "Hoy" se toma en hora de Ecuador.
  const comparativaAlDia = await calcularComparativaAlDia();

  // Vendedores: SOLO el anio en curso (a proposito - un ranking con todo el
  // historico mezclaria vendedores que ya no trabajan ahi con el equipo
  // actual). Combina la carga historica con el webhook en vivo en estado
  // "Registrado" (desde el 20-ago-2026), agrupando por fechaAlta igual que
  // arriba.
  const [porVendedorHistorico, porVendedorEnVivo] = await Promise.all([
    db.$queryRawUnsafe(
      `SELECT h.vendedorNombre AS vendedor, h.sucursal AS agencia, MONTH(h.fechaAlta) AS mes, COUNT(*) AS n
       FROM VentaHistoricoImport h
       LEFT JOIN (SELECT DISTINCT ventaId FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO') w
         ON w.ventaId = h.ventaId
       WHERE YEAR(h.fechaAlta) = ? AND w.ventaId IS NULL
         AND h.vendedorNombre IS NOT NULL AND h.vendedorNombre != ''
       GROUP BY vendedor, agencia, mes`,
      anioActual
    ),
    db.$queryRawUnsafe(
      `SELECT vendedorNombre AS vendedor, TRIM(sucursal) AS agencia, MONTH(fechaAlta) AS mes, COUNT(DISTINCT ventaId) AS n
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'REGISTRADO' AND YEAR(fechaAlta) = ?
         AND vendedorNombre IS NOT NULL AND vendedorNombre != ''
       GROUP BY vendedor, agencia, mes`,
      anioActual
    ),
  ]);
  const porVendedorMap = new Map();
  // Mismo conteo desglosado por mes, para el filtro de mes del ranking.
  const porVendedorMesMap = new Map();
  for (const r of [...porVendedorHistorico, ...porVendedorEnVivo]) {
    // El webhook en vivo trae el nombre del vendedor con un espacio al final
    // en algunos casos (mismo tipo de dato crudo que "estado"), mientras el
    // historico no - sin el trim() esa misma persona quedaba partida en 2
    // filas distintas del ranking (una por fuente).
    const vendedor = (r.vendedor || "").trim();
    const agencia = normalizarAgencia(r.agencia);
    const mes = Number(r.mes);
    const key = `${vendedor}|${agencia}`;
    porVendedorMap.set(key, {
      vendedor,
      agencia,
      n: (porVendedorMap.get(key)?.n || 0) + Number(r.n),
    });
    const keyMes = `${key}|${mes}`;
    porVendedorMesMap.set(keyMes, {
      vendedor,
      agencia,
      mes,
      n: (porVendedorMesMap.get(keyMes)?.n || 0) + Number(r.n),
    });
  }
  // Sin límite (antes .slice(0, 30)): el frontend ahora agrupa por sucursal,
  // asi que necesita el listado completo, no solo el top 30 global.
  const porVendedor = [...porVendedorMap.values()].sort((a, b) => b.n - a.n);

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

  const enVivoRaw = await db.ventaWebhookLog.findMany({
    // El dato crudo trae un espacio al final ("Registrado "). La collation de
    // esta columna (utf8mb4_0900_ai_ci) no lo ignora en comparaciones exactas,
    // asi que un `estado: "Registrado"` literal nunca matchea nada - se usa
    // startsWith para que sea robusto a eso, igual que el resto del archivo
    // usa TRIM() en las consultas SQL crudas.
    where: { estado: { startsWith: "Registrado" } },
    // Sin datos del cliente (politica de privacidad del modulo BI).
    select: {
      ventaId: true,
      fechaAlta: true,
      marca: true,
      modelo: true,
      version: true,
      color: true,
      vendedorNombre: true,
      origen: true,
      pctDescuento: true,
      cuotasFinanciadas: true,
      montoRetomaUsado: true,
      usadoMarca: true,
      usadoModelo: true,
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
    // Antes 500: ahora el frontend filtra por mes/agencia, y con ~200 ventas al
    // mes un tope bajo cortaria en silencio los meses mas viejos.
    take: 3000,
  });
  // Pilot puede reenviar el mismo webhook mas de una vez para la misma venta
  // (mismo patron ya manejado con GROUP BY ventaId en Performance/Embudo) -
  // aqui se dedupea en JS quedandose con la entrega mas reciente por ventaId
  // (ya viene ordenado por receivedAt desc, asi que la primera ocurrencia es
  // la mas nueva).
  const ventaIdVistos = new Set();
  const enVivo = enVivoRaw
    .filter((r) => {
      if (ventaIdVistos.has(r.ventaId)) return false;
      ventaIdVistos.add(r.ventaId);
      return true;
    })
    // Mismo nombre de agencia que el ranking de vendedores (alias El Recreo -> Quicentro Sur).
    .map((r) => ({ ...r, sucursal: normalizarAgencia(r.sucursal) }));

  const h = historicoAgg[0];

  return res.status(200).json({
    anioActual,
    ventasPorAnioMes: ventasPorAnioMes.map((r) => ({ anio: Number(r.anio), mes: Number(r.mes), n: Number(r.n) })),
    comparativaAlDia,
    porVendedor: porVendedor.map((r) => ({ vendedor: r.vendedor, agencia: r.agencia, n: Number(r.n) })),
    porVendedorMes: [...porVendedorMesMap.values()],
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

// Ventas registradas con fechaAlta en [desde, hasta) - mismas dos fuentes y
// misma exclusion de duplicados que la comparativa interanual.
async function contarVentas(desde, hasta) {
  const [[hist], [vivo]] = await Promise.all([
    db.$queryRawUnsafe(
      `SELECT COUNT(*) AS n
       FROM VentaHistoricoImport h
       LEFT JOIN (SELECT DISTINCT ventaId FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO') w
         ON w.ventaId = h.ventaId
       WHERE h.fechaAlta >= ? AND h.fechaAlta < ? AND w.ventaId IS NULL`,
      desde,
      hasta
    ),
    db.$queryRawUnsafe(
      `SELECT COUNT(DISTINCT ventaId) AS n
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'REGISTRADO' AND fechaAlta >= ? AND fechaAlta < ?`,
      desde,
      hasta
    ),
  ]);
  return Number(hist.n) + Number(vivo.n);
}

const pad = (n) => String(n).padStart(2, "0");
const fechaStr = (anio, mes, dia) => `${anio}-${pad(mes)}-${pad(dia)}`;
// Dia siguiente (limite exclusivo del rango), sin problemas de zona horaria.
const diaSiguiente = (anio, mes, dia) => {
  const d = new Date(Date.UTC(anio, mes - 1, dia + 1));
  return fechaStr(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
};

async function calcularComparativaAlDia() {
  const hoyEc = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Guayaquil" }).format(new Date());
  const [anio, mes, dia] = hoyEc.split("-").map(Number);
  const anioAnt = anio - 1;
  // 29-feb no existe el anio anterior: se compara hasta el 28.
  const ultimoDiaMesAnt = new Date(Date.UTC(anioAnt, mes, 0)).getUTCDate();
  const diaAnt = Math.min(dia, ultimoDiaMesAnt);
  const mesSiguienteAnt = new Date(Date.UTC(anioAnt, mes, 1));

  // Ultima venta con datos: si la base no esta al dia (ej. copia local),
  // la comparativa "al dia" sale baja sin que sea una caida real.
  const [ultima] = await db.$queryRawUnsafe(
    `SELECT MAX(f) AS ultima FROM (
       SELECT MAX(fechaAlta) AS f FROM VentaHistoricoImport
       UNION ALL
       SELECT MAX(fechaAlta) FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO'
     ) t`
  );
  const ultimaVenta = ultima?.ultima || null;

  // Factor de ritmo para la proyeccion de cierre: mismo rango en ambos anios,
  // pero cortado en el ultimo dia con datos (no en hoy) para que una base
  // desactualizada no abarate la proyeccion.
  let corte = hoyEc;
  if (ultimaVenta) {
    const u = new Date(ultimaVenta);
    const uStr = fechaStr(u.getUTCFullYear(), u.getUTCMonth() + 1, u.getUTCDate());
    if (uStr < corte && uStr >= fechaStr(anio, 1, 1)) corte = uStr;
  }
  const [, mesCorte, diaCorte] = corte.split("-").map(Number);
  const diaCorteAnt = Math.min(diaCorte, new Date(Date.UTC(anioAnt, mesCorte, 0)).getUTCDate());

  const [ytdActual, ytdAnterior, mesActual, mesAnterior, mesAnteriorCompleto, corteActual, corteAnterior] = await Promise.all([
    contarVentas(fechaStr(anio, 1, 1), diaSiguiente(anio, mes, dia)),
    contarVentas(fechaStr(anioAnt, 1, 1), diaSiguiente(anioAnt, mes, diaAnt)),
    contarVentas(fechaStr(anio, mes, 1), diaSiguiente(anio, mes, dia)),
    contarVentas(fechaStr(anioAnt, mes, 1), diaSiguiente(anioAnt, mes, diaAnt)),
    contarVentas(
      fechaStr(anioAnt, mes, 1),
      fechaStr(mesSiguienteAnt.getUTCFullYear(), mesSiguienteAnt.getUTCMonth() + 1, 1)
    ),
    contarVentas(fechaStr(anio, 1, 1), diaSiguiente(anio, mesCorte, diaCorte)),
    contarVentas(fechaStr(anioAnt, 1, 1), diaSiguiente(anioAnt, mesCorte, diaCorteAnt)),
  ]);

  return {
    hoy: hoyEc,
    anio,
    anioAnterior: anioAnt,
    mes,
    dia,
    ytd: { actual: ytdActual, anterior: ytdAnterior },
    mesEnCurso: { actual: mesActual, anterior: mesAnterior, anteriorCompleto: mesAnteriorCompleto },
    ultimaVenta,
    proyeccion: {
      corte,
      actual: corteActual,
      anterior: corteAnterior,
      factor: corteAnterior ? corteActual / corteAnterior : null,
    },
  };
}

export default handler;
