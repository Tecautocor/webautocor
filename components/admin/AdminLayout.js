import Link from "next/link";
import Head from "next/head";
import { signOut } from "next-auth/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Logo } from "../Shared";

export default function AdminLayout({
  userEmail,
  title,
  backHref,
  backLabel = "Volver a BI",
  wide = false,
  children,
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Plataforma de administración Web — AUTOCOR</title>
      </Head>
      <header className="bg-white shadow-sm">
        <div
          className={`${wide ? "max-w-none" : "max-w-5xl"} mx-auto px-4 py-4 grid grid-cols-3 items-center`}
        >
          <Link href="/admin" className="flex items-center gap-3 justify-self-start">
            <Logo />
          </Link>
          <span className="text-xl font-bold text-gray-800 text-center hidden sm:block">
            Plataforma de administración Web
          </span>
          <div className="flex items-center gap-4 justify-self-end">
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
      <main className={`${wide ? "max-w-none" : "max-w-5xl"} mx-auto px-4 py-8`}>
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-main mb-3"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
        {title && <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
