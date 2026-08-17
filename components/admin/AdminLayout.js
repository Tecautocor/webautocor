import Link from "next/link";
import Head from "next/head";
import { signOut } from "next-auth/react";
import { Logo } from "../Shared";

export default function AdminLayout({ userEmail, title, children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Plataforma de administración Web — AUTOCOR</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo />
            <span className="font-bold text-gray-800 hidden sm:inline">
              Plataforma de administración Web
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden sm:inline">{userEmail}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="text-sm text-gray-500 hover:text-main underline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {title && <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
