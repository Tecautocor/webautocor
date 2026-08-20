import Link from "next/link";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  PhotoIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ChartBarSquareIcon,
  TrophyIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";

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
    title: "Números telefónicos",
    description:
      "WhatsApp del sitio y teléfono de cada agencia, con historial permanente de cambios.",
    href: "/admin/phones",
    icon: PhoneIcon,
  },
  {
    title: "Cotizador Seguros (Ecuaprimas)",
    description:
      "Tablero de las ventas aprobadas: cuáles matchearon contra el catálogo y cuáles no, con motivo.",
    href: "/admin/ecuaprimas",
    icon: ShieldCheckIcon,
  },
  {
    title: "Resumen de Inventario",
    description:
      "Dashboard en vivo del stock: concentración por modelo, antigüedad, valor y carrocería, con filtros interactivos.",
    href: "/admin/inventario",
    icon: ChartBarSquareIcon,
  },
  {
    title: "Performance por Agencia",
    description:
      "Ventas vs meta por agencia y mes, con ranking de cumplimiento y evolución acumulada.",
    href: "/admin/performance",
    icon: TrophyIcon,
  },
  {
    title: "Metas de Ventas",
    description: "Definir el objetivo mensual de unidades a vender por agencia.",
    href: "/admin/metas",
    icon: FlagIcon,
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
