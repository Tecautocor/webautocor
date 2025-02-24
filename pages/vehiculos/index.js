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
import { SectionText, Spinner } from "../../components/Shared";

export default function Vehicle() {
  const router = useRouter();
  const params = router.query;
  const { data, isLoading, isError } = useListStockQuery(params);

  const { data: years } = useListYearQuery();

  const { data: brands } = useListBrandQuery();

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
          key={router.asPath}
          brands={brands}
          years={years}
          buttonTitle="Aplicar Filtro"
        />
      </div>

      <div className="bg-white flex justify-center flex-col items-center pt-4 pb-4">
        <div className="pb-4 flex-col justify-center items-center">
          <div className="py-2 flex flex-col lg:flex-row justify-between items-center gap-4">
            {Object.entries(router.query).filter(
              (filter) => filter[1] !== "" && filter[0] !== "page"
            ).length > 0 ? (
              <Filters
                tags={Object.entries(router.query).filter(
                  (filter) => filter[1] !== "" && filter[0] !== "page"
                )}
              />
            ) : (
              <div></div>
            )}

            {!isLoading && !isError && data && (
              <Pagination pagination={data.aditional_data} />
            )}
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
          
          {!isLoading && !isError && data && <List list={data.entitydata} /> }

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

    if (tag[0] === "kilometers") {
      tagsRevised.push("Menor kilometraje");
    }

    if (tag[0] === "homeMaintenance") {
      tagsRevised.push("Mantenimiento en casa");
    }

    if (tag[0] === "type") {
      tagsRevised.push("Tipo: " + tag[1]);
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
