import { getServerSession } from "next-auth/next";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/admin/login",
        permanent: false,
      },
    };
  }

  return { props: { userEmail: session.user?.email || "" } };
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

  async function loadBanners() {
    setLoading(true);
    const res = await fetch("/api/admin/banners");
    const data = await res.json();
    setBanners(data.entitydata || []);
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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <Head>
        <title>Panel AUTOCOR — Banners</title>
      </Head>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Banners del home</h1>
            <p className="text-gray-500 text-sm">Sesión: {userEmail}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-sm text-gray-500 hover:text-main underline"
          >
            Cerrar sesión
          </button>
        </div>

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
              <label className="block text-sm text-gray-600 mb-1">
                Link al hacer click
              </label>
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
          <h2 className="font-semibold text-gray-800 mb-4">Banners actuales</h2>
          {loading && <p className="text-gray-500 text-sm">Cargando...</p>}
          {!loading && banners?.length === 0 && (
            <p className="text-gray-500 text-sm">No hay banners activos.</p>
          )}
          <div className="space-y-4">
            {banners?.map((b, i) => (
              <div key={b.id} className="flex items-center gap-4 border rounded-md p-3">
                <div className="relative w-40 h-14 flex-shrink-0 bg-gray-100">
                  <Image src={b.src} alt="" fill style={{ objectFit: "contain" }} unoptimized />
                </div>
                <div className="flex-1 text-sm text-gray-600 truncate">
                  {i === 0 && <span className="text-main font-semibold mr-2">Principal</span>}
                  {b.href}
                </div>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-sm text-gray-400 hover:text-main whitespace-nowrap"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
