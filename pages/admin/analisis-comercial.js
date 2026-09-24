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
const ANIO_INICIO_INTERANUAL = 2023;
const COLORES_ANIO ={ 2023: "#94a3b8", 2024: "#1d4ed8", 2025: "#0891b2", 2026: "#e43d30" };

const TABS = [
  { key: "interanual", label: "Comparativa Interanual", icon: ArrowTrendingUpIcon },
  { key: "vendedores", label: "Vendedores", icon: UserGroupIcon },
  { key: "rentabilidad", label: "Rentabilidad y Financiamiento", icon: BanknotesIcon },
];

const MESES_NOMBRE = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function TarjetaCrecimiento({ titulo, detalle, actual, anterior }) {
  const pct = anterior ? ((actual - anterior) / anterior) * 100 : 0;
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="text-3xl font-bold tabular-nums" style={{ color: pct >= 0 ? "#16a34a" : "#dc2626" }}>
        <AnimatedNumber value={pct} format={(n) => (n >= 0 ? "+" : "") + n.toFixed(1) + "%"} />
      </div>
      <div className="text-sm font-medium text-gray-700 mt-1">{titulo}</div>
      <div className="text-xs text-gray-500">
        {actual} vs {anterior} unidades
      </div>
      <div className="text-xs text-gray-400 mt-1">{detalle}</div>
    </div>
  );
}

const ritmoTexto = (factor) => {
  const pct = Math.round((factor - 1) * 100);
  return pct >= 0 ? `${pct}% más que el año anterior` : `${-pct}% menos que el año anterior`;
};

function VariacionVsAnterior({ cierre, anterior, anio, small }) {
  const pct = anterior ? ((cierre - anterior) / anterior) * 100 : 0;
  return (
    <span className={`tabular-nums font-medium ${small ? "text-xs" : ""}`} style={{ color: pct >= 0 ? "#16a34a" : "#dc2626" }}>
      {pct >= 0 ? "+" : ""}
      {pct.toFixed(1)}% vs {anterior.toLocaleString("es-EC")} u. de {anio}
    </span>
  );
}

// Diferencia en unidades contra el mes anterior: ▲ verde, ▼ roja, = gris.
function Delta({ actual, anterior }) {
  const d = actual - anterior;
  if (d === 0) return <span className="text-xs font-medium text-gray-400 tabular-nums">=</span>;
  return (
    <span className="text-xs font-medium tabular-nums" style={{ color: d > 0 ? "#16a34a" : "#dc2626" }}>
      {d > 0 ? "▲" : "▼"} {Math.abs(d)}
    </span>
  );
}

// fechaAlta llega como hora local de Pilot guardada tal cual: se leen las partes UTC para no correrla.
const fechaCorta = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
};
const capitalizar = (s) => s.trim().toLowerCase().replace(/^\p{L}/u, (c) => c.toUpperCase());

const currency = (n) => "$" + Math.round(n || 0).toLocaleString("es-EC");

export default function AdminAnalisisComercial({ userEmail }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("interanual");
  // null = todos los años visibles; un año = solo ese año en el gráfico interanual.
  const [anioSolo, setAnioSolo] = useState(null);
  // null = anio completo; 1-12 = ranking de vendedores solo de ese mes.
  const [mesVendedores, setMesVendedores] = useState(null);
  // Filtros de Rentabilidad "En vivo": "" = todas / todos; mes en formato "YYYY-MM".
  const [filtroAgencia, setFiltroAgencia] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [ventasVisibles, setVentasVisibles] = useState(30);
  useEffect(() => setVentasVisibles(30), [filtroAgencia, filtroMes]);

  useEffect(() => {
    fetch("/api/admin/analisis-comercial")
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const anios = useMemo(() => {
    // 2022 solo trae los ultimos dias de diciembre (inicio de la carga historica), no es comparable.
    const set = new Set((data?.ventasPorAnioMes || []).map((v) => v.anio).filter((a) => a >= ANIO_INICIO_INTERANUAL));
    return [...set].sort();
  }, [data]);

  // Proyeccion de cierre del anio en curso: cada mes que falta = mismo mes del
  // anio anterior x factor de ritmo. Asi respeta la estacionalidad (oct/dic
  // altos, nov bajo). Dos escenarios:
  // - principal: ritmo de los ultimos 3 meses cerrados vs los mismos meses del
  //   anio anterior (refleja como va el negocio ahora; no cambia dia a dia).
  // - referencia: ritmo de todo el anio (1-ene a la fecha de corte).
  const proyeccion = useMemo(() => {
    const cd = data?.comparativaAlDia;
    const factorAnio = cd?.proyeccion?.factor;
    if (!cd || !factorAnio) return null;
    const ventasDe = (anio, mes) =>
      (data.ventasPorAnioMes || []).find((v) => v.anio === anio && v.mes === mes)?.n || 0;

    // Meses cerrados del anio en curso (hasta 3). En enero no hay ninguno:
    // se usa el ritmo del anio como principal.
    const mesesRecientes = [];
    for (let mes = Math.max(1, cd.mes - 3); mes < cd.mes; mes++) mesesRecientes.push(mes);
    const recienteActual = mesesRecientes.reduce((s, m) => s + ventasDe(cd.anio, m), 0);
    const recienteAnterior = mesesRecientes.reduce((s, m) => s + ventasDe(cd.anioAnterior, m), 0);
    const factorReciente = recienteAnterior ? recienteActual / recienteAnterior : factorAnio;

    const escenario = (factor) => {
      const porMes = {};
      let cierre = 0;
      for (let mes = 1; mes <= 12; mes++) {
        const real = ventasDe(cd.anio, mes);
        const estimado = Math.round(ventasDe(cd.anioAnterior, mes) * factor);
        let valor;
        if (mes < cd.mes) valor = real;
        else if (mes === cd.mes) valor = Math.max(real, estimado);
        else valor = estimado;
        if (mes >= cd.mes) porMes[mes] = valor;
        cierre += valor;
      }
      // Punto de arranque de la linea punteada: el ultimo mes cerrado (real).
      if (cd.mes > 1) porMes[cd.mes - 1] = ventasDe(cd.anio, cd.mes - 1);
      return { factor, porMes, cierre };
    };

    const totalAnterior = (data.ventasPorAnioMes || [])
      .filter((v) => v.anio === cd.anioAnterior)
      .reduce((s, v) => s + v.n, 0);
    return {
      anio: cd.anio,
      anioAnterior: cd.anioAnterior,
      corte: cd.proyeccion.corte,
      mesesRecientes,
      totalAnterior,
      principal: escenario(factorReciente),
      referencia: escenario(factorAnio),
    };
  }, [data]);

  const interanualData = useMemo(() => {
    return MESES_LABEL.map((label, i) => {
      const mes = i + 1;
      const row = { mes: label };
      for (const anio of anios) {
        const found = (data?.ventasPorAnioMes || []).find((v) => v.anio === anio && v.mes === mes);
        row[anio] = found ? found.n : null;
      }
      row.proyeccion = proyeccion?.principal.porMes[mes] ?? null;
      return row;
    });
  }, [data, anios, proyeccion]);

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

  const alDia = data?.comparativaAlDia || null;
  // Mas de 2 dias entre la ultima venta y hoy = la base no esta al dia (normal en la copia local).
  const datosDesactualizados =
    alDia?.ultimaVenta && (new Date(alDia.hoy) - new Date(alDia.ultimaVenta.slice(0, 10))) / 86400000 > 2;

  // Meses del anio en curso con ventas, para los botones del filtro.
  const mesesVendedores = useMemo(
    () => [...new Set((data?.porVendedorMes || []).map((r) => r.mes))].sort((a, b) => a - b),
    [data]
  );
  const porVendedorList = useMemo(() => {
    if (mesVendedores === null) return data?.porVendedor || [];
    return (data?.porVendedorMes || []).filter((r) => r.mes === mesVendedores).sort((a, b) => b.n - a.n);
  }, [data, mesVendedores]);
  // Ventas del mes anterior por vendedor|agencia, para comparar al filtrar por
  // mes. En enero no hay mes anterior dentro del anio en curso: sin comparacion.
  const mesAnteriorVendedores = mesVendedores !== null && mesVendedores > 1 ? mesVendedores - 1 : null;
  const ventasMesAnterior = useMemo(() => {
    const map = new Map();
    if (mesAnteriorVendedores === null) return map;
    for (const r of data?.porVendedorMes || []) {
      if (r.mes === mesAnteriorVendedores) map.set(`${r.vendedor}|${r.agencia}`, r.n);
    }
    return map;
  }, [data, mesAnteriorVendedores]);
  const anteriorDe = (v) =>
    mesAnteriorVendedores === null ? null : ventasMesAnterior.get(`${v.vendedor}|${v.agencia}`) || 0;

  const top3Vendedores =useMemo(() => porVendedorList.slice(0, 3), [porVendedorList]);
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
  // Opciones de los filtros de "En vivo", sacadas de los propios datos.
  const agenciasEnVivo = useMemo(
    () => [...new Set(rentabilidadEnVivo.map((r) => r.sucursal).filter(Boolean))].sort(),
    [rentabilidadEnVivo]
  );
  const mesesEnVivo = useMemo(
    () =>
      [...new Set(rentabilidadEnVivo.map((r) => (r.fechaAlta ? r.fechaAlta.slice(0, 7) : null)).filter(Boolean))]
        .sort()
        .reverse(),
    [rentabilidadEnVivo]
  );
  const enVivoFiltrado = useMemo(
    () =>
      rentabilidadEnVivo.filter(
        (r) =>
          (!filtroAgencia || r.sucursal === filtroAgencia) &&
          (!filtroMes || (r.fechaAlta && r.fechaAlta.startsWith(filtroMes)))
      ),
    [rentabilidadEnVivo, filtroAgencia, filtroMes]
  );
  // Mas recientes primero por fecha de venta (el API las trae por fecha de recepcion del webhook).
  const ventasOrdenadas = useMemo(
    () => [...enVivoFiltrado].sort((a, b) => String(b.fechaAlta || "").localeCompare(String(a.fechaAlta || ""))),
    [enVivoFiltrado]
  );
  const ultimasVentas = ventasOrdenadas.slice(0, ventasVisibles);
  const enVivoKpis = useMemo(() => {
    if (enVivoFiltrado.length === 0) return null;
    const n = enVivoFiltrado.length;
    // Promedio ignorando vacios, igual que el AVG() del historico. (Descuento
    // vendedor/gerente y comision llegan siempre vacios desde Pilot: no se usan.)
    const avg = (key) => {
      const vals = enVivoFiltrado.map((r) => r[key]).filter((v) => v !== null && v !== undefined);
      return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
    };
    const financiadas = enVivoFiltrado.filter((r) => (r.montoFinanciado || 0) > 0).length;
    return {
      n,
      descuentoProm: avg("pctDescuento"),
      ticketPromedio: avg("totalTransaccion"),
      pctFinanciadas: (financiadas / n) * 100,
    };
  }, [enVivoFiltrado]);

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {crecimientoYTD && (
                    <TarjetaCrecimiento
                      titulo={`Crecimiento YTD ${crecimientoYTD.anioActual} vs ${crecimientoYTD.anioAnterior}`}
                      detalle={`Por meses completos, ene–${MESES_LABEL[new Date().getMonth()].toLowerCase()}`}
                      actual={crecimientoYTD.actual}
                      anterior={crecimientoYTD.anterior}
                    />
                  )}
                  {alDia && (
                    <TarjetaCrecimiento
                      titulo={`Crecimiento al día ${alDia.anio} vs ${alDia.anioAnterior}`}
                      detalle={`1 ene – ${alDia.dia} ${MESES_LABEL[alDia.mes - 1].toLowerCase()} de cada año`}
                      actual={alDia.ytd.actual}
                      anterior={alDia.ytd.anterior}
                    />
                  )}
                  {alDia && (
                    <TarjetaCrecimiento
                      titulo={`${MESES_NOMBRE[alDia.mes - 1]} ${alDia.anio} vs ${MESES_NOMBRE[alDia.mes - 1].toLowerCase()} ${alDia.anioAnterior}`}
                      detalle={`Del 1 al ${alDia.dia} de ${MESES_NOMBRE[alDia.mes - 1].toLowerCase()} · ${
                        MESES_NOMBRE[alDia.mes - 1].toLowerCase()
                      } ${alDia.anioAnterior} completo: ${alDia.mesEnCurso.anteriorCompleto} u.`}
                      actual={alDia.mesEnCurso.actual}
                      anterior={alDia.mesEnCurso.anterior}
                    />
                  )}
                </div>
                {alDia && datosDesactualizados && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mb-4">
                    La última venta registrada en la base es del {alDia.ultimaVenta.slice(0, 10)}: las
                    comparativas al día cuentan hasta hoy ({alDia.hoy}), así que los días sin datos bajan
                    el año actual.
                  </p>
                )}
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <h3 className="font-semibold text-gray-800 mb-1">Ventas cerradas por mes, comparado año a año</h3>
                  <p className="text-xs text-gray-400 mb-2">
                    Fuente: carga histórica real de Pilot (2023 en adelante) + webhook en vivo de
                    Pilot en estado &quot;Registrado&quot; (desde el 20 de agosto {new Date().getFullYear()}).
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <button
                      onClick={() => setAnioSolo(null)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                        anioSolo === null ? "bg-gray-800 text-white border-gray-800" : "text-gray-600 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      Todos
                    </button>
                    {anios.map((anio) => {
                      const activo = anioSolo === anio;
                      const color = COLORES_ANIO[anio] || "#999";
                      return (
                        <button
                          key={anio}
                          onClick={() => setAnioSolo(activo ? null : anio)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
                            activo ? "text-white" : "text-gray-600 border-gray-300 hover:bg-gray-50"
                          }`}
                          style={activo ? { backgroundColor: color, borderColor: color } : undefined}
                        >
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activo ? "#fff" : color }} />
                          {anio}
                          {activo && (
                            <span className="tabular-nums opacity-90">
                              · {(data?.ventasPorAnioMes || []).filter((v) => v.anio === anio).reduce((s, v) => s + v.n, 0)} u.
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {proyeccion && (anioSolo === null || anioSolo === proyeccion.anio) && (
                    <div className="mb-3 space-y-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                        <span className="text-gray-700">
                          Cierre proyectado {proyeccion.anio}:{" "}
                          <strong className="tabular-nums">~{proyeccion.principal.cierre.toLocaleString("es-EC")} u.</strong>
                        </span>
                        <VariacionVsAnterior cierre={proyeccion.principal.cierre} anterior={proyeccion.totalAnterior} anio={proyeccion.anioAnterior} />
                      </div>
                      <div className="text-sm text-gray-500">
                        Si se recupera el ritmo de inicio de año:{" "}
                        <span className="tabular-nums font-medium text-gray-700">
                          ~{proyeccion.referencia.cierre.toLocaleString("es-EC")} u.
                        </span>{" "}
                        <VariacionVsAnterior cierre={proyeccion.referencia.cierre} anterior={proyeccion.totalAnterior} anio={proyeccion.anioAnterior} small />
                      </div>
                      <p className="text-xs text-gray-400">
                        Cada mes que falta = mismo mes de {proyeccion.anioAnterior} × ritmo actual (
                        {proyeccion.mesesRecientes.length > 0
                          ? `${proyeccion.mesesRecientes.map((m) => MESES_LABEL[m - 1].toLowerCase()).join("–")} ${proyeccion.anio} vs ${proyeccion.anioAnterior}`
                          : `1-ene al ${proyeccion.corte.slice(8, 10)}/${proyeccion.corte.slice(5, 7)}`}
                        : {ritmoTexto(proyeccion.principal.factor)}). Inicio de año = 1-ene al{" "}
                        {proyeccion.corte.slice(8, 10)}/{proyeccion.corte.slice(5, 7)}: {ritmoTexto(proyeccion.referencia.factor)}.
                      </p>
                    </div>
                  )}
                  <ResponsiveContainer width="100%" height={340}>
                    <LineChart data={interanualData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend
                        wrapperStyle={{ fontSize: 12, cursor: "pointer" }}
                        onClick={(e) => {
                          const anio = e.dataKey === "proyeccion" ? proyeccion?.anio : Number(e.dataKey);
                          setAnioSolo((prev) => (prev === anio ? null : anio));
                        }}
                      />
                      {anios.map((anio) => (
                        <Line
                          key={anio}
                          type="monotone"
                          dataKey={anio}
                          name={String(anio)}
                          stroke={COLORES_ANIO[anio] || "#999"}
                          strokeWidth={anioSolo === anio || anio === anios[anios.length - 1] ? 3 : 2}
                          dot={{ r: 3 }}
                          hide={anioSolo !== null && anioSolo !== anio}
                          connectNulls
                        />
                      ))}
                      {proyeccion && (
                        <Line
                          type="monotone"
                          dataKey="proyeccion"
                          name={`${proyeccion.anio} proyectado`}
                          stroke={COLORES_ANIO[proyeccion.anio] || "#999"}
                          strokeWidth={2}
                          strokeDasharray="6 4"
                          dot={{ r: 3, fill: "#fff" }}
                          hide={anioSolo !== null && anioSolo !== proyeccion.anio}
                          connectNulls
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {tab === "vendedores" && (
              <motion.div key="vendedores" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {[null, ...mesesVendedores].map((mes) => {
                    const activo = mesVendedores === mes;
                    return (
                      <button
                        key={mes ?? "anio"}
                        onClick={() => setMesVendedores(activo && mes !== null ? null : mes)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                          activo ? "bg-main text-white border-main" : "text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {mes === null ? `Año ${data?.anioActual}` : MESES_LABEL[mes - 1]}
                      </button>
                    );
                  })}
                </div>
                {top3Vendedores.length === 0 && (
                  <p className="text-sm text-gray-500">No hay ventas registradas en este período.</p>
                )}
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
                          {anteriorDe(v) !== null && (
                            <div className="text-xs mt-1 flex items-center gap-1.5">
                              <Delta actual={v.n} anterior={anteriorDe(v)} />
                              <span className="text-gray-500">
                                vs {MESES_LABEL[mesAnteriorVendedores - 1].toLowerCase()} ({anteriorDe(v)} u.)
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  Ranking por sucursal (
                  {mesVendedores === null
                    ? data?.anioActual
                    : `${MESES_NOMBRE[mesVendedores - 1].toLowerCase()} ${data?.anioActual}`}
                  )
                  {mesAnteriorVendedores !== null && (
                    <span className="font-normal text-gray-400">
                      {" "}· ▲▼ = unidades más o menos que en {MESES_NOMBRE[mesAnteriorVendedores - 1].toLowerCase()}
                    </span>
                  )}
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
                              {anteriorDe(v) !== null && (
                                <span
                                  className="w-10 text-right shrink-0"
                                  title={`${MESES_NOMBRE[mesAnteriorVendedores - 1]}: ${anteriorDe(v)} u.`}
                                >
                                  <Delta actual={v.n} anterior={anteriorDe(v)} />
                                </span>
                              )}
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
                      El descuento autorizado por vendedor/gerente y la comisión no vienen poblados
                      desde Pilot (ni en la carga histórica ni en el webhook en vivo), por eso no se muestran.
                    </p>
                  </>
                )}

                <h3 className="text-sm font-semibold text-gray-500 mb-2">En vivo (webhook de Pilot)</h3>
                {rentabilidadEnVivo.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                    <BanknotesIcon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Todavía no hay eventos reales del webhook de Ventas (esperando que la primera
                      venta pase a estado <b>&quot;Registrado&quot;</b> en Pilot desde que se activó la
                      regla). En cuanto lleguen, aquí se ve el detalle de cada venta.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        Agencia
                        <select
                          value={filtroAgencia}
                          onChange={(e) => setFiltroAgencia(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
                        >
                          <option value="">Todas</option>
                          {agenciasEnVivo.map((a) => (
                            <option key={a} value={a}>
                              {a.replace(/^Autocor\s+/i, "")}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600">
                        Mes
                        <select
                          value={filtroMes}
                          onChange={(e) => setFiltroMes(e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
                        >
                          <option value="">Todos</option>
                          {mesesEnVivo.map((m) => (
                            <option key={m} value={m}>
                              {MESES_NOMBRE[Number(m.slice(5, 7)) - 1]} {m.slice(0, 4)}
                            </option>
                          ))}
                        </select>
                      </label>
                      <span className="text-sm text-gray-500 tabular-nums">
                        {enVivoFiltrado.length} {enVivoFiltrado.length === 1 ? "venta" : "ventas"}
                      </span>
                      {(filtroAgencia || filtroMes) && (
                        <button
                          onClick={() => {
                            setFiltroAgencia("");
                            setFiltroMes("");
                          }}
                          className="text-xs text-main hover:underline"
                        >
                          Quitar filtros
                        </button>
                      )}
                    </div>
                    {!enVivoKpis ? (
                      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-sm text-gray-500">
                        No hay ventas registradas para este filtro.
                      </div>
                    ) : (
                  <>
                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-4">
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{enVivoKpis.n}</div>
                        <div className="text-xs text-gray-500">Ventas registradas</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">
                          {enVivoKpis.descuentoProm !== null ? enVivoKpis.descuentoProm.toFixed(2) + "%" : "—"}
                        </div>
                        <div className="text-xs text-gray-500">Descuento promedio</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{enVivoKpis.pctFinanciadas.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">Ventas financiadas</div>
                      </div>
                      <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="text-2xl font-bold text-gray-800">{currency(enVivoKpis.ticketPromedio)}</div>
                        <div className="text-xs text-gray-500">Ticket promedio</div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-5 overflow-x-auto">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        Últimas ventas registradas
                        {(filtroAgencia || filtroMes) && (
                          <span className="font-normal text-gray-400 text-sm">
                            {" "}(
                            {[
                              filtroAgencia && filtroAgencia.replace(/^Autocor\s+/i, ""),
                              filtroMes &&
                                `${MESES_NOMBRE[Number(filtroMes.slice(5, 7)) - 1].toLowerCase()} ${filtroMes.slice(0, 4)}`,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                            )
                          </span>
                        )}
                      </h3>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-400 text-xs uppercase border-b">
                            <th className="py-2 pr-3">Fecha</th>
                            <th className="py-2 pr-3">Vehículo</th>
                            <th className="py-2 pr-3">Vendedor</th>
                            <th className="py-2 pr-3">Canal</th>
                            <th className="py-2 pr-3 text-right">Precio lista</th>
                            <th className="py-2 pr-3 text-right">Total</th>
                            <th className="py-2 pr-3 text-right">Desc.</th>
                            <th className="py-2 pr-3">Pago</th>
                            <th className="py-2 pr-3">Retoma</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ultimasVentas.map((r) => (
                            <tr key={r.ventaId} className="border-b last:border-0 align-top">
                              <td className="py-2 pr-3 whitespace-nowrap text-gray-600 tabular-nums">
                                {fechaCorta(r.fechaAlta)}
                                <div className="text-[11px] text-gray-400">#{r.ventaId}</div>
                              </td>
                              <td className="py-2 pr-3 min-w-[160px]">
                                <div className="font-medium text-gray-800">
                                  {[r.marca, r.modelo].filter(Boolean).join(" ") || "—"}
                                </div>
                                <div className="text-[11px] text-gray-400">
                                  {[r.version, r.color && capitalizar(r.color)].filter(Boolean).join(" · ")}
                                </div>
                              </td>
                              <td className="py-2 pr-3 min-w-[130px]">
                                <div className="text-gray-700">{r.vendedorNombre?.trim() || "—"}</div>
                                <div className="text-[11px] text-gray-400">{r.sucursal?.trim() || ""}</div>
                              </td>
                              <td className="py-2 pr-3 text-xs text-gray-600">{r.origen ? capitalizar(r.origen) : "—"}</td>
                              <td className="py-2 pr-3 text-right tabular-nums text-gray-500">{currency(r.precioLista)}</td>
                              <td className="py-2 pr-3 text-right tabular-nums font-medium">{currency(r.totalTransaccion)}</td>
                              <td className="py-2 pr-3 text-right tabular-nums">
                                {r.pctDescuento !== null && r.pctDescuento !== undefined
                                  ? r.pctDescuento.toFixed(1).replace(".", ",") + " %"
                                  : "—"}
                              </td>
                              <td className="py-2 pr-3 text-xs">
                                {(r.montoFinanciado || 0) > 0 ? (
                                  <>
                                    <div className="text-gray-700">{r.banco?.trim() || "Financiado"}</div>
                                    <div className="text-[11px] text-gray-400 tabular-nums">
                                      {currency(r.montoFinanciado)}
                                      {r.cuotasFinanciadas ? ` · ${r.cuotasFinanciadas} cuotas` : ""}
                                    </div>
                                  </>
                                ) : (
                                  <span className="text-gray-500">Contado</span>
                                )}
                              </td>
                              <td className="py-2 pr-3 text-xs">
                                {(r.montoRetomaUsado || 0) > 0 ? (
                                  <>
                                    <div className="text-gray-700">
                                      {[r.usadoMarca, r.usadoModelo].filter(Boolean).join(" ") || "Usado"}
                                    </div>
                                    <div className="text-[11px] text-gray-400 tabular-nums">{currency(r.montoRetomaUsado)}</div>
                                  </>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {ventasOrdenadas.length > ultimasVentas.length && (
                        <div className="text-center mt-3">
                          <button
                            onClick={() => setVentasVisibles((v) => v + 30)}
                            className="text-sm text-main font-medium hover:underline"
                          >
                            Ver más ({ventasOrdenadas.length - ultimasVentas.length} restantes)
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                    )}
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
