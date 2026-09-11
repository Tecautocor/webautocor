import db from "../../../lib/db";

// Endpoint de solo lectura para que Ecuaprimas consulte nuestro catálogo
// (marca/modelo/color/etc.) en vez de que se lo reenviemos por Excel a mano.
// Acordado en la reunión del 2026-09-11: auth por API key, respuesta JSON.
async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const apiKey = req.headers["x-api-key"] || "";
  if (
    !process.env.ECUAPRIMAS_CATALOG_API_KEY ||
    apiKey !== process.env.ECUAPRIMAS_CATALOG_API_KEY
  ) {
    return res.status(401).end();
  }

  const tipo = (req.query.tipo || "").toString().toUpperCase();

  try {
    const catalogo = await db.ecuaprimasCatalogo.findMany({
      where: tipo ? { tipo } : undefined,
      select: {
        tipo: true,
        codigo: true,
        nombre: true,
        nombre_normalizado: true,
        parent_codigo: true,
      },
      orderBy: [{ tipo: "asc" }, { codigo: "asc" }],
    });
    return res.status(200).json({ catalogo });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ catalogo: [] });
  }
}

export default handler;
