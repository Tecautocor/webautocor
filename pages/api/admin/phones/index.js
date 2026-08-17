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

  const phones = await db.phone.findMany({ orderBy: [{ category: "asc" }, { label: "asc" }] });
  return res.status(200).json({ entitydata: phones });
}

export default handler;
