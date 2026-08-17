import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "POST") {
    return res.status(404).end();
  }

  const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
  if (ids.length === 0) {
    return res.status(400).json({ message: "Falta la lista de banners" });
  }

  try {
    await db.$transaction(
      ids.map((id, index) =>
        db.banner.update({ where: { id: parseInt(id) }, data: { order: index } })
      )
    );
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error al guardar el orden" });
  }
}

export default handler;
