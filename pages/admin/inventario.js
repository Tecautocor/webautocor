import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";
import AnimatedNumber from "../../components/admin/AnimatedNumber";
import {
  CubeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const RANGO_COLORS = {
  "0-30": "#22c55e",
  "31-60": "#eab308",
  "61-90": "#f97316",
  ">90": "#dc2626",
};
const RANGO_ORDER = ["0-30", "31-60", "61-90", ">90"];

const CARROCERIA_COLORS = {
  SUV: "#e43d30",
  Camioneta: "#1d4ed8",
  Sedán: "#0891b2",
  Hatchback: "#7c3aed",
  Otros: "#94a3b8",
};

function bucketRango(dias) {
  if (dias === null || dias === undefined) return "Sin dato";
  if (dias <= 30) return "0-30";
  if (dias <= 60) return "31-60";
  if (dias <= 90) return "61-90";
  return ">90";
}

function semaforoColor(dias) {
  const b = bucketRango(dias);
  return RANGO_COLORS[b] || "#94a3b8";
}

function renderRangoLabel({ cx, cy, midAngle, innerRadius, outerRadius, value, payload }) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central">
      <tspan x={x} dy="-0.3em" fill="#fff" fontSize={13} fontWeight={700}>
        {value}
      </tspan>
      <tspan x={x} dy="1.2em" fill="rgba(255,255,255,0.85)" fontSize={10} fontWeight={500}>
        {payload.pctValor.toFixed(0)}%
      </tspan>
    </text>
  );
}

function groupCount(list, keyFn) {
  const map = new Map();
  for (const item of list) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

const currency = (n) =>
  "$" + Math.round(n || 0).toLocaleString("es-EC");

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
          <AnimatedNumber value={value} format={format} />
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

export default function AdminInventario({ userEmail }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    agencia: null,
    carroceria: null,
    marca: null,
    rangoDias: null,
  });
  useEffect(() => {
    fetch("/api/admin/inventario")
      .then((r) => r.json())
      .then((json) => {
        setVehicles(json.vehicles || []);
        setLoading(false);
      });
  }, []);

  const toggleFilter = (dim, value) => {
    setFilters((f) => ({ ...f, [dim]: f[dim] === value ? null : value }));
  };

  const clearAll = () =>
    setFilters({ agencia: null, carroceria: null, marca: null, rangoDias: null });

  const matchesExcept = (v, exceptDim) => {
    if (exceptDim !== "agencia" && filters.agencia && v.agencia !== filters.agencia) return false;
    if (exceptDim !== "carroceria" && filters.carroceria && v.carroceria !== filters.carroceria) return false;
    if (exceptDim !== "marca" && filters.marca && v.marca !== filters.marca) return false;
    if (exceptDim !== "rangoDias" && filters.rangoDias && bucketRango(v.diasEnStock) !== filters.rangoDias) return false;
    return true;
  };

  const filtered = useMemo(
    () => vehicles.filter((v) => matchesExcept(v, null)),
    [vehicles, filters]
  );

  const kpis = useMemo(() => {
    const total = filtered.length;
    const valorTotal = filtered.reduce((s, v) => s + (v.valor || 0), 0);
    const conDias = filtered.filter((v) => v.diasEnStock !== null);
    const edadPromedio = conDias.length
      ? conDias.reduce((s, v) => s + v.diasEnStock, 0) / conDias.length
      : 0;
    const masDe90 = filtered.filter((v) => bucketRango(v.diasEnStock) === ">90").length;
    const sinFactura = filtered.filter((v) => !v.conFactura).length;

    return {
      total,
      valorTotal,
      edadPromedio,
      masDe90,
      masDe90Pct: total ? (masDe90 / total) * 100 : 0,
      sinFactura,
      sinFacturaPct: total ? (sinFactura / total) * 100 : 0,
    };
  }, [filtered]);

  const sinFacturaLista = useMemo(() => {
    return filtered
      .filter((v) => !v.conFactura)
      .sort((a, b) => (b.diasEnStock ?? -1) - (a.diasEnStock ?? -1));
  }, [filtered]);

  const rangoData = useMemo(() => {
    const base = vehicles.filter((v) => matchesExcept(v, "rangoDias"));
    const counts = groupCount(base, (v) => bucketRango(v.diasEnStock));
    const valores = new Map();
    for (const v of base) {
      const b = bucketRango(v.diasEnStock);
      valores.set(b, (valores.get(b) || 0) + (v.valor || 0));
    }
    const valorTotalBase = base.reduce((s, v) => s + (v.valor || 0), 0);
    return RANGO_ORDER.filter((r) => counts.get(r)).map((r) => ({
      name: r,
      value: counts.get(r) || 0,
      valor: valores.get(r) || 0,
      pctValor: valorTotalBase ? ((valores.get(r) || 0) / valorTotalBase) * 100 : 0,
      color: RANGO_COLORS[r],
    }));
  }, [vehicles, filters]);

  const carroceriaData = useMemo(() => {
    const base = vehicles.filter((v) => matchesExcept(v, "carroceria"));
    const counts = groupCount(base, (v) => v.carroceria);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value, color: CARROCERIA_COLORS[name] || "#94a3b8" }));
  }, [vehicles, filters]);

  const agenciaData = useMemo(() => {
    const base = vehicles.filter((v) => matchesExcept(v, "agencia"));
    const counts = groupCount(base, (v) => v.agencia);
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [vehicles, filters]);

  const top5Modelos = useMemo(() => {
    const map = new Map();
    for (const v of filtered) {
      const key = `${v.marca} ${v.modelo}`;
      if (!map.has(key)) map.set(key, { modelo: key, unidades: 0, diasSum: 0, diasN: 0, diasMax: 0, valorSum: 0, anioSum: 0 });
      const acc = map.get(key);
      acc.unidades += 1;
      acc.valorSum += v.valor || 0;
      acc.anioSum += v.anio || 0;
      if (v.diasEnStock !== null) {
        acc.diasSum += v.diasEnStock;
        acc.diasN += 1;
        acc.diasMax = Math.max(acc.diasMax, v.diasEnStock);
      }
    }
    const total = filtered.length || 1;
    let acumulado = 0;
    return [...map.values()]
      .sort((a, b) => b.unidades - a.unidades)
      .slice(0, 5)
      .map((m, i) => {
        const pct = (m.unidades / total) * 100;
        acumulado += pct;
        return {
          pos: i + 1,
          modelo: m.modelo,
          unidades: m.unidades,
          pct,
          pctAcumulado: Math.min(acumulado, 100),
          diasPromedio: m.diasN ? m.diasSum / m.diasN : null,
          diasMax: m.diasMax,
          valorTotal: m.valorSum,
          valorPromedio: m.valorSum / m.unidades,
          anioPromedio: Math.round(m.anioSum / m.unidades),
        };
      });
  }, [filtered]);

  const top50Antiguos = useMemo(() => {
    return filtered
      .filter((v) => v.diasEnStock !== null)
      .sort((a, b) => b.diasEnStock - a.diasEnStock)
      .slice(0, 50);
  }, [filtered]);

  const activeChips = [
    filters.agencia && { dim: "agencia", label: filters.agencia },
    filters.carroceria && { dim: "carroceria", label: filters.carroceria },
    filters.marca && { dim: "marca", label: filters.marca },
    filters.rangoDias && { dim: "rangoDias", label: `${filters.rangoDias} días` },
  ].filter(Boolean);

  return (
    <AdminLayout userEmail={userEmail} title="Resumen de Inventario" backHref="/admin/bi">
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando inventario en vivo...</p>
      ) : (
        <>
          {/* Barra de filtros activos */}
          <div className="flex items-center flex-wrap gap-2 mb-6 min-h-[34px]">
            <AnimatePresence mode="popLayout">
              {activeChips.map((chip) => (
                <FilterChip
                  key={chip.dim}
                  label={chip.label}
                  onClear={() => toggleFilter(chip.dim, chip.label)}
                />
              ))}
            </AnimatePresence>
            {activeChips.length > 0 && (
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-gray-600 underline ml-1"
              >
                Limpiar todo
              </button>
            )}
            {activeChips.length === 0 && (
              <span className="text-xs text-gray-400">
                Haz clic en cualquier gráfico para filtrar todo el tablero
              </span>
            )}
          </div>

          {/* KPIs */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6">
            <KpiCard icon={CubeIcon} label="Inventario total" value={kpis.total} tone="gray" delay={0} />
            <KpiCard
              icon={ClockIcon}
              label="Edad promedio (días)"
              value={kpis.edadPromedio}
              format={(n) => Math.round(n)}
              tone="orange"
              delay={0.05}
            />
            <KpiCard
              icon={ExclamationTriangleIcon}
              label={`Con +90 días (${kpis.masDe90Pct.toFixed(0)}%)`}
              value={kpis.masDe90}
              tone="red"
              delay={0.1}
            />
            <KpiCard
              icon={BanknotesIcon}
              label="Valor total inventario"
              value={kpis.valorTotal}
              format={currency}
              tone="green"
              delay={0.15}
            />
            <KpiCard
              icon={ExclamationTriangleIcon}
              label={`Sin factura de fábrica (${kpis.sinFacturaPct.toFixed(0)}%)`}
              value={kpis.sinFactura}
              tone="orange"
              delay={0.2}
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-2 mb-6">
            <motion.div layout className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Días de inventario por rango</h3>
              <p className="text-xs text-gray-400 mb-2">Clic en un rango para filtrar</p>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={rangoData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    animationDuration={600}
                    onClick={(d) => toggleFilter("rangoDias", d.name)}
                    cursor="pointer"
                    label={renderRangoLabel}
                    labelLine={false}
                  >
                    {rangoData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        opacity={filters.rangoDias && filters.rangoDias !== entry.name ? 0.3 : 1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v, n, p) => [`${v} unidades — ${p.payload.pctValor.toFixed(1)}% del valor`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-1">
                {rangoData.map((r) => (
                  <span key={r.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                    {r.name} días ({r.value})
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div layout className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Tipo de carrocería</h3>
              <p className="text-xs text-gray-400 mb-2">Clic en una barra para filtrar</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={carroceriaData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [`${v} unidades`]} />
                  <Bar
                    dataKey="value"
                    radius={[0, 6, 6, 0]}
                    animationDuration={600}
                    onClick={(d) => toggleFilter("carroceria", d.name)}
                    cursor="pointer"
                  >
                    {carroceriaData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        opacity={filters.carroceria && filters.carroceria !== entry.name ? 0.3 : 1}
                      />
                    ))}
                    <LabelList dataKey="value" position="right" fontSize={12} fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div layout className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Inventario por agencia</h3>
              <p className="text-xs text-gray-400 mb-2">Clic en una barra para filtrar</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={agenciaData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} unidades`]} />
                  <Bar
                    dataKey="value"
                    radius={[0, 6, 6, 0]}
                    animationDuration={600}
                    onClick={(d) => toggleFilter("agencia", d.name)}
                    cursor="pointer"
                  >
                    {agenciaData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill="#e43d30"
                        opacity={filters.agencia && filters.agencia !== entry.name ? 0.3 : 1}
                      />
                    ))}
                    <LabelList dataKey="value" position="right" fontSize={12} fontWeight={700} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div layout className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-1">Top 5 modelos con más unidades</h3>
              <p className="text-xs text-gray-400 mb-3">
                Barra = unidades relativas al modelo líder. Clic en un modelo para filtrar.
              </p>
              {top5Modelos.length > 0 ? (
                <div className="space-y-2">
                  {top5Modelos.map((m) => {
                    const maxUnidades = top5Modelos[0].unidades || 1;
                    const relPct = Math.round((m.unidades / maxUnidades) * 100);
                    return (
                      <button
                        key={m.modelo}
                        onClick={() => toggleFilter("marca", m.modelo.split(" ")[0])}
                        className={`w-full text-left flex items-center gap-3 border rounded-lg px-3 py-2 hover:bg-gray-50 transition ${
                          filters.marca && filters.marca !== m.modelo.split(" ")[0] ? "opacity-40" : ""
                        }`}
                      >
                        <span className="font-bold text-gray-800 text-sm w-4 shrink-0">{m.pos}</span>
                        <span className="font-bold text-gray-800 text-sm uppercase truncate flex-1">
                          {m.modelo}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                          {m.unidades} units
                        </span>
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden shrink-0 hidden sm:block">
                          <div
                            className="h-full bg-slate-500 rounded-full"
                            style={{ width: `${relPct}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-10 text-right shrink-0">
                          {relPct}%
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-sm py-6 text-center">
                  No hay vehículos que coincidan con los filtros seleccionados.
                </p>
              )}
            </motion.div>
          </div>

          {/* Tabla top 50 vehículos más antiguos */}
          <div className="bg-white rounded-xl shadow-sm p-5 overflow-x-auto mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">Top 50 vehículos más antiguos</h3>
            <p className="text-xs text-gray-400 mb-3">
              Ordenado por días en stock (no por unidades) — mientras más días, mayor pérdida para el negocio.
            </p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase border-b">
                  <th className="py-2 pr-2">Pos</th>
                  <th className="py-2 pr-2">Vehículo</th>
                  <th className="py-2 pr-2">Placa</th>
                  <th className="py-2 pr-2">Color</th>
                  <th className="py-2 pr-2">Agencia</th>
                  <th className="py-2 pr-2 text-right">Año</th>
                  <th className="py-2 pr-2 text-right">Valor</th>
                  <th className="py-2 pr-2 text-right">Días en stock</th>
                  <th className="py-2 pr-2 text-center">Factura</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {top50Antiguos.map((v, i) => (
                    <motion.tr
                      key={v.placa || `${v.marca}-${v.modelo}-${i}`}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b last:border-0"
                    >
                      <td className="py-2 pr-2 text-gray-400">{i + 1}</td>
                      <td className="py-2 pr-2 font-medium text-gray-800">
                        {v.marca} {v.modelo}
                      </td>
                      <td className="py-2 pr-2 text-gray-500">{v.placa || "—"}</td>
                      <td className="py-2 pr-2 text-gray-500">{v.color || "—"}</td>
                      <td className="py-2 pr-2 text-gray-500">{v.agencia}</td>
                      <td className="py-2 pr-2 text-right tabular-nums text-gray-500">{v.anio || "—"}</td>
                      <td className="py-2 pr-2 text-right tabular-nums text-gray-500">{currency(v.valor)}</td>
                      <td className="py-2 pr-2 text-right tabular-nums">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{
                            color: semaforoColor(v.diasEnStock),
                            backgroundColor: semaforoColor(v.diasEnStock) + "1a",
                          }}
                        >
                          {v.diasEnStock}
                        </span>
                      </td>
                      <td className="py-2 pr-2 text-center">
                        {v.conFactura ? (
                          <span className="text-green-600" title="Con factura de fábrica">✓</span>
                        ) : (
                          <span className="text-red-500 font-semibold" title="Sin factura de fábrica">✗</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {top50Antiguos.length === 0 && (
              <p className="text-gray-400 text-sm py-6 text-center">
                No hay vehículos con días en stock que coincidan con los filtros seleccionados.
              </p>
            )}
          </div>

          {/* Tabla vehículos sin factura de fábrica */}
          <div className="bg-white rounded-xl shadow-sm p-5 overflow-x-auto mb-6">
            <h3 className="font-semibold text-gray-800 mb-1">Vehículos sin factura de fábrica</h3>
            <p className="text-xs text-gray-400 mb-3">
              Unidades que Pilot todavía no marca como facturadas por fábrica al concesionario —
              ordenado por días en stock.
            </p>
            {sinFacturaLista.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase border-b">
                    <th className="py-2 pr-2">Vehículo</th>
                    <th className="py-2 pr-2">Placa</th>
                    <th className="py-2 pr-2">Agencia</th>
                    <th className="py-2 pr-2 text-right">Valor</th>
                    <th className="py-2 pr-2 text-right">Días en stock</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {sinFacturaLista.map((v, i) => (
                      <motion.tr
                        key={v.placa || `${v.marca}-${v.modelo}-${i}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b last:border-0"
                      >
                        <td className="py-2 pr-2 font-medium text-gray-800">
                          {v.marca} {v.modelo}
                        </td>
                        <td className="py-2 pr-2 text-gray-500">{v.placa || "—"}</td>
                        <td className="py-2 pr-2 text-gray-500">{v.agencia}</td>
                        <td className="py-2 pr-2 text-right tabular-nums text-gray-500">{currency(v.valor)}</td>
                        <td className="py-2 pr-2 text-right tabular-nums text-gray-500">
                          {v.diasEnStock ?? "—"}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 text-sm py-6 text-center">
                Todos los vehículos filtrados tienen factura de fábrica.
              </p>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
