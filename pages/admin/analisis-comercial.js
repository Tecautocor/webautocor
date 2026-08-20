import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";
import AnimatedNumber from "../../components/admin/AnimatedNumber";
import {
  ArrowTrendingUpIcon,
  UserGroupIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MESES_LABEL = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const COLORES_ANIO = { 2023: "#94a3b8", 2024: "#1d4ed8", 2025: "#0891b2", 2026: "#e43d30" };

const TABS = [
  { key: "interanual", label: "Comparativa Interanual", icon: ArrowTrendingUpIcon },
  { key: "vendedores", label: "Vendedores", icon: UserGroupIcon },
  { key: "rentabilidad", label: "Rentabilidad y Financiamiento", icon: BanknotesIcon },
];

const currency = (n) => "$" + Math.round(n || 0).toLocaleString("es-EC");

export default function AdminAnalisisComercial({ userEmail }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("interanual");

  useEffect(() => {
    fetch("/api/admin/analisis-comercial")
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const anios = useMemo(() => {
    const set = new Set((data?.ventasPorAnioMes || []).map((v) => v.anio));
    return [...set].sort();
  }, [data]);

  const interanualData = useMemo(() => {
    return MESES_LABEL.map((label, i) => {
      const mes = i + 1;
      const row = { mes: label };
      for (const anio of anios) {
        const found = (data?.ventasPorAnioMes || []).find((v) => v.anio === anio && v.mes === mes);
        row[anio] = found ? found.n : null;
      }
      return row;
    });
  }, [data, anios]);

  const crecimientoYTD = useMemo(() => {
    if (anios.length < 2) return null;
    const anioActual = anios[anios.length - 1];
    const anioAnterior = anios[anios.length - 2];
    const mesActual = new Date().getMonth() + 1;
    const sum = (anio) =>
      (data?.ventasPorAnioMes || [])
        .filter((v) => v.anio === anio && v.mes <= mesActual)
        .reduce((s, v) => s + v.n, 0);
    const actual = sum(anioActual);
    const anterior = sum(anioAnterior);
    return { anioActual, anioAnterior, actual, anterior, pct: anterior ? ((actual - anterior) / anterior) * 100 : 0 };
  }, [data, anios]);

  const rentabilidad = data?.rentabilidad || [];
  const rentKpis = useMemo(() => {
    if (rentabilidad.length === 0) return null;
    const n = rentabilidad.length;
    const avg = (key) => rentabilidad.reduce((s, r) => s + (r[key] || 0), 0) / n;
    const financiadas = rentabilidad.filter((r) => (r.montoFinanciado || 0) > 0).length;
    return {
      n,
      descuentoVendedorProm: avg("descuentoVendedor"),
      descuentoGerenteProm: avg("descuentoGerente"),
      pctFinanciadas: (financiadas / n) * 100,
      utilidadRetomaProm: avg("usadoRentabilidadEstimada"),
      comisionProm: avg("comisionVendedor"),
    };
  }, [rentabilidad]);

  return (
    <AdminLayout userEmail={userEmail} title="Análisis Comercial">
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando...</p>
      ) : (
        <>
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-full">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition whitespace-nowrap shrink-0 ${
                  tab === t.key ? "bg-white shadow-sm text-main" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "interanual" && (
              <motion.div key="interanual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {crecimientoYTD && (
                  <div className="bg-white rounded-xl shadow-sm p-5 mb-4 flex items-center gap-4">
                    <div>
                      <div className="text-3xl font-bold tabular-nums" style={{ color: crecimientoYTD.pct >= 0 ? "#16a34a" : "#dc2626" }}>
                        <AnimatedNumber value={crecimientoYTD.pct} format={(n) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%"} />
                      </div>
                      <div className="text-xs text-gray-500">
                        Crecimiento YTD {crecimientoYTD.anioActual} vs {crecimientoYTD.anioAnterior} (
                        {crecimientoYTD.actual} vs {crecimientoYTD.anterior} unidades)
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <h3 className="font-semibold text-gray-800 mb-1">Ventas cerradas por mes, comparado año a año</h3>
                  <p className="text-xs text-gray-400 mb-2">Fuente: AllVehicle (estado Vendido) — desde 2023</p>
                  <ResponsiveContainer width="100%" height={340}>
                    <LineChart data={interanualData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      {anios.map((anio) => (
                        <Line
                          key={anio}
                          type="monotone"
                          dataKey={anio}
                          name={String(anio)}
                          stroke={COLORES_ANIO[anio] || "#999"}
                          strokeWidth={anio === anios[anios.length - 1] ? 3 : 2}
                          dot={{ r: 3 }}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {tab === "vendedores" && (
              <motion.div key="vendedores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="bg-orange-50 text-orange-700 text-sm rounded-lg p-4 mb-4">
                  Esto usa el usuario que <b>reservó la unidad</b> en el sistema como aproximación de
                  quién vendió — no es un campo explícito de &quot;vendedor&quot; en el stock. En cuanto se
                  acumulen datos del webhook de Ventas (que sí trae el vendedor real de cada
                  operación), esto se reemplaza por ese dato exacto.
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Ranking por unidades (año en curso)</h3>
                  <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={data?.porVendedor || []} layout="vertical" margin={{ left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="vendedor" width={180} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(v, n, p) => [`${v} unidades — ${p.payload.agencia}`]} />
                      <Bar dataKey="n" fill="#e43d30" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {tab === "rentabilidad" && (
              <motion.div key="rentabilidad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {!rentKpis ? (
                  <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                    <BanknotesIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Todavía no hay datos reales del webhook de Ventas (esperando que la primera
                      venta pase a estado <b>&quot;Registrado&quot;</b> en Pilot). En cuanto lleguen los
                      primeros eventos, esta sección se llena sola con descuentos, financiamiento y
                      rentabilidad de retomas.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-4">
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{rentKpis.n}</div>
                        <div className="text-xs text-gray-500">Ventas registradas</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{currency(rentKpis.descuentoVendedorProm)}</div>
                        <div className="text-xs text-gray-500">Descuento prom. (vendedor)</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{currency(rentKpis.descuentoGerenteProm)}</div>
                        <div className="text-xs text-gray-500">Descuento prom. (gerente)</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{rentKpis.pctFinanciadas.toFixed(0)}%</div>
                        <div className="text-xs text-gray-500">Ventas financiadas</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5 overflow-x-auto">
                      <h3 className="font-semibold text-gray-800 mb-3">Últimas ventas registradas</h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-400 text-xs uppercase border-b">
                            <th className="py-2 pr-2">Venta</th>
                            <th className="py-2 pr-2">Sucursal</th>
                            <th className="py-2 pr-2 text-right">Precio lista</th>
                            <th className="py-2 pr-2 text-right">Total</th>
                            <th className="py-2 pr-2 text-right">Financiado</th>
                            <th className="py-2 pr-2">Banco</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rentabilidad.slice(0, 30).map((r) => (
                            <tr key={r.ventaId} className="border-b last:border-0">
                              <td className="py-1.5 pr-2">{r.ventaId}</td>
                              <td className="py-1.5 pr-2">{r.sucursal || "—"}</td>
                              <td className="py-1.5 pr-2 text-right">{currency(r.precioLista)}</td>
                              <td className="py-1.5 pr-2 text-right">{currency(r.totalTransaccion)}</td>
                              <td className="py-1.5 pr-2 text-right">{currency(r.montoFinanciado)}</td>
                              <td className="py-1.5 pr-2">{r.banco || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AdminLayout>
  );
}
