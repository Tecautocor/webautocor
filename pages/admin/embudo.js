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
  CalendarDaysIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MESES_LABEL = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const COLORES_FORM = ["#e43d30", "#1d4ed8", "#0891b2", "#7c3aed", "#ca8a04"];

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
        negociosCerrados: negociosCerrados.filter((n) => n.mes === mes).length,
      };
    });
  }, [leads, negociosCerrados]);

  const totalLeads = leads.length;
  const totalNegocios = negociosCerrados.length;
  const conversion = totalLeads ? (totalNegocios / totalLeads) * 100 : 0;

  const desdeFmt = data?.leadLogDesde
    ? new Date(data.leadLogDesde).toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  return (
    <AdminLayout userEmail={userEmail} title="Embudo de Conversión">
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando...</p>
      ) : (
        <>
          <div className="bg-blue-50 text-blue-700 text-sm rounded-lg p-4 mb-6">
            <b>Leads</b> se empezó a capturar {desdeFmt ? `el ${desdeFmt}` : "recién ahora"} — no hay
            histórico previo a esa fecha, porque antes los formularios del sitio solo se mandaban
            a Pilot sin guardar copia local. <b>Visualizaciones</b>, <b>Alcance</b> y <b>Citas</b>{" "}
            todavía no tienen una fuente de datos confirmada (requieren integración con Meta Ads y
            confirmar si Citas vive en Pilot o en Atom).
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 mb-6">
            <EtapaCard icon={EyeIcon} label="Visualizaciones (Meta Ads)" real={false} delay={0} />
            <EtapaCard icon={UsersIcon} label="Alcance (Meta Ads)" real={false} delay={0.05} />
            <EtapaCard icon={UserPlusIcon} label="Leads generados" value={totalLeads} real delay={0.1} />
            <EtapaCard icon={CalendarDaysIcon} label="Citas agendadas" real={false} delay={0.15} />
            <EtapaCard icon={CheckCircleIcon} label="Citas asistidas" real={false} delay={0.2} />
            <EtapaCard icon={ShoppingBagIcon} label="Negocios cerrados" value={totalNegocios} real delay={0.25} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">Conversión Leads → Negocios cerrados</h3>
            <p className="text-xs text-gray-400 mb-3">
              Único tramo del embudo con datos reales en ambos extremos hoy.
            </p>
            <div className="text-3xl font-bold text-main tabular-nums">
              <AnimatedNumber value={conversion} format={(n) => n.toFixed(2) + "%"} />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              De cada 100 leads generados, {conversion.toFixed(1)} terminan en una venta cerrada.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 mb-6">
            <motion.div layout className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Leads por formulario/canal</h3>
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
              <h3 className="font-semibold text-gray-800 mb-1">Leads vs Negocios cerrados por mes</h3>
              <p className="text-xs text-gray-400 mb-2">{anioActual}</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={porMes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="leads" name="Leads" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="negociosCerrados" name="Negocios cerrados" fill="#e43d30" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
