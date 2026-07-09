import { useState } from "react";
import { Logo } from "./Shared";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const navigation = [
  { name: "Quiénes somos", href: "/quienes-somos", slug: "about" },
  { name: "Vehículos", href: "/vehiculos", slug: "vehicles" },
  { name: "Liquidación", href: "/liquidacion", slug: "liquidacion" },
  { name: "Compramos tu auto", href: "/compramos-tu-auto", slug: "buy" },
  {
    name: "Planes de financiamiento",
    href: "/planes-de-financiamiento",
    slug: "financing",
  },
  {
    name: "Trabaja con nosotros",
    href: "/trabaja-con-nosotros",
    slug: "work",
  },
  { name: "Contáctanos", href: "/contactanos", slug: "contact" },
  { name: "Datos Personales", href: "/proteccion-de-datos", slug: "data" },
];

function DescuentosSticker() {
  return (
    <span className="absolute left-1/2 top-full -translate-x-1/2 flex flex-col items-center select-none pointer-events-none">
      <span className="w-px h-3 bg-gray-400/70" aria-hidden="true" />
      <span className="hanging-tag relative bg-main text-white text-[7px] xl:text-[8px] font-bold uppercase leading-[1.1] text-center px-1.5 pt-2 pb-1 rounded-sm shadow-md">
        <span className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white ring-1 ring-gray-300" />
        Grandes
        <br />
        descuentos
      </span>
      <style jsx>{`
        .hanging-tag {
          transform-origin: top center;
          animation: swing 2.6s ease-in-out infinite;
        }
        @keyframes swing {
          0%,
          100% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(4deg);
          }
        }
      `}</style>
    </span>
  );
}

export default function Header({ selected }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white drop-shadow-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between py-2 px-6 lg:px-8"
        aria-label="Autocor"
      >
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Autocor</span>
          <Logo />
        </Link>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Abrir el menu principal</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-4 xl:gap-x-7 items-center">
          {navigation.map((item) => (
            <div key={item.name} className="relative flex items-center">
              <Link
                href={item.href}
                className={
                  selected === item.slug
                    ? "text-main hover:text-[#939393] underline font-light text-xs xl:text-sm whitespace-nowrap"
                    : "text-[#939393] hover:text-main hover:underline font-light text-xs xl:text-sm whitespace-nowrap"
                }
              >
                {item.name}
              </Link>
              {item.slug === "liquidacion" && <DescuentosSticker />}
            </div>
          ))}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel
          focus="true"
          className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Cerrar menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    className="relative flex items-center w-fit"
                    style={item.slug === "liquidacion" ? { marginBottom: "2.25rem" } : undefined}
                  >
                    <Link
                      href={item.href}
                      className="-mx-3 block rounded-lg py-2 px-3 leading-7 text-gray-900 hover:text-main hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.slug === "liquidacion" && <DescuentosSticker />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
