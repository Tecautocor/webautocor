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

export default function AdminSecretos({ userEmail }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [days, setDays] = useState(14);
  const [pin, setPin] = useState("");
  const [creating, setCreating] = useState(false);
  const [newLink, setNewLink] = useState(null);
  const [newPin, setNewPin] = useState(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/secrets");
    const json = await res.json();
    setItems(json.entitydata || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!label.trim() || !value.trim()) return;
    if (pin && !/^\d{4}$/.test(pin)) {
      alert("El código debe ser de 4 dígitos");
      return;
    }
    setCreating(true);
    setNewLink(null);
    setNewPin(null);
    const res = await fetch("/api/admin/secrets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, value, days, pin: pin || undefined }),
    });
    const json = await res.json();
    setCreating(false);
    if (res.ok) {
      setNewLink(`${window.location.origin}/secreto/${json.token}`);
      setNewPin(pin || null);
      setLabel("");
      setValue("");
      setDays(14);
      setPin("");
      load();
    }
  }

  async function handleRevoke(id) {
    if (!confirm("¿Revocar este link? Ya no se podrá abrir.")) return;
    await fetch(`/api/admin/secrets/${id}`, { method: "PATCH" });
    load();
  }

  return (
    <AdminLayout userEmail={userEmail} title="Compartir accesos">
      <div className="max-w-3xl">
        <p className="text-sm text-gray-500 mb-6">
          Genera un link de un solo secreto (API key, contraseña, etc.) para compartir por correo
          sin escribirlo en texto plano. El valor queda cifrado en la base de datos; el link solo
          contiene un token aleatorio y expira en la fecha que elijas (o antes, si lo revocás).
          Opcionalmente podés pedir un código de 4 dígitos para verlo — se bloquea solo después de
          5 intentos fallidos.
        </p>

        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-5 mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder='Ej. "API key catálogo Ecuaprimas"'
              className="w-full border rounded px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secreto a compartir
            </label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm font-mono"
              required
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expira en (días)
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-24 border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de confirmación (opcional)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="Ej. 5454"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="w-32 border rounded px-3 py-2 text-sm text-center tracking-widest"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 -mt-2">
            Si ponés un código de 4 dígitos, quien reciba el link también va a necesitarlo para ver
            el secreto — compartíselo por otro canal (WhatsApp, llamada), nunca por el mismo correo
            del link. No queda guardado en texto plano, así que no se puede recuperar después.
          </p>
          <button
            type="submit"
            disabled={creating}
            className="bg-main text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
          >
            {creating ? "Generando..." : "Generar link"}
          </button>

          {newLink && (
            <div className="bg-green-50 border border-green-200 rounded p-3 text-sm space-y-2">
              <div className="font-medium text-green-800">Link generado:</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all text-xs">{newLink}</code>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(newLink)}
                  className="text-xs bg-white border rounded px-2 py-1 shrink-0"
                >
                  Copiar
                </button>
              </div>
              {newPin && (
                <p className="text-green-800">
                  Código: <strong>{newPin}</strong> — compartilo por otro canal, distinto de donde
                  mandes el link. No se vuelve a mostrar.
                </p>
              )}
            </div>
          )}
        </form>

        <h2 className="font-semibold text-gray-800 mb-3">Links generados</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Cargando...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500">Todavía no se generó ningún link.</p>
        ) : (
          <div className="space-y-2">
            {items.map((s) => {
              const expired = new Date(s.expiresAt) < new Date();
              const inactive = s.revoked || expired;
              return (
                <div
                  key={s.id}
                  className="bg-white rounded-lg shadow p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-medium text-gray-800">{s.label}</div>
                    <div className="text-xs text-gray-500">
                      Creado {formatDateTime(s.createdAt)} por {s.createdBy || "—"} · Expira{" "}
                      {formatDateTime(s.expiresAt)} · Visto {s.viewCount}{" "}
                      {s.viewCount === 1 ? "vez" : "veces"}
                      {s.lastViewedAt ? ` (última ${formatDateTime(s.lastViewedAt)})` : ""}
                      {s.hasPin ? " · con código" : ""}
                      {s.failedAttempts > 0 ? ` · ${s.failedAttempts} intento(s) fallido(s)` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {inactive ? (
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500">
                        {s.revoked ? "Revocado" : "Expirado"}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRevoke(s.id)}
                        className="text-xs px-2 py-1 rounded bg-red-50 text-red-600"
                      >
                        Revocar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
