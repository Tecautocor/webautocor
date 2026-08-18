import { matchVehiculo } from "../../../lib/ecuaprimasCatalogo";
import db from "../../../lib/db";

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

  const match = await matchVehiculo(vehiculo || {});
  console.log("pilotSaleWebhook: resultado match catalogo Ecuaprimas", venta.id, JSON.stringify(match));

  try {
    await db.ecuaprimasMatchLog.create({
      data: {
        ventaId: String(venta.id),
        marca: vehiculo?.marca || null,
        modelo: vehiculo?.modelo || null,
        version: vehiculo?.version || null,
        color: vehiculo?.color || null,
        matchOk: match.ok,
        motivo: match.ok ? null : match.motivo,
        marcaCodigo: match.ok ? match.marca_codigo : null,
        modeloCodigo: match.ok ? match.modelo_codigo : null,
        modeloNombreCatalogo: match.ok ? match.modelo_nombre_catalogo : null,
        modeloCobertura: match.ok ? match.modelo_cobertura : null,
        colorCodigo: match.ok ? match.color_codigo : null,
      },
    });
  } catch (err) {
    console.log("pilotSaleWebhook: error guardando EcuaprimasMatchLog (no bloquea la respuesta)", err);
  }

  // TODO: una vez validado el matching en pruebas reales, llamar a Ecuaprimas
  // (auth + cotizacion) solo cuando match.ok === true. Si match.ok === false,
  // no adivinar - dejar la venta pendiente de mapeo manual.
  console.log("pilotSaleWebhook: venta aprobada jefatura, pendiente disparar cotizacion Ecuaprimas", venta.id);

  return res.status(200).json({ ok: true, procesado: true, match });
}

export default handler;
