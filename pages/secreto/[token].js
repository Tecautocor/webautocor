import { useState } from "react";
import Head from "next/head";
import db from "../../lib/db";
import { decryptSecret } from "../../lib/secretShare";
import { Logo } from "../../components/Shared";

export async function getServerSideProps({ params }) {
  const record = await db.sharedSecret.findUnique({ where: { token: params.token } });

  if (!record || record.revoked || record.expiresAt < new Date()) {
    return { props: { status: "unavailable" } };
  }

  await db.sharedSecret.update({
    where: { id: record.id },
    data: { viewCount: { increment: 1 }, lastViewedAt: new Date() },
  });

  const value = decryptSecret(record);

  return {
    props: {
      status: "ok",
      label: record.label,
      value,
    },
  };
}

export default function SecretoPage({ status, label, value }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Head>
        <title>Acceso seguro — AUTOCOR</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="bg-white rounded-lg shadow max-w-md w-full p-6">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        {status === "unavailable" ? (
          <p className="text-center text-gray-600">
            Este link ya no está disponible (expiró o fue revocado). Pedí uno nuevo.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">{label}</p>
            {!revealed ? (
              <button
                onClick={() => setRevealed(true)}
                className="w-full bg-main text-white py-2 rounded font-medium"
              >
                Mostrar
              </button>
            ) : (
              <div className="space-y-3">
                <code className="block break-all bg-gray-50 border rounded p-3 text-sm">
                  {value}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(value);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full bg-gray-800 text-white py-2 rounded font-medium"
                >
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
