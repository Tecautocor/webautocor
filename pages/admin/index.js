import Link from "next/link";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";
import { PencilSquareIcon, ShieldCheckIcon, ChartBarSquareIcon } from "@heroicons/react/24/outline";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MODULES = [
  {
    title: "Edición de contenido",
    description:
      "Agencias (foto, dirección, horario, mapa, teléfono), números telefónicos generales y banners del home — todo con historial de cambios.",
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
