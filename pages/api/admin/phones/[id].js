import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "PATCH") {
    return res.status(404).end();
  }

  const { id } = req.query;
  const newValue = String(req.body?.phone || "").trim();

  if (!newValue) {
    return res.status(400).json({ message: "El número no puede estar vacío" });
  }

  try {
    const current = await db.phone.findUnique({ where: { id: parseInt(id) } });
    if (!current) {
      return res.status(404).json({ message: "Número no encontrado" });
    }

    if (current.phone === newValue) {
      return res.status(200).json({ entitydata: current });
    }

    const [, updated] = await db.$transaction([
      db.phoneChangeLog.create({
        data: {
          phoneKey: current.key,
          label: current.label,
          oldValue: current.phone,
          newValue,
          changedBy: session.user?.email || "desconocido",
        },
      }),
      db.phone.update({
        where: { id: current.id },
        data: { phone: newValue, updatedBy: session.user?.email || null },
      }),
    ]);

    return res.status(200).json({ entitydata: updated });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error al actualizar el número" });
  }
}

export default handler;
