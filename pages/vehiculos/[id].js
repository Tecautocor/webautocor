import Features from "../../components/Features";
import Layout from "../../components/Layout";
import Pricing from "../../components/Pricing";
import BudgetTool from "../../components/BudgetTool";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useState, useEffect, useref } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AnimationOnScroll } from "react-animation-on-scroll";
import { XMarkIcon } from "@heroicons/react/24/outline";
//import FormWA from "../../components/FormWA";
import FormReservar from "../../components/FormReservar";
import Head from "next/head";

import {
  useGetStockDetailsQuery,
  useGetStockImagesQuery,
} from "../../lib/hooks";
import { SectionText, Spinner, LinkButton } from "../../components/Shared";
import { calcCuotaXMeses, calcCuota48Meses } from "../../lib/utils";

export default function Details() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openR, setOpenR] = useState(false);
  const [amount, setAmount] = useState(0);
  const [time, setTime] = useState(12);
  const [slide, setSlide] = useState("/foto-autocor.jpg"); // Imagen por defecto

  const { data, isLoading, isError } = useGetStockDetailsQuery(router.query.id);
  const { data: dataImages } = useGetStockImagesQuery(router.query.id);


  const [fullImageOpen, setFullImageOpen] = useState(false); // Estado para imagen a pantalla completa
  const [isZoomed, setIsZoomed] = useState(false); // Estado para el zoom
  const toggleZoom = () => {
    setIsZoomed((prev) => !prev); // Cambia entre hacer zoom y no
  };
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la imagen actual

  useEffect(() => {
    if (!dataImages || dataImages.result.entitydata.length === 0) {
      return; // Mantiene la imagen por defecto si no hay imágenes
    }

    const desktopImage = dataImages.result.entitydata.find(
      (photo) => photo.size === "desktop"
    );

    if (desktopImage) {
      setSlide(desktopImage.full_path); // Establece la imagen disponible
    } else {
      setSlide("/foto-autocor.jpg"); // Imagen por defecto si no hay imágenes de escritorio
    }
  }, [dataImages]);

  useEffect(() => {
    if (data) {
      setAmount(Number(data.result.entitydata.prices[0].value) / 2);
    }
  }, [data]);

  // Función para ir a la imagen anterior
  const prevImage = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex === 0) {
        return dataImages.result.entitydata.filter(photo => photo.size === "desktop").length - 1; // Ir a la última imagen
      }
      return prevIndex - 1; // Ir a la imagen anterior
    });
  };

  // Función para ir a la siguiente imagen
  const nextImage = () => {
    setCurrentIndex((prevIndex) => {
      const totalImages = dataImages.result.entitydata.filter(photo => photo.size === "desktop").length;
      return (prevIndex + 1) % totalImages; // Volver al inicio si está en la última imagen
    });
  };

  // Al actualizar la imagen a mostrar
  useEffect(() => {
    if (dataImages && dataImages.result.entitydata.length > 0) {
      const desktopImages = dataImages.result.entitydata.filter(photo => photo.size === "desktop");
      setSlide(desktopImages[currentIndex]?.full_path || "/foto-autocor.jpg");
    }
  }, [currentIndex, dataImages]);




  if (data) {
    return (
      <Layout selected="vehicles">
        <Head>
          <title>{`AUTOCOR | ${data.result.entitydata.brand} ${data.result.entitydata.model}`}</title>
          <meta property="og:title" content={`AUTOCOR | ${data.result.entitydata.brand} ${data.result.entitydata.model}`} />
          <meta property="og:description" content={`Año: ${data.result.entitydata.year}. Precio: $${new Intl.NumberFormat("es-EC", { maximumFractionDigits: 0 }).format(data.result.entitydata.prices[0].value)}`} />
          <meta property="og:image" content={slide} />
        </Head>
        {isLoading && (
          <p className="bg-white flex justify-center flex-col items-center pt-4 pb-10 px-8 h-screen">
            <Spinner />
          </p>
        )}
        {isError && (
          <div className="flex justify-center items-center pt-4 pb-10 px-8 gap-2 h-screen">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>

            <p className="bg-white text-red-700 flex justify-center flex-col items-center">
              Ha ocurrido un error. Por favor actualice la pantalla.
            </p>
          </div>
        )}

        {!isLoading && !isError && data && (
          <div className=" bg-white">
            <div className="max-w-7xl mx-auto flex justify-center flex-col items-center pt-10 pb-24 px-8">
              <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-10 justify-center items-center">
                <div className="w-96 lg:w-[600px] h-96 lg:h-[600px]">
                  {/* Contenedor de la imagen en vista normal */}
                  <div className="w-96 lg:w-[600px] h-96 lg:h-[600px] relative">
                    <Image
                      className="object-cover cursor-pointer" // Añadir cursor pointer
                      src={slide}
                      alt="Imagen del vehículo"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onClick={() => setFullImageOpen(true)} // Abrir imagen a pantalla completa
                    />

                    {/* Barra con números en la parte inferior */}
                    <div className="absolute bottom-0 w-full flex justify-center items-center p-2">
                      <p className="text-white font-bold text-xl">
                        {currentIndex + 1} / {dataImages?.result.entitydata.filter(photo => photo.size === "desktop").length}
                      </p>
                    </div>

                    {/* Botones de navegación */}
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-transparent text-white rounded-full p-2 text-4xl shadow"
                    >
                      <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent text-white rounded-full p-2 text-4xl shadow"
                    >
                      <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                  </div>

                  <div className="relative flex items-center py-1 w-full overflow-hidden border">
                    <div
                      className="flex border items-center flex-grow"
                      style={{
                        width: `${dataImages?.result?.entitydata.filter(photo => photo.size === "desktop").length * 112}px`,
                        transform: `translateX(-${Math.max(0, Math.min(currentIndex - (window.innerWidth < 640 ? 2 : 3), dataImages?.result?.entitydata.filter(photo => photo.size === "desktop").length - (window.innerWidth < 640 ? 4 : 5)) * 112 - 37)}px)` // Cambia a 3 o 4 según el ancho
                      }}
                    >
                      {dataImages?.result?.entitydata.length > 0
                        ? dataImages.result.entitydata
                          .filter(photo => photo.size === "desktop")
                          .map((listItem, index) => (
                            <div
                              key={listItem.id}
                              className={`w-40 h-32 border cursor-pointer relative ${index === currentIndex ? 'ring-2 ring-red-500 ring-offset-2 z-10' : ''} transition-all duration-200`}
                              onClick={() => {
                                setSlide(listItem.full_path);
                                setCurrentIndex(index);
                              }}
                            >
                              <Image
                                className="object-cover w-full h-full"
                                src={listItem.full_path}
                                alt="Miniatura del vehículo"
                                fill
                                priority
                              />
                            </div>
                          ))
                        : null}
                    </div>

                    <button
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent p-2 rounded h-full z-10"
                      onClick={() => {
                        const totalImages = dataImages?.result?.entitydata.filter(photo => photo.size === "desktop").length || 0;
                        if (totalImages > 0) {
                          const newIndex = currentIndex === 0 ? totalImages - 1 : currentIndex - 1;
                          setCurrentIndex(newIndex);
                        } else {
                          console.error("No hay imágenes disponibles."); // Log para depuración
                        }
                      }}
                    >
                      <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent p-2 rounded h-full z-10"
                      onClick={() => {
                        const totalImages = dataImages?.result?.entitydata.filter(photo => photo.size === "desktop").length || 0;
                        const newIndex = (currentIndex + 1) % totalImages; // Regresa a la primera imagen
                        setCurrentIndex(newIndex);
                      }}
                    >
                      <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>





                <div className="mt-20 lg:mt-0 sm:mt-16 md:mt-20 pt-12">
                  <p className="text-gray-500 text-lg lg:text-2xl text-center lg:text-left">
                    Año {data.result.entitydata.year}
                  </p>
                  <p className="text-black font-bold uppercase text-2xl lg:text-4xl text-center lg:text-left">
                    {data.result.entitydata.brand +
                      " " +
                      data.result.entitydata.model}
                  </p>
                  <p className="text-gray-500 text-lg lg:text-2xl text-center lg:text-left">
                    Agencia{" "}
                    {data.result.entitydata.owner_branch_code?.name ||
                      "No disponible"}
                  </p>
                  <p className="text-main  text-3xl lg:text-5xl font-bold mt-6 text-center lg:text-left">
                    ${" "}
                    {new Intl.NumberFormat("es-EC", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(data.result.entitydata.prices[0].value | 0)}
                  </p>
                  <p className="text-gray-500  text-xl lg:text-2xl mt-2 text-center lg:text-left">
                    ${" "}
                    {new Intl.NumberFormat("es-EC", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(
                      calcCuota48Meses(
                        Number(data.result.entitydata.prices[0].value)
                      ) | 0
                    )}
                    <span className="text-lg">/mes</span>
                  </p>
                  <div className="flex flex-col md:flex-row justify-center lg:justify-start gap-2 pt-4">

                    <button
                      onClick={() => {
                        const phoneNumber = "593998208817";
                        const currentUrl = window.location.href; // Obtiene la URL actual
                        const year = data.result.entitydata.year;
                        const brand = data.result.entitydata.brand;
                        const model = data.result.entitydata.model;
                        const agency = data.result.entitydata.owner_branch_code?.name || "No disponible";
                        const price = new Intl.NumberFormat("es-EC", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(data.result.entitydata.prices[0]?.value || 0); // Asegúrate de que la propiedad exista
                        const message = `¡Hola Autocor!! \n\nMe interesa este auto:\n\nMarca:${brand}\nModelo: ${model}\nAño: ${year}\nPrecio: $${price}\nAgencia: ${agency}\n\n${currentUrl}`;
                        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, "_blank");
                      }}
                      className="py-2 gap-2 px-4 hover:shadow-lg flex items-center border-green-600 bg-green-600 text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-green-600 hover:text-green-600 transition-colors group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="29px" height="29px" fill-rule="evenodd" clip-rule="evenodd"><path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z" /><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z" /><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z" /><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z" /><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd" /></svg>

                      <span className="ml-6 sm:ml-4 md:ml-2 lg:ml-0">AGENDAR</span>


                    </button>

                    <button
                      onClick={() => setOpenR(true)}
                      className="py-2 gap-2 px-4 hover:shadow-lg flex items-center justify-center border-main bg-main text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-main hover:text-main transition-colors group"
                    >
                      <p className="text-center">Reservar</p>{" "}

                    </button>

                    <LinkButton title="FINANCIAR" link="#budget" />

                  </div>
                </div>
                <Transition.Root show={openR} as={Fragment}>
                  <Dialog as="div" className="relative z-10" onClose={setOpenR}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                              <button
                                type="button"
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2"
                                onClick={() => setOpenR(false)}
                              >
                                <span className="sr-only">Close</span>
                                <XMarkIcon
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                            <div>
                              <div className=" text-center">
                                <SectionText
                                  title="DÉJANOS TUS DATOS"
                                  subtitle="UN ASESOR TE CONTACTARÁ DE INMEDIATO"
                                />
                                <div className="mt-2">
                                  <FormReservar
                                    time={time}
                                    id={data.result.entitydata.id}
                                    initialPayment={amount}
                                    monthlyPayment={calcCuotaXMeses(
                                      amount,
                                      time
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition.Root>
              </div>
            </div>




            <div className="bg-white flex justify-center flex-col items-center lg:pt-12 pb-10">
              <div className="pb-10 flex-col justify-center items-center">
                <SectionText
                  title="Especificaciones"
                  subtitle="¿Por qué elegir este auto?"
                />

                <Features info={data.result.entitydata} />
              </div>
            </div>

            <div className="bg-white pt-4 pb-10 flex-col justify-center items-center">
              <SectionText
                title="Financiamiento"
                subtitle="Plazos adaptados a tus necesidades"
              />

              <Pricing value={data.result.entitydata.prices[0].value} />
            </div>

            <div
              className="bg-white pb-10 flex-col justify-center items-center"
              id="budget"
            >
              <BudgetTool
                value={data.result.entitydata.prices[0].value}
                amount={amount}
                setAmount={(value) => setAmount(value)}
                time={time}
                setTime={(value) => setTime(value)}
              />
            </div>

            <div className="bg-white flex max-w-7xl pt-4 pb-10 mx-auto">
              <div className="pb-10 flex flex-1 justify-center">
                <div className="flex flex-col flex-1 max-w-7xl">
                  <SectionText title="" subtitle="Observaciones" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl">
                    <div className="shadow-lg py-4 px-12 flex flex-col items-center">
                      <Image
                        src="/pre-approval-image.png"
                        alt=""
                        width={397 / 2}
                        height={460 / 2}
                        className="px-10 py-6"
                      />
                      <p className="font-bold text-center">
                        AUTOCOR, el concesionario de todas las marcas, tiene
                        para ti más de 500 seminuevos GARANTIZADOS.
                      </p>
                    </div>

                    <div className="shadow-lg py-4 px-12 flex flex-col items-center">
                      <Image
                        src="/agile-image.png"
                        alt=""
                        width={534 / 2}
                        height={326 / 2}
                        className="px-10 py-6"
                      />
                      <p className="font-bold text-center">
                        En nuestro amplio inventario tenemos vehículos en
                        perfecto estado, cero choques, excelentes mantenimientos
                        y documentos en regla.
                      </p>
                    </div>

                    <div className="shadow-lg py-4 px-12 flex flex-col items-center">
                      <Image
                        src="/tax-image.png"
                        alt=""
                        width={469 / 2}
                        height={453 / 2}
                        className="px-10 py-6"
                      />
                      <p className="font-bold text-center">
                        Ofrecemos garantía de procedencia y de kilometraje.
                      </p>
                    </div>

                    <div className="shadow-lg py-4 px-12 flex flex-col items-center">
                      <Image
                        src="/card-image.png"
                        alt=""
                        width={523 / 2}
                        height={456 / 2}
                        className="px-10 py-6"
                      />
                      <div>
                        <p className="font-bold text-center">
                          Ademas tenemos crédito con todas las instituciones
                          financieras con el 25% de entrada hasta 48 meses plazo
                          y recibimos también todas las tarjetas de crédito.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {fullImageOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 cursor-pointer"
            onClick={() => setFullImageOpen(false)} // Cierra al hacer clic en el fondo
          >
            {/* Barra de herramientas superpuesta */}
            <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-75 flex justify-between items-center p-2 z-50">
              <div className="ml-auto flex items-center gap-4">
                <button
                  className="text-white"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que el clic cierre la vista
                    toggleZoom(); // Alternar zoom
                  }}
                >
                  <Image src={isZoomed ? "/icons/lupa-positiva.png" : "/icons/lupa-negativa.png"} alt={isZoomed ? 'Zoom Out' : 'Zoom In'} className="w-6 h-6" />
                </button>
                <button
                  className="text-white"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que el clic cierre la vista
                    const imgContainer = document.getElementById('zoom-image').parentElement; // Contenedor de la imagen
                    if (document.fullscreenElement) {
                      document.exitFullscreen();
                    } else {
                      imgContainer.requestFullscreen().catch(err => {
                        console.error("Error intentando entrar en pantalla completa:", err);
                      });
                    }
                  }}
                >
                  <Image src="/icons/pantalla completa.png" alt="Pantalla Completa" className="w-6 h-6" />
                </button>
                <button
                  className="text-white"
                  onClick={() => setFullImageOpen(false)} // Cerrar imagen
                >
                  <Image src="/icons/x.png" alt="Cerrar" className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center mt-10"
              onClick={(e) => e.stopPropagation()}>
              <div className="w-full h-full max-w-[1298px] max-h-[865px] overflow-hidden flex items-center justify-center relative">
                <div className="absolute top-2 right-2 flex">
                  <button
                    className="text-white mr-4"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que el clic cierre la vista
                      toggleZoom(); // Alternar zoom
                    }}
                  >
                    <Image src={isZoomed ? "/icons/lupa-positiva.png" : "/icons/lupa-negativa.png"} alt={isZoomed ? 'Zoom Out' : 'Zoom In'} className="w-6 h-6" />
                  </button>
                  <button
                    className="text-white mr-4"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que el clic cierre la vista
                      const imgContainer = document.getElementById('zoom-image').parentElement; // Contenedor de la imagen
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        imgContainer.requestFullscreen().catch(err => {
                          console.error("Error intentando entrar en pantalla completa:", err);
                        });
                      }
                    }}
                  >
                    <Image src="/icons/pantalla completa.png" alt="Pantalla Completa" className="w-6 h-6" />
                  </button>
                  <button
                    className="text-white"
                    onClick={() => setFullImageOpen(false)} // Cerrar imagen
                  >
                    <Image src="/icons/x.png" alt="Cerrar" className="w-6 h-6" />
                  </button>
                </div>

                <button onClick={prevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-transparent rounded-full p-2 z-10">
                  <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M15 5l-7 7 7 7" />
                  </svg>
                </button>

                <button onClick={nextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-transparent rounded-full p-2 z-10">
                  <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <Image
                  id="zoom-image"
                  className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom'}`}
                  src={slide}
                  alt="Imagen ampliada del vehículo"
                  width={1296} // Usa un ancho responsivo
                  height={864} // Usa una altura responsiva
                  onClick={(e) => {
                    e.stopPropagation(); // Evita que el clic en la imagen cierre la vista
                    toggleZoom(); // Alternar zoom al hacer clic
                  }}
                />

                {/* Barra Oscura en la Parte Inferior */}
                <div className="w-full bg-black flex justify-center items-center p-2 fixed bottom-0">
                  <p className="text-white">
                    {currentIndex + 1} / {dataImages?.result.entitydata.filter(photo => photo.size === "desktop").length}
                  </p>
                </div>
              </div>
            </div>

            {/* Barra oscura en la parte inferior */}
            <div className="w-full bg-black flex justify-center items-center p-2 fixed bottom-0">
              <p className="text-white">
                {currentIndex + 1} / {dataImages?.result.entitydata.filter(photo => photo.size === "desktop").length}
              </p>
            </div>
          </div>
        )}

      </Layout>
    );
  }

  return null;
}

export function IconArrow({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 78 136"
      className={className}
    >
      <path
        fillRule="nonzero"
        d="M0-15.515l6.932 6.932a1.167 1.167 0 010 1.651L0 0c-.735.735-1.992.214-1.992-.825V-14.69c0-1.04 1.257-1.56 1.992-.825"
        transform="translate(-9082.92 -19967.5) scale(8.33333) translate(1091.94 2411.96)"
      ></path>
    </svg>
  );
}
