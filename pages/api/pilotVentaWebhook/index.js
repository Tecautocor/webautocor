import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

// Pilot manda numeros en formato latino: punto = miles, coma = decimal
// (ej. "15.900,00"). Sin esto, parseFloat lee mal la coma y arruina el monto.
function num(v) {
  if (v === null || v === undefined || v === "") return null;
  const s = String(v).trim().replace(/\./g, "").replace(",", ".");
  const n = parseFloat(s.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function int(v) {
  const n = num(v);
  return n === null ? null : Math.trunc(n);
}

// Pilot manda fechas como "DD/MM/YYYY" - new Date() nativo asume MM/DD/YYYY
// y falla (o interpreta mal) con dia > 12, hay que parsear explicito.
function date(v) {
  if (!v) return null;
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, day, month, year] = m;
    const d = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

// La forma exacta del payload todavia no esta confirmada (Pilot no la
// documenta - se arma en su UI con "campos personalizados"). Se asume, por
// consistencia con pilotSaleWebhook (mismo Pilot), una estructura anidada
// venta/vehiculo/vendedor/sucursal. rawPayload siempre se guarda completo
// como respaldo - si esta forma no coincide con la real, no se pierde nada,
// solo hay que ajustar esta extraccion una vez se vea el primer evento real.
function extraerCampos(body) {
  const venta = body.venta || body;
  const vehiculo = body.vehiculo || body.stock || {};
  const vendedor = body.vendedor || {};
  const sucursal = body.sucursal || {};

  return {
    ventaId: venta.id || venta.codigo || body.id || null,
    estado: venta.estado || body.estado || null,
    tipoNegocio: venta.tipo_negocio || venta.tipoNegocio || null,
    origen: venta.origen || body.origen || null,
    suborigen: venta.suborigen || body.suborigen || null,
    fechaAlta: date(venta.fecha_alta),
    fechaAprobacion: date(venta.fecha_aprobacion),
    marca: vehiculo.marca || null,
    modelo: vehiculo.modelo || null,
    version: vehiculo.version || null,
    color: vehiculo.color || null,
    precioLista: num(venta.precio_lista),
    montoEfectivo: num(venta.monto_efectivo),
    montoFinanciado: num(venta.monto_financiado),
    montoRetomaUsado: num(venta.monto_retoma_usado),
    gastosEntrega: num(venta.gastos_entrega),
    totalTransaccion: num(venta.total_transaccion),
    pctDescuento: num(venta.pct_descuento),
    descuentoVendedor: num(venta.descuento_autorizado_vendedor),
    descuentoGerente: num(venta.descuento_autorizado_gerente),
    banco: venta.banco || null,
    cuotasFinanciadas: int(venta.cuotas_financiadas),
    montoCuota: num(venta.monto_cuota),
    tasaFinanciacion: num(venta.tasa_financiacion),
    usadoMarca: venta.usado_marca || null,
    usadoModelo: venta.usado_modelo || null,
    usadoValorEstimado: num(venta.usado_valor_estimado_venta),
    usadoCostoReparacion: num(venta.usado_costo_reparacion),
    usadoRentabilidadEstimada: num(venta.usado_rentabilidad_estimada),
    vendedorNombre: vendedor.nombre || null,
    sucursal: vendedor.sucursal || sucursal.nombre || null,
    comisionVendedor: num(venta.comision_vendedor),
  };
}

async function handler(req, res) {
  if (req.method !== "POST") return res.status(404).end();

  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!process.env.PILOT_VENTA_WEBHOOK_TOKEN || token !== process.env.PILOT_VENTA_WEBHOOK_TOKEN) {
    console.log("pilotVentaWebhook: token invalido o ausente");
    return res.status(401).end();
  }

  const body = req.body || {};
  console.log("pilotVentaWebhook: payload recibido", JSON.stringify(body));

  try {
    const campos = extraerCampos(body);
    await db.ventaWebhookLog.create({
      data: { ...campos, rawPayload: body },
    });
  } catch (err) {
    console.log("pilotVentaWebhook: error guardando VentaWebhookLog", err);
    return res.status(500).json({ ok: false });
  }

  return res.status(200).json({ ok: true });
}

export default handler;
