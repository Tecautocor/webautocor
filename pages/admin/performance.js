import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";
import AnimatedNumber from "../../components/admin/AnimatedNumber";
import {
  TrophyIcon,
  ChartBarIcon,
  FlagIcon,
  CalendarDaysIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MESES_LABEL = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function cumplimientoColor(pct) {
  if (pct >= 95) return "#16a34a";
  if (pct >= 80) return "#eab308";
  if (pct >= 60) return "#f97316";
  return "#dc2626";
}

function FilterChip({ label, onClear }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={onClear}
      className="flex items-center gap-1 bg-main/10 text-main text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-main/20 transition"
    >
      {label}
      <XMarkIcon className="h-3.5 w-3.5" />
    </motion.button>
  );
}

function KpiCard({ icon: Icon, label, value, format, tone, delay }) {
  const toneClasses = {
    red: "bg-red-50 text-red-700",
    green: "bg-green-50 text-green-700",
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
    gray: "bg-gray-50 text-gray-700",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${toneClasses[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800 tabular-nums">
          {typeof value === "string" ? value : <AnimatedNumber value={value} format={format} />}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

export default function AdminPerformance({ userEmail }) {
  const anioActual = new Date().getFullYear();
  const mesActual = new Date().getMonth() + 1;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ agencia: null, mes: null });

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/performance?anio=${anioActual}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, [anioActual]);

  const toggleFilter = (dim, value) => {
    setFilters((f) => ({ ...f, [dim]: f[dim] === value ? null : value }));
  };
  const clearAll = () => setFilters({ agencia: null, mes: null });

  const ventasAllVehicle = data?.ventas || [];
  const metas = data?.metas || [];
  const estadoRegistrada = data?.estadoRegistrada || [];
  const estadoAprobadoJefatura = data?.estadoAprobadoJefatura || [];
  const estadoPendientes = data?.estadoPendientes || [];

  // Fuente combinada (2026-09-10, a pedido del cliente): AllVehicle (fecha de
  // facturacion) para meses anteriores a agosto 2026, y el webhook de Pilot en
  // vivo desde agosto en adelante, que es desde cuando esta conectado. Venta
  // concretada = estado "Registrada" (VentaWebhookLog) por si solo, segun
  // aclaracion del cliente (2026-09-17): "Aprobado Jefatura" es un paso
  // posterior de revision de papeles/pagos, no el momento en que se concreta
  // la venta, asi que no se exige tambien ese estado.
  const CUTOFF_MES_EMBUDO = 8;
  const ventas = useMemo(() => {
    const registradas = estadoRegistrada
      .filter((v) => v.mes >= CUTOFF_MES_EMBUDO)
      .map((v) => ({ agencia: v.agencia, mes: v.mes }));
    return [...ventasAllVehicle.filter((v) => v.mes < CUTOFF_MES_EMBUDO), ...registradas];
  }, [ventasAllVehicle, estadoRegistrada]);

  const matchesExcept = (v, exceptDim) => {
    if (exceptDim !== "agencia" && filters.agencia && v.agencia !== filters.agencia) return false;
    if (exceptDim !== "mes" && filters.mes && v.mes !== filters.mes) return false;
    return true;
  };
  const matchesMes = (v) => !filters.mes || v.mes === filters.mes;

  const ventasFiltradas = useMemo(() => ventas.filter((v) => matchesExcept(v, null)), [ventas, filters]);

  // EcuaprimasMatchLog (Aprobado Jefatura) no trae agencia en el payload de Pilot,
  // asi que ese conteo y el total (union de ambos estados) solo se pueden filtrar
  // por mes - el filtro de agencia solo aplica a Registrada y Pendientes.
  const estadoRegistradaCount = useMemo(
    () => estadoRegistrada.filter((v) => matchesExcept(v, null)).length,
    [estadoRegistrada, filters]
  );
  const estadoAprobadoJefaturaCount = useMemo(
    () => estadoAprobadoJefatura.filter(matchesMes).length,
    [estadoAprobadoJefatura, filters.mes]
  );
  const estadoPendientesFiltrado = useMemo(
    () => estadoPendientes.filter((v) => matchesExcept(v, null)),
    [estadoPendientes, filters]
  );
  const estadoTotalCount = useMemo(() => {
    const ids = new Set();
    estadoRegistrada.filter(matchesMes).forEach((v) => ids.add(v.ventaId));
    estadoAprobadoJefatura.filter(matchesMes).forEach((v) => ids.add(v.ventaId));
    return ids.size;
  }, [estadoRegistrada, estadoAprobadoJefatura, filters.mes]);

  const metaTotalPeriodo = useMemo(() => {
    const mesesIncluidos = filters.mes ? [filters.mes] : MESES_LABEL.map((_, i) => i + 1).filter((m) => m <= mesActual);
    return metas
      .filter((m) => mesesIncluidos.includes(m.mes) && (!filters.agencia || m.agencia === filters.agencia))
      .reduce((s, m) => s + m.metaUnidades, 0);
  }, [metas, filters, mesActual]);

  const kpis = useMemo(() => {
    const totalVentas = ventasFiltradas.length;
    const pct = metaTotalPeriodo ? (totalVentas / metaTotalPeriodo) * 100 : 0;

    const porAgencia = new Map();
    for (const v of ventas.filter((v) => matchesExcept(v, "agencia"))) {
      porAgencia.set(v.agencia, (porAgencia.get(v.agencia) || 0) + 1);
    }
    let agenciaLider = "—";
    let mejorPct = -1;
    for (const agencia of new Set(metas.map((m) => m.agencia))) {
      const metaAg = metas
        .filter((m) => m.agencia === agencia && m.mes <= mesActual)
        .reduce((s, m) => s + m.metaUnidades, 0);
      const ventasAg = porAgencia.get(agencia) || 0;
      const pctAg = metaAg ? (ventasAg / metaAg) * 100 : 0;
      if (pctAg > mejorPct) {
        mejorPct = pctAg;
        agenciaLider = agencia;
      }
    }

    const ventasMesActual = ventas.filter((v) => v.mes === mesActual && (!filters.agencia || v.agencia === filters.agencia)).length;
    const metaMesActual = metas
      .filter((m) => m.mes === mesActual && (!filters.agencia || m.agencia === filters.agencia))
      .reduce((s, m) => s + m.metaUnidades, 0);
    const pctMesActual = metaMesActual ? (ventasMesActual / metaMesActual) * 100 : 0;

    return { totalVentas, metaTotalPeriodo, pct, agenciaLider, ventasMesActual, metaMesActual, pctMesActual };
  }, [ventasFiltradas, ventas, metas, filters, metaTotalPeriodo, mesActual]);

  const porAgenciaData = useMemo(() => {
    const base = ventas.filter((v) => matchesExcept(v, "agencia"));
    const counts = new Map();
    for (const v of base) counts.set(v.agencia, (counts.get(v.agencia) || 0) + 1);

    const agencias = new Set([...metas.map((m) => m.agencia), ...counts.keys()]);
    return [...agencias]
      .map((agencia) => {
        const ventasYtd = counts.get(agencia) || 0;
        const metaYtd = metas
          .filter((m) => m.agencia === agencia && m.mes <= mesActual)
          .reduce((s, m) => s + m.metaUnidades, 0);
        const pct = metaYtd ? (ventasYtd / metaYtd) * 100 : 0;
        return { agencia, ventasYtd, metaYtd, pct, gap: ventasYtd - metaYtd };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [ventas, metas, filters, mesActual]);

  const evolucionData = useMemo(() => {
    const base = ventas.filter((v) => matchesExcept(v, "mes"));
    let acumVentas = 0;
    let acumMeta = 0;
    return MESES_LABEL.map((label, i) => {
      const mes = i + 1;
      const ventasMes = base.filter((v) => v.mes === mes).length;
      const metaMes = metas
        .filter((m) => m.mes === mes && (!filters.agencia || m.agencia === filters.agencia))
        .reduce((s, m) => s + m.metaUnidades, 0);
      acumVentas += mes <= mesActual ? ventasMes : 0;
      acumMeta += metaMes;
      return {
        mes: label,
        mesNum: mes,
        ventasAcumuladas: mes <= mesActual ? acumVentas : null,
        presupuestoAcumulado: acumMeta,
      };
    });
  }, [ventas, metas, filters, mesActual]);

  const activeChips = [
    filters.agencia && { dim: "agencia", label: filters.agencia },
    filters.mes && { dim: "mes", label: MESES_LABEL[filters.mes - 1] },
  ].filter(Boolean);

  return (
    <AdminLayout userEmail={userEmail} title="Performance por Agencia" backHref="/admin/bi">
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando ventas en vivo...</p>
      ) : (
        <>
          <div className="flex items-center flex-wrap gap-2 mb-6 min-h-[34px]">
            <AnimatePresence mode="popLayout">
              {activeChips.map((chip) => (
                <FilterChip key={chip.dim} label={chip.label} onClear={() => toggleFilter(chip.dim, chip.label)} />
              ))}
            </AnimatePresence>
            {activeChips.length > 0 && (
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600 underline ml-1">
                Limpiar todo
              </button>
            )}
            {activeChips.length === 0 && (
              <span className="text-xs text-gray-400">
                Haz clic en una agencia o un mes para filtrar todo el tablero
              </span>
            )}
          </div>

          {metas.length === 0 && (
            <div className="bg-orange-50 text-orange-700 text-sm rounded-lg p-4 mb-6">
              Todavía no hay metas cargadas para {anioActual}. Ve a{" "}
              <Link href="/admin/metas" className="underline font-semibold">
                Metas de Ventas
              </Link>{" "}
              para definirlas — sin eso, el % de cumplimiento no se puede calcular.
            </div>
          )}

          <p className="text-xs text-gray-400 mb-2">
            “Ventas acumuladas YTD” combina dos fuentes — antes de agosto 2026 usa la fecha de
            facturación de fábrica, y desde agosto usa las ventas en estado “Registrada” (venta
            concretada), que es desde cuando ese webhook de Pilot está conectado.
          </p>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
            <KpiCard icon={ChartBarIcon} label="Ventas acumuladas YTD" value={kpis.totalVentas} tone="gray" delay={0} />
            <KpiCard icon={FlagIcon} label="Presupuesto acumulado YTD" value={kpis.metaTotalPeriodo} tone="blue" delay={0.05} />
            <KpiCard
              icon={ChartBarIcon}
              label="% Cumplimiento YTD"
              value={kpis.pct}
              format={(n) => n.toFixed(0) + "%"}
              tone={kpis.pct >= 95 ? "green" : kpis.pct >= 80 ? "orange" : "red"}
              delay={0.1}
            />
            <KpiCard icon={TrophyIcon} label="Agencia líder YTD" value={kpis.agenciaLider} tone="green" delay={0.15} />
            <KpiCard
              icon={CalendarDaysIcon}
              label={`% Cumplimiento ${MESES_LABEL[mesActual - 1]}`}
              value={kpis.pctMesActual}
              format={(n) => n.toFixed(0) + "%"}
              tone={kpis.pctMesActual >= 95 ? "green" : kpis.pctMesActual >= 80 ? "orange" : "red"}
              delay={0.2}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">Ventas por estado (webhooks Pilot en vivo)</h3>
            <p className="text-xs text-gray-400 mb-4">
              “Registrada” = el cliente confirmó que compra. “Aprobado Jefatura” = el asesor llevó la
              venta al jefe y se revisaron papeles/pagos. Es una señal en tiempo real por etapa del
              proceso (desde agosto 2026), distinta de las ventas cerradas por facturación que se usan
              arriba para el cumplimiento YTD.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-800 tabular-nums">
                  <AnimatedNumber value={estadoTotalCount} />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Total en el embudo</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-800 tabular-nums">
                  <AnimatedNumber value={estadoRegistradaCount} />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Registrada</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="text-2xl font-bold text-gray-800 tabular-nums">
                  <AnimatedNumber value={estadoAprobadoJefaturaCount} />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">Aprobado Jefatura</div>
              </div>
              <div className="rounded-lg bg-orange-50 p-4">
                <div className="text-2xl font-bold text-orange-700 tabular-nums">
                  <AnimatedNumber value={estadoPendientesFiltrado.length} />
                </div>
                <div className="text-xs text-orange-600 mt-0.5">Pendientes de aprobación</div>
              </div>
            </div>
            {filters.agencia && (
              <p className="text-[11px] text-gray-400 mt-3">
                Pilot no envía la agencia en el webhook de “Aprobado Jefatura” — por eso “Total” y
                “Aprobado Jefatura” no se filtran por agencia, solo por mes. “Registrada” y
                “Pendientes” sí.
              </p>
            )}

            {estadoPendientesFiltrado.length > 0 && (
              <div className="mt-5 overflow-x-auto">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Top 10 ventas registradas con más días esperando pasar a Aprobado Jefatura
                </h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 text-xs uppercase border-b">
                      <th className="py-2 pr-2">Venta ID</th>
                      <th className="py-2 pr-2">Vehículo</th>
                      <th className="py-2 pr-2">Vendedor</th>
                      <th className="py-2 pr-2">Agencia</th>
                      <th className="py-2 pr-2 text-right">Registrada</th>
                      <th className="py-2 pr-2 text-right">Días esperando</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...estadoPendientesFiltrado]
                      .sort((a, b) => new Date(a.fechaAlta) - new Date(b.fechaAlta))
                      .slice(0, 10)
                      .map((p) => {
                        const dias = Math.floor((Date.now() - new Date(p.fechaAlta).getTime()) / 86400000);
                        return (
                          <tr key={p.ventaId} className="border-b last:border-0">
                            <td className="py-2 pr-2 text-gray-500">{p.ventaId}</td>
                            <td className="py-2 pr-2 font-medium text-gray-800">
                              {p.marca} {p.modelo}
                            </td>
                            <td className="py-2 pr-2 text-gray-500">{p.vendedor || "—"}</td>
                            <td className="py-2 pr-2 text-gray-500">{p.agencia || "—"}</td>
                            <td className="py-2 pr-2 text-right tabular-nums text-gray-500">
                              {new Date(p.fechaAlta).toLocaleDateString("es-EC")}
                            </td>
                            <td className="py-2 pr-2 text-right tabular-nums">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  dias > 7 ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {dias}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2 mb-6">
            <motion.div layout className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Ranking por % de cumplimiento YTD</h3>
              <p className="text-xs text-gray-400 mb-2">Clic en una agencia para filtrar</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={porAgenciaData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" unit="%" domain={[0, (dataMax) => Math.ceil(dataMax * 1.15)]} />
                  <YAxis type="category" dataKey="agencia" width={130} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v, n, p) => [`${v.toFixed(0)}% (${p.payload.ventasYtd}/${p.payload.metaYtd})`, "Cumplimiento"]} />
                  <Bar
                    dataKey="pct"
                    radius={[0, 6, 6, 0]}
                    animationDuration={600}
                    onClick={(d) => toggleFilter("agencia", d.agencia)}
                    cursor="pointer"
                  >
                    {porAgenciaData.map((entry) => (
                      <Cell
                        key={entry.agencia}
                        fill={cumplimientoColor(entry.pct)}
                        opacity={filters.agencia && filters.agencia !== entry.agencia ? 0.3 : 1}
                      />
                    ))}
                    <LabelList dataKey="pct" position="right" formatter={(v) => `${v.toFixed(0)}%`} fontSize={12} fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div layout className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Evolución acumulada: Ventas vs Presupuesto</h3>
              <p className="text-xs text-gray-400 mb-2">Clic en un mes para filtrar</p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={evolucionData} onClick={(e) => e?.activeLabel && toggleFilter("mes", evolucionData.find((d) => d.mes === e.activeLabel)?.mesNum)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="ventasAcumuladas" name="Ventas acumuladas" stroke="#e43d30" strokeWidth={3} dot={{ r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="presupuestoAcumulado" name="Presupuesto acumulado" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 overflow-x-auto">
            <h3 className="font-semibold text-gray-800 mb-3">Resumen YTD por agencia</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase border-b">
                  <th className="py-2 pr-2">Agencia</th>
                  <th className="py-2 pr-2 text-right">Ventas YTD</th>
                  <th className="py-2 pr-2 text-right">Presupuesto YTD</th>
                  <th className="py-2 pr-2 text-right">% Cumplimiento</th>
                  <th className="py-2 pr-2 text-right">Gap</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {porAgenciaData.map((row) => (
                    <motion.tr
                      key={row.agencia}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => toggleFilter("agencia", row.agencia)}
                      className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-2 pr-2 font-medium text-gray-800">{row.agencia}</td>
                      <td className="py-2 pr-2 text-right tabular-nums">{row.ventasYtd}</td>
                      <td className="py-2 pr-2 text-right tabular-nums text-gray-500">{row.metaYtd}</td>
                      <td className="py-2 pr-2 text-right tabular-nums">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{ color: cumplimientoColor(row.pct), backgroundColor: cumplimientoColor(row.pct) + "1a" }}
                        >
                          {row.pct.toFixed(0)}%
                        </span>
                      </td>
                      <td className={`py-2 pr-2 text-right tabular-nums ${row.gap < 0 ? "text-red-600" : "text-green-600"}`}>
                        {row.gap > 0 ? "+" : ""}
                        {row.gap}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {porAgenciaData.length === 0 && (
              <p className="text-gray-400 text-sm py-6 text-center">Sin datos para los filtros seleccionados.</p>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
