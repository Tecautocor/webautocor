import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

const FORMULARIO_LABELS = {
  home: "Contacto (home)",
  reserve: "Reservar auto",
  wa: "WhatsApp (auto)",
  budget: "Cotizador de presupuesto",
  buy: "Vende tu auto",
};

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const anio = parseInt(req.query.anio, 10) || new Date().getFullYear();

  const leads = await db.leadLog.findMany({
    where: { createdAt: { gte: new Date(Date.UTC(anio, 0, 1)), lt: new Date(Date.UTC(anio + 1, 0, 1)) } },
    select: { formulario: true, createdAt: true },
  });

  // "Negocio cerrado" = venta en estado "Registrada" en Pilot (mismo criterio
  // real confirmado por el cliente el 2026-09-17 y ya usado en Performance y
  // Analisis Comercial) - reemplaza el proxy viejo (AllVehicle + fecha de
  // facturacion de fabrica), que no reflejaba el momento real en que se
  // concreta la venta. Combina el historico importado de Pilot con el
  // webhook en vivo, excluyendo cualquier ventaId que el webhook ya cubra
  // para no contar la misma venta dos veces.
  const [negociosHistoricoRows, negociosEnVivoRows] = await Promise.all([
    db.$queryRawUnsafe(
      `SELECT MONTH(h.fechaAlta) AS mes
       FROM VentaHistoricoImport h
       LEFT JOIN (SELECT DISTINCT ventaId FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO') w
         ON w.ventaId = h.ventaId
       WHERE YEAR(h.fechaAlta) = ? AND w.ventaId IS NULL`,
      anio
    ),
    db.$queryRawUnsafe(
      `SELECT ventaId, MONTH(MIN(fechaAlta)) AS mes
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'REGISTRADO' AND YEAR(fechaAlta) = ?
       GROUP BY ventaId`,
      anio
    ),
  ]);
  const negociosCerradosRows = [...negociosHistoricoRows, ...negociosEnVivoRows];

  return res.status(200).json({
    anio,
    leadLogDesde: await db.leadLog
      .findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } })
      .then((r) => r?.createdAt || null),
    leads: leads.map((l) => ({
      formulario: l.formulario,
      formularioLabel: FORMULARIO_LABELS[l.formulario] || l.formulario,
      mes: l.createdAt.getUTCMonth() + 1,
    })),
    negociosCerrados: negociosCerradosRows.map((r) => ({
      mes: Number(r.mes),
    })),
  });
}

export default handler;
