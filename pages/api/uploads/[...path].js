import fs from "fs";
import path from "path";

// Sirve archivos subidos desde el panel de admin (banners, fotos de agencias)
// leyéndolos del disco en cada pedido, en vez de vivir bajo `public/` — Next.js
// en producción (`next start`) solo detecta lo que hay en `public/` al momento
// de arrancar el proceso, así que un archivo subido en caliente por el panel
// quedaba invisible (404) hasta el próximo reinicio/deploy. Esta ruta evita el
// problema por completo: siempre lee el archivo real del momento del pedido.

export const config = {
  api: {
    responseLimit: false,
  },
};

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

const CONTENT_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
};

async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(404).end();
  }

  const segments = Array.isArray(req.query.path) ? req.query.path : [];
  if (segments.some((s) => s.includes("..") || s.includes("/") || s.includes("\\"))) {
    return res.status(400).end();
  }

  const filePath = path.join(UPLOADS_ROOT, ...segments);
  if (!filePath.startsWith(UPLOADS_ROOT)) {
    return res.status(400).end();
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return res.status(404).end();
  }

  try {
    const stat = fs.statSync(filePath);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stat.size);
    // Los nombres de archivo incluyen un timestamp único por subida, así que
    // cachear agresivamente es seguro: un mismo nombre nunca cambia de contenido.
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    if (req.method === "HEAD") {
      return res.status(200).end();
    }

    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    return res.status(404).end();
  }
}

export default handler;
