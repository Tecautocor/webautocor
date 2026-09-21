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

  const anio = parseInt(req.query.anio, 10) || new Date().getFullYear();

  const metas = await db.metaVentas.findMany({ where: { anio } });

  // Ventas por estado segun los webhooks de Pilot ya conectados: VentaWebhookLog
  // se llena en el evento "Registrada" (pilotVentaWebhook, sí trae sucursal) y
  // EcuaprimasMatchLog se llena en el evento "Aprobada Jefatura" (pilotSaleWebhook,
  // que hoy se usa para disparar cotizaciones de seguro pero registra toda venta
  // que llega a ese estado - ese payload NO trae sucursal, solo se puede filtrar
  // por mes). Se agrupa por ventaId porque Pilot puede reenviar el mismo evento
  // mas de una vez. Se devuelven filas crudas (no un conteo ya armado) para que
  // el frontend las filtre con el mismo mecanismo de agencia/mes que "ventas".
  const [historicoRows, registradaRows, reservadaRows, aprobadoJefaturaRows, pendientesRows] = await Promise.all([
    // "Venta concretada" = estado "Registrada" en Pilot (aclaracion del
    // cliente, 2026-09-17). Para anios/meses anteriores al webhook en vivo
    // (conectado 20-ago-2026) se usa el historico completo importado de Pilot
    // (VentaHistoricoImport, mismo criterio "Registrado", cubre 2022-2026 sin
    // huecos), excluyendo cualquier ventaId que el webhook ya cubra para no
    // contar la misma venta dos veces - mismo patron ya usado en Analisis
    // Comercial. Esto reemplaza el proxy viejo (AllVehicle + fecha de
    // facturacion de fabrica), que era solo una aproximacion para los meses
    // sin dato real.
    db.$queryRawUnsafe(
      `SELECT MAX(TRIM(h.sucursal)) AS agencia, MONTH(MIN(h.fechaAlta)) AS mes
       FROM VentaHistoricoImport h
       LEFT JOIN (SELECT DISTINCT ventaId FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO') w
         ON w.ventaId = h.ventaId
       WHERE YEAR(h.fechaAlta) = ? AND w.ventaId IS NULL
       GROUP BY h.ventaId`,
      anio
    ),
    db.$queryRawUnsafe(
      `SELECT ventaId, MAX(TRIM(sucursal)) AS agencia, MAX(MONTH(fechaAlta)) AS mes
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'REGISTRADO' AND YEAR(fechaAlta) = ?
       GROUP BY ventaId`,
      anio
    ),
    // "Reservada" (RESERVA-APRO JEFATURA en Pilot) - todavia no llega ningun
    // evento real porque falta conectar esa plantilla en Pilot (Admin >
    // Plantillas de Webhooks), pero el mismo endpoint pilotVentaWebhook ya
    // guarda cualquier estado que Pilot le mande (no filtra), asi que en
    // cuanto se conecte esto empieza a llenarse solo, sin tocar codigo.
    db.$queryRawUnsafe(
      `SELECT ventaId, MAX(TRIM(sucursal)) AS agencia, MAX(MONTH(fechaAlta)) AS mes
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'RESERVA-APRO JEFATURA' AND YEAR(fechaAlta) = ?
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

  const ventas = [
    ...historicoRows.map((r) => ({ agencia: normalizarAgencia(r.agencia), mes: Number(r.mes) })),
    ...registradaRows.map((r) => ({ agencia: normalizarAgencia(r.agencia), mes: Number(r.mes) })),
  ];

  return res.status(200).json({
    anio,
    ventas,
    metas: metas.map((m) => ({ agencia: normalizarAgencia(m.agencia), mes: m.mes, metaUnidades: m.metaUnidades })),
    estadoRegistrada: registradaRows.map((r) => ({ ventaId: r.ventaId, agencia: normalizarAgencia(r.agencia), mes: Number(r.mes) })),
    estadoReservada: reservadaRows.map((r) => ({ ventaId: r.ventaId, agencia: normalizarAgencia(r.agencia), mes: Number(r.mes) })),
    estadoAprobadoJefatura: aprobadoJefaturaRows.map((r) => ({ ventaId: r.ventaId, mes: Number(r.mes) })),
    estadoPendientes: pendientesRows.map((r) => ({
      ventaId: r.ventaId,
      marca: r.marca,
      modelo: r.modelo,
      vendedor: r.vendedor,
      agencia: normalizarAgencia(r.agencia),
      fechaAlta: r.fechaAlta,
      mes: Number(r.mes),
    })),
  });
}

export default handler;
