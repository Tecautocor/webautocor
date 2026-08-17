import Link from "next/link";
import { requireAdminSession } from "../../lib/adminAuth";
import AdminLayout from "../../components/admin/AdminLayout";

export async function getServerSideProps(context) {
  return requireAdminSession(context);
}

const MODULES = [
  {
    title: "Banners",
    description: "Ver, subir y eliminar los banners del carrusel del home.",
    href: "/admin/banners",
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
            <h2 className="font-semibold text-gray-800 mb-1">{m.title}</h2>
            <p className="text-sm text-gray-500">{m.description}</p>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
