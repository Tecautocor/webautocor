import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

const MAX_ROWS = 300;

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const entries = await db.ecuaprimasMatchLog.findMany({
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS,
  });

  const total = entries.length;
  const matched = entries.filter((e) => e.matchOk).length;
  const failed = total - matched;

  const byMotivo = {};
  for (const e of entries) {
    if (!e.matchOk) {
      const key = e.motivo || "sin_motivo";
      byMotivo[key] = (byMotivo[key] || 0) + 1;
    }
  }

  return res.status(200).json({
    entitydata: entries,
    stats: { total, matched, failed, byMotivo },
    limited: total >= MAX_ROWS,
  });
}

export default handler;
