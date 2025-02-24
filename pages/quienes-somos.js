import Layout from "../components/Layout";
import Image from "next/image";
import { SectionText } from "../components/Shared";

const stats = [
  { id: 1, name: "Autos en inventario", value: "+500", top: "" },
  { id: 2, name: "Autos Vendidos", value: "+15000", top: "" },
  { id: 3, name: "Agencias", value: "8", top: "" },
];

export default function About() {
  return (
    <Layout selected="about">
      <div className="bg-white pb-4 flex flex-col justify-center items-center px-8">
        <SectionText
          title="Conócenos"
          subtitle="Somos el concesionario de todas las marcas"
        />

        <div className="max-w-4xl mx-auto">
          {/* Primer bloque con imagen y texto */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4 py-8 text-center md:text-left">
            <div className="flex-shrink-0">
              <Image
                src={"/quines-somos-1.jpg"}
                alt="Imagen 1"
                width={500} // Cambié el tamaño a más pequeño
                height={300} 
                priority
              />
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
            
              <p className="text-main font-semibold">
                Somos un concesionario automotriz
              </p>
              <p className="text-gray-600">
                Dedicado a la comercialización de vehículos seminuevos de las
                mejores marcas del mercado.
              </p>
            </div>
          </div>

          {/* Segundo bloque con texto e imagen */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4 py-8 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              
              <p className="text-main font-semibold">
                Contamos con un personal altamente calificado
              </p>
              <p className="text-gray-600">
                Para brindar a nuestros clientes una atención personalizada que
                genere la mayor confianza y seguridad en la negociación.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Image
                src={"/quines-somos-2.jpg"}
                alt="Imagen 2"
                width={500} // Cambié el tamaño a más pequeño
                height={300}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white flex-col justify-center items-center px-8">
        <Stats />
      </div>

      <div className="bg-white flex justify-center flex-col items-center py-4">
        <div className="pb-10 flex-col justify-center items-center">
          <SectionText
            title="Nuestro diferencial"
            subtitle="¿Por qué elegirnos?"
          />
          <p className="py-2 max-w-2xl text-center text-gray-600 px-8">
            Nuestros clientes son el centro de nuestra empresa. Todas nuestras
            acciones y resultados se basan en sus beneficios, por eso, AUTOCOR
            se basa en valores importantes e inquebrantables.
          </p>
        </div>

        {/* Bloques de valores */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-1 items-center mx-auto py-4">
          <ValueBlock src="/integrity.jpg" text="Integridad" />
          <Image src="/link.png" alt="" width={100} height={25} className="hidden md:flex" />
          <ValueBlock src="/responsability.jpg" text="Responsabilidad y respeto" />
          <Image src="/link-2.png" alt="" width={100} height={25} className="hidden md:flex" />
          <ValueBlock src="/honesty.jpg" text="Honestidad y compromiso" />
          <Image src="/link.png" alt="" width={100} height={25} className="hidden md:flex" />
          <ValueBlock src="/service.jpg" text="Orientación al servicio" />
        </div>

        <div className="pt-16 px-8">
          <Image src="/autocor-bg.png" alt="" width={800} height={133} />
        </div>
      </div>
    </Layout>
  );
}

// Bloque de valores para reutilizar código
function ValueBlock({ src, text }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-28 p-2 bg-white shadow-lg mb-2">
        <Image src={src} alt={text} width={100} height={100} /> {/* Imagen más pequeña */}
      </div>
      <p className="text-gray-800 text-sm font-bold">{text}</p>
    </div>
  );
}

// Componente de estadísticas
function Stats() {
  return (
    <div className="py-2">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-secondary py-10 overflow-x-hidden">
          <dl className="grid grid-cols-1 gap-y-16 gap-x-8 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="mx-auto flex max-w-xs flex-col justify-center"
              >
                <dt className="order-last text-2xl w-32 font-light leading-none text-gray-200">
                  {stat.name}
                </dt>
                <dd className="order-first text-lg w-32 text-left pb-0 font-light leading-none text-gray-200">
                  {stat.top}
                </dd>
                <dd className="text-4xl font-black text-white sm:text-6xl">
                  {stat.value}
                </dd>
              </div>
            ))}
            <div className="-m-10 lg:flex flex-col hidden">
              <Image
                className="rounded-md"
                src="/auto-agencias.png"
                alt=""
                width={600} // Reducido el tamaño
                height={318}
              />
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}



function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 336 321"
      className="w-10 p-1"
    >
      <path
        fill="#E43D30"
        fillRule="nonzero"
        d="M0-71.364l9.023 27.77c.287.885 1.072 1.542 2.025 1.542h29.199l-1.059-3.913a483520.36 483520.36 0 00-23.623 17.163c-.734.532-1.271 1.431-.965 2.371l9.023 27.77 3.085-2.371L3.085-18.195c-.548-.398-1.572-.398-2.12 0A483520.36 483520.36 0 01-22.658-1.032l3.085 2.371 9.023-27.77c.309-.95-.228-1.836-.965-2.371a483520.36 483520.36 0 00-23.623-17.163l-1.059 3.913h29.199c.958 0 1.738-.658 2.025-1.542l9.023-27.77C4.887-73.941.833-75.044 0-72.48l-9.023 27.77 2.025-1.542h-29.199c-2.23 0-2.662 2.75-1.06 3.913l23.622 17.163-.965-2.371-9.023 27.77c-.536 1.649 1.591 3.457 3.085 2.371L3.085-14.568H.965L24.588 2.594c1.488 1.082 3.624-.711 3.085-2.371l-9.023-27.77-.965 2.371 23.622-17.163c1.601-1.162 1.174-3.913-1.06-3.913H11.048l2.025 1.542L4.05-72.48C3.218-75.04-.839-73.945 0-71.364"
        transform="translate(-1093.05 -4175.7) scale(4.16667) translate(300.55 1076.11)"
      ></path>
    </svg>
  );
}

function CarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 514 242"
      className="w-12 p-1"
    >
      <path
        fill="#E43D30"
        fillRule="nonzero"
        d="M0 10.651c-12.265.36-21.548.504-28.67.493V-2.557a2.057 2.057 0 10-4.116 0v13.676c-16.289-.192-18.88-1.367-21.403-2.516-.666-.303-1.355-.617-2.252-.927a2.058 2.058 0 00-1.346 3.89c.713.247 1.286.508 1.892.784 3.377 1.537 6.404 2.916 27.874 2.916 7.123 0 16.276-.152 28.142-.5a2.058 2.058 0 001.997-2.118C2.084 11.512 1.124 10.63 0 10.651"
        transform="translate(-4135.18 -2160.2) scale(4.16667) translate(1086.58 530.33)"
      ></path>
      <path
        fill="#E43D30"
        fillRule="nonzero"
        d="M0 29.753h-6.513c-.98-5.633-5.893-9.935-11.802-9.935s-10.822 4.302-11.801 9.935h-32.046c-.979-5.633-5.892-9.935-11.802-9.935-5.909 0-10.822 4.302-11.801 9.935H-96.89c.527-13.928 12.348-17.853 21.054-20.715 1.393-.457 2.692-.886 3.839-1.316 3.296-1.24 5.993-3.806 8.849-6.523 5.484-5.217 11.699-11.13 24.731-11.13 13.997 0 24.381 3.883 30.862 11.541C.773 11.45.424 25.013 0 29.753m-18.315 9.93c-4.341 0-7.874-3.532-7.874-7.874s3.533-7.874 7.874-7.874c4.342 0 7.875 3.532 7.875 7.874s-3.533 7.874-7.875 7.874m-55.649 0c-4.33 0-7.852-3.512-7.872-7.837 0-.012.003-.023.003-.035 0-.012-.003-.023-.004-.036.019-4.326 3.542-7.84 7.873-7.84 4.333 0 7.857 3.516 7.874 7.845-.001.011-.004.021-.004.031 0 .011.003.02.003.031-.017 4.327-3.541 7.841-7.873 7.841M4.011 19.818C3.302 13.407 1.172 5.564-4.39-1.022c-7.298-8.642-18.747-13.025-34.027-13.025-14.678 0-21.825 6.8-27.568 12.264-2.655 2.525-4.948 4.706-7.461 5.651-1.098.413-2.342.821-3.675 1.259-9.532 3.134-23.936 7.869-23.936 25.573 0 .194.035.378.086.556a1.993 1.993 0 00-.086.555c0 1.138.921 2.059 2.058 2.059h13.234c.981 5.631 5.893 9.93 11.801 9.93s10.82-4.299 11.802-9.93h32.047c.981 5.631 5.892 9.93 11.8 9.93s10.82-4.299 11.801-9.93H1.83a2.06 2.06 0 002.029-1.714c.054-.321.579-3.572.442-8.221"
        transform="translate(-4135.18 -2160.2) scale(4.16667) translate(1093.5 532.496)"
      ></path>
      <path
        fill="#E43D30"
        fillRule="nonzero"
        d="M16.945-16.945C7.587-16.945 0-9.358 0 0s7.587 16.945 16.945 16.945C26.304 16.945 33.89 9.358 33.89 0s-7.586-16.945-16.945-16.945"
        transform="translate(-4135.18 -2160.2) scale(4.16667) matrix(0 1 1 0 1098.7 522.937)"
      ></path>
      <path
        fill="#fff"
        fillRule="nonzero"
        d="M0 6.585l4.401 4.401c.674.674 1.82.675 2.496 0L18.854-.972c1.608-1.608-.887-4.104-2.495-2.495L4.401 8.491h2.496L2.495 4.089C.887 2.481-1.609 4.976 0 6.585"
        transform="translate(-4135.18 -2160.2) scale(4.16667) translate(1089.39 536.253)"
      ></path>
    </svg>
  );
}
