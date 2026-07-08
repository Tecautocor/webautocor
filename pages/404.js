import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>AUTOCOR | Página no encontrada</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <img
              src="/logo-autocor.png"
              alt="AUTOCOR"
              className="h-14 mx-auto"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
          <h1 className="text-5xl font-bold text-[#e43d30] mb-4">404</h1>
          <p className="text-xl font-semibold text-[#3F3F3F] mb-2">
            Página no encontrada
          </p>
          <p className="text-gray-500 mb-8">
            La página que buscas no existe o fue movida.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-[#e43d30] hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              Ir al inicio
            </Link>
            <Link
              href="/vehiculos"
              className="border border-[#3F3F3F] text-[#3F3F3F] hover:bg-gray-100 font-semibold py-3 px-6 rounded-md transition-colors"
            >
              Ver vehículos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
