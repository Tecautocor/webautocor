import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
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

const TABS = [
  { key: "actuales", label: "Actuales" },
  { key: "temporada", label: "De temporada" },
  { key: "inactivos", label: "Inactivos" },
];

export default function AdminBanners({ userEmail }) {
  const [banners, setBanners] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("actuales");

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [href, setHref] = useState("");
  const [external, setExternal] = useState(true);
  const [isTemporal, setIsTemporal] = useState(false);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editHref, setEditHref] = useState("");
  const [editExternal, setEditExternal] = useState(true);
  const [editStartsAt, setEditStartsAt] = useState("");
  const [editEndsAt, setEditEndsAt] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const [savedOrderIds, setSavedOrderIds] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);

  async function loadBanners() {
    setLoading(true);
    const res = await fetch("/api/admin/banners");
    const data = await res.json();
    const list = data.entitydata || [];
    setBanners(list);
    setSavedOrderIds(list.map((b) => b.id));
    setLoading(false);
  }

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const grouped = useMemo(() => {
    const g = { actuales: [], temporada: [], inactivos: [] };
    (banners || []).forEach((b) => g[classifyBanner(b)].push(b));
    return g;
  }, [banners]);

  const visibleBanners = grouped[tab] || [];
  const draggable = tab !== "inactivos";

  const orderChanged =
    draggable &&
    visibleBanners.map((b) => b.id).join(",") !==
      savedOrderIds.filter((id) => visibleBanners.some((b) => b.id === id)).join(",");

  async function handleUpload(e) {
    e.preventDefault();
    setError("");

    if (!file || !href) {
      setError("Falta la imagen o el link de destino.");
      return;
    }
    if (isTemporal && !startsAt && !endsAt) {
      setError("Define al menos una fecha de inicio o de fin para un banner de temporada.");
      return;
    }
    if (isTemporal && startsAt && endsAt && new Date(startsAt) >= new Date(endsAt)) {
      setError("La fecha de fin debe ser posterior a la de inicio.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("href", href);
    formData.append("external", external ? "true" : "false");
    if (isTemporal && startsAt) formData.append("startsAt", startsAt);
    if (isTemporal && endsAt) formData.append("endsAt", endsAt);

    const res = await fetch("/api/admin/banners", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Error al subir el banner");
      return;
    }

    setFile(null);
    setHref("");
    setExternal(true);
    setIsTemporal(false);
    setStartsAt("");
    setEndsAt("");
    setFileInputKey((k) => k + 1);
    loadBanners();
  }

  async function handleDeactivate(id) {
    if (!confirm("¿Desactivar este banner? Deja de mostrarse en el home, pero podrás reactivarlo después desde la pestaña Inactivos."))
      return;
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: false }),
    });
    loadBanners();
  }

  async function handleReactivate(id) {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true }),
    });
    loadBanners();
  }

  async function handlePermanentDelete(id) {
    if (!confirm("Esta acción no se puede deshacer. ¿Eliminar este banner permanentemente?"))
      return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    loadBanners();
  }

  async function handleDuplicate(id) {
    setDuplicatingId(id);
    await fetch(`/api/admin/banners/${id}/duplicate`, { method: "POST" });
    setDuplicatingId(null);
    loadBanners();
  }

  function startEdit(banner) {
    setEditingId(banner.id);
    setEditHref(banner.href);
    setEditExternal(banner.external);
    setEditStartsAt(toDatetimeLocalValue(banner.startsAt));
    setEditEndsAt(toDatetimeLocalValue(banner.endsAt));
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError("");
  }

  async function handleSaveEdit(id) {
    if (!editHref.trim()) {
      setEditError("Falta el link de destino.");
      return;
    }
    if (editStartsAt && editEndsAt && new Date(editStartsAt) >= new Date(editEndsAt)) {
      setEditError("La fecha de fin debe ser posterior a la de inicio.");
      return;
    }

    setSavingEdit(true);
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        href: editHref.trim(),
        external: editExternal,
        startsAt: editStartsAt || null,
        endsAt: editEndsAt || null,
      }),
    });
    setSavingEdit(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setEditError(data.message || "Error al actualizar el banner");
      return;
    }

    setEditingId(null);
    loadBanners();
  }

  function handleDragStart(index) {
    setDragIndex(index);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(targetIndex) {
    if (dragIndex === null || dragIndex === targetIndex) return;

    const visibleIds = visibleBanners.map((b) => b.id);
    const [movedId] = visibleIds.splice(dragIndex, 1);
    visibleIds.splice(targetIndex, 0, movedId);

    setBanners((prev) => {
      const reordered = visibleIds.map((id) => prev.find((b) => b.id === id));
      let cursor = 0;
      // conserva el resto de banners (otras pestañas) tal cual, solo reacomoda los visibles entre sí
      return prev.map((b) => (visibleIds.includes(b.id) ? reordered[cursor++] : b));
    });
    setDragIndex(null);
  }

  async function handleSaveOrder() {
    setSavingOrder(true);
    await fetch("/api/admin/banners/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: banners.map((b) => b.id) }),
    });
    setSavingOrder(false);
    loadBanners();
  }

  function handleDiscardOrder() {
    loadBanners();
  }

  return (
    <AdminLayout userEmail={userEmail} title="Banners del home">
      <form onSubmit={handleUpload} className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="font-semibold text-gray-800 mb-1">Subir banner nuevo</h2>
        <p className="text-sm text-gray-500 mb-4">
          El banner nuevo pasa a ser el primero que se muestra en el carrusel del home. Sin marcar
          la casilla de temporada queda permanente (pestaña &quot;Actuales&quot;); marcándola y
          definiendo una fecha de fin, pasa a &quot;De temporada&quot; y se apaga solo cuando
          caduque.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Imagen</label>
            <input
              key={fileInputKey}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Link al hacer click</label>
            <input
              type="text"
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="https://api.whatsapp.com/send?..."
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 mt-4">
          <input
            type="checkbox"
            checked={isTemporal}
            onChange={(e) => {
              setIsTemporal(e.target.checked);
              if (!e.target.checked) {
                setStartsAt("");
                setEndsAt("");
              }
            }}
          />
          Banner de temporada / con caducidad (promoción por tiempo limitado)
        </label>

        {isTemporal && (
          <div className="grid gap-4 sm:grid-cols-2 mt-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Activo desde (opcional)
              </label>
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Activo hasta</label>
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Vista previa — así se vería en el hero del home:
            </p>
            <div className="relative w-full aspect-[3/1] bg-gray-100 rounded-md overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Vista previa del banner"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        <label className="flex items-center gap-2 text-sm text-gray-600 mt-4">
          <input
            type="checkbox"
            checked={external}
            onChange={(e) => setExternal(e.target.checked)}
          />
          Es un link externo (WhatsApp, etc.)
        </label>
        {error && <p className="text-main text-sm mt-3">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="mt-5 bg-main text-white px-5 py-2.5 rounded-md font-semibold disabled:opacity-50"
        >
          {uploading ? "Subiendo..." : "Subir banner"}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg mb-5 w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
                tab === t.key
                  ? "bg-main text-white shadow"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label} ({grouped[t.key]?.length || 0})
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-500">
            {tab === "actuales" &&
              "Banners permanentes, siempre visibles en el home mientras no se desactiven."}
            {tab === "temporada" &&
              "Banners con fecha de inicio y/o fin — vigentes ahora o programados para el futuro."}
            {tab === "inactivos" &&
              "Banners desactivados o vencidos. Quedan como histórico hasta que se eliminen permanentemente."}
          </p>
          {orderChanged && (
            <div className="flex items-center gap-3 whitespace-nowrap">
              <button
                onClick={handleDiscardOrder}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Descartar orden
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={savingOrder}
                className="bg-main text-white px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
              >
                {savingOrder ? "Guardando..." : "Guardar cambios de orden"}
              </button>
            </div>
          )}
        </div>
        {draggable && (
          <p className="text-xs text-gray-400 mb-4">
            Arrastra un banner con el ícono ⠿ para cambiar el orden en que aparecen en el home.
          </p>
        )}

        {loading && <p className="text-gray-500 text-sm mt-4">Cargando...</p>}
        {!loading && visibleBanners.length === 0 && (
          <p className="text-gray-500 text-sm mt-4">No hay banners en esta categoría.</p>
        )}

        <div className="space-y-4 mt-4">
          {visibleBanners.map((b, i) => (
            <motion.div
              key={b.id}
              layout
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              onDragOver={draggable ? handleDragOver : undefined}
              onDrop={draggable ? () => handleDrop(i) : undefined}
              className={`border rounded-md p-3 bg-white ${dragIndex === i ? "opacity-40" : ""}`}
            >
              <div className="flex items-center gap-4">
                {draggable ? (
                  <span
                    draggable={editingId === null}
                    onDragStart={() => handleDragStart(i)}
                    onDragEnd={() => setDragIndex(null)}
                    className={`text-xl text-gray-300 select-none flex-shrink-0 ${
                      editingId === null ? "cursor-grab hover:text-gray-500" : "cursor-not-allowed"
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
                    {tab === "actuales" && i === 0 && (
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
                  {tab === "temporada" &&
                    b.endsAt &&
                    daysUntil(b.endsAt) !== null &&
                    daysUntil(b.endsAt) <= EXPIRING_SOON_DAYS && (
                      <span className="inline-block mt-1 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                        {daysUntil(b.endsAt) <= 0
                          ? "Vence hoy"
                          : `Vence en ${daysUntil(b.endsAt)} día${daysUntil(b.endsAt) === 1 ? "" : "s"}`}
                      </span>
                    )}
                </div>
                {editingId !== b.id && (
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <button
                      onClick={() => startEdit(b)}
                      className="text-sm text-gray-400 hover:text-main"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDuplicate(b.id)}
                      disabled={duplicatingId === b.id}
                      className="text-sm text-gray-400 hover:text-main disabled:opacity-50"
                    >
                      {duplicatingId === b.id ? "Duplicando..." : "Duplicar"}
                    </button>
                    {tab === "inactivos" ? (
                      <>
                        {!b.active && (
                          <button
                            onClick={() => handleReactivate(b.id)}
                            className="text-sm text-gray-400 hover:text-main"
                          >
                            Reactivar
                          </button>
                        )}
                        <button
                          onClick={() => handlePermanentDelete(b.id)}
                          className="text-sm text-gray-400 hover:text-red-600"
                        >
                          Eliminar permanentemente
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDeactivate(b.id)}
                        className="text-sm text-gray-400 hover:text-main"
                      >
                        Desactivar
                      </button>
                    )}
                  </div>
                )}
              </div>

              {editingId === b.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">
                        Link al hacer click
                      </label>
                      <input
                        type="text"
                        value={editHref}
                        onChange={(e) => setEditHref(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Activo desde (opcional)
                      </label>
                      <input
                        type="datetime-local"
                        value={editStartsAt}
                        onChange={(e) => setEditStartsAt(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Activo hasta (opcional)
                      </label>
                      <input
                        type="datetime-local"
                        value={editEndsAt}
                        onChange={(e) => setEditEndsAt(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                    <input
                      type="checkbox"
                      checked={editExternal}
                      onChange={(e) => setEditExternal(e.target.checked)}
                    />
                    Es un link externo (WhatsApp, etc.)
                  </label>
                  {editError && <p className="text-main text-sm mt-2">{editError}</p>}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleSaveEdit(b.id)}
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
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
