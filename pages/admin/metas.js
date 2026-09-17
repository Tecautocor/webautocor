import { useEffect, useState } from "react";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MESES_LABEL = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const HOY = new Date();
const ANIO_ACTUAL = HOY.getFullYear();
const MES_ACTUAL = HOY.getMonth() + 1;

// Coloreamos meses ya transcurridos, incluido el mes en curso (con lo
// vendido hasta hoy) - los meses futuros quedan neutros, todavia no hay nada
// que evaluar.
function mesEvaluable(anio, mes) {
  return anio < ANIO_ACTUAL || (anio === ANIO_ACTUAL && mes <= MES_ACTUAL);
}

function claseCumplimiento(anio, mes, metaUnidades, real) {
  if (!mesEvaluable(anio, mes) || !metaUnidades) return "border-gray-200";
  const ratio = real / metaUnidades;
  if (ratio >= 1) return "bg-green-50 border-green-200";
  if (ratio >= 0.8) return "bg-yellow-50 border-yellow-200";
  return "bg-red-50 border-red-200";
}

export default function AdminMetas({ userEmail }) {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  function load(y) {
    setLoading(true);
    fetch(`/api/admin/metas?anio=${y}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }

  useEffect(() => {
    load(anio);
  }, [anio]);

  async function guardarCelda(agencia, mes, valor) {
    const key = `${agencia}|${mes}`;
    setSavingKey(key);
    await fetch("/api/admin/metas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anio, mes, agencia, metaUnidades: valor }),
    });
    setSavingKey(null);
  }

  function actualizarLocal(agencia, mes, valor) {
    setData((prev) => ({
      ...prev,
      grid: prev.grid.map((row) =>
        row.agencia !== agencia
          ? row
          : {
              ...row,
              meses: row.meses.map((m) => (m.mes !== mes ? m : { ...m, metaUnidades: valor })),
            }
      ),
    }));
  }

  const totalAnual =
    data?.grid?.reduce(
      (sum, row) => sum + row.meses.reduce((s, m) => s + (m.metaUnidades || 0), 0),
      0
    ) || 0;

  // Meta y venta real de toda la empresa por mes - suma automática de las
  // agencias, no se guarda aparte en la base (se deriva siempre en vivo).
  const totalesPorMes = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1;
    return (data?.grid || []).reduce(
      (acc, row) => {
        const celda = row.meses.find((m) => m.mes === mes);
        return {
          mes,
          metaUnidades: acc.metaUnidades + (celda?.metaUnidades || 0),
          real: acc.real + (celda?.real || 0),
        };
      },
      { mes, metaUnidades: 0, real: 0 }
    );
  });
  const totalGeneralAnual = totalesPorMes.reduce((s, m) => s + m.metaUnidades, 0);

  return (
    <AdminLayout userEmail={userEmail} title="Metas de Ventas por Agencia" backHref="/admin/bi" wide>
      <p className="text-sm text-gray-500 mb-4">
        Objetivo mensual de unidades a vender por agencia. No sale de Pilot ni de ningún otro
        sistema - se define aquí manualmente y alimenta el dashboard de Performance por Agencia.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-600">Año:</label>
        <select
          value={anio}
          onChange={(e) => setAnio(parseInt(e.target.value, 10))}
          className="border rounded pl-2 pr-7 py-1 text-sm"
        >
          {[anio - 1, anio, anio + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500 ml-4">
          Total anual: <b className="text-gray-800">{totalAnual.toLocaleString("es-EC")}</b> unidades
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-50 border border-green-200" /> meta cumplida
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-yellow-50 border border-yellow-200" /> cerca (80-99%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-50 border border-red-200" /> no cumplida
        </span>
        <span>— meses transcurridos, incluido el actual (con lo vendido hasta hoy)</span>
      </div>

      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        {loading && <p className="text-gray-500 text-sm">Cargando...</p>}
        {!loading && data && (
          <table className="text-sm w-full">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase border-b">
                <th className="py-2 pr-3 sticky left-0 bg-white">Agencia</th>
                {MESES_LABEL.map((m) => (
                  <th key={m} className="py-2 px-1 text-center">
                    {m}
                  </th>
                ))}
                <th className="py-2 pl-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.grid.map((row) => {
                const totalFila = row.meses.reduce((s, m) => s + (m.metaUnidades || 0), 0);
                return (
                  <tr key={row.agencia} className="border-b last:border-0">
                    <td className="py-1.5 pr-3 font-medium text-gray-700 whitespace-nowrap sticky left-0 bg-white">
                      {row.agencia}
                    </td>
                    {row.meses.map((m) => {
                      const key = `${row.agencia}|${m.mes}`;
                      return (
                        <td key={m.mes} className="py-1 px-1 text-center">
                          <input
                            type="number"
                            min="0"
                            value={m.metaUnidades ?? ""}
                            onChange={(e) => actualizarLocal(row.agencia, m.mes, e.target.value === "" ? null : parseInt(e.target.value, 10))}
                            onBlur={(e) => {
                              if (e.target.value !== "") guardarCelda(row.agencia, m.mes, e.target.value);
                            }}
                            className={`w-20 text-center border rounded py-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                              savingKey === key
                                ? "bg-blue-50 border-blue-300"
                                : claseCumplimiento(anio, m.mes, m.metaUnidades, m.real)
                            }`}
                          />
                        </td>
                      );
                    })}
                    <td className="py-1 pl-3 text-right font-semibold text-gray-700">{totalFila}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-4 border-gray-700 bg-gray-800">
                <td className="py-3 pr-3 font-bold text-white uppercase text-sm tracking-wide sticky left-0 bg-gray-800">
                  Total Empresa
                </td>
                {totalesPorMes.map((m) => (
                  <td key={m.mes} className="py-2 px-1 text-center">
                    <div
                      className={`w-20 mx-auto rounded py-1.5 text-base font-bold text-gray-800 border-2 ${claseCumplimiento(
                        anio,
                        m.mes,
                        m.metaUnidades,
                        m.real
                      )}`}
                    >
                      {m.metaUnidades || "—"}
                    </div>
                  </td>
                ))}
                <td className="py-2 pl-3 text-right font-bold text-white text-lg">
                  {totalGeneralAnual}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
