import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { id } = req.query;

  if (req.method === "PATCH") {
    const updated = await db.sharedSecret.update({
      where: { id: Number(id) },
      data: { revoked: true },
    });
    return res.status(200).json({ entitydata: updated });
  }

  return res.status(405).end();
}
