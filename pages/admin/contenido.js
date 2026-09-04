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

function emptyAgencyForm() {
  return { name: "", address: "", time: "", latitude: "", longitude: "", phone: "" };
}

const CATEGORY_LABELS = {
  whatsapp: "WhatsApp",
};

export default function AdminContenido({ userEmail }) {
  const [agencies, setAgencies] = useState(null);
  const [phones, setPhones] = useState(null);
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Agencias: alta nueva ---
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyAgencyForm());
  const [createFile, setCreateFile] = useState(null);
  const [createFileKey, setCreateFileKey] = useState(0);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // --- Agencias: edición ---
  const [editingAgencyId, setEditingAgencyId] = useState(null);
  const [editAgencyForm, setEditAgencyForm] = useState(emptyAgencyForm());
  const [editAgencyFile, setEditAgencyFile] = useState(null);
  const [editAgencyFileKey, setEditAgencyFileKey] = useState(0);
  const [savingAgencyEdit, setSavingAgencyEdit] = useState(false);
  const [agencyEditError, setAgencyEditError] = useState("");
  const [savingPhoneId, setSavingPhoneId] = useState(null);

  // --- Números generales (WhatsApp, etc.) ---
  const [editingPhoneId, setEditingPhoneId] = useState(null);
  const [editPhoneValue, setEditPhoneValue] = useState("");
  const [savingPhoneEdit, setSavingPhoneEdit] = useState(false);
  const [phoneEditError, setPhoneEditError] = useState("");

  async function loadAll() {
    setLoading(true);
    const [agRes, phRes, logRes] = await Promise.all([
      fetch("/api/admin/agencies"),
      fetch("/api/admin/phones"),
      fetch("/api/admin/phones/log"),
    ]);
    const [agData, phData, logData] = await Promise.all([
      agRes.json(),
      phRes.json(),
      logRes.json(),
    ]);
    setAgencies(agData.entitydata || []);
    setPhones(phData.entitydata || []);
    setLog(logData.entitydata || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const phoneByKey = useMemo(
    () => Object.fromEntries((phones || []).map((p) => [p.key, p])),
    [phones]
  );

  const generalGrouped = useMemo(
    () =>
      (phones || [])
        .filter((p) => p.category !== "agencia")
        .reduce((acc, p) => {
          acc[p.category] = acc[p.category] || [];
          acc[p.category].push(p);
          return acc;
        }, {}),
    [phones]
  );

  // --- Agencias: crear ---
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

    setCreateForm(emptyAgencyForm());
    setCreateFile(null);
    setCreateFileKey((k) => k + 1);
    setShowCreate(false);
    loadAll();
  }

  // --- Agencias: editar ---
  function startEditAgency(a) {
    setEditingAgencyId(a.id);
    setEditAgencyForm({
      name: a.name,
      address: a.address,
      time: a.time,
      latitude: String(a.latitude),
      longitude: String(a.longitude),
      phone: "",
    });
    setEditAgencyFile(null);
    setAgencyEditError("");
  }

  function cancelEditAgency() {
    setEditingAgencyId(null);
    setAgencyEditError("");
  }

  async function handleSaveAgencyEdit(id) {
    const { name, address, time, latitude, longitude } = editAgencyForm;
    if (!name.trim()) return setAgencyEditError("El nombre no puede estar vacío.");
    if (!address.trim()) return setAgencyEditError("La dirección no puede estar vacía.");
    if (!time.trim()) return setAgencyEditError("El horario no puede estar vacío.");
    if (latitude === "" || longitude === "")
      return setAgencyEditError("Faltan las coordenadas (latitud/longitud).");

    setSavingAgencyEdit(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("address", address.trim());
    formData.append("time", time.trim());
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (editAgencyFile) formData.append("image", editAgencyFile);

    const res = await fetch(`/api/admin/agencies/${id}`, { method: "PATCH", body: formData });
    setSavingAgencyEdit(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setAgencyEditError(data.message || "Error al actualizar la agencia");
      return;
    }

    setEditingAgencyId(null);
    setEditAgencyFileKey((k) => k + 1);
    loadAll();
  }

  async function handleDeleteAgency(a) {
    if (
      !confirm(
        `Esta acción no se puede deshacer. ¿Eliminar "${a.name}"? Deja de mostrarse en Contáctanos y se borra también su teléfono.`
      )
    )
      return;
    await fetch(`/api/admin/agencies/${a.id}`, { method: "DELETE" });
    loadAll();
  }

  async function handleSaveAgencyPhone(agency, newPhone) {
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

  // --- Números generales ---
  function startEditPhone(phone) {
    setEditingPhoneId(phone.id);
    setEditPhoneValue(phone.phone);
    setPhoneEditError("");
  }

  function cancelEditPhone() {
    setEditingPhoneId(null);
    setPhoneEditError("");
  }

  async function handleSavePhoneEdit(id) {
    if (!editPhoneValue.trim()) {
      setPhoneEditError("El número no puede estar vacío.");
      return;
    }

    setSavingPhoneEdit(true);
    const res = await fetch(`/api/admin/phones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: editPhoneValue.trim() }),
    });
    setSavingPhoneEdit(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setPhoneEditError(data.message || "Error al actualizar el número");
      return;
    }

    setEditingPhoneId(null);
    loadAll();
  }

  return (
    <AdminLayout userEmail={userEmail} title="Edición de contenido">
      <p className="text-sm text-gray-500 mb-8">
        Todo lo que antes requería un cambio de código y un despliegue — foto, dirección,
        horario y ubicación de cada agencia, y los números generales del sitio — se edita desde
        acá. Los cambios se ven en el sitio al instante.
      </p>

      {/* ================= AGENCIAS ================= */}
      <h2 className="text-lg font-bold text-gray-800 mb-3">Agencias</h2>

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
            <h3 className="font-semibold text-gray-800 mb-4">Agencia nueva</h3>
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

      <div className="space-y-4 mb-10">
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
                    {editingAgencyId !== a.id && (
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          onClick={() => startEditAgency(a)}
                          className="text-sm text-gray-400 hover:text-main"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteAgency(a)}
                          className="text-sm text-gray-400 hover:text-red-600"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                  {editingAgencyId !== a.id && (
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
                              handleSaveAgencyPhone(a, e.target.value);
                            }
                          }}
                          disabled={savingPhoneId === a.id}
                          className="border rounded px-2 py-1 text-sm w-48"
                        />
                        <span className="text-xs text-gray-400">
                          {savingPhoneId === a.id
                            ? "Guardando..."
                            : "Teléfono (Enter/clic afuera para guardar)"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Última modificación: {a.updatedBy || "—"} — {formatDateTime(a.updatedAt)}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {editingAgencyId === a.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Foto nueva (opcional)</label>
                      <input
                        key={editAgencyFileKey}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => setEditAgencyFile(e.target.files?.[0] || null)}
                        className="w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={editAgencyForm.name}
                        onChange={(e) =>
                          setEditAgencyForm({ ...editAgencyForm, name: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Dirección</label>
                      <input
                        type="text"
                        value={editAgencyForm.address}
                        onChange={(e) =>
                          setEditAgencyForm({ ...editAgencyForm, address: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Horario</label>
                      <input
                        type="text"
                        value={editAgencyForm.time}
                        onChange={(e) =>
                          setEditAgencyForm({ ...editAgencyForm, time: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Latitud</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editAgencyForm.latitude}
                        onChange={(e) =>
                          setEditAgencyForm({ ...editAgencyForm, latitude: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Longitud</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editAgencyForm.longitude}
                        onChange={(e) =>
                          setEditAgencyForm({ ...editAgencyForm, longitude: e.target.value })
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  {agencyEditError && <p className="text-main text-sm mt-3">{agencyEditError}</p>}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleSaveAgencyEdit(a.id)}
                      disabled={savingAgencyEdit}
                      className="bg-main text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
                    >
                      {savingAgencyEdit ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      onClick={cancelEditAgency}
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

      {/* ================= NÚMEROS GENERALES ================= */}
      <h2 className="text-lg font-bold text-gray-800 mb-3">Números generales</h2>
      <p className="text-sm text-gray-500 mb-6">
        WhatsApp del sitio y demás números que no son de una agencia específica (botón flotante,
        cotizador, botón &quot;Agendar&quot; en la ficha de vehículo).
      </p>

      {Object.keys(generalGrouped).map((category) => (
        <div key={category} className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="space-y-3">
            {generalGrouped[category].map((p) => (
              <div key={p.id} className="border rounded-md p-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 font-medium truncate">{p.label}</div>
                    {editingPhoneId !== p.id && (
                      <div className="text-sm text-gray-500 mt-0.5">{p.phone}</div>
                    )}
                    {p.updatedBy && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        Última modificación: {p.updatedBy} — {formatDateTime(p.updatedAt)}
                      </div>
                    )}
                  </div>
                  {editingPhoneId !== p.id && (
                    <button
                      onClick={() => startEditPhone(p)}
                      className="text-sm text-gray-400 hover:text-main whitespace-nowrap"
                    >
                      Editar
                    </button>
                  )}
                </div>

                {editingPhoneId === p.id && (
                  <div className="mt-3 pt-3 border-t">
                    <input
                      type="text"
                      value={editPhoneValue}
                      onChange={(e) => setEditPhoneValue(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                      autoFocus
                    />
                    {phoneEditError && <p className="text-main text-sm mt-2">{phoneEditError}</p>}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleSavePhoneEdit(p.id)}
                        disabled={savingPhoneEdit}
                        className="bg-main text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
                      >
                        {savingPhoneEdit ? "Guardando..." : "Guardar"}
                      </button>
                      <button
                        onClick={cancelEditPhone}
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
        <h2 className="font-semibold text-gray-800 mb-1">Historial de cambios de teléfonos</h2>
        <p className="text-xs text-gray-400 mb-4">
          Registro permanente (agencias y números generales) — no se puede editar ni eliminar
          desde el panel.
        </p>
        {!log && <p className="text-gray-500 text-sm">Cargando...</p>}
        {log?.length === 0 && <p className="text-gray-500 text-sm">Todavía no hay cambios registrados.</p>}
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
