import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import { Logo } from "../../components/Shared";

export default function AdminLogin() {
  const { status } = useSession();
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin/banners");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Head>
        <title>Panel AUTOCOR</title>
      </Head>
      <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">Panel AUTOCOR</h1>
        <p className="text-gray-500 text-sm mb-6">Administración de banners</p>
        {error && (
          <p className="text-main text-sm mb-4">
            Tu cuenta de Microsoft no tiene acceso a este panel.
          </p>
        )}
        <button
          onClick={() => signIn("azure-ad", { callbackUrl: "/admin/banners" })}
          className="w-full bg-main text-white py-2.5 rounded-md font-semibold hover:opacity-90 transition"
        >
          Iniciar sesión con Microsoft
        </button>
      </div>
    </div>
  );
}
