import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

const FORMULARIO_LABELS = {
  home: "Contacto (home)",
  reserve: "Reservar auto",
  wa: "WhatsApp (auto)",
  budget: "Cotizador de presupuesto",
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

  const negociosCerradosRows = await db.$queryRawUnsafe(
    `SELECT factory_invoicing_dt AS fecha FROM AllVehicle
     WHERE availability_status_code = '3'
       AND factory_invoicing_dt IS NOT NULL
       AND YEAR(factory_invoicing_dt) = ?`,
    anio
  );

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
      mes: new Date(r.fecha).getUTCMonth() + 1,
    })),
  });
}

export default handler;
