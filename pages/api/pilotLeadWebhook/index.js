import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

// Pilot manda fechas como "DD/MM/YYYY" (opcionalmente con hora) - new Date()
// nativo asume MM/DD/YYYY, hay que parsear explicito.
function date(v) {
  if (!v) return null;
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (m) {
    const [, day, month, year, hh = "0", mm = "0", ss = "0"] = m;
    const d = new Date(Date.UTC(+year, +month - 1, +day, +hh, +mm, +ss));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

// La forma del payload la define el cuerpo JSON que se arme en la plantilla
// de webhook de Pilot. Se sugiere una estructura anidada `lead` (mismo estilo
// que "BI - Ventas"), pero se aceptan tambien campos planos. rawPayload
// siempre se guarda completo: si la forma real no coincide, no se pierde
// nada, solo hay que ajustar esta extraccion al ver el primer evento real.
function extraerCampos(body) {
  const lead = body.lead || body;
  const asesor = body.asesor || {};
  return {
    leadId: lead.id != null ? String(lead.id) : null,
    estado: lead.estado || null,
    origen: lead.origen || null,
    suborigen: lead.suborigen || null,
    tipoNegocio: lead.tipo_negocio || null,
    tipoContacto: lead.tipo_contacto || null,
    sucursal: asesor.sucursal || lead.sucursal || null,
    asesor: asesor.nombre || lead.asesor || null,
    fechaCreacion: date(lead.fecha_creacion || lead.fecha_alta),
  };
}

async function handler(req, res) {
  if (req.method !== "POST") return res.status(404).end();

  // Token propio si se define; si no, se reutiliza el de "BI - Ventas" para
  // que la plantilla de Leads en Pilot pueda usar la misma Key.
  const esperado = process.env.PILOT_LEAD_WEBHOOK_TOKEN || process.env.PILOT_VENTA_WEBHOOK_TOKEN;
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!esperado || token !== esperado) {
    console.log("pilotLeadWebhook: token invalido o ausente");
    return res.status(401).end();
  }

  const body = req.body || {};
  try {
    await db.leadWebhookLog.create({
      data: { ...extraerCampos(body), rawPayload: body },
    });
  } catch (err) {
    console.log("pilotLeadWebhook: error guardando LeadWebhookLog", err);
    return res.status(500).json({ ok: false });
  }

  return res.status(200).json({ ok: true });
}

export default handler;
