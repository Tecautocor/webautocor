import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

const FORMULARIO_LABELS = {
  home: "Contacto (home)",
  reserve: "Reservar auto",
  wa: "WhatsApp (auto)",
  budget: "Cotizador de presupuesto",
  buy: "Vende tu auto",
};

// Suborigen (texto) con que Pilot registra la venta -> formulario del sitio.
// "Vende tu auto" (buy) no aparece: genera compras, no ventas.
function formularioDesdeSuborigen(suborigen) {
  const s = (suborigen || "").toUpperCase();
  if (s.includes("WHATSAPP")) return "wa";
  if (s.includes("COTIZADOR")) return "budget";
  if (s.includes("RESERVAR")) return "reserve";
  if (s.includes("HOME")) return "home";
  return "otro";
}

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const anio = parseInt(req.query.anio, 10) || new Date().getFullYear();

  const leads = await db.leadLog.findMany({
    where: { createdAt: { gte: new Date(Date.UTC(anio, 0, 1)), lt: new Date(Date.UTC(anio + 1, 0, 1)) } },
    select: { formulario: true, createdAt: true },
  });

  // "Negocio cerrado" = venta en estado "Registrada" en Pilot (mismo criterio
  // real confirmado por el cliente el 2026-09-17 y ya usado en Performance y
  // Analisis Comercial) - reemplaza el proxy viejo (AllVehicle + fecha de
  // facturacion de fabrica), que no reflejaba el momento real en que se
  // concreta la venta. Combina el historico importado de Pilot con el
  // webhook en vivo, excluyendo cualquier ventaId que el webhook ya cubra
  // para no contar la misma venta dos veces.
  const [negociosHistoricoRows, negociosEnVivoRows] = await Promise.all([
    db.$queryRawUnsafe(
      `SELECT MONTH(h.fechaAlta) AS mes, TRIM(h.origen) AS origen
       FROM VentaHistoricoImport h
       LEFT JOIN (SELECT DISTINCT ventaId FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO') w
         ON w.ventaId = h.ventaId
       WHERE YEAR(h.fechaAlta) = ? AND w.ventaId IS NULL`,
      anio
    ),
    db.$queryRawUnsafe(
      `SELECT ventaId, MONTH(MIN(fechaAlta)) AS mes, TRIM(MIN(origen)) AS origen
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'REGISTRADO' AND YEAR(fechaAlta) = ?
       GROUP BY ventaId`,
      anio
    ),
  ]);
  const negociosCerradosRows = [...negociosHistoricoRows, ...negociosEnVivoRows];

  // Leads de Pilot de todos los canales (web, Atom/WhatsApp, RRSS, showroom...),
  // solo tipo de negocio "Venta" (los de "Compra" son personas que venden su
  // auto a Autocor, no alimentan el embudo de ventas). Combina el export
  // historico con el webhook en vivo: del webhook se toma el ultimo evento de
  // cada lead (estado mas reciente) y se excluye cualquier leadId que ya este
  // en el historico, y los payloads de prueba del boton "Previsualizar/Test".
  const leadsPilotRows = await db.$queryRawUnsafe(
    `SELECT mes, origen, estado, COUNT(*) AS n, SUM(vendido) AS vendidos FROM (
       SELECT MONTH(fechaCreacion) AS mes, TRIM(origen) AS origen, TRIM(estado) AS estado, vendido
       FROM LeadHistoricoImport
       WHERE YEAR(fechaCreacion) = ? AND TRIM(tipoNegocio) = 'Venta'
       UNION ALL
       SELECT MONTH(w.fechaCreacion), TRIM(w.origen), TRIM(w.estado), 0
       FROM LeadWebhookLog w
       JOIN (SELECT leadId, MAX(id) AS id FROM LeadWebhookLog GROUP BY leadId) u ON u.id = w.id
       LEFT JOIN LeadHistoricoImport h ON h.leadId = w.leadId
       WHERE h.leadId IS NULL AND YEAR(w.fechaCreacion) = ? AND TRIM(w.tipoNegocio) = 'Venta'
         AND w.leadId NOT LIKE 'TEST-%' AND w.origen NOT LIKE 'Lorem ipsum%'
     ) t
     GROUP BY mes, origen, estado`,
    anio,
    anio
  );

  // Ventas originadas en la pagina web (origen "PAGINA WEB" en Pilot), mismo
  // criterio de venta concretada y misma deduplicacion que arriba. El
  // suborigen de Pilot identifica el formulario del sitio que genero el lead,
  // lo que permite una conversion real lead web -> venta web (no contra el
  // total de ventas de todos los canales).
  const [ventasWebHistoricoRows, ventasWebEnVivoRows] = await Promise.all([
    db.$queryRawUnsafe(
      `SELECT h.fechaAlta AS fechaAlta, TRIM(h.suborigen) AS suborigen
       FROM VentaHistoricoImport h
       LEFT JOIN (SELECT DISTINCT ventaId FROM VentaWebhookLog WHERE TRIM(estado) = 'REGISTRADO') w
         ON w.ventaId = h.ventaId
       WHERE YEAR(h.fechaAlta) = ? AND w.ventaId IS NULL AND TRIM(h.origen) = 'PAGINA WEB'`,
      anio
    ),
    db.$queryRawUnsafe(
      `SELECT MIN(fechaAlta) AS fechaAlta, TRIM(MIN(suborigen)) AS suborigen
       FROM VentaWebhookLog
       WHERE TRIM(estado) = 'REGISTRADO' AND YEAR(fechaAlta) = ? AND TRIM(origen) = 'PAGINA WEB'
       GROUP BY ventaId`,
      anio
    ),
  ]);
  const ventasWeb = [...ventasWebHistoricoRows, ...ventasWebEnVivoRows].map((r) => {
    const formulario = formularioDesdeSuborigen(r.suborigen);
    return {
      fecha: r.fechaAlta,
      mes: new Date(r.fechaAlta).getUTCMonth() + 1,
      formulario,
      formularioLabel: FORMULARIO_LABELS[formulario] || r.suborigen || "Otro (web)",
    };
  });

  return res.status(200).json({
    anio,
    leadLogDesde: await db.leadLog
      .findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } })
      .then((r) => r?.createdAt || null),
    ventasWeb,
    leads: leads.map((l) => ({
      formulario: l.formulario,
      formularioLabel: FORMULARIO_LABELS[l.formulario] || l.formulario,
      mes: l.createdAt.getUTCMonth() + 1,
      fecha: l.createdAt,
    })),
    negociosCerrados: negociosCerradosRows.map((r) => ({
      mes: Number(r.mes),
      origen: r.origen || null,
    })),
    leadsPilot: leadsPilotRows.map((r) => ({
      mes: Number(r.mes),
      origen: r.origen || "Sin origen",
      estado: r.estado || "Sin estado",
      n: Number(r.n),
      vendidos: Number(r.vendidos || 0),
    })),
  });
}

export default handler;
