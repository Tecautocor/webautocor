import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";
import AnimatedNumber from "../../components/admin/AnimatedNumber";
import {
  EyeIcon,
  UsersIcon,
  UserPlusIcon,
  FunnelIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MESES_LABEL = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const COLORES_FORM = ["#e43d30", "#1d4ed8", "#0891b2", "#7c3aed", "#ca8a04"];
const ORDEN_ESTADOS = ["Sin Gestion", "En Gestion", "Oportunidad", "Cerrado", "Ganado", "Perdido"];
const FORMULARIOS_CONVERSION = [
  { key: "budget", label: "Cotizador de presupuesto", conLeads: true },
  { key: "reserve", label: "Reservar auto", conLeads: true },
  { key: "home", label: "Contacto (home)", conLeads: true },
  { key: "wa", label: "WhatsApp (auto)", conLeads: false },
];

function EtapaCard({ icon: Icon, label, value, real, delay, format }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className={`rounded-xl p-5 flex flex-col gap-3 ${
        real ? "bg-white shadow-sm" : "bg-gray-50 border border-dashed border-gray-300"
      }`}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${real ? "bg-red-50 text-main" : "bg-gray-200 text-gray-400"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className={`text-2xl font-bold tabular-nums ${real ? "text-gray-800" : "text-gray-400"}`}>
          {real ? <AnimatedNumber value={value} format={format} /> : "—"}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
        {!real && <div className="text-[11px] text-orange-500 mt-1">Pendiente de integración</div>}
      </div>
    </motion.div>
  );
}

export default function AdminEmbudo({ userEmail }) {
  const anioActual = new Date().getFullYear();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/embudo?anio=${anioActual}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, [anioActual]);

  const leads = data?.leads || [];
  const negociosCerrados = data?.negociosCerrados || [];
  const ventasWeb = data?.ventasWeb || [];
  const leadsPilot = data?.leadsPilot || [];

  const porFormulario = useMemo(() => {
    const counts = new Map();
    for (const l of leads) counts.set(l.formularioLabel, (counts.get(l.formularioLabel) || 0) + 1);
    return [...counts.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [leads]);

  const porMes = useMemo(() => {
    return MESES_LABEL.map((label, i) => {
      const mes = i + 1;
      return {
        mes: label,
        leads: leads.filter((l) => l.mes === mes).length,
        ventasWeb: ventasWeb.filter((v) => v.mes === mes).length,
      };
    });
  }, [leads, ventasWeb]);

  const totalNegocios = negociosCerrados.length;

  // Conversion real lead web -> venta web: solo formularios que pasan por
  // nuestro backend (LeadLog) y solo desde que existe LeadLog, para comparar
  // la misma ventana de tiempo en ambos extremos. WhatsApp abre el chat
  // directo (Pilot crea el lead por su lado), asi que tiene ventas pero no
  // leads registrados; "Vende tu auto" genera compras, no ventas.
  const conversionPorFormulario = useMemo(() => {
    const desde = data?.leadLogDesde ? new Date(data.leadLogDesde) : null;
    const ventasDesde = desde ? ventasWeb.filter((v) => new Date(v.fecha) >= desde) : [];
    return FORMULARIOS_CONVERSION.map(({ key, label, conLeads }) => {
      const nLeads = conLeads ? leads.filter((l) => l.formulario === key).length : null;
      const nVentas = ventasDesde.filter((v) => v.formulario === key).length;
      return {
        key,
        label,
        leads: nLeads,
        ventas: nVentas,
        conversion: nLeads ? (nVentas / nLeads) * 100 : null,
      };
    });
  }, [data, leads, ventasWeb]);

  const conLeads = conversionPorFormulario.filter((f) => f.leads !== null);
  const leadsConversion = conLeads.reduce((s, f) => s + f.leads, 0);
  const ventasConversion = conLeads.reduce((s, f) => s + f.ventas, 0);
  const conversion = leadsConversion ? (ventasConversion / leadsConversion) * 100 : 0;

  // Leads de Pilot (todos los canales, tipo "Venta") vs ventas registradas,
  // agrupados por origen de Pilot - el mismo campo en ambos lados.
  const totalLeadsPilot = leadsPilot.reduce((s, r) => s + r.n, 0);
  // Etapa intermedia real mientras no haya fuente de citas: leads que siguen
  // en "Oportunidad" en Pilot + los que ya se vendieron (Pilot no tiene
  // estado "Ganado": el lead pasa a "Cerrado" con la marca Vendido, y la venta
  // se crea a partir de una oportunidad, asi que ya paso por esa etapa).
  const totalOportunidades = leadsPilot.reduce(
    (s, r) => s + (r.estado === "Oportunidad" ? r.n : r.vendidos),
    0
  );

  const porCanal = useMemo(() => {
    const map = new Map();
    const fila = (origen) => {
      if (!map.has(origen)) map.set(origen, { origen, leads: 0, ventas: 0 });
      return map.get(origen);
    };
    for (const r of leadsPilot) fila(r.origen).leads += r.n;
    for (const n of negociosCerrados) fila(n.origen || "Sin origen").ventas += 1;
    return [...map.values()]
      .map((f) => ({ ...f, conversion: f.leads ? (f.ventas / f.leads) * 100 : null }))
      .sort((a, b) => b.leads - a.leads);
  }, [leadsPilot, negociosCerrados]);

  const porEstado = useMemo(() => {
    const counts = {};
    for (const r of leadsPilot) counts[r.estado] = (counts[r.estado] || 0) + r.n;
    const conocidos = ORDEN_ESTADOS.filter((e) => counts[e]);
    const otros = Object.keys(counts).filter((e) => !ORDEN_ESTADOS.includes(e));
    return [...conocidos, ...otros].map((e) => ({ estado: e, n: counts[e] }));
  }, [leadsPilot]);

  const porMesTodos = useMemo(() => {
    return MESES_LABEL.map((label, i) => {
      const mes = i + 1;
      return {
        mes: label,
        leads: leadsPilot.filter((r) => r.mes === mes).reduce((s, r) => s + r.n, 0),
        ventas: negociosCerrados.filter((n) => n.mes === mes).length,
      };
    });
  }, [leadsPilot, negociosCerrados]);

  const desdeFmt = data?.leadLogDesde
    ? new Date(data.leadLogDesde).toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  return (
    <AdminLayout userEmail={userEmail} title="Embudo de Conversión" backHref="/admin/bi">
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando...</p>
      ) : (
        <>
          <div className="bg-blue-50 text-blue-700 text-sm rounded-lg p-4 mb-6">
            <b>Leads</b> salen de Pilot, donde terminan todos los canales (formularios web, bot de
            Atom en WhatsApp/Instagram/Messenger, redes sociales, showroom, portales). Solo se cuentan
            leads de tipo “Venta”. <b>Visualizaciones</b> y <b>Alcance</b> requieren integración con
            Meta Ads. Como las citas no se registran en Atom, la etapa intermedia es{" "}
            <b>Oportunidades</b>: leads que llegaron a ese estado en Pilot.
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-6">
            <EtapaCard icon={EyeIcon} label="Visualizaciones (Meta Ads)" real={false} delay={0} />
            <EtapaCard icon={UsersIcon} label="Alcance (Meta Ads)" real={false} delay={0.05} />
            <EtapaCard icon={UserPlusIcon} label="Leads generados (todos los canales)" value={totalLeadsPilot} real delay={0.1} />
            <EtapaCard icon={FunnelIcon} label="Oportunidades (Pilot)" value={totalOportunidades} real delay={0.15} />
            <EtapaCard icon={ShoppingBagIcon} label="Negocios cerrados (todos los canales)" value={totalNegocios} real delay={0.2} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Leads y ventas por canal</h3>
              <p className="text-xs text-gray-400 mb-3">
                {anioActual} · origen del lead y de la venta según Pilot
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b">
                    <th className="py-2 font-medium">Canal</th>
                    <th className="py-2 font-medium text-right">Leads</th>
                    <th className="py-2 font-medium text-right">Ventas</th>
                    <th className="py-2 font-medium text-right">Conversión</th>
                  </tr>
                </thead>
                <tbody>
                  {porCanal.map((f) => (
                    <tr key={f.origen} className="border-b last:border-0">
                      <td className="py-2 text-gray-700">{f.origen}</td>
                      <td className="py-2 text-right tabular-nums">{f.leads.toLocaleString("es-EC")}</td>
                      <td className="py-2 text-right tabular-nums">{f.ventas.toLocaleString("es-EC")}</td>
                      <td className="py-2 text-right tabular-nums font-semibold">
                        {f.conversion === null ? "—" : f.conversion.toFixed(1) + "%"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-wrap gap-2 mt-3">
                {porEstado.map((e) => (
                  <span key={e.estado} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-1">
                    {e.estado}: <b className="tabular-nums">{e.n.toLocaleString("es-EC")}</b>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                Conversión = ventas registradas del canal / leads de venta creados en el año. Una venta
                puede venir de un lead creado el año anterior.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Leads vs Ventas por mes</h3>
              <p className="text-xs text-gray-400 mb-2">{anioActual} · todos los canales</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={porMesTodos}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => v.toLocaleString("es-EC")} />
                  <Bar dataKey="leads" name="Leads" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ventas" name="Ventas" fill="#e43d30" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">Conversión Leads web → Ventas web</h3>
            <p className="text-xs text-gray-400 mb-3">
              Ventas registradas en Pilot con origen “Página web”, cruzadas por formulario con los
              leads del mismo formulario, {desdeFmt ? `desde el ${desdeFmt}` : "desde que existe el registro de leads"}.
            </p>
            <div className="text-3xl font-bold text-main tabular-nums">
              <AnimatedNumber value={conversion} format={(n) => n.toFixed(2) + "%"} />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {ventasConversion} ventas de {leadsConversion} leads — de cada 100 leads de formularios
              web, {conversion.toFixed(1)} terminan en una venta.
            </p>

            <table className="w-full text-sm mt-4">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="py-2 font-medium">Formulario</th>
                  <th className="py-2 font-medium text-right">Leads</th>
                  <th className="py-2 font-medium text-right">Ventas</th>
                  <th className="py-2 font-medium text-right">Conversión</th>
                </tr>
              </thead>
              <tbody>
                {conversionPorFormulario.map((f) => (
                  <tr key={f.key} className="border-b last:border-0">
                    <td className="py-2 text-gray-700">{f.label}</td>
                    <td className="py-2 text-right tabular-nums">{f.leads === null ? "—" : f.leads}</td>
                    <td className="py-2 text-right tabular-nums">{f.ventas}</td>
                    <td className="py-2 text-right tabular-nums font-semibold">
                      {f.conversion === null ? "—" : f.conversion.toFixed(1) + "%"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[11px] text-gray-400 mt-2">
              WhatsApp abre el chat directo y Pilot crea el lead por su cuenta, así que sus leads no se
              registran aquí (sin conversión calculable). “Vende tu auto” no aparece porque genera
              compras, no ventas.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 mb-6">
            <motion.div layout className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Leads por formulario del sitio web</h3>
              <p className="text-xs text-gray-400 mb-2">Desde que se activó el registro</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={porFormulario} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} leads`]} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={600}>
                    {porFormulario.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORES_FORM[i % COLORES_FORM.length]} />
                    ))}
                    <LabelList dataKey="value" position="right" fontSize={12} fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {porFormulario.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-8">Todavía no hay leads registrados.</p>
              )}
            </motion.div>

            <motion.div layout className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Leads web vs Ventas web por mes</h3>
              <p className="text-xs text-gray-400 mb-2">{anioActual} · las ventas web incluyen WhatsApp</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={porMes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="leads" name="Leads" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ventasWeb" name="Ventas web" fill="#e43d30" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
