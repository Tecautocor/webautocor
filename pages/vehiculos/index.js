import Layout from "../../components/Layout";
import List from "../../components/ListVehicles";
//import List from "../components/List";
import SearchBar from "../../components/SearchBar";
import FiltersSection from "../../components/FiltersSection";
import {
  useListStockQuery,
  useListYearQuery,
  useListBrandQuery,
} from "../../lib/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { SectionText, Spinner } from "../../components/Shared";

export default function Vehicle() {
  const router = useRouter();
  const params = router.query;
  const { data, isLoading, isFetching, isError } = useListStockQuery(params);

  const { data: years } = useListYearQuery();

  const { data: brands } = useListBrandQuery();

  // Solo debe reiniciarse el formulario de filtros cuando cambian los filtros
  // reales - "page" y "sortBy" cambian con la paginacion/orden y no deben
  // forzar un remontaje completo (eso disparaba el "scroll anchoring" del
  // navegador y hacia saltar la pagina al usar el menu de orden).
  const filterKey = JSON.stringify(
    Object.fromEntries(
      Object.entries(router.query).filter(
        ([key]) => key !== "page" && key !== "sortBy"
      )
    )
  );

  return (
    <Layout selected="vehicles">
      <div className="bg-gray-50 flex justify-center flex-col items-center py-10">
        <div className="px-6 w-full max-w-6xl mx-auto">
          <SearchBar />
        </div>

        <SectionText
          title="Especificaciones"
          subtitle="¿En qué tipo de auto estás interesado?"
        />

        <FiltersSection
          key={filterKey}
          brands={brands}
          years={years}
          buttonTitle="Aplicar Filtro"
        />
      </div>

      <div className="bg-white flex justify-center flex-col items-center pt-4 pb-4">
        <div className="pb-4 flex-col justify-center items-center w-full">
          <div className="mx-auto max-w-md gap-4 px-6 sm:max-w-lg lg:max-w-7xl lg:px-8 py-2 grid grid-cols-1 lg:grid-cols-3 items-center">
            <div className="flex justify-center lg:justify-start">
              {Object.entries(router.query).filter(
                (filter) => filter[1] !== "" && filter[0] !== "page" && filter[0] !== "sortBy"
              ).length > 0 && (
                <Filters
                  tags={Object.entries(router.query).filter(
                    (filter) => filter[1] !== "" && filter[0] !== "page" && filter[0] !== "sortBy"
                  )}
                />
              )}
            </div>

            <div className="flex justify-center">
              <SortDropdown />
            </div>

            <div className="flex justify-center lg:justify-end">
              {!isLoading && !isError && data && (
                <Pagination pagination={data.aditional_data} />
              )}
            </div>
          </div>
          {isLoading && (
            <p className="bg-white flex justify-center flex-col items-center pt-4 pb-10 px-8">
              <Spinner />
            </p>
          )}
          {isError && (
            <div className="flex justify-center items-center pt-4 pb-10 px-8 gap-2">
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
            <div
              className={
                isFetching ? "opacity-50 transition-opacity" : "transition-opacity"
              }
            >
              <List list={data.entitydata} />
            </div>
          )}

          {!isLoading && !isError && data && (
            <div className="flex justify-end">
              <Pagination pagination={data.aditional_data} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const DISPLACEMENT_LABELS = {
  "1000-1600": "1.0L a 1.6L",
  "1600-2000": "1.6L a 2.0L",
  "2000-3000": "2.0L a 3.0L",
  "3000+": "Más de 3.0L",
};

function Filters({ tags }) {
  const router = useRouter();

  const tagsRevised = [];
  tags.map((tag) => {
    if (tag[0] === "brand") {
      tagsRevised.push("Marca: " + tag[1]);
    }
    if (tag[0] === "agency") {
      tagsRevised.push("Agencia: " + tag[1]);
    }
    if (tag[0] === "model") {
      tagsRevised.push("Modelo: " + tag[1]);
    }
    if (tag[0] === "priceFrom") {
      tagsRevised.push("Precio desde: " + tag[1]);
    }
    if (tag[0] === "priceTo") {
      tagsRevised.push("Precio hasta: " + tag[1]);
    }
    if (tag[0] === "yearFrom") {
      tagsRevised.push("Año desde: " + tag[1]);
    }
    if (tag[0] === "yearTo") {
      tagsRevised.push("Año hasta: " + tag[1]);
    }

    if (tag[0] === "owner") {
      tagsRevised.push("Un solo dueño");
    }

    if (tag[0] === "fuel_name") {
      tagsRevised.push("Combustible: " + tag[1]);
    }

    if (tag[0] === "color") {
      tagsRevised.push("Color: " + tag[1]);
    }

    if (tag[0] === "saving_plan_order") {
      tagsRevised.push("Transmisión: " + tag[1]);
    }

    if (tag[0] === "license_plate") {
      tagsRevised.push("Último dígito de placa: " + tag[1]);
    }

    if (tag[0] === "kilometers") {
      tagsRevised.push("Menor kilometraje");
    }

    if (tag[0] === "homeMaintenance") {
      tagsRevised.push("Vehículo blindado");
    }

    if (tag[0] === "type") {
      tagsRevised.push("Tipo: " + tag[1]);
    }

    if (tag[0] === "invoice") {
      tagsRevised.push("Auto con factura");
    }

    if (tag[0] === "kmFrom") {
      tagsRevised.push("Kilometraje desde: " + tag[1]);
    }

    if (tag[0] === "kmTo") {
      tagsRevised.push("Kilometraje hasta: " + tag[1]);
    }

    if (tag[0] === "traction") {
      tagsRevised.push("Tracción: " + tag[1]);
    }

    if (tag[0] === "displacement") {
      tagsRevised.push(
        "Cilindraje: " + (DISPLACEMENT_LABELS[tag[1]] || tag[1])
      );
    }
  });

  return (
    <div className="gap-2 flex flex-col md:flex-row px-6">
      {tagsRevised.map((tag, index) => (
        <span
          key={index}
          className="inline-flex px-2 py-1 bg-gray-200 text-gray-600 text-xs font-light rounded items-center gap-1 justify-between"
        >
          <p className="">{tag}</p>
        </span>
      ))}
      {tagsRevised.length > 0 && (
        <button
          onClick={() => router.push("/vehiculos")}
          className="inline-flex px-2 py-1 bg-gray-200 text-gray-600 text-xs font-light rounded items-center gap-1 justify-between"
        >
          <p className="">Limpiar filtros</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-gray-400"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

const SORT_LABELS = {
  "": "Recomendado",
  price_asc: "Menor precio",
  price_desc: "Mayor precio",
  km_asc: "Menor kilometraje",
  km_desc: "Mayor kilometraje",
  year_desc: "Año más reciente",
  year_asc: "Año menos reciente",
};

function SortDropdown() {
  const router = useRouter();
  const params = router.query;
  const currentSort = params.sortBy || "";

  const setSort = (value) => {
    const newParams = { ...params, page: 1 };
    if (value === "") {
      delete newParams.sortBy;
    } else {
      newParams.sortBy = value;
    }
    router.push(
      { pathname: "/vehiculos", query: newParams },
      undefined,
      { scroll: false }
    );
  };

  return (
    <Menu as="div" className="relative shrink-0">
      <Menu.Button className="flex items-center gap-1.5 py-2 px-3 text-xs font-semibold text-gray-600 hover:text-main uppercase">
        <span>Ordenar: {SORT_LABELS[currentSort]}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-20 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none py-1">
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <Menu.Item key={value || "recomendado"}>
              {({ active }) => (
                <button
                  onClick={() => setSort(value)}
                  className={`${
                    active ? "bg-gray-50" : ""
                  } flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-light text-gray-700`}
                >
                  <CheckIcon
                    className={`w-4 h-4 text-main ${
                      currentSort === value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {label}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function Pagination({ pagination }) {
  const router = useRouter();
  const params = router.query;

  const prev =
    Number(pagination.page) === 1
      ? ""
      : "?" +
        new URLSearchParams({
          ...params,
          page: Number(pagination.page) - 1,
        }).toString();

  const next =
    Number(pagination.page) === Number(pagination.page_count) ||
    Number(pagination.page_count) === 0
      ? ""
      : "?" +
        new URLSearchParams({
          ...params,
          page: Number(pagination.page) + 1,
        }).toString();

  const from =
    (Number(pagination.page) - 1) * Number(pagination.rows_per_page) + 1;

  const to =
    (Number(pagination.page) - 1) * Number(pagination.rows_per_page) +
    Number(pagination.rows_in_page);

  return (
    <div className="flex px-6 text-sm text-gray-400 items-center gap-2 font-light">
      <p>
        {from}-{to} de {pagination.rows_count}
      </p>
      {prev === "" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <Link href={"/vehiculos" + prev}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-gray-600 hover:text-gray-900 hover:scale-110"
          >
            <path
              fillRule="evenodd"
              d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      )}

      {next === "" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={
            next === "?page=" + Number(pagination.page_count)
              ? "w-6 h-6"
              : "w-6 h-6"
          }
        >
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <Link href={"/vehiculos" + next}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-gray-600 hover:text-gray-900 hover:scale-110"
          >
            <path
              fillRule="evenodd"
              d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      )}
    </div>
  );
}
