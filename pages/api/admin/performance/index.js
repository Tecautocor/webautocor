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

  return res.status(200).json({
    anio,
    ventas,
    metas: metas.map((m) => ({ agencia: m.agencia, mes: m.mes, metaUnidades: m.metaUnidades })),
  });
}

export default handler;
