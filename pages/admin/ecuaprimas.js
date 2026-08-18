import { useEffect, useState } from "react";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MOTIVO_LABELS = {
  marca_no_encontrada: "Marca no encontrada en el catálogo",
  modelo_no_encontrado: "Modelo/versión no encontrado (o cobertura insuficiente)",
  sin_motivo: "Sin motivo registrado",
};

function formatDateTime(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({ label, value, tone }) {
  const toneClass =
    tone === "green"
      ? "text-green-700 bg-green-50"
      : tone === "red"
      ? "text-red-700 bg-red-50"
      : "text-gray-700 bg-gray-50";

  return (
    <div className={`rounded-lg p-5 ${toneClass}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
}

export default function AdminEcuaprimas({ userEmail }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/ecuaprimas");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const entries = data?.entitydata || [];
  const stats = data?.stats || { total: 0, matched: 0, failed: 0, byMotivo: {} };

  return (
    <AdminLayout userEmail={userEmail} title="Cotizador Seguros — Ecuaprimas">
      <p className="text-sm text-gray-500 mb-6">
        Cada vez que una venta llega a &quot;APROBADA JEFATURA&quot; en Pilot, el sistema intenta
        identificar el vehículo contra el catálogo de Ecuaprimas. Todavía no se dispara la
        cotización real — esto solo muestra si el matching funcionó o no, para decidir cuándo
        activar el siguiente paso.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <StatCard label="Ventas procesadas" value={stats.total} />
        <StatCard label="Match exitoso" value={stats.matched} tone="green" />
        <StatCard label="Sin match" value={stats.failed} tone="red" />
      </div>

      {stats.failed > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">Motivos de fallo</h2>
          <div className="space-y-1 text-sm">
            {Object.entries(stats.byMotivo).map(([motivo, count]) => (
              <div key={motivo} className="flex justify-between">
                <span className="text-gray-600">{MOTIVO_LABELS[motivo] || motivo}</span>
                <span className="font-semibold text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Últimas ventas procesadas</h2>
        {data?.limited && (
          <p className="text-xs text-gray-400 mb-4">
            Mostrando las 300 más recientes.
          </p>
        )}
        {loading && <p className="text-gray-500 text-sm mt-4">Cargando...</p>}
        {!loading && entries.length === 0 && (
          <p className="text-gray-500 text-sm mt-4">
            Todavía no se ha procesado ninguna venta con este flujo.
          </p>
        )}
        <div className="space-y-3 mt-4">
          {entries.map((e) => (
            <div key={e.id} className="border rounded-md p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-gray-700 font-medium">
                    Venta {e.ventaId} — {e.marca} {e.modelo} {e.version}
                    {e.color && <span className="text-gray-400"> · {e.color}</span>}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{formatDateTime(e.createdAt)}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {e.matchOk ? (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded whitespace-nowrap">
                      Match
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded whitespace-nowrap">
                      Sin match
                    </span>
                  )}
                  {e.matchOk && e.cotizacionEnviada && (
                    <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded whitespace-nowrap">
                      Cotización enviada
                    </span>
                  )}
                  {e.matchOk && !e.cotizacionEnviada && e.errorCotizacion && (
                    <span className="text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded whitespace-nowrap">
                      Cotización falló
                    </span>
                  )}
                </div>
              </div>
              {e.matchOk ? (
                <div className="text-xs text-gray-500 mt-2">
                  Catálogo: {e.modeloNombreCatalogo} — cobertura{" "}
                  {e.modeloCobertura != null ? `${Math.round(e.modeloCobertura * 100)}%` : "—"} —
                  códigos marca/modelo/color: {e.marcaCodigo}/{e.modeloCodigo}/
                  {e.colorCodigo || "sin color"}
                  {e.cotizacionEnviada && (
                    <div className="text-blue-600 mt-1">
                      Certificado {e.numeroCertificado} — enviado a {e.enviadoA}
                    </div>
                  )}
                  {!e.cotizacionEnviada && e.errorCotizacion && (
                    <div className="text-orange-600 mt-1">
                      No se generó la cotización: {e.errorCotizacion}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-red-600 mt-2">
                  {MOTIVO_LABELS[e.motivo] || e.motivo}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
