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

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method === "GET") {
    const agencies = await db.agency.findMany({ orderBy: { id: "asc" } });
    return res.status(200).json({ entitydata: agencies });
  }

  if (req.method === "POST") {
    try {
      const form = formidable({ multiples: false });
      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve([fields, files]);
        });
      });

      const file = files.image?.[0];
      const name = (fields.name?.[0] || "").trim();
      const address = (fields.address?.[0] || "").trim();
      const time = (fields.time?.[0] || "").trim();
      const phone = (fields.phone?.[0] || "").trim();
      const latitude = parseFloat(fields.latitude?.[0]);
      const longitude = parseFloat(fields.longitude?.[0]);

      if (!file) return res.status(400).json({ message: "Falta la foto de la agencia" });
      if (!name) return res.status(400).json({ message: "Falta el nombre" });
      if (!address) return res.status(400).json({ message: "Falta la dirección" });
      if (!time) return res.status(400).json({ message: "Falta el horario" });
      if (!phone) return res.status(400).json({ message: "Falta el teléfono" });
      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return res.status(400).json({ message: "Latitud/longitud inválidas" });
      }

      const baseKey = `agencia_${slugify(name)}`;
      let phoneKey = baseKey;
      let suffix = 2;
      while (await db.agency.findUnique({ where: { phoneKey } })) {
        phoneKey = `${baseKey}_${suffix++}`;
      }

      const ext = path.extname(file.originalFilename || "").toLowerCase();
      const safeExt = ALLOWED_EXT.includes(ext) ? ext : ".jpg";
      const filename = `agencia-${Date.now()}${safeExt}`;
      const destDir = path.join(process.cwd(), "public", "agencias");
      const destPath = path.join(destDir, filename);

      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(file.filepath, destPath);
      fs.unlink(file.filepath, () => {});

      const [agency] = await db.$transaction([
        db.agency.create({
          data: {
            phoneKey,
            name,
            address,
            time,
            latitude,
            longitude,
            src: `/agencias/${filename}`,
            updatedBy: session.user?.email || null,
          },
        }),
        db.phone.create({
          data: {
            key: phoneKey,
            label: `Agencia ${name}`,
            category: "agencia",
            phone,
            updatedBy: session.user?.email || null,
          },
        }),
      ]);

      return res.status(200).json({ entitydata: agency });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error al crear la agencia" });
    }
  }

  return res.status(404).end();
}

export default handler;
