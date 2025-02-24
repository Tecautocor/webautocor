import Layout from "../components/Layout";
import Brands from "../components/Brands";
import List from "../components/List";

import { LinkButton, SectionText, Spinner } from "../components/Shared";

import Stats from "../components/Stats";
import CTA from "../components/CTA";
import ContactForm from "../components/ContactForm";
import SearchBar from "../components/SearchBar";
import FiltersSection from "../components/FiltersSection";
import {
  useListStockViewedQuery,
  useListStockFeaturedQuery,
  useListBrandQuery,
  useListYearQuery,
} from "../lib/hooks";

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

export default function Home() {
  const { data, isLoading, isError } = useListStockViewedQuery();
  const {
    data: dataFeatured,
    isLoading: isLoadingFeatured,
    isError: isErrorFeatured,
  } = useListStockFeaturedQuery();

  const { data: brands } = useListBrandQuery();

  const { data: years } = useListYearQuery();

  return (
    <Layout selected="home">
      <div className="bg-gray-50 flex justify-center flex-col items-center pt-6 pb-16">
        <div className="px-6 w-full max-w-6xl mx-auto">
          <SearchBar />
        </div>

        <SectionText
          title="Especificaciones"
          subtitle="¿En qué tipo de auto estás interesado?"
        />

        <FiltersSection
          brands={brands}
          years={years}
          buttonTitle="Buscar mi Auto"
        />
      </div>

      <div className="bg-white flex justify-center flex-col items-center py-4">
        <div className="pb-10 flex-col justify-center items-center">
          <SectionText
            title="Destacados"
            subtitle="Encuentra el seminuevo de tus sueños"
          />
          {isLoadingFeatured && (
            <p className="bg-white flex justify-center flex-col items-center pt-4 pb-10 px-8">
              <Spinner />
            </p>
          )}
          {isErrorFeatured && (
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
          {!isLoadingFeatured && !isErrorFeatured && dataFeatured && (
            <List list={getMultipleRandom(dataFeatured.result.entitydata, 4)} />
          )}
          <div className="flex justify-center">
            <LinkButton title="Ver más autos" link="/vehiculos" />
          </div>
        </div>
      </div>

      <CTA />

      <div className="bg-white flex justify-center flex-col items-center py-6">
        <div className="pb-10 flex-col justify-center items-center">
          <SectionText
            title="Oportunidad de compra"
            subtitle="Los más vistos de la semana"
          />
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
            <List list={data.result.entitydata} />
          )}
          <div className="flex justify-center">
            <LinkButton title="Ver más autos" link="/vehiculos" />
          </div>
        </div>
      </div>

      <Stats />
      <Brands />
      <ContactForm />
    </Layout>
  );
}
