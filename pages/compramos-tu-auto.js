import Layout from "../components/Layout";
import Form from "../components/Form";
import Image from "next/image";
import { SectionText } from "../components/Shared";
import Link from "next/link";
import { useRef } from "react"; // Importar useRef

export default function Buy() {
  const formRef = useRef(null); // Crear una referencia para el formulario

  // Función para desplazar a la parte baja de la vista
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout selected="buy">
      <div className="bg-main h-80 py-20 px-8">
        <div className="flex max-w-7xl mx-auto relative h-full items-center">
          <Image
            src="/car-header-buy.png"
            alt=""
            width={700}
            height={360}
            className="hidden lg:flex absolute mt-16"
            priority
          />
          <div className="flex w-full justify-center lg:justify-end lg:mr-36">
            <SectionHeaderText />
          </div>
        </div>
      </div>
      <div className="bg-white pt-10 pb-20 flex flex-col justify-center items-center px-8">
        <SectionText
         // title="Proceso de compra" 
          subtitle="Vende tu vehículo en 4 pasos"
        />

<div className="flex flex-wrap gap-4 md:gap-1 items-center justify-center mx-auto py-4">
      <div onClick={scrollToForm} className="flex flex-col justify-center items-center cursor-pointer">
        <div className="w-28 p-2 bg-white shadow-lg mb-2">
          <Image src="/buy-contact.jpg" alt="" width={146} height={146} priority />
        </div>
        <p className="text-gray-800 text-sm font-bold">Contáctanos</p>
      </div>

      <div className="hidden md:flex items-center">
        <Image src="/link.png" alt="" width={100} height={25} />
      </div>

      <div onClick={scrollToForm} className="flex flex-col justify-center items-center cursor-pointer">
        <div className="w-28 p-2 bg-white shadow-lg mb-2">
          <Image src="/buy-evaluate.jpg" alt="" width={146} height={146} />
        </div>
        <p className="text-gray-800 text-sm font-bold">Evaluamos tu auto</p>
      </div>

      <div className="hidden md:flex items-center">
        <Image src="/link-2.png" alt="" width={100} height={25} />
      </div>

      <div onClick={scrollToForm} className="flex flex-col justify-center items-center cursor-pointer">
        <div className="w-28 p-2 bg-white shadow-lg mb-2">
          <Image src="/buy-proposal.jpg" alt="" width={146} height={146} />
        </div>
        <p className="text-gray-800 text-sm font-bold">Realizamos una propuesta</p>
      </div>

      <div className="hidden md:flex items-center">
        <Image src="/link.png" alt="" width={100} height={25} />
      </div>

      <div onClick={scrollToForm} className="flex flex-col justify-center items-center cursor-pointer">
        <div className="w-28 p-2 bg-white shadow-lg mb-2">
          <Image src="/buy-agree.jpg" alt="" width={146} height={146} />
        </div>
        <p className="text-gray-800 text-sm font-bold">Compramos tu auto</p>
      </div>
    </div>
      </div>

      <div ref={formRef} className="bg-gray-50 flex justify-center flex-col items-center py-10">
        <div className="flex justify-center -mt-20 w-96">
          <Image src="/car-buy.png" alt="" width={800} height={493} priority />
        </div>

        <div className="pb-10 flex flex-col justify-center items-center">
          <SectionText
            title="FORMULARIO DE REGISTRO"
            subtitle="FÁCIL Y RÁPIDO"
          />
          <p className="text-sm font-light max-w-2xl text-center text-gray-400 px-8">
            Ingresa la información solicitada y un asesor te contactará
          </p>
        </div>

        <div className="w-full px-6 z-20">
          <Form />
        </div>

        <div className="absolute w-56 right-24 flex justify-end">
          <Image
            className="-rotate-90 -mr-40"
            src="/autocor-bg.png"
            alt=""
            width={800}
            height={133}
            priority
          />
        </div>
      </div>
    </Layout>
  );
}

function SectionHeaderText() {
  return (
    <div className="pt-6 pb-2 px-6 sm:pt-8 sm:pb-4 lg:px-8">
      <div className="mx-auto max-w-4xl text-center flex flex-col justify-center items-center">
        <h2 className="text-3xl font-light uppercase tracking-tight text-white">
          La historia
        </h2>
        <p className="text-6xl uppercase font-black text-white font-poppins">
          De tu auto
        </p>

        <p className="mt-1 mb-4 text-3xl uppercase font-black leading-8 text-white font-poppins">
          Aún no termina
        </p>
        <IconArrow />
      </div>
    </div>
  );
}

function IconArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 106 61"
      className="w-6"
    >
      <path
        fill="#fff"
        fillRule="nonzero"
        d="M0-4.204l-5.401 5.401a.91.91 0 01-1.286 0l-5.401-5.401c-.573-.573-.168-1.552.642-1.552H-.643c.81 0 1.216.979.643 1.552"
        transform="translate(-2649.09 -1664.6) scale(8.33333) translate(330.247 205.508)"
      ></path>
    </svg>
  );
}
