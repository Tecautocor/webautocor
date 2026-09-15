import { useState } from "react";
import Head from "next/head";
import db from "../../lib/db";
import { Logo } from "../../components/Shared";

export async function getServerSideProps({ params }) {
  const record = await db.sharedSecret.findUnique({ where: { token: params.token } });

  if (!record || record.revoked || record.expiresAt < new Date()) {
    return { props: { status: "unavailable" } };
  }

  return {
    props: {
      status: "ok",
      label: record.label,
      requiresPin: !!record.pinHash,
      token: params.token,
    },
  };
}

export default function SecretoPage({ status, label, requiresPin, token }) {
  const [pin, setPin] = useState("");
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function reveal(e) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/secret/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(
        json.attemptsLeft !== undefined
          ? `${json.message} (${json.attemptsLeft} intento(s) restante(s))`
          : json.message
      );
      return;
    }
    setValue(json.value);
  }

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
            Este link ya no está disponible (expiró, fue revocado o se bloqueó por intentos
            fallidos). Pedí uno nuevo.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-3">{label}</p>

            {value ? (
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
            ) : (
              <form onSubmit={reveal} className="space-y-3">
                {requiresPin && (
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="Código de 4 dígitos"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    className="w-full border rounded px-3 py-2 text-sm text-center tracking-widest"
                    autoFocus
                  />
                )}
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || (requiresPin && pin.length !== 4)}
                  className="w-full bg-main text-white py-2 rounded font-medium disabled:opacity-50"
                >
                  {loading ? "Verificando..." : "Mostrar"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
