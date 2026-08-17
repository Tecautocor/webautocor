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

  if (req.method === "GET") {
    const banners = await db.banner.findMany({ orderBy: { order: "asc" } });
    return res.status(200).json({ entitydata: banners });
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
      const href = (fields.href?.[0] || "").trim();
      const external = fields.external?.[0] === "true";

      if (!file) {
        return res.status(400).json({ message: "Falta la imagen" });
      }
      if (!href) {
        return res.status(400).json({ message: "Falta el link de destino" });
      }

      const ext = path.extname(file.originalFilename || "").toLowerCase();
      const safeExt = ALLOWED_EXT.includes(ext) ? ext : ".jpg";
      const filename = `banner-${Date.now()}${safeExt}`;
      const destDir = path.join(process.cwd(), "public", "banners");
      const destPath = path.join(destDir, filename);

      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(file.filepath, destPath);
      fs.unlink(file.filepath, () => {});

      await db.banner.updateMany({ data: { order: { increment: 1 } } });

      const banner = await db.banner.create({
        data: {
          src: `/banners/${filename}`,
          href,
          external,
          order: 0,
        },
      });

      return res.status(200).json({ entitydata: banner });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error al subir el banner" });
    }
  }

  return res.status(404).end();
}

export default handler;
