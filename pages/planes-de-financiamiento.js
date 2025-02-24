import Layout from "../components/Layout";
import Image from "next/image";

import { SectionText } from "../components/Shared";

export default function Financing() {
  return (
    <Layout selected="financing">
      <div className="bg-main h-80 py-0 px-8">
        <div className="flex max-w-7xl mx-auto h-full">
          <Image
            src="/financing-man.png"
            alt=""
            width={500}
            height={325}
            className="hidden lg:flex"
            priority
          />
          <div className="flex w-full justify-center lg:justify-end lg:mr-36 h-full items-center">
            <SectionHeaderText />
          </div>
        </div>
      </div>
      <div className="bg-white py-6 flex flex-col justify-center items-center px-8">
        <SectionText
          title="Planes de financiamiento"
          subtitle="DISEÑADOS ESPECIALMENTE PARA TI"
        />

        <div className="flex flex-col md:flex-row gap-4 md:gap-1 items-center mx-auto py-4">
          <div className="flex flex-col justify-center items-center">
            <div className="w-28 p-2 bg-white shadow-lg mb-2">
              <Image
                src="/financing-credit.jpg"
                alt=""
                width={146}
                height={146}
              />
            </div>
            <p className="text-gray-800 text-sm font-bold text-center">
              Crédito
              <br />
              vehicular
            </p>
          </div>
          <div className="hidden md:flex">
            <Image src="/link.png" alt="" width={100} height={25} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="w-28 p-2 bg-white shadow-lg mb-2">
              <Image
                src="/financing-from.jpg"
                alt=""
                width={146}
                height={146}
              />
            </div>
            <p className="text-gray-800 text-sm font-bold text-center">
              Desde el
              <br />
              0% entrada
            </p>
          </div>
          <div className="hidden md:flex">
            <Image src="/link-2.png" alt="" width={100} height={25} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="w-28 p-2 bg-white shadow-lg mb-2">
              <Image
                src="/financing-time.jpg"
                alt=""
                width={146}
                height={146}
              />
            </div>
            <p className="text-gray-800 text-sm font-bold text-center">
              Plazos desde
              <br />
              12 hasta 60 meses
            </p>
          </div>
          <div className="hidden md:flex">
            <Image src="/link.png" alt="" width={100} height={25} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="w-28 p-2 bg-white shadow-lg mb-2">
              <Image
                src="/financing-secure.jpg"
                alt=""
                width={146}
                height={146}
              />
            </div>
            <p className="text-gray-800 text-sm font-bold text-center">
              Incluye seguro
              <br />y dispositivo de rastreo
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 flex justify-center flex-col items-center py-4">
        <div className="pb-10 flex flex-col justify-center items-center">
          <SectionText
            title="REQUISITOS DE APROBACIÓN"
            subtitle="PARA TENER EL AUTO DE TUS SUEÑOS"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mx-auto max-w-4xl px-6 justify-start items-start">
          <div className="bg-white w-full lg:w-1/2 shadow-lg flex flex-col items-center justify-center px-8 py-2 text-gray-500">
            <p className="font-bold text-lg pb-4 text-gray-800">DEPENDIENTE:</p>
            <div className="flex justify-start items-start flex-col text-sm">
              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-id.png" alt="" width={200} height={200} />
                </div>

                <p className="font-light flex flex-1">
                  Copia de la cédula de identidad a color y del cónyugue en caso
                  de estar casado.
                </p>
              </div>
              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-vote.png" alt="" width={200} height={200} />
                </div>
                <p className="font-light flex flex-1">
                  Copia de la papeleta de votación y del cónyugue en caso de
                  estar casado.
                </p>
              </div>
              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image
                    src="/icon-justify.png"
                    alt=""
                    width={200}
                    height={200}
                  />
                </div>

                <p className="font-light flex flex-1">
                  Justiﬁcativos de ingresos del deudor y del cónyugue en caso de
                  estar casado.
                </p>
              </div>
              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-rol.png" alt="" width={200} height={200} />
                </div>

                <p className="font-light flex flex-1">
                  Rol de pagos últimos 3 meses.
                </p>
              </div>
              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-bank.png" alt="" width={200} height={200} />
                </div>

                <p className="font-light flex flex-1">
                  Tres últimos estados de cuenta bancaria
                </p>
              </div>
              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image
                    src="/icon-basic.png"
                    alt=""
                    width={200}
                    height={200}
                  />
                </div>

                <p className="font-light flex flex-1">
                  Copia de una planilla de servicio básico.
                </p>
              </div>
              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-car.png" alt="" width={200} height={200} />
                </div>

                <p className="font-light flex flex-1">Matrícula vehicular</p>
              </div>
              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image
                    src="/icon-justify.png"
                    alt=""
                    width={200}
                    height={200}
                  />
                </div>

                <p className="font-light flex flex-1">Impuesto predial</p>
              </div>
            </div>
          </div>
          <div className="bg-white w-full lg:w-1/2 shadow-lg flex flex-col items-center justify-center px-8 py-2 text-gray-500">
            <p className="font-bold text-lg pb-4 text-gray-800">
              INDEPENDIENTE:
            </p>
            <div className="flex justify-start items-start flex-col text-sm">
              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-id.png" alt="" width={200} height={200} />
                </div>

                <p className="font-light flex flex-1">
                  Copia de la cédula de identidad a color y del cónyugue en caso
                  de estar casado.
                </p>
              </div>

              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-vote.png" alt="" width={200} height={200} />
                </div>

                <p className="font-light flex flex-1">
                  Copia de la papeleta de votación y del cónyugue en caso de
                  estar casado.
                </p>
              </div>

              <div className="flex py-4">
                <p className="font-semibold text-main">
                  Justiﬁcativos de ingresos:
                </p>
              </div>

              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image
                    src="/icon-justify.png"
                    alt=""
                    width={200}
                    height={200}
                  />
                </div>

                <p className="font-light flex flex-1">RUC/RISE</p>
              </div>

              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-rol.png" alt="" width={200} height={200} />
                </div>

                <p className="font-light flex flex-1">
                  Declaraciones del IVA los 3 últimos meses
                </p>
              </div>

              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-bank.png" alt="" width={200} height={200} />
                </div>

                <p className="font-light flex flex-1">
                  Estados de cuenta bancaria 3 últimos meses y del cónyugue en
                  el caso de estar casado
                </p>
              </div>

              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image
                    src="/icon-basic.png"
                    alt=""
                    width={200}
                    height={200}
                  />
                </div>

                <p className="font-light flex flex-1">
                  Copia de una planilla de servicio básico. Matrícula vehicular
                </p>
              </div>

              <div className="flex py-1 gap-4 items-center">
                <div className="w-12 flex justify-center items-center">
                  <Image src="/icon-tax.png" alt="" width={200} height={200} />
                </div>

                <p className="font-light flex flex-1">Impuesto predial</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white flex justify-center flex-col items-center py-6 pt-8 pb-12">
        <div className="pb-10 flex flex-col justify-center items-center">
          <SectionText
            title="BENEFICIOS"
            subtitle="ADAPTADOS A TUS NECESIDADES"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl">
          <div className="shadow-lg py-4 px-12 flex flex-col items-center">
            <Image
              src="/pre-approval-image.png"
              alt=""
              width={397 / 2}
              height={453 / 2}
              className="px-10 py-6"
            />
           <p className="font-bold text-center" style={{ fontSize: '15px' }}>
  Pre-aprobación inmediata
  previa solicitud de crédito
</p>


          </div>

          <div className="shadow-lg py-4 px-12 flex flex-col items-center">
          <Image
  src="/agile-image.png"
  alt="Imagen de proceso ágil"
  className="move-right w-full h-auto px-4 py-2"
/>


  <p className="font-bold text-center mt-9" style={{ fontSize: '15px' }}>
    Agilitamos el proceso
    para la entrega de tu auto.
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
            <p className="font-bold text-center mt-6">
              Tasas desde 9,76%
              <br />
              hasta 17%
            </p>
          </div>

          <div className="shadow-lg py-4 px-12 flex flex-col items-center">
            <Image
              src="/card-image.png"
              alt=""
              width={523 / 2}
              height={453 / 2}
              className="px-10 py-6"
            />
            <div>
            <p className="font-bold text-center mt-9">Tarjeta de crédito</p>
              <span className="text-red-600 italic text-xs text-center block">
                (Sín límite de monto de acuerdo al cupo)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-main flex justify-center flex-col items-center pt-6 pb-12 px-8">
        <div className="max-w-5xl">
          <div className="pb-10 flex flex-col justify-center items-center">
            <SectionTextWhite
              title="TARJETAS DE CRÉDITO"
              subtitle="FACILIDADES DE PAGO"
            />
          </div>

          <div className="flex flex-col lg:flex-row text-white gap-8">
            <div className="flex flex-col justify-center items-center px-8 w-full lg:w-1/3">
              <p className="font-bold uppercase text-lg leading-none ml-20">
                hasta
              </p>
              <p className="font-bold uppercase text-[140px] leading-none">
                48
              </p>
              <p className="font-bold uppercase text-2xl leading-none">
                meses plazo
              </p>
            </div>
            <div className="flex items-center px-8 w-full lg:w-2/3">
              <ul className="list-disc font-light space-y-2">
                <li>
                  Diners, Discover, Visa Banco Pichincha y Visa Banco del
                  Pacíﬁco
                </li>
                <li>
                  Visa y MasterCard Banco Bolivariano, Produbanco,
                  Internacional, Amazonas, Machala, Austro, Mutualista{" "}
                  <span className="italic text-xs">
                    (Azuay, Imbabura, Pichincha)
                  </span>
                </li>
                <li>
                  Cooperativa 
                  <span className="italic text-xs">
                    (Jeep, Oscus, Policia Nacional, Cooprogreso)
                  </span>
                </li>
                <li>
                  American Express Banco Guayaquil{" "}
                  <span className="italic text-xs">
                    (Pago corriente con opción a diferido en la institución
                    ﬁnanciera)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function SectionTextWhite({ title, subtitle }) {
  return (
    <div className="pt-6 pb-2 px-6 sm:pt-8 sm:pb-4 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-xl font-light uppercase tracking-tight text-white sm:text-xl">
          {title}
        </h2>
        <p className="mt-1 text-3xl uppercase font-bold leading-8 text-white font-poppins">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function SectionHeaderText() {
  return (
    <div className="pt-6 pb-2 px-6 sm:pt-8 sm:pb-4 lg:px-8">
      <div className="mx-auto max-w-4xl text-center flex flex-col justify-center items-center">
        <h2 className="text-3xl font-light uppercase tracking-tight text-white">
          Con Autocor
        </h2>
        <p className="text-6xl uppercase font-black text-white font-poppins">
          Estrenar tu
        </p>

        <p className="mt-1 mb-4 text-3xl uppercase font-black leading-8 text-white font-poppins">
          Auto seminuevo es posible
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
