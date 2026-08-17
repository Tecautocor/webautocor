import { useEffect, useState } from "react";
import Image from "next/image";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

function formatUploadDate(dateString) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminBanners({ userEmail }) {
  const [banners, setBanners] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [href, setHref] = useState("");
  const [external, setExternal] = useState(true);
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editHref, setEditHref] = useState("");
  const [editExternal, setEditExternal] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const [savedOrderIds, setSavedOrderIds] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const orderChanged =
    banners && banners.map((b) => b.id).join(",") !== savedOrderIds.join(",");

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

  async function handleUpload(e) {
    e.preventDefault();
    setError("");

    if (!file || !href) {
      setError("Falta la imagen o el link de destino.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("href", href);
    formData.append("external", external ? "true" : "false");

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
    setFileInputKey((k) => k + 1);
    loadBanners();
  }

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este banner del carrusel del home?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    loadBanners();
  }

  function startEdit(banner) {
    setEditingId(banner.id);
    setEditHref(banner.href);
    setEditExternal(banner.external);
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

    setSavingEdit(true);
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ href: editHref.trim(), external: editExternal }),
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
    setBanners((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
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
          El banner nuevo pasa a ser el primero que se muestra en el carrusel del home.
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
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-800">Banners actuales</h2>
          {orderChanged && (
            <div className="flex items-center gap-3">
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
        <p className="text-sm text-gray-500 mb-4">
          Arrastra un banner con el ícono ⠿ para cambiar el orden en que aparecen en el home.
        </p>
        {loading && <p className="text-gray-500 text-sm">Cargando...</p>}
        {!loading && banners?.length === 0 && (
          <p className="text-gray-500 text-sm">No hay banners activos.</p>
        )}
        <div className="space-y-4">
          {banners?.map((b, i) => (
            <div
              key={b.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(i)}
              className={`border rounded-md p-3 ${dragIndex === i ? "opacity-40" : ""}`}
            >
              <div className="flex items-center gap-4">
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
                <div className="relative w-40 h-14 flex-shrink-0 bg-gray-100">
                  <Image src={b.src} alt="" fill style={{ objectFit: "contain" }} unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-600 truncate">
                    {i === 0 && <span className="text-main font-semibold mr-2">Principal</span>}
                    {b.href}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Subido: {formatUploadDate(b.createdAt)}
                  </div>
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
                      onClick={() => handleDelete(b.id)}
                      className="text-sm text-gray-400 hover:text-main"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              {editingId === b.id && (
                <div className="mt-4 pt-4 border-t">
                  <label className="block text-sm text-gray-600 mb-1">Link al hacer click</label>
                  <input
                    type="text"
                    value={editHref}
                    onChange={(e) => setEditHref(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
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
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
