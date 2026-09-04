import Link from "next/link";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";
import { PhotoIcon, PencilSquareIcon, ShieldCheckIcon, ChartBarSquareIcon } from "@heroicons/react/24/outline";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MODULES = [
  {
    title: "Banners",
    description: "Ver, subir y eliminar los banners del carrusel del home.",
    href: "/admin/banners",
    icon: PhotoIcon,
  },
  {
    title: "Edición de contenido",
    description:
      "Foto, dirección, horario y ubicación de cada agencia, más los números telefónicos generales del sitio (WhatsApp, etc.), con historial de cambios.",
    href: "/admin/contenido",
    icon: PencilSquareIcon,
  },
  {
    title: "Cotizador Seguros (Ecuaprimas)",
    description:
      "Tablero de las ventas aprobadas: cuáles matchearon contra el catálogo y cuáles no, con motivo.",
    href: "/admin/ecuaprimas",
    icon: ShieldCheckIcon,
  },
  {
    title: "BI",
    description: "Metas, Inventario, Performance, Embudo de Conversión y Análisis Comercial.",
    href: "/admin/bi",
    icon: ChartBarSquareIcon,
  },
];

export default function AdminDashboard({ userEmail }) {
  return (
    <AdminLayout userEmail={userEmail} title="Módulos">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition block"
          >
            <m.icon className="h-8 w-8 text-main mb-3" />
            <h2 className="font-semibold text-gray-800 mb-1">{m.title}</h2>
            <p className="text-sm text-gray-500">{m.description}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
