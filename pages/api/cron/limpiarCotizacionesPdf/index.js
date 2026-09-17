import fs from "fs";
import path from "path";
import db from "../../../../lib/db";

const COTIZACIONES_DIR = path.join(process.cwd(), "uploads", "cotizaciones");
const DIAS_RETENCION = 30;

// Corre vía cron diario en el VPS (ver crontab de root), mismo patrón que
// tarea_update_bdd para loadVehicles/loadAllVehicles — sin auth, igual que
// esos endpoints, porque no expone datos ni hace nada más riesgoso que
// adelantar un borrado que de todos modos iba a pasar por fecha.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const limite = new Date(Date.now() - DIAS_RETENCION * 24 * 60 * 60 * 1000);

  const vencidos = await db.ecuaprimasMatchLog.findMany({
    where: { pdfUrl: { not: null }, createdAt: { lt: limite } },
    select: { id: true, pdfUrl: true },
  });

  let borrados = 0;
  for (const registro of vencidos) {
    const nombreArchivo = registro.pdfUrl.split("/").pop();
    const filePath = path.join(COTIZACIONES_DIR, nombreArchivo);
    try {
      fs.unlinkSync(filePath);
      borrados++;
    } catch (err) {
      // el archivo ya no existía en disco, igual limpiamos la referencia
    }
    await db.ecuaprimasMatchLog.update({
      where: { id: registro.id },
      data: { pdfUrl: null },
    });
  }

  return res.status(200).json({ ok: true, revisados: vencidos.length, borrados });
}
