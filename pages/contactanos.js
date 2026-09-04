import Layout from "../components/Layout";
import Image from "next/image";
import Maps from "../components/Maps";
import { useListPhonesQuery, useListAgenciesQuery } from "../lib/hooks";

export default function Contact() {
  const { data: phonesData } = useListPhonesQuery();
  const { data: agenciesData } = useListAgenciesQuery();

  const phoneByKey = Object.fromEntries(
    (phonesData?.entitydata || []).map((p) => [p.key, p.phone])
  );

  const agenciasConTelefono = (agenciesData?.entitydata || []).map((a) => ({
    id: a.id,
    src: a.src,
    name: a.name,
    address: a.address,
    time: a.time,
    location: { latitude: a.latitude, longitude: a.longitude },
    phoneKey: a.phoneKey,
    phone: phoneByKey[a.phoneKey] || "",
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

