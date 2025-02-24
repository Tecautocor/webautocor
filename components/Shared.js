import Link from "next/link";
import Image from "next/image";
import "animate.css";

export function Spinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

export function Logo() {
  return (
    <Image
      alt=""
      src={"/logo-autocor.png"}
      width={150}
      height={68}
      priority
      className="animate__animated animate__pulse"
    />
  );
}

export function LogoFooter() {
  return (
    <Image
      alt=""
      src={"/logo-autocor.png"}
      width={120}
      height={54}
      priority
      className="animate__animated animate__pulse"
    />
  );
}

export function Button({ title }) {
  return (
    <button className="py-2 gap-2 px-4 hover:shadow-lg border-gray-600 flex items-center bg-gray-600 text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-gray-600 hover:text-gray-600 transition-colors group">
      <p>{title}</p>{" "}
      <IconArrow className="w-2 fill-white group-hover:fill-gray-600" />
    </button>
  );
}

export function ButtonMain({ title }) {
  return (
    <button className="py-2 gap-2 px-4 hover:shadow-lg border-main flex items-center bg-main text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-main hover:text-main transition-colors group">
      <p>{title}</p>{" "}
     
    </button>
  );
}

export function LinkButton({ title, link }) {
  return (
    <Link
      href={link}
      scroll={false}
      className="py-2 gap-2 px-4 hover:shadow-lg flex items-center justify-center border-gray-600 bg-gray-600 text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-gray-600 hover:text-gray-600 transition-colors group"
    >
      <p className="text-center">{title}</p>{" "}

    </Link>
  );
}

export function LinkButtonWhatsapp({ title, link }) {
  return (
    <Link
      href={link}
      className="py-2 gap-2 px-4 hover:shadow-lg flex items-center border-green-600 bg-green-600 text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-green-600 hover:text-green-600 transition-colors group"
    >
      <p>{title}</p>{" "}
      <IconArrow className="w-2 fill-white group-hover:fill-green-600" />
    </Link>
  );
}

export function LinkPrevButton({ title, link }) {
  return (
    <Link
      href={link}
      className="py-2 gap-2 px-4 hover:shadow-lg flex items-center border-gray-600 bg-gray-600 text-white font-semibold rounded-md border uppercase hover:bg-white hover:border-gray-600 hover:text-gray-600 transition-colors group"
    >
      <IconArrow className="w-2 fill-white group-hover:fill-gray-600 rotate-180" />
      <p>{title}</p>{" "}
    </Link>
  );
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

export function SectionText({ title, subtitle }) {
  return (
    <div className="pt-6 pb-3 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-light uppercase tracking-normal text-main">
          {title}
        </h2>
        <p className="text-3xl uppercase font-bold leading-8 text-gray-600 font-poppins">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function SectionTextWhite({ title, subtitle }) {
  return (
    <div className="pt-6 pb-3 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-light uppercase tracking-normal text-white">
          {title}
        </h2>
        <p className="text-3xl uppercase font-bold leading-8 text-white font-poppins">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
