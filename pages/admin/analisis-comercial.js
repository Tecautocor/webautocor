import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
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

  const porVendedorList = data?.porVendedor || [];
  const top3Vendedores = useMemo(() => porVendedorList.slice(0, 3), [porVendedorList]);
  const porSucursal = useMemo(() => {
    const map = new Map();
    for (const v of porVendedorList) {
      const key = v.agencia || "Sin sucursal";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(v);
    }
    return [...map.entries()]
      .map(([agencia, vendedores]) => ({
        agencia,
        vendedores: [...vendedores].sort((a, b) => b.n - a.n).slice(0, 6),
        total: vendedores.reduce((s, v) => s + v.n, 0),
      }))
      .sort((a, b) => b.total - a.total);
  }, [porVendedorList]);

  const rentabilidadEnVivo = data?.rentabilidadEnVivo || [];
  const rentHistorico = data?.rentabilidadHistorico || null;
  const enVivoKpis = useMemo(() => {
    if (rentabilidadEnVivo.length === 0) return null;
    const n = rentabilidadEnVivo.length;
    const avg = (key) => rentabilidadEnVivo.reduce((s, r) => s + (r[key] || 0), 0) / n;
    const financiadas = rentabilidadEnVivo.filter((r) => (r.montoFinanciado || 0) > 0).length;
    return {
      n,
      descuentoVendedorProm: avg("descuentoVendedor"),
      descuentoGerenteProm: avg("descuentoGerente"),
      pctFinanciadas: (financiadas / n) * 100,
    };
  }, [rentabilidadEnVivo]);

  return (
    <AdminLayout userEmail={userEmail} title="Análisis Comercial" backHref="/admin/bi">
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
                  <p className="text-xs text-gray-400 mb-2">
                    Fuente: carga histórica real de Pilot (2023 en adelante) + webhook en vivo de
                    Pilot en estado &quot;Registrado&quot; (desde el 20 de agosto {new Date().getFullYear()}).
                  </p>
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
                {top3Vendedores.length > 0 && (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
                    {top3Vendedores.map((v, i) => {
                      const medal = [
                        { bg: "bg-yellow-50", ring: "ring-yellow-300", text: "text-yellow-700", emoji: "🥇" },
                        { bg: "bg-gray-50", ring: "ring-gray-300", text: "text-gray-600", emoji: "🥈" },
                        { bg: "bg-orange-50", ring: "ring-orange-300", text: "text-orange-700", emoji: "🥉" },
                      ][i];
                      return (
                        <div
                          key={`${v.vendedor}|${v.agencia}`}
                          className={`rounded-xl shadow-sm p-5 ring-2 ${medal.bg} ${medal.ring}`}
                        >
                          <div className="text-3xl mb-2">{medal.emoji}</div>
                          <div className="font-bold text-gray-800 uppercase truncate">{v.vendedor}</div>
                          <div className="text-xs text-gray-500 mb-2">{v.agencia}</div>
                          <div className={`text-2xl font-bold ${medal.text}`}>
                            {v.n} <span className="text-sm font-normal text-gray-500">unidades</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  Ranking por sucursal ({data?.anioActual})
                </h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {porSucursal.map((s) => (
                    <div key={s.agencia} className="bg-white rounded-xl shadow-sm p-5">
                      <h4 className="font-semibold text-gray-800 mb-3 uppercase text-sm">{s.agencia}</h4>
                      <div className="space-y-2">
                        {s.vendedores.map((v, idx) => {
                          const maxN = s.vendedores[0].n || 1;
                          const relPct = Math.round((v.n / maxN) * 100);
                          return (
                            <div key={v.vendedor} className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 text-xs w-4 shrink-0">{idx + 1}</span>
                              <span className="text-xs text-gray-700 truncate flex-1">{v.vendedor}</span>
                              <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden shrink-0 hidden sm:block">
                                <div
                                  className="h-full bg-main rounded-full"
                                  style={{ width: `${relPct}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-gray-600 w-6 text-right shrink-0">
                                {v.n}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "rentabilidad" && (
              <motion.div key="rentabilidad" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {rentHistorico && (
                  <>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                      Histórico (2023–{data?.anioActual}, carga de Pilot)
                    </h3>
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{rentHistorico.n.toLocaleString("es-EC")}</div>
                        <div className="text-xs text-gray-500">Ventas registradas</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">
                          {rentHistorico.descuentoProm !== null ? rentHistorico.descuentoProm.toFixed(2) + "%" : "—"}
                        </div>
                        <div className="text-xs text-gray-500">Descuento promedio</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">
                          {rentHistorico.pctFinanciadas !== null ? rentHistorico.pctFinanciadas.toFixed(1) + "%" : "—"}
                        </div>
                        <div className="text-xs text-gray-500">Ventas financiadas</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{currency(rentHistorico.ticketPromedio)}</div>
                        <div className="text-xs text-gray-500">Ticket promedio</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 -mt-4 mb-6">
                      El detalle de descuento autorizado por vendedor/gerente y comisión no está
                      confiablemente poblado en la carga histórica — esos dos solo van a tener datos
                      reales a partir del webhook en vivo.
                    </p>
                  </>
                )}

                <h3 className="text-sm font-semibold text-gray-500 mb-2">En vivo (webhook de Pilot)</h3>
                {!enVivoKpis ? (
                  <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                    <BanknotesIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Todavía no hay eventos reales del webhook de Ventas (esperando que la primera
                      venta pase a estado <b>&quot;Registrado&quot;</b> en Pilot desde que se activó la
                      regla). En cuanto lleguen, aquí se ve el detalle exacto de descuentos por
                      vendedor/gerente y comisión que el histórico no tiene.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-4">
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{enVivoKpis.n}</div>
                        <div className="text-xs text-gray-500">Ventas registradas</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{currency(enVivoKpis.descuentoVendedorProm)}</div>
                        <div className="text-xs text-gray-500">Descuento prom. (vendedor)</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{currency(enVivoKpis.descuentoGerenteProm)}</div>
                        <div className="text-xs text-gray-500">Descuento prom. (gerente)</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{enVivoKpis.pctFinanciadas.toFixed(0)}%</div>
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
                          {rentabilidadEnVivo.slice(0, 30).map((r) => (
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
