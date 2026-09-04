import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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

function emptyForm() {
  return {
    name: "",
    address: "",
    time: "",
    latitude: "",
    longitude: "",
    phone: "",
  };
}

export default function AdminAgencies({ userEmail }) {
  const [agencies, setAgencies] = useState(null);
  const [phones, setPhones] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm());
  const [createFile, setCreateFile] = useState(null);
  const [createFileKey, setCreateFileKey] = useState(0);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm());
  const [editFile, setEditFile] = useState(null);
  const [editFileKey, setEditFileKey] = useState(0);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const [savingPhoneId, setSavingPhoneId] = useState(null);

  async function loadAll() {
    setLoading(true);
    const [agRes, phRes] = await Promise.all([
      fetch("/api/admin/agencies"),
      fetch("/api/admin/phones"),
    ]);
    const agData = await agRes.json();
    const phData = await phRes.json();
    setAgencies(agData.entitydata || []);
    setPhones(phData.entitydata || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const phoneByKey = useMemo(
    () => Object.fromEntries((phones || []).map((p) => [p.key, p])),
    [phones]
  );

  async function handleCreate(e) {
    e.preventDefault();
    setCreateError("");

    const { name, address, time, latitude, longitude, phone } = createForm;
    if (!createFile) return setCreateError("Falta la foto de la agencia.");
    if (!name.trim()) return setCreateError("Falta el nombre.");
    if (!address.trim()) return setCreateError("Falta la dirección.");
    if (!time.trim()) return setCreateError("Falta el horario.");
    if (!phone.trim()) return setCreateError("Falta el teléfono.");
    if (latitude === "" || longitude === "")
      return setCreateError("Faltan las coordenadas (latitud/longitud).");

    setCreating(true);
    const formData = new FormData();
    formData.append("image", createFile);
    formData.append("name", name.trim());
    formData.append("address", address.trim());
    formData.append("time", time.trim());
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("phone", phone.trim());

    const res = await fetch("/api/admin/agencies", { method: "POST", body: formData });
    setCreating(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setCreateError(data.message || "Error al crear la agencia");
      return;
    }

    setCreateForm(emptyForm());
    setCreateFile(null);
    setCreateFileKey((k) => k + 1);
    setShowCreate(false);
    loadAll();
  }

  function startEdit(a) {
    setEditingId(a.id);
    setEditForm({
      name: a.name,
      address: a.address,
      time: a.time,
      latitude: String(a.latitude),
      longitude: String(a.longitude),
      phone: "",
    });
    setEditFile(null);
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
  }

  async function handleSaveEdit(id) {
    const { name, address, time, latitude, longitude } = editForm;
    if (!name.trim()) return setEditError("El nombre no puede estar vacío.");
    if (!address.trim()) return setEditError("La dirección no puede estar vacía.");
    if (!time.trim()) return setEditError("El horario no puede estar vacío.");
    if (latitude === "" || longitude === "")
      return setEditError("Faltan las coordenadas (latitud/longitud).");

    setSavingEdit(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("address", address.trim());
    formData.append("time", time.trim());
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (editFile) formData.append("image", editFile);

    const res = await fetch(`/api/admin/agencies/${id}`, { method: "PATCH", body: formData });
    setSavingEdit(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setEditError(data.message || "Error al actualizar la agencia");
      return;
    }

    setEditingId(null);
    setEditFileKey((k) => k + 1);
    loadAll();
  }

  async function handleDelete(a) {
    if (
      !confirm(
        `Esta acción no se puede deshacer. ¿Eliminar "${a.name}"? Deja de mostrarse en Contáctanos y se borra también su teléfono.`
      )
    )
      return;
    await fetch(`/api/admin/agencies/${a.id}`, { method: "DELETE" });
    loadAll();
  }

  async function handleSavePhone(agency, newPhone) {
    const current = phoneByKey[agency.phoneKey];
    if (!current) return;
    if (!newPhone.trim()) return;

    setSavingPhoneId(agency.id);
    await fetch(`/api/admin/phones/${current.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: newPhone.trim() }),
    });
    setSavingPhoneId(null);
    loadAll();
  }

  return (
    <AdminLayout userEmail={userEmail} title="Agencias">
      <p className="text-sm text-gray-500 mb-6">
        Foto, dirección, horario, ubicación en el mapa y teléfono de cada agencia mostrada en{" "}
        &quot;Contáctanos&quot;. Los cambios se ven en el sitio al instante, sin necesidad de
        avisarnos ni esperar un despliegue.
      </p>

      <div className="mb-6">
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="bg-main text-white px-4 py-2 rounded-md text-sm font-semibold"
          >
            + Agregar agencia nueva
          </button>
        ) : (
          <form onSubmit={handleCreate} className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Agencia nueva</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Foto</label>
                <input
                  key={createFileKey}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setCreateFile(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Autocor Norte"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                <input
                  type="text"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Horario</label>
                <input
                  type="text"
                  value={createForm.time}
                  onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })}
                  placeholder="Lunes a Viernes de 08:00 a 18:00, ..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Latitud</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={createForm.latitude}
                  onChange={(e) => setCreateForm({ ...createForm, latitude: e.target.value })}
                  placeholder="-0.2853"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Longitud</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={createForm.longitude}
                  onChange={(e) => setCreateForm({ ...createForm, longitude: e.target.value })}
                  placeholder="-78.5438"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="+593 99 000 0000"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Para las coordenadas: en Google Maps, clic derecho sobre el punto exacto → clic en
              los números que aparecen arriba para copiarlos → pega el primero en Latitud y el
              segundo en Longitud.
            </p>
            {createError && <p className="text-main text-sm mt-3">{createError}</p>}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="submit"
                disabled={creating}
                className="bg-main text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
              >
                {creating ? "Creando..." : "Crear agencia"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setCreateError("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {loading && <p className="text-gray-500 text-sm">Cargando...</p>}

      <div className="space-y-4">
        {(agencies || []).map((a) => {
          const phoneRecord = phoneByKey[a.phoneKey];
          return (
            <div key={a.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-4">
                <div className="relative w-32 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  <Image src={a.src} alt={a.name} fill style={{ objectFit: "cover" }} unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-800">{a.name}</p>
                    {editingId !== a.id && (
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          onClick={() => startEdit(a)}
                          className="text-sm text-gray-400 hover:text-main"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(a)}
                          className="text-sm text-gray-400 hover:text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                  {editingId !== a.id && (
                    <>
                      <p className="text-sm text-gray-500 mt-1">{a.address}</p>
                      <p className="text-sm text-gray-500">{a.time}</p>
                      <p className="text-sm text-gray-500">
                        {a.latitude}, {a.longitude}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          defaultValue={phoneRecord?.phone || ""}
                          onBlur={(e) => {
                            if (e.target.value !== phoneRecord?.phone) {
                              handleSavePhone(a, e.target.value);
                            }
                          }}
                          disabled={savingPhoneId === a.id}
                          className="border rounded px-2 py-1 text-sm w-48"
                        />
                        <span className="text-xs text-gray-400">
                          {savingPhoneId === a.id ? "Guardando..." : "Teléfono (Enter/clic afuera para guardar)"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Última modificación: {a.updatedBy || "—"} — {formatDateTime(a.updatedAt)}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {editingId === a.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Foto nueva (opcional)</label>
                      <input
                        key={editFileKey}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                        className="w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Horario</label>
                      <input
                        type="text"
                        value={editForm.time}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Latitud</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editForm.latitude}
                        onChange={(e) => setEditForm({ ...editForm, latitude: e.target.value })}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Longitud</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editForm.longitude}
                        onChange={(e) => setEditForm({ ...editForm, longitude: e.target.value })}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  {editError && <p className="text-main text-sm mt-3">{editError}</p>}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleSaveEdit(a.id)}
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
          );
        })}
      </div>
    </AdminLayout>
  );
}
