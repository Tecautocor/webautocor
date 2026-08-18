import { matchVehiculo } from "../../../lib/ecuaprimasCatalogo";
import { cotizar, descargarDocumento } from "../../../lib/ecuaprimasApi";
import { sendMailGraph } from "../../../lib/graphMail";
import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

// Vehiculo tipo AUTO por defecto - Pilot no manda una clasificacion
// AUTO|CAMIONETA|FURGONETA|JEEP en el payload actual. Revisar/mapear esto
// antes de apuntar a producción real de Ecuaprimas (hoy solo corre contra
// preproducción, ver ECUAPRIMAS_BASE_URL en .env).
const TIPO_VEHICULO_DEFAULT = "AUTO";

function partirNombre(nombreCompleto) {
  const partes = (nombreCompleto || "").trim().split(/\s+/);
  return {
    primer_nombre: partes[0] || "",
    primer_apellido: partes.slice(1).join(" ") || partes[0] || "",
  };
}

async function procesarCotizacion({ venta, vehiculo, cliente, vendedor, match }) {
  if (!match.color_codigo) {
    return { ok: false, error: "sin_color_detectado" };
  }
  if (!cliente?.nro_documento) {
    return { ok: false, error: "sin_cedula_cliente" };
  }
  if (!vendedor?.email) {
    return { ok: false, error: "sin_email_vendedor" };
  }

  const { primer_nombre, primer_apellido } = partirNombre(cliente.nombre);
  const valorVehiculo = String(venta.total_transaccion || venta.precio_lista || "0");

  const payload = {
    informacion_titular: {
      identificacion: cliente.nro_documento,
      primer_nombre,
      primer_apellido,
      email: cliente.email || "",
      telefono: cliente.telefono || cliente.celular || "",
      celular: cliente.celular || cliente.telefono || "",
      direccion: cliente.domicilio || "",
    },
    cotizador: {
      lugar: vendedor.sucursal || "Quito",
      fecha: new Date().toISOString().split("T")[0],
      valor_vehiculo: valorVehiculo,
      valor_extras: "0",
      valor_asegurado: valorVehiculo,
    },
    objeto_asegurado: {
      tipo: TIPO_VEHICULO_DEFAULT,
      marca: String(match.marca_codigo),
      modelo: String(match.modelo_codigo),
      color: String(match.color_codigo),
      motor: vehiculo.motor || "",
      chasis: vehiculo.chasis || "",
      placa: vehiculo.matricula || "",
      anio: String(vehiculo.anio || ""),
    },
  };

  const cotizacion = await cotizar(payload);

  if (!cotizacion.documento || !cotizacion.numero_certificado) {
    return { ok: false, error: `respuesta_ecuaprimas_incompleta: ${cotizacion.mensaje || ""}` };
  }

  const pdfBuffer = await descargarDocumento(cotizacion.documento);

  await sendMailGraph({
    to: vendedor.email,
    subject: `Cotización de seguro generada - Certificado ${cotizacion.numero_certificado}`,
    html: `
      <p>Se generó la cotización de seguro para la venta ${venta.id}.</p>
      <p><b>Vehículo:</b> ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version || ""}</p>
      <p><b>Número de certificado:</b> ${cotizacion.numero_certificado}</p>
      <p>El PDF de la cotización va adjunto.</p>
    `,
    attachments: [
      {
        filename: `cotizacion_${cotizacion.numero_certificado}.pdf`,
        contentType: "application/pdf",
        buffer: pdfBuffer,
      },
    ],
  });

  return {
    ok: true,
    numeroCertificado: cotizacion.numero_certificado,
    enviadoA: vendedor.email,
  };
}

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

  let cotizacionResultado = null;
  if (match.ok) {
    try {
      cotizacionResultado = await procesarCotizacion({ venta, vehiculo, cliente, vendedor, match });
      console.log("pilotSaleWebhook: resultado cotizacion", venta.id, JSON.stringify(cotizacionResultado));
    } catch (err) {
      console.log("pilotSaleWebhook: error generando/enviando cotizacion", venta.id, err?.response?.data || err.message);
      cotizacionResultado = { ok: false, error: err?.response?.data?.mensaje || err.message };
    }
  }

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
        marcaCodigo: match.ok ? String(match.marca_codigo) : null,
        modeloCodigo: match.ok ? String(match.modelo_codigo) : null,
        modeloNombreCatalogo: match.ok ? match.modelo_nombre_catalogo : null,
        modeloCobertura: match.ok ? match.modelo_cobertura : null,
        colorCodigo: match.ok ? (match.color_codigo != null ? String(match.color_codigo) : null) : null,
        numeroCertificado: cotizacionResultado?.numeroCertificado || null,
        cotizacionEnviada: !!cotizacionResultado?.enviadoA,
        enviadoA: cotizacionResultado?.enviadoA || null,
        errorCotizacion: cotizacionResultado && !cotizacionResultado.ok ? cotizacionResultado.error : null,
      },
    });
  } catch (err) {
    console.log("pilotSaleWebhook: error guardando EcuaprimasMatchLog (no bloquea la respuesta)", err);
  }

  return res.status(200).json({ ok: true, procesado: true, match, cotizacion: cotizacionResultado });
}

export default handler;
