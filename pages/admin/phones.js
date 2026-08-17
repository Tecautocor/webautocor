import { useEffect, useState } from "react";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

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

const CATEGORY_LABELS = {
  whatsapp: "WhatsApp",
  agencia: "Agencias",
};

export default function AdminPhones({ userEmail }) {
  const [phones, setPhones] = useState(null);
  const [loading, setLoading] = useState(true);
  const [log, setLog] = useState(null);
  const [loadingLog, setLoadingLog] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  async function loadPhones() {
    setLoading(true);
    const res = await fetch("/api/admin/phones");
    const data = await res.json();
    setPhones(data.entitydata || []);
    setLoading(false);
  }

  async function loadLog() {
    setLoadingLog(true);
    const res = await fetch("/api/admin/phones/log");
    const data = await res.json();
    setLog(data.entitydata || []);
    setLoadingLog(false);
  }

  useEffect(() => {
    loadPhones();
    loadLog();
  }, []);

  function startEdit(phone) {
    setEditingId(phone.id);
    setEditValue(phone.phone);
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
  }

  async function handleSaveEdit(id) {
    if (!editValue.trim()) {
      setEditError("El número no puede estar vacío.");
      return;
    }

    setSavingEdit(true);
    const res = await fetch(`/api/admin/phones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: editValue.trim() }),
    });
    setSavingEdit(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setEditError(data.message || "Error al actualizar el número");
      return;
    }

    setEditingId(null);
    loadPhones();
    loadLog();
  }

  const grouped = (phones || []).reduce((acc, p) => {
    acc[p.category] = acc[p.category] || [];
    acc[p.category].push(p);
    return acc;
  }, {});

  return (
    <AdminLayout userEmail={userEmail} title="Números telefónicos">
      <p className="text-sm text-gray-500 mb-6">
        Estos números alimentan directamente el sitio (botón flotante de WhatsApp, cotizador,
        botón &quot;Agendar&quot; en la ficha de vehículo, y el teléfono de cada agencia en{" "}
        &quot;Contáctanos&quot;). Cada cambio queda registrado abajo en el historial — quién lo
        hizo y cuándo — y ese historial no se puede eliminar desde el panel.
      </p>

      {loading && <p className="text-gray-500 text-sm">Cargando...</p>}

      {Object.keys(grouped).map((category) => (
        <div key={category} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            {CATEGORY_LABELS[category] || category}
          </h2>
          <div className="space-y-3">
            {grouped[category].map((p) => (
              <div key={p.id} className="border rounded-md p-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 font-medium truncate">{p.label}</div>
                    {editingId !== p.id && (
                      <div className="text-sm text-gray-500 mt-0.5">{p.phone}</div>
                    )}
                    {p.updatedBy && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        Última modificación: {p.updatedBy} — {formatDateTime(p.updatedAt)}
                      </div>
                    )}
                  </div>
                  {editingId !== p.id && (
                    <button
                      onClick={() => startEdit(p)}
                      className="text-sm text-gray-400 hover:text-main whitespace-nowrap"
                    >
                      Editar
                    </button>
                  )}
                </div>

                {editingId === p.id && (
                  <div className="mt-3 pt-3 border-t">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                      autoFocus
                    />
                    {editError && <p className="text-main text-sm mt-2">{editError}</p>}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleSaveEdit(p.id)}
                        disabled={savingEdit}
                        className="bg-main text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
                      >
                        {savingEdit ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Historial de cambios</h2>
        <p className="text-xs text-gray-400 mb-4">
          Registro permanente — no se puede editar ni eliminar desde el panel.
        </p>
        {loadingLog && <p className="text-gray-500 text-sm">Cargando...</p>}
        {!loadingLog && log?.length === 0 && (
          <p className="text-gray-500 text-sm">Todavía no hay cambios registrados.</p>
        )}
        <div className="space-y-2">
          {log?.map((entry) => (
            <div key={entry.id} className="text-sm border-b last:border-b-0 pb-2">
              <span className="font-medium text-gray-700">{entry.label}</span>{" "}
              <span className="text-gray-400">
                {entry.oldValue} → {entry.newValue}
              </span>
              <div className="text-xs text-gray-400">
                {entry.changedBy} — {formatDateTime(entry.changedAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
