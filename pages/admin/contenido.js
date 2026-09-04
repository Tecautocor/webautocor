import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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

function formatDate(dateString, opts) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...opts,
  });
}

function toDatetimeLocalValue(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function classifyBanner(b) {
  if (!b.active) return "inactivos";
  const hasSchedule = !!(b.startsAt || b.endsAt);
  if (!hasSchedule) return "actuales";
  const now = new Date();
  if (b.endsAt && now > new Date(b.endsAt)) return "inactivos";
  return "temporada";
}

const EXPIRING_SOON_DAYS = 3;

function daysUntil(dateString) {
  if (!dateString) return null;
  const ms = new Date(dateString).getTime() - Date.now();
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

const BANNER_TABS = [
  { key: "actuales", label: "Actuales" },
  { key: "temporada", label: "De temporada" },
  { key: "inactivos", label: "Inactivos" },
];

function emptyAgencyForm() {
  return { name: "", address: "", time: "", latitude: "", longitude: "", phone: "" };
}

const CATEGORY_LABELS = {
  whatsapp: "WhatsApp",
};

const SECTIONS = [
  { key: "agencias", label: "Agencias" },
  { key: "generales", label: "Números generales" },
  { key: "banners", label: "Banners" },
];

export default function AdminContenido({ userEmail }) {
  const [section, setSection] = useState("agencias");

  const [agencies, setAgencies] = useState(null);
  const [phones, setPhones] = useState(null);
  const [log, setLog] = useState(null);
  const [bannerList, setBannerList] = useState(null);
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

  // --- Banners: alta nueva ---
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState("");
  const [bannerHref, setBannerHref] = useState("");
  const [bannerExternal, setBannerExternal] = useState(true);
  const [bannerIsTemporal, setBannerIsTemporal] = useState(false);
  const [bannerStartsAt, setBannerStartsAt] = useState("");
  const [bannerEndsAt, setBannerEndsAt] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerFileInputKey, setBannerFileInputKey] = useState(0);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);
  const [bannerDuplicatingId, setBannerDuplicatingId] = useState(null);
  const [bannerTab, setBannerTab] = useState("actuales");

  // --- Banners: edición ---
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editBannerHref, setEditBannerHref] = useState("");
  const [editBannerExternal, setEditBannerExternal] = useState(true);
  const [editBannerStartsAt, setEditBannerStartsAt] = useState("");
  const [editBannerEndsAt, setEditBannerEndsAt] = useState("");
  const [savingBannerEdit, setSavingBannerEdit] = useState(false);
  const [bannerEditError, setBannerEditError] = useState("");

  // --- Banners: orden ---
  const [bannerSavedOrderIds, setBannerSavedOrderIds] = useState([]);
  const [bannerDragIndex, setBannerDragIndex] = useState(null);
  const [savingBannerOrder, setSavingBannerOrder] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [agRes, phRes, logRes, bnRes] = await Promise.all([
      fetch("/api/admin/agencies"),
      fetch("/api/admin/phones"),
      fetch("/api/admin/phones/log"),
      fetch("/api/admin/banners"),
    ]);
    const [agData, phData, logData, bnData] = await Promise.all([
      agRes.json(),
      phRes.json(),
      logRes.json(),
      bnRes.json(),
    ]);
    setAgencies(agData.entitydata || []);
    setPhones(phData.entitydata || []);
    setLog(logData.entitydata || []);
    const bnList = bnData.entitydata || [];
    setBannerList(bnList);
    setBannerSavedOrderIds(bnList.map((b) => b.id));
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(bannerFile);
    setBannerPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerFile]);

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

  const bannerGrouped = useMemo(() => {
    const g = { actuales: [], temporada: [], inactivos: [] };
    (bannerList || []).forEach((b) => g[classifyBanner(b)].push(b));
    return g;
  }, [bannerList]);

  const visibleBanners = bannerGrouped[bannerTab] || [];
  const bannerDraggable = bannerTab !== "inactivos";

  const bannerOrderChanged =
    bannerDraggable &&
    visibleBanners.map((b) => b.id).join(",") !==
      bannerSavedOrderIds.filter((id) => visibleBanners.some((b) => b.id === id)).join(",");

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

  // --- Banners ---
  async function handleBannerUpload(e) {
    e.preventDefault();
    setBannerUploadError("");

    if (!bannerFile || !bannerHref) {
      setBannerUploadError("Falta la imagen o el link de destino.");
      return;
    }
    if (bannerIsTemporal && !bannerStartsAt && !bannerEndsAt) {
      setBannerUploadError("Define al menos una fecha de inicio o de fin para un banner de temporada.");
      return;
    }
    if (
      bannerIsTemporal &&
      bannerStartsAt &&
      bannerEndsAt &&
      new Date(bannerStartsAt) >= new Date(bannerEndsAt)
    ) {
      setBannerUploadError("La fecha de fin debe ser posterior a la de inicio.");
      return;
    }

    setBannerUploading(true);
    const formData = new FormData();
    formData.append("image", bannerFile);
    formData.append("href", bannerHref);
    formData.append("external", bannerExternal ? "true" : "false");
    if (bannerIsTemporal && bannerStartsAt) formData.append("startsAt", bannerStartsAt);
    if (bannerIsTemporal && bannerEndsAt) formData.append("endsAt", bannerEndsAt);

    const res = await fetch("/api/admin/banners", { method: "POST", body: formData });
    setBannerUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setBannerUploadError(data.message || "Error al subir el banner");
      return;
    }

    setBannerFile(null);
    setBannerHref("");
    setBannerExternal(true);
    setBannerIsTemporal(false);
    setBannerStartsAt("");
    setBannerEndsAt("");
    setBannerFileInputKey((k) => k + 1);
    loadAll();
  }

  async function handleBannerDeactivate(id) {
    if (
      !confirm(
        "¿Desactivar este banner? Deja de mostrarse en el home, pero podrás reactivarlo después desde la pestaña Inactivos."
      )
    )
      return;
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: false }),
    });
    loadAll();
  }

  async function handleBannerReactivate(id) {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true }),
    });
    loadAll();
  }

  async function handleBannerPermanentDelete(id) {
    if (!confirm("Esta acción no se puede deshacer. ¿Eliminar este banner permanentemente?"))
      return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function handleBannerDuplicate(id) {
    setBannerDuplicatingId(id);
    await fetch(`/api/admin/banners/${id}/duplicate`, { method: "POST" });
    setBannerDuplicatingId(null);
    loadAll();
  }

  function startEditBanner(banner) {
    setEditingBannerId(banner.id);
    setEditBannerHref(banner.href);
    setEditBannerExternal(banner.external);
    setEditBannerStartsAt(toDatetimeLocalValue(banner.startsAt));
    setEditBannerEndsAt(toDatetimeLocalValue(banner.endsAt));
    setBannerEditError("");
  }

  function cancelEditBanner() {
    setEditingBannerId(null);
    setBannerEditError("");
  }

  async function handleSaveBannerEdit(id) {
    if (!editBannerHref.trim()) {
      setBannerEditError("Falta el link de destino.");
      return;
    }
    if (
      editBannerStartsAt &&
      editBannerEndsAt &&
      new Date(editBannerStartsAt) >= new Date(editBannerEndsAt)
    ) {
      setBannerEditError("La fecha de fin debe ser posterior a la de inicio.");
      return;
    }

    setSavingBannerEdit(true);
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        href: editBannerHref.trim(),
        external: editBannerExternal,
        startsAt: editBannerStartsAt || null,
        endsAt: editBannerEndsAt || null,
      }),
    });
    setSavingBannerEdit(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setBannerEditError(data.message || "Error al actualizar el banner");
      return;
    }

    setEditingBannerId(null);
    loadAll();
  }

  function handleBannerDragStart(index) {
    setBannerDragIndex(index);
  }

  function handleBannerDragOver(e) {
    e.preventDefault();
  }

  function handleBannerDrop(targetIndex) {
    if (bannerDragIndex === null || bannerDragIndex === targetIndex) return;

    const visibleIds = visibleBanners.map((b) => b.id);
    const [movedId] = visibleIds.splice(bannerDragIndex, 1);
    visibleIds.splice(targetIndex, 0, movedId);

    setBannerList((prev) => {
      const reordered = visibleIds.map((id) => prev.find((b) => b.id === id));
      let cursor = 0;
      return prev.map((b) => (visibleIds.includes(b.id) ? reordered[cursor++] : b));
    });
    setBannerDragIndex(null);
  }

  async function handleSaveBannerOrder() {
    setSavingBannerOrder(true);
    await fetch("/api/admin/banners/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: bannerList.map((b) => b.id) }),
    });
    setSavingBannerOrder(false);
    loadAll();
  }

  function handleDiscardBannerOrder() {
    loadAll();
  }

  return (
    <AdminLayout userEmail={userEmail} title="Edición de contenido">
      <p className="text-sm text-gray-500 mb-6">
        Todo lo que antes requería un cambio de código y un despliegue — agencias, números
        telefónicos y banners del home — se edita desde acá. Los cambios se ven en el sitio al
        instante.
      </p>

      <div className="flex items-center gap-2 bg-gray-200 p-1 rounded-lg mb-8 w-fit">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSection(s.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              section === s.key ? "bg-white text-main shadow" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 text-sm mb-4">Cargando...</p>}

      {/* ================= AGENCIAS ================= */}
      {section === "agencias" && (
        <>
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
                  Para las coordenadas: en Google Maps, clic derecho sobre el punto exacto → clic
                  en los números que aparecen arriba para copiarlos → pega el primero en Latitud y
                  el segundo en Longitud.
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

          <div className="space-y-4">
            {(agencies || []).map((a) => {
              const phoneRecord = phoneByKey[a.phoneKey];
              return (
                <div key={a.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={a.src}
                        alt={a.name}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
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
                            Última modificación: {a.updatedBy || "—"} —{" "}
                            {formatDateTime(a.updatedAt)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {editingAgencyId === a.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Foto nueva (opcional)
                          </label>
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
                      {agencyEditError && (
                        <p className="text-main text-sm mt-3">{agencyEditError}</p>
                      )}
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
        </>
      )}

      {/* ================= NÚMEROS GENERALES ================= */}
      {section === "generales" && (
        <>
          <p className="text-sm text-gray-500 mb-6">
            WhatsApp del sitio y demás números que no son de una agencia específica (botón
            flotante, cotizador, botón &quot;Agendar&quot; en la ficha de vehículo). El teléfono de
            cada agencia se edita en la pestaña &quot;Agencias&quot;.
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
                        <div className="text-sm text-gray-700 font-medium truncate">
                          {p.label}
                        </div>
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
                        {phoneEditError && (
                          <p className="text-main text-sm mt-2">{phoneEditError}</p>
                        )}
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
            <h3 className="font-semibold text-gray-800 mb-1">Historial de cambios de teléfonos</h3>
            <p className="text-xs text-gray-400 mb-4">
              Registro permanente (agencias y números generales) — no se puede editar ni eliminar
              desde el panel.
            </p>
            {!log && <p className="text-gray-500 text-sm">Cargando...</p>}
            {log?.length === 0 && (
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
        </>
      )}

      {/* ================= BANNERS ================= */}
      {section === "banners" && (
        <>
          <form onSubmit={handleBannerUpload} className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="font-semibold text-gray-800 mb-1">Subir banner nuevo</h3>
            <p className="text-sm text-gray-500 mb-4">
              El banner nuevo pasa a ser el primero que se muestra en el carrusel del home. Sin
              marcar la casilla de temporada queda permanente (pestaña &quot;Actuales&quot;);
              marcándola y definiendo una fecha de fin, pasa a &quot;De temporada&quot; y se apaga
              solo cuando caduque.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Imagen</label>
                <input
                  key={bannerFileInputKey}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Link al hacer click</label>
                <input
                  type="text"
                  value={bannerHref}
                  onChange={(e) => setBannerHref(e.target.value)}
                  placeholder="https://api.whatsapp.com/send?..."
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 mt-4">
              <input
                type="checkbox"
                checked={bannerIsTemporal}
                onChange={(e) => {
                  setBannerIsTemporal(e.target.checked);
                  if (!e.target.checked) {
                    setBannerStartsAt("");
                    setBannerEndsAt("");
                  }
                }}
              />
              Banner de temporada / con caducidad (promoción por tiempo limitado)
            </label>

            {bannerIsTemporal && (
              <div className="grid gap-4 sm:grid-cols-2 mt-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Activo desde (opcional)</label>
                  <input
                    type="datetime-local"
                    value={bannerStartsAt}
                    onChange={(e) => setBannerStartsAt(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Activo hasta</label>
                  <input
                    type="datetime-local"
                    value={bannerEndsAt}
                    onChange={(e) => setBannerEndsAt(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {bannerPreviewUrl && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Vista previa — así se vería en el hero del home:
                </p>
                <div className="relative w-full aspect-[3/1] bg-gray-100 rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bannerPreviewUrl}
                    alt="Vista previa del banner"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 text-sm text-gray-600 mt-4">
              <input
                type="checkbox"
                checked={bannerExternal}
                onChange={(e) => setBannerExternal(e.target.checked)}
              />
              Es un link externo (WhatsApp, etc.)
            </label>
            {bannerUploadError && <p className="text-main text-sm mt-3">{bannerUploadError}</p>}
            <button
              type="submit"
              disabled={bannerUploading}
              className="mt-5 bg-main text-white px-5 py-2.5 rounded-md font-semibold disabled:opacity-50"
            >
              {bannerUploading ? "Subiendo..." : "Subir banner"}
            </button>
          </form>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg mb-5 w-fit">
              {BANNER_TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setBannerTab(t.key)}
                  className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
                    bannerTab === t.key
                      ? "bg-main text-white shadow"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.label} ({bannerGrouped[t.key]?.length || 0})
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-gray-500">
                {bannerTab === "actuales" &&
                  "Banners permanentes, siempre visibles en el home mientras no se desactiven."}
                {bannerTab === "temporada" &&
                  "Banners con fecha de inicio y/o fin — vigentes ahora o programados para el futuro."}
                {bannerTab === "inactivos" &&
                  "Banners desactivados o vencidos. Quedan como histórico hasta que se eliminen permanentemente."}
              </p>
              {bannerOrderChanged && (
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <button
                    onClick={handleDiscardBannerOrder}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Descartar orden
                  </button>
                  <button
                    onClick={handleSaveBannerOrder}
                    disabled={savingBannerOrder}
                    className="bg-main text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
                  >
                    {savingBannerOrder ? "Guardando..." : "Guardar cambios de orden"}
                  </button>
                </div>
              )}
            </div>
            {bannerDraggable && (
              <p className="text-xs text-gray-400 mb-4">
                Arrastra un banner con el ícono ⠿ para cambiar el orden en que aparecen en el home.
              </p>
            )}

            {!bannerList && <p className="text-gray-500 text-sm mt-4">Cargando...</p>}
            {bannerList && visibleBanners.length === 0 && (
              <p className="text-gray-500 text-sm mt-4">No hay banners en esta categoría.</p>
            )}

            <div className="space-y-4 mt-4">
              {visibleBanners.map((b, i) => (
                <motion.div
                  key={b.id}
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  onDragOver={bannerDraggable ? handleBannerDragOver : undefined}
                  onDrop={bannerDraggable ? () => handleBannerDrop(i) : undefined}
                  className={`border rounded-md p-3 bg-white ${
                    bannerDragIndex === i ? "opacity-40" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {bannerDraggable ? (
                      <span
                        draggable={editingBannerId === null}
                        onDragStart={() => handleBannerDragStart(i)}
                        onDragEnd={() => setBannerDragIndex(null)}
                        className={`text-xl text-gray-300 select-none flex-shrink-0 ${
                          editingBannerId === null
                            ? "cursor-grab hover:text-gray-500"
                            : "cursor-not-allowed"
                        }`}
                        title="Arrastrar para reordenar"
                      >
                        ⠿
                      </span>
                    ) : (
                      <span className="w-5 flex-shrink-0" />
                    )}
                    <div className="relative w-40 h-14 flex-shrink-0 bg-gray-100">
                      <Image src={b.src} alt="" fill style={{ objectFit: "contain" }} unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-600 truncate">
                        {bannerTab === "actuales" && i === 0 && (
                          <span className="text-main font-semibold mr-2">Principal</span>
                        )}
                        {b.href}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 flex flex-col gap-0.5">
                        <span>
                          <span className="text-gray-500 font-medium">Subido:</span>{" "}
                          {formatDate(b.createdAt, { hour: "2-digit", minute: "2-digit" })}
                          {b.createdBy && (
                            <>
                              {" "}
                              <span className="text-gray-500 font-medium ml-2">Por:</span>{" "}
                              {b.createdBy}
                            </>
                          )}
                        </span>
                        {(b.startsAt || b.endsAt) && (
                          <span>
                            <span className="text-gray-500 font-medium">Vigencia:</span>{" "}
                            {b.startsAt ? formatDate(b.startsAt) : "sin inicio"} —{" "}
                            {b.endsAt ? formatDate(b.endsAt) : "sin fin"}
                          </span>
                        )}
                      </div>
                      {bannerTab === "temporada" &&
                        b.endsAt &&
                        daysUntil(b.endsAt) !== null &&
                        daysUntil(b.endsAt) <= EXPIRING_SOON_DAYS && (
                          <span className="inline-block mt-1 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                            {daysUntil(b.endsAt) <= 0
                              ? "Vence hoy"
                              : `Vence en ${daysUntil(b.endsAt)} día${
                                  daysUntil(b.endsAt) === 1 ? "" : "s"
                                }`}
                          </span>
                        )}
                    </div>
                    {editingBannerId !== b.id && (
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <button
                          onClick={() => startEditBanner(b)}
                          className="text-sm text-gray-400 hover:text-main"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleBannerDuplicate(b.id)}
                          disabled={bannerDuplicatingId === b.id}
                          className="text-sm text-gray-400 hover:text-main disabled:opacity-50"
                        >
                          {bannerDuplicatingId === b.id ? "Duplicando..." : "Duplicar"}
                        </button>
                        {bannerTab === "inactivos" ? (
                          <>
                            {!b.active && (
                              <button
                                onClick={() => handleBannerReactivate(b.id)}
                                className="text-sm text-gray-400 hover:text-main"
                              >
                                Reactivar
                              </button>
                            )}
                            <button
                              onClick={() => handleBannerPermanentDelete(b.id)}
                              className="text-sm text-gray-400 hover:text-red-600"
                            >
                              Eliminar permanentemente
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleBannerDeactivate(b.id)}
                            className="text-sm text-gray-400 hover:text-main"
                          >
                            Desactivar
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {editingBannerId === b.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className="block text-sm text-gray-600 mb-1">
                            Link al hacer click
                          </label>
                          <input
                            type="text"
                            value={editBannerHref}
                            onChange={(e) => setEditBannerHref(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Activo desde (opcional)
                          </label>
                          <input
                            type="datetime-local"
                            value={editBannerStartsAt}
                            onChange={(e) => setEditBannerStartsAt(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Activo hasta (opcional)
                          </label>
                          <input
                            type="datetime-local"
                            value={editBannerEndsAt}
                            onChange={(e) => setEditBannerEndsAt(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                        <input
                          type="checkbox"
                          checked={editBannerExternal}
                          onChange={(e) => setEditBannerExternal(e.target.checked)}
                        />
                        Es un link externo (WhatsApp, etc.)
                      </label>
                      {bannerEditError && (
                        <p className="text-main text-sm mt-2">{bannerEditError}</p>
                      )}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => handleSaveBannerEdit(b.id)}
                          disabled={savingBannerEdit}
                          className="bg-main text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
                        >
                          {savingBannerEdit ? "Guardando..." : "Guardar"}
                        </button>
                        <button
                          onClick={cancelEditBanner}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
