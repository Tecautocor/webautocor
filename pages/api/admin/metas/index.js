import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

const MESES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

async function listarAgencias() {
  const rows = await db.$queryRawUnsafe(
    `SELECT DISTINCT owner_branch_code AS agencia FROM AllVehicle
     WHERE owner_branch_code IS NOT NULL AND owner_branch_code != ''
     ORDER BY agencia ASC`
  );
  return rows.map((r) => r.agencia);
}

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method === "GET") {
    const anio = parseInt(req.query.anio, 10) || new Date().getFullYear();
    const agencias = await listarAgencias();
    const metas = await db.metaVentas.findMany({ where: { anio } });

    const metaMap = new Map(metas.map((m) => [`${m.mes}|${m.agencia}`, m]));
    const grid = agencias.map((agencia) => ({
      agencia,
      meses: MESES.map((mes) => ({
        mes,
        metaUnidades: metaMap.get(`${mes}|${agencia}`)?.metaUnidades ?? null,
      })),
    }));

    return res.status(200).json({ anio, agencias, grid });
  }

  if (req.method === "PATCH") {
    const { anio, mes, agencia, metaUnidades } = req.body || {};
    if (!anio || !mes || !agencia || metaUnidades === undefined) {
      return res.status(400).json({ message: "Faltan campos" });
    }
    const valor = parseInt(metaUnidades, 10);
    if (!Number.isFinite(valor) || valor < 0) {
      return res.status(400).json({ message: "Meta invalida" });
    }

    const updated = await db.metaVentas.upsert({
      where: { anio_mes_agencia: { anio: parseInt(anio, 10), mes: parseInt(mes, 10), agencia } },
      update: { metaUnidades: valor, updatedBy: session.user?.email || null },
      create: {
        anio: parseInt(anio, 10),
        mes: parseInt(mes, 10),
        agencia,
        metaUnidades: valor,
        updatedBy: session.user?.email || null,
      },
    });

    return res.status(200).json({ entitydata: updated });
  }

  return res.status(404).end();
}

export default handler;
