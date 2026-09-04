import { getServerSession } from "next-auth/next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  const { id } = req.query;
  const agencyId = parseInt(id);

  if (req.method === "PATCH") {
    try {
      const form = formidable({ multiples: false });
      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });

      const current = await db.agency.findUnique({ where: { id: agencyId } });
      if (!current) return res.status(404).json({ message: "Agencia no encontrada" });

      const name = (fields.name?.[0] ?? current.name).trim();
      const address = (fields.address?.[0] ?? current.address).trim();
      const time = (fields.time?.[0] ?? current.time).trim();
      const latitude =
        fields.latitude?.[0] !== undefined ? parseFloat(fields.latitude[0]) : current.latitude;
      const longitude =
        fields.longitude?.[0] !== undefined ? parseFloat(fields.longitude[0]) : current.longitude;

      if (!name) return res.status(400).json({ message: "El nombre no puede estar vacío" });
      if (!address) return res.status(400).json({ message: "La dirección no puede estar vacía" });
      if (!time) return res.status(400).json({ message: "El horario no puede estar vacío" });
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return res.status(400).json({ message: "Latitud/longitud inválidas" });
      }

      let src = current.src;
      const file = files.image?.[0];
      if (file) {
        const ext = path.extname(file.originalFilename || "").toLowerCase();
        const safeExt = ALLOWED_EXT.includes(ext) ? ext : ".jpg";
        const filename = `agencia-${Date.now()}${safeExt}`;
        const destDir = path.join(process.cwd(), "public", "agencias");
        const destPath = path.join(destDir, filename);

        fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(file.filepath, destPath);
        fs.unlink(file.filepath, () => {});
        src = `/agencias/${filename}`;
      }

      const updated = await db.agency.update({
        where: { id: agencyId },
        data: {
          name,
          address,
          time,
          latitude,
          longitude,
          src,
          updatedBy: session.user?.email || null,
        },
      });

      return res.status(200).json({ entitydata: updated });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error al actualizar la agencia" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const current = await db.agency.findUnique({ where: { id: agencyId } });
      if (!current) return res.status(404).json({ message: "Agencia no encontrada" });

      await db.$transaction([
        db.agency.delete({ where: { id: agencyId } }),
        db.phone.deleteMany({ where: { key: current.phoneKey } }),
      ]);

      return res.status(200).json({ entitydata: { id: agencyId } });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error al eliminar la agencia" });
    }
  }

  return res.status(404).end();
}

export default handler;
