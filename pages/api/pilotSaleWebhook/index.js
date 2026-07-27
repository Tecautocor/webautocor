export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(404).end();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!process.env.PILOT_WEBHOOK_TOKEN || token !== process.env.PILOT_WEBHOOK_TOKEN) {
    console.log("pilotSaleWebhook: token invalido o ausente");
    return res.status(401).end();
  }

  const { venta, vehiculo, cliente, vendedor } = req.body || {};

  console.log("pilotSaleWebhook: payload recibido", JSON.stringify(req.body));

  if (!venta || venta.estado !== "APROBADA JEFATURA") {
    console.log(`pilotSaleWebhook: estado ignorado (${venta && venta.estado})`);
    return res.status(200).json({ ok: true, procesado: false });
  }

  // TODO: llamar a Ecuaprimas (auth + cotizacion) una vez que tengamos el
  // catalogo de codigos marca/modelo/color (Catalogos Autocor.xlsx) — sin
  // eso la cotizacion sale "exitosa" pero con marca/modelo/color incorrectos.
  console.log("pilotSaleWebhook: venta aprobada jefatura, pendiente disparar cotizacion Ecuaprimas", venta.id);

  return res.status(200).json({ ok: true, procesado: true });
}

export default handler;
