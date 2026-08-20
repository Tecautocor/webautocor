import { useEffect, useState } from "react";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MESES_LABEL = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

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

  return (
    <AdminLayout userEmail={userEmail} title="Metas de Ventas por Agencia">
      <p className="text-sm text-gray-500 mb-4">
        Objetivo mensual de unidades a vender por agencia. No sale de Pilot ni de ningún otro
        sistema - se define aquí manualmente y alimenta el dashboard de Performance por Agencia.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-600">Año:</label>
        <select
          value={anio}
          onChange={(e) => setAnio(parseInt(e.target.value, 10))}
          className="border rounded px-2 py-1 text-sm"
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
                            className={`w-14 text-center border rounded py-0.5 text-sm ${
                              savingKey === key ? "bg-yellow-50 border-yellow-300" : "border-gray-200"
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
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
