import Layout from "../components/Layout";
import Image from "next/image";
import Maps from "../components/Maps";
import { useListPhonesQuery } from "../lib/hooks";

const agencias = [
  {
    id: 1,
    src: "/autocor-local-3.jpg",
    name: "Autocor Matriz Av. 6 de Diciembre",
    address: "Av. 6 de diciembre SN N61 y Santa Lucia",
    time: "Lunes a Viernes de 08:00 a 18:00, Sábado de 09:00 a 17:00 y Domingo de 10:00 a 14:00",
    location: { latitude: -0.12705068988192195, longitude: -78.47793321363118 },
    phoneKey: "agencia_matriz",
    phone: "+593 99 965 3587"
  },
  {
    id: 2,
    src: "/autocor-local-cumbaya.jpg",
    name: "Autocor Cumbaya",
    address: "Av. Oswaldo Guayasamín",
    time: "Lunes a Viernes de 9:00 a 18:30; Sábado de 09:00 a 17:00 y Domingo de 10:00 a 14:00",
    location: { latitude: -0.20599, longitude: -78.43362 },
    phoneKey: "agencia_cumbaya",
    phone: "+593 99 043 6699"
  },
  {
    id: 3,
    src: "/autocor-local-5.jpg",
    name: "Autocor Shyris",
    address: "Av. De Los Shyris y El Universo E8-40",
    time: "Lunes a Viernes de 08:00 a 18:00, Sábado de 09:00 a 17:00 y Domingo de 10:00 a 14:00",
    location: { latitude: -0.17091753257295517, longitude: -78.48016468479545 },
    phoneKey: "agencia_shyris",
    phone: "+593 98 300 5861"
  },
  {
    id: 4,
    src: "/autocor-local-4.jpg",
    name: "Autocor Eloy Alfaro",
    address:
      "Av. Eloy Alfaro E14 - 65 y Camilo Gallegos, esquina (una cuadra antes de la Av. De los Granados).",
    time: "Lunes a Viernes de 08:00 a 19:00, Sábado de 09:00 a 17:00 y Domingo de 10:00 a 14:00.",
    location: { latitude: -0.16664207649076915, longitude: -78.46845050013835 },
    phoneKey: "agencia_eloy_alfaro",
    phone: "+593 99 037 4297"
  },
  {
    id: 5,
    src: "/autocor-local-2.jpg",
    name: "Autocor Av. Orellana",
    address:
      "Av. Francisco de Orellana E4-328 y Enrique Gangotena. Diagonal al Hotel Marriott. Quito, Pichincha",
    time: "Lunes a Viernes de 08:00 a 19:00, Sábado de 09:00 a 17:00 y Domingo de 10:00 a 14:00",
    location: { latitude: -0.19742284789267078, longitude: -78.49054922297624 },
    phoneKey: "agencia_orellana",
    phone: "+593 99 043 6699"
  },
  {
    id: 6,
    src: "/autocor-local-prensa.jpg",
    name: "Autocor Prensa",
    address: "Av. La Prensa N46-15 y, Zamora, Frente al Tecnologico Cordillera",
    time: "Lunes a Viernes de 08:00 a 18:30, Sábado de 09:00 a 17:00 y Domingo de 10:00 - 14:00",
    location: { latitude: -0.15546, longitude: -78.48885 },
    phoneKey: "agencia_prensa",
    phone: "+593 99 965 3587"
  },
  {
    id: 7,
    src: "/autocor-local-loschillos.jpg",
    name: "Autocor Valle de los Chillos",
    address: "Av. General Enríquez y San Juan de Dios esquina.",
    time: "Lunes a viernes de 08:00 - 19:00, Sábados de 09:00 - 17:00 y Domingo de 10:00 - 14:00",
    location: { latitude: -0.3049719, longitude: -78.4510271 },
    phoneKey: "agencia_valle_chillos",
    phone: "+593 99 965 3587"
  },
  {
    id: 8,
    src: "/autocor-local-sur.jpg",
    name: "Autocor Sur",
    address: "Av. Morán Valverde y Llira Ñan, 170606 Quito, Frente al Quicentro Sur",
    time: "Lunes a viernes de 08:00 - 18:00, Sábados de 09:00 - 17:00 y Domingo de 10:00 - 14:00",
    location: { latitude: -0.2853, longitude: -78.5438 },
    phoneKey: "agencia_sur",
    phone: "+593 99 333 9571"
  },
  {
    id: 8,
    src: "/autocor-local-guayaquil.jpg",
    name: "Autocor Guayaquil",
    address: "Av. de las Américas, junto al ingreso del Aeropuerto Jose Joaquin de Olmedo.",
    time: "Lunes a viernes de 08:00 - 18:00, Sábados de 09:00 - 17:00 y Domingo de 10:00 - 14:00",
    location: { latitude: -2.14946, longitude: -79.88602 },
    phoneKey: "agencia_guayaquil",
    phone: "+593 98 300 5861"
  },
];

export default function Contact() {
  const { data: phonesData } = useListPhonesQuery();
  const phoneByKey = Object.fromEntries(
    (phonesData?.entitydata || []).map((p) => [p.key, p.phone])
  );

  const agenciasConTelefono = agencias.map((a) => ({
    ...a,
    phone: phoneByKey[a.phoneKey] || a.phone,
  }));

  const comprasPhone = phoneByKey["agencia_compras"] || "+593 99 037 4297";

  return (
    <Layout selected="contact">
      <div className="bg-gray-50">
        <Maps agencias={agenciasConTelefono} comprasPhone={comprasPhone} />
        <div className="bg-gray-50 pb-10 flex-col justify-center items-center px-8">
          <CTA />
        </div>
      </div>
    </Layout>
  );
}

function CTA() {
  return (
    <div className="">
      <div className="mx-auto max-w-7xl py-2 lg:px-8">
        <div className=" bg-main px-6 pt-8 shadow-xl sm:px-16 md:pt-12 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="hidden w-1/3 -m-36 lg:flex justify-center items-center">
            <Image
              className="rounded-md"
              src="/contact-car-1.png"
              alt=""
              width={1200}
              height={741}
            />
          </div>
          <div className="w-full lg:w-1/3 text-center lg:mx-0 lg:flex-auto py-16">
            <h2 className="text-2xl font-light uppercase tracking-tight text-white">
              El concesionario de
            </h2>
            <p className="mt-1 text-5xl uppercase font-bold text-white font-poppins">
              Todas las marcas,
              <br /> más cerca de ti
            </p>
          </div>
          <div className="hidden w-1/3 -m-36 lg:flex justify-center items-center">
            <Image
              className="rounded-md"
              src="/contact-car-2.png"
              alt=""
              width={1200}
              height={792}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

