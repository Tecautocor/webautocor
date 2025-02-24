import Image from "next/image";
import { LinkButton } from "../components/Shared";

export default function CTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-2 px-8">
        <div className=" from-[#E43B2F] bg-gradient-to-r  via-[#E13A2F] to-[#E43B2F] px-6 pt-16 shadow-lg sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
          <div className="hidden w-2/3 -mx-36 -mt-8 lg:flex justify-center items-center">
            <Image
              unoptimized
              className="rounded-md"
              src="/auto-compramos.png"
              alt=""
              width={1200}
              height={713}
              priority
            />
          </div>
          <div className="w-full lg:w-1/3 text-center flex flex-col justify-center lg:mx-0 lg:flex-auto pt-8 pb-10 lg:pt-10 lg:pb-10">
            <h2 className="text-2xl font-light uppercase tracking-tight text-white">
              Compramos tu auto
            </h2>
            <p className="text-3xl uppercase font-bold text-white font-poppins">
              La historia de tu auto
              <br /> aún no termina
            </p>
            <div className="mt-5 flex items-center justify-center gap-x-6">
              <LinkButton title="Conoce más" link="/compramos-tu-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
