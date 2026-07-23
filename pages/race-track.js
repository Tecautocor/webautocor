import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { ErrorMessage, Field, Form as FormikForm, Formik } from "formik";
import {
  ShieldCheckIcon,
  TruckIcon,
  BanknotesIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import { RaceTrackSchema } from "../lib/models";
import { Spinner } from "../components/Shared";

const features = [
  { icon: ShieldCheckIcon, label: "Confianza Garantizada" },
  { icon: TruckIcon, label: "+500 Seminuevos" },
  { icon: BanknotesIcon, label: "Financiamiento" },
  { icon: TagIcon, label: "Los mejores precios" },
];

const fireworks = [
  { top: "-16px", left: "-10%", color: "#fbbf24", delay: "0s", tx: "-30px", ty: "-24px" },
  { top: "-20px", left: "20%", color: "#f87171", delay: "0.2s", tx: "-6px", ty: "-32px" },
  { top: "-18px", left: "50%", color: "#34d399", delay: "0.4s", tx: "10px", ty: "-30px" },
  { top: "-14px", left: "80%", color: "#60a5fa", delay: "0.6s", tx: "30px", ty: "-20px" },
  { top: "-6px", left: "100%", color: "#facc15", delay: "0.8s", tx: "34px", ty: "0px" },
  { top: "10px", left: "95%", color: "#a78bfa", delay: "1s", tx: "28px", ty: "20px" },
  { top: "14px", left: "60%", color: "#f472b6", delay: "1.2s", tx: "12px", ty: "26px" },
  { top: "16px", left: "25%", color: "#fb923c", delay: "1.4s", tx: "-14px", ty: "24px" },
  { top: "8px", left: "-8%", color: "#38bdf8", delay: "1.6s", tx: "-30px", ty: "10px" },
];

export default function RaceTrack() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function createRecord(record, resetForm) {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);

    try {
      await axios({
        method: "POST",
        url: "/api/raceTrackForm",
        data: record,
      });

      setIsLoading(false);
      setIsSuccess(true);
      resetForm();
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  }

  return (
    <>
      <Head>
        <title>Race Track | AUTOCOR</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Fondo con degradado rojo/negro */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-black" />
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] sm:-top-40 sm:-left-40 sm:w-[600px] sm:h-[600px] bg-main/20 rounded-full blur-3xl" />

        <div className="absolute top-8 left-4 z-20 animate__animated animate__pulse animate__infinite animate__slow">
          <span className="inline-flex items-center gap-3">
            <svg
              viewBox="0 0 30 20"
              className="w-14 h-9 sm:w-16 sm:h-10 shrink-0 shadow-lg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="0" width="30" height="4" fill="#75AADB" />
              <rect x="0" y="4" width="30" height="4" fill="#ffffff" />
              <rect x="0" y="8" width="30" height="4" fill="#75AADB" />
              <rect x="0" y="12" width="30" height="4" fill="#ffffff" />
              <rect x="0" y="16" width="30" height="4" fill="#75AADB" />
              {[9, 15, 21].map((cx) => (
                <g key={cx} transform={`translate(${cx - 1.6}, 8.4) scale(0.032)`}>
                  <path
                    d="M50 5 L61 39 L98 39 L68 60 L79 95 L50 73 L21 95 L32 60 L2 39 L39 39 Z"
                    fill="#ffffff"
                  />
                </g>
              ))}
            </svg>
            <span className="relative inline-block">
              <span className="relative z-10 text-white text-base sm:text-lg font-bold uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                ¡Viva Guayaquil!
              </span>
              {fireworks.map((fw, i) => (
                <span
                  key={i}
                  className="firework-spark"
                  style={{
                    top: fw.top,
                    left: fw.left,
                    background: fw.color,
                    boxShadow: `0 0 10px 4px ${fw.color}`,
                    animationDelay: fw.delay,
                    "--tx": fw.tx,
                    "--ty": fw.ty,
                  }}
                />
              ))}
              <style jsx>{`
                .firework-spark {
                  position: absolute;
                  width: 7px;
                  height: 7px;
                  border-radius: 50%;
                  opacity: 0;
                  animation: fw-spark 1.8s ease-out infinite;
                }
                @keyframes fw-spark {
                  0% {
                    transform: translate(0, 0) scale(0.3);
                    opacity: 1;
                  }
                  70% {
                    opacity: 1;
                  }
                  100% {
                    transform: translate(var(--tx), var(--ty)) scale(1);
                    opacity: 0;
                  }
                }
              `}</style>
            </span>
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12 w-full min-w-0">
          <div className="flex justify-end">
            <Image
              src="/logo-autocor.png"
              alt="AUTOCOR"
              width={165}
              height={75}
              priority
              unoptimized
              className="h-auto w-24 sm:w-[165px]"
            />
          </div>

          <div className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda: hero */}
            <div className="min-w-0">
              <span className="inline-block bg-main/20 border border-main text-main text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full">
                Evento Exclusivo
              </span>

              <h1 className="mt-6 font-poppins font-black uppercase text-4xl sm:text-6xl lg:text-8xl leading-none text-white drop-shadow-[0_0_25px_rgba(228,61,48,0.5)] break-words">
                Race Track
              </h1>

              <p className="mt-6 text-base sm:text-lg text-white/70 font-light">
                Ponte al volante y siente la adrenalina en la pista.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3 min-w-0"
                  >
                    <Icon className="w-5 h-5 text-main shrink-0" />
                    <span className="text-white text-sm font-medium">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna derecha: formulario */}
            <div className="min-w-0 bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
              <h2 className="font-poppins font-bold text-2xl text-white">
                Regístrate
              </h2>
              <p className="mt-1 text-sm text-white/60">
                Completa tus datos para participar.
              </p>

              {isSuccess ? (
                <p className="mt-8 font-bold text-white text-center">
                  ¡Tu registro fue enviado correctamente! Nos pondremos en
                  contacto contigo.
                </p>
              ) : (
                <Formik
                  initialValues={{
                    name: "",
                    lastname: "",
                    phone: "",
                    email: "",
                    aceptaPolitica: false,
                    autorizaDatos: false,
                  }}
                  validationSchema={RaceTrackSchema}
                  onSubmit={(values, { resetForm }) => {
                    createRecord(values, resetForm);
                  }}
                >
                  <FormikForm noValidate className="mt-6 flex flex-col gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white"
                      >
                        Nombre
                      </label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Tu nombre"
                          className="block w-full rounded-md font-light border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-white/40 shadow-sm focus:border-main focus:ring-main"
                        />
                        <ErrorMessage name="name">
                          {(msg) => (
                            <div className="mt-1 px-1 text-xs text-main font-semibold">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lastname"
                        className="block text-sm font-medium text-white"
                      >
                        Apellido
                      </label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="lastname"
                          id="lastname"
                          placeholder="Tu apellido"
                          className="block w-full rounded-md font-light border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-white/40 shadow-sm focus:border-main focus:ring-main"
                        />
                        <ErrorMessage name="lastname">
                          {(msg) => (
                            <div className="mt-1 px-1 text-xs text-main font-semibold">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-white"
                      >
                        Celular
                      </label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="phone"
                          id="phone"
                          autoComplete="tel"
                          placeholder="09XXXXXXXX"
                          className="block w-full rounded-md font-light border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-white/40 shadow-sm focus:border-main focus:ring-main"
                        />
                        <ErrorMessage name="phone">
                          {(msg) => (
                            <div className="mt-1 px-1 text-xs text-main font-semibold">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white"
                      >
                        Correo electrónico
                      </label>
                      <div className="mt-1">
                        <Field
                          type="text"
                          name="email"
                          id="email"
                          placeholder="correo@ejemplo.com"
                          className="block w-full rounded-md font-light border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-white/40 shadow-sm focus:border-main focus:ring-main"
                        />
                        <ErrorMessage name="email">
                          {(msg) => (
                            <div className="mt-1 px-1 text-xs text-main font-semibold">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>

                    {/* Aviso de privacidad */}
                    <div className="border-l-2 border-white/20 pl-4 py-1">
                      <p className="text-xs text-white/60 leading-relaxed">
                        <span className="font-semibold text-white/80">
                          Aviso de Privacidad —
                        </span>{" "}
                        AUTOCOR tratará los datos personales ingresados con la
                        finalidad de gestionar tu participación en este
                        evento. Los datos serán tratados conforme a la LOPDP.
                        Para más información consulta nuestra{" "}
                        <Link
                          href="/proteccion-de-datos"
                          target="_blank"
                          className="text-white underline hover:text-gray-200"
                        >
                          Política de Protección de Datos Personales
                        </Link>
                        .
                      </p>
                    </div>

                    {/* Checkboxes de consentimiento */}
                    <div className="flex flex-col gap-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <Field
                          type="checkbox"
                          name="aceptaPolitica"
                          id="aceptaPolitica"
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-main cursor-pointer"
                        />
                        <span className="text-xs text-white/80 leading-relaxed">
                          Acepto el tratamiento de mis datos personales
                          conforme a la{" "}
                          <Link
                            href="/proteccion-de-datos"
                            target="_blank"
                            className="text-white underline hover:text-gray-200"
                          >
                            Política de Protección de Datos
                          </Link>{" "}
                          de AUTOCOR
                        </span>
                      </label>
                      <ErrorMessage name="aceptaPolitica">
                        {(msg) => (
                          <div className="px-1 text-xs text-main font-semibold">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <Field
                          type="checkbox"
                          name="autorizaDatos"
                          id="autorizaDatos"
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-main cursor-pointer"
                        />
                        <span className="text-xs text-white/80 leading-relaxed">
                          Autorizo que se traten mis datos personales para
                          enviarme información comercial y/o sobre servicios
                          de AUTOCOR
                        </span>
                      </label>
                      <ErrorMessage name="autorizaDatos">
                        {(msg) => (
                          <div className="px-1 text-xs text-main font-semibold">
                            {msg}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-2 w-full py-3 px-4 bg-main hover:bg-red-700 text-white font-bold uppercase tracking-wide rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isLoading ? (
                        <span className="flex h-5 w-5 items-center justify-center">
                          <Spinner />
                        </span>
                      ) : (
                        "Continuar"
                      )}
                    </button>

                    {isError && (
                      <div className="text-center text-sm font-semibold text-main">
                        Lo sentimos, hubo un error. Intenta nuevamente.
                      </div>
                    )}
                  </FormikForm>
                </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
