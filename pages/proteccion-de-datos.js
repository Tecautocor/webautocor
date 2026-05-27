import { useState } from "react";
import Layout from "../components/Layout";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  EyeSlashIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

const pilares = [
  {
    icon: ShieldCheckIcon,
    titulo: "Tus datos están protegidos",
    descripcion:
      "Cumplimos con la Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador para garantizar la seguridad de tu información.",
  },
  {
    icon: LockClosedIcon,
    titulo: "Acceso controlado",
    descripcion:
      "Solo personal autorizado accede a tus datos. Aplicamos medidas técnicas y organizativas para prevenir accesos no autorizados.",
  },
  {
    icon: EyeSlashIcon,
    titulo: "Sin uso indebido",
    descripcion:
      "Tu información personal nunca será vendida ni compartida con terceros sin tu consentimiento expreso.",
  },
];

function Acordeon({ icono: Icono, titulo, subtitulo, children, descarga }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="bg-main/10 p-2 rounded-full">
            <Icono className="h-5 w-5 text-main" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-[#3F3F3F] text-sm">{titulo}</p>
            <p className="text-gray-400 text-xs mt-0.5">
              {abierto ? "Haz clic para ocultar" : subtitulo}
            </p>
          </div>
        </div>
        {abierto ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {abierto && (
        <div className="border-t border-gray-100">
          {children}
          {descarga && (
            <div className="px-6 py-4 bg-gray-50 flex justify-end border-t border-gray-100">
              <a
                href={descarga.href}
                download
                className="inline-flex items-center gap-2 bg-main text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                {descarga.label}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProteccionDeDatos() {
  return (
    <Layout selected="data">
      {/* HERO */}
      <div className="bg-[#3F3F3F] text-white">
        <div className="max-w-5xl mx-auto px-6 py-14 flex flex-col items-center text-center gap-4">
          <div className="bg-main/20 p-4 rounded-full">
            <ShieldCheckIcon className="h-12 w-12 text-main" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Protección de Datos Personales
          </h1>
          <p className="text-gray-300 max-w-xl text-sm md:text-base">
            En AUTOCOR nos comprometemos con la privacidad y seguridad de tu
            información personal, de acuerdo con la normativa vigente del
            Ecuador.
          </p>
        </div>
      </div>

      {/* PILARES */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-center text-xl font-semibold text-[#3F3F3F] mb-8">
            Nuestro compromiso contigo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pilares.map((p) => (
              <div
                key={p.titulo}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3"
              >
                <div className="bg-main/10 w-10 h-10 rounded-full flex items-center justify-center">
                  <p.icon className="h-5 w-5 text-main" />
                </div>
                <h3 className="font-semibold text-[#3F3F3F] text-sm">
                  {p.titulo}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {p.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DOCUMENTOS */}
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-[#3F3F3F] mb-2">
          Documentos
        </h2>

        {/* Política PDF — sin descarga */}
        <Acordeon
          icono={DocumentTextIcon}
          titulo="Política de Protección de Datos Personales"
          subtitulo="Haz clic para ver el documento completo"
        >
          <iframe
            src="/politica-proteccion-datos.pdf"
            className="w-full"
            style={{ height: "75vh", minHeight: "500px" }}
            title="Política de Protección de Datos Personales AUTOCOR"
          />
        </Acordeon>

        {/* Formulario Excel — con descarga */}
        <Acordeon
          icono={TableCellsIcon}
          titulo="Formulario Único de Derechos ARCO"
          subtitulo="Haz clic para ver el detalle y descargar"
          descarga={{
            href: "/formulario-derechos-arco.xlsx",
            label: "Descargar Formulario",
          }}
        >
          <div className="px-6 py-8 bg-white flex flex-col items-center gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-full">
              <TableCellsIcon className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-[#3F3F3F]">
                Formulario Único de Derechos ARCO
              </p>
              <p className="text-gray-500 text-sm mt-1 max-w-md">
                Utiliza este formulario para ejercer tus derechos de Acceso,
                Rectificación, Cancelación u Oposición sobre tus datos
                personales registrados en AUTOCOR.
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400 mt-2">
              <span>📋 Formato Excel (.xlsx)</span>
              <span>📁 FORMULARIO_UNICO_DERECHOS_ARCO</span>
            </div>
          </div>
        </Acordeon>
      </div>
    </Layout>
  );
}
