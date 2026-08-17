import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await db.banner.delete({ where: { id: parseInt(id) } });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error al eliminar el banner" });
    }
  }

  if (req.method === "PATCH") {
    const href = (req.body?.href || "").trim();
    const external = !!req.body?.external;

    if (!href) {
      return res.status(400).json({ message: "Falta el link de destino" });
    }

    try {
      const banner = await db.banner.update({
        where: { id: parseInt(id) },
        data: { href, external },
      });
      return res.status(200).json({ entitydata: banner });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error al actualizar el banner" });
    }
  }

  return res.status(404).end();
}

export default handler;
