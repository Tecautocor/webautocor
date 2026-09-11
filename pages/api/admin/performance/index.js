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

  const anio = parseInt(req.query.anio, 10) || new Date().getFullYear();

  // "Vendido" (code 3) en AllVehicle es la senal de venta cerrada mientras
  // acumulamos datos reales del webhook de Pilot (VentaWebhookLog, estado
  // "Registrado") - factory_invoicing_dt funciona como fecha de venta real
  // (verificado: distribucion mensual consistente, ver memoria del proyecto).
  const rows = await db.$queryRawUnsafe(
    `SELECT owner_branch_code AS agencia, brand AS marca, model AS modelo,
            factory_invoicing_dt AS fecha
     FROM AllVehicle
     WHERE availability_status_code = '3'
       AND factory_invoicing_dt IS NOT NULL
       AND YEAR(factory_invoicing_dt) = ?
       AND owner_branch_code IS NOT NULL AND owner_branch_code != ''`,
    anio
  );

  const ventas = rows.map((r) => ({
    agencia: r.agencia,
    marca: r.marca,
    modelo: r.modelo,
    mes: new Date(r.fecha).getUTCMonth() + 1,
  }));

  const metas = await db.metaVentas.findMany({ where: { anio } });

  // Ventas por estado segun los webhooks de Pilot ya conectados: VentaWebhookLog
  // se llena en el evento "Registrada" (pilotVentaWebhook, sí trae sucursal) y
  // EcuaprimasMatchLog se llena en el evento "Aprobada Jefatura" (pilotSaleWebhook,
  // que hoy se usa para disparar cotizaciones de seguro pero registra toda venta
  // que llega a ese estado - ese payload NO trae sucursal, solo se puede filtrar
  // por mes). Se agrupa por ventaId porque Pilot puede reenviar el mismo evento
  // mas de una vez. Se devuelven filas crudas (no un conteo ya armado) para que
  // el frontend las filtre con el mismo mecanismo de agencia/mes que "ventas".
  const [registradaRows, aprobadoJefaturaRows, pendientesRows] = await Promise.all([
    db.$queryRawUnsafe(
      `SELECT ventaId, MAX(TRIM(sucursal)) AS agencia, MAX(MONTH(fechaAlta)) AS mes
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'REGISTRADO' AND YEAR(fechaAlta) = ?
       GROUP BY ventaId`,
      anio
    ),
    db.$queryRawUnsafe(
      `SELECT ventaId, MAX(MONTH(createdAt)) AS mes
       FROM EcuaprimasMatchLog
       WHERE YEAR(createdAt) = ?
       GROUP BY ventaId`,
      anio
    ),
    // Ventas "Registrada" que nunca llegaron a "Aprobado Jefatura" - lo que el
    // cliente quiere ver para dar seguimiento (que falta de aprobar y por que).
    db.$queryRawUnsafe(
      `SELECT r.ventaId AS ventaId,
              MAX(r.marca) AS marca,
              MAX(r.modelo) AS modelo,
              MAX(r.vendedorNombre) AS vendedor,
              MAX(TRIM(r.sucursal)) AS agencia,
              MIN(r.fechaAlta) AS fechaAlta,
              MONTH(MIN(r.fechaAlta)) AS mes
       FROM VentaWebhookLog r
       LEFT JOIN EcuaprimasMatchLog e ON e.ventaId = r.ventaId
       WHERE TRIM(r.estado) = 'REGISTRADO' AND YEAR(r.fechaAlta) = ? AND e.ventaId IS NULL
       GROUP BY r.ventaId
       ORDER BY fechaAlta ASC`,
      anio
    ),
  ]);

  return res.status(200).json({
    anio,
    ventas,
    metas: metas.map((m) => ({ agencia: m.agencia, mes: m.mes, metaUnidades: m.metaUnidades })),
    estadoRegistrada: registradaRows.map((r) => ({ ventaId: r.ventaId, agencia: r.agencia, mes: Number(r.mes) })),
    estadoAprobadoJefatura: aprobadoJefaturaRows.map((r) => ({ ventaId: r.ventaId, mes: Number(r.mes) })),
    estadoPendientes: pendientesRows.map((r) => ({
      ventaId: r.ventaId,
      marca: r.marca,
      modelo: r.modelo,
      vendedor: r.vendedor,
      agencia: r.agencia,
      fechaAlta: r.fechaAlta,
      mes: Number(r.mes),
    })),
  });
}

export default handler;
