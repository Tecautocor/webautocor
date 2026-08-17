import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import db from "../../../../../lib/db";

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "POST") {
    return res.status(404).end();
  }

  const { id } = req.query;

  try {
    const original = await db.banner.findUnique({ where: { id: parseInt(id) } });
    if (!original) {
      return res.status(404).json({ message: "Banner no encontrado" });
    }

    await db.banner.updateMany({ data: { order: { increment: 1 } } });

    const copy = await db.banner.create({
      data: {
        src: original.src,
        href: original.href,
        external: original.external,
        order: 0,
        startsAt: original.startsAt,
        endsAt: original.endsAt,
        createdBy: session.user?.email || null,
      },
    });

    return res.status(200).json({ entitydata: copy });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error al duplicar el banner" });
  }
}

export default handler;
