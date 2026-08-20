import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const anioActual = new Date().getFullYear();

  // Comparativa interanual: ahora usa la carga historica real del CSV de
  // Pilot (VentaHistoricoImport, estado "Registrado") en vez de la
  // aproximacion via AllVehicle/Vendido - cubre 2023 en adelante.
  const ventasPorAnioMes = await db.$queryRawUnsafe(
    `SELECT YEAR(fechaAprobacion) AS anio, MONTH(fechaAprobacion) AS mes, COUNT(*) AS n
     FROM VentaHistoricoImport
     WHERE fechaAprobacion IS NOT NULL
     GROUP BY anio, mes
     ORDER BY anio, mes`
  );

  // Vendedores: SOLO el anio en curso (a proposito - un ranking con todo el
  // historico mezclaria vendedores que ya no trabajan ahi con el equipo
  // actual). Usa el nombre real de vendedor de la carga historica.
  const porVendedor = await db.$queryRawUnsafe(
    `SELECT vendedorNombre AS vendedor, sucursal AS agencia, COUNT(*) AS n
     FROM VentaHistoricoImport
     WHERE YEAR(fechaAprobacion) = ?
       AND vendedorNombre IS NOT NULL AND vendedorNombre != ''
     GROUP BY vendedor, agencia
     ORDER BY n DESC
     LIMIT 30`,
    anioActual
  );

  // Rentabilidad: baseline historico (para tener con que comparar) + eventos
  // reales en vivo del webhook (VentaWebhookLog) que se van acumulando desde
  // que se activo la regla en Pilot.
  const historicoAgg = await db.$queryRawUnsafe(
    `SELECT COUNT(*) AS n,
            AVG(pctDescuento) AS descuentoProm,
            SUM(CASE WHEN montoFinanciado > 0 THEN 1 ELSE 0 END) / COUNT(*) * 100 AS pctFinanciadas,
            AVG(NULLIF(usadoRentabilidadEstimada, 0)) AS usadoRentabilidadProm,
            AVG(totalTransaccion) AS ticketPromedio
     FROM VentaHistoricoImport`
  );

  const enVivo = await db.ventaWebhookLog.findMany({
    where: { estado: "Registrado" },
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
