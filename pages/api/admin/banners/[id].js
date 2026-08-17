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
    const body = req.body || {};
    const data = {};

    if (body.href !== undefined) {
      const href = String(body.href).trim();
      if (!href) {
        return res.status(400).json({ message: "Falta el link de destino" });
      }
      data.href = href;
    }
    if (body.external !== undefined) data.external = !!body.external;
    if (body.startsAt !== undefined) data.startsAt = body.startsAt ? new Date(body.startsAt) : null;
    if (body.endsAt !== undefined) data.endsAt = body.endsAt ? new Date(body.endsAt) : null;
    if (body.active !== undefined) data.active = !!body.active;

    if (data.startsAt && data.endsAt && data.startsAt >= data.endsAt) {
      return res.status(400).json({ message: "La fecha de fin debe ser posterior a la de inicio" });
    }

    try {
      const banner = await db.banner.update({
        where: { id: parseInt(id) },
        data,
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
