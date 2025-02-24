import { useState } from "react";
import { Combobox } from "@headlessui/react";
import { useQuery } from "react-query";
import { getItems } from "../lib/api";
import { useRouter } from "next/router";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  let queryParams = router.query;

  const [query, setQuery] = useState(null);

  const { data, isLoading } = useQuery(
    ["items", query],
    () => getItems({ s: query || undefined }),
    { enabled: query !== null }
  );

  function handleSearch() {
    if (search) {
      queryParams = {
        ...queryParams,
        brand: search.brand,
        model: search.model,
      };
      router.push({ pathname: "/vehiculos", query: queryParams });
    }
  }

  return (
    <>
      <div className="flex rounded-md shadow-sm">
        <div className="relative flex flex-grow  justify-between">
          <Combobox
            onChange={(value) => {
              if (value) {
                setSearch(value);
              }
            }}
            nullable
          >
            <Combobox.Input
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-main focus:border-main sm:text-sm"
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder="¿Qué estás buscando?"
              displayValue={(value) => {
                if (!value) return "";
                return value?.brand + "-" + value?.model;
              }}
            />
            <Combobox.Options className="absolute top-10 px-3 py-2 z-10 bg-white shadow">
              {isLoading ? (
                <div className="px-2 py-1">Cargando...</div>
              ) : data?.items.length > 0 ? (
                data.items.map((item, index) => (
                  <Combobox.Option
                    key={index}
                    value={item}
                    className="px-2 py-1"
                  >
                    {item.brand + "-" + item.model}
                  </Combobox.Option>
                ))
              ) : (
                <div className="px-2 py-1">No se encontró resultados </div>
              )}
            </Combobox.Options>
          </Combobox>
          {/* <input
            type="text"
            name="search"
            id="search"
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full text-sm rounded-md border-none pr-10 focus:border-main focus:ring-main font-light placeholder-[#939393]"
            placeholder="¿Qué estás buscando?"
          />*/}
          <button
            onClick={() => handleSearch()}
            className="absolute inset-y-0 right-0 md:flex items-center bg-main hover:shadow-lg mx-2 my-1 px-2 rounded-md gap-1 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 hidden md:block"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                clipRule="evenodd"
              />
            </svg>
            <p className="uppercase">Buscar</p>
          </button>
        </div>
      </div>
    </>
  );
}

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 106 61"
      className="w-3"
    >
      <path
        fill="#BCBBBB"
        fillRule="nonzero"
        d="M0-4.204l-5.401 5.401a.91.91 0 01-1.286 0l-5.401-5.401c-.573-.573-.168-1.552.642-1.552H-.643c.81 0 1.216.979.643 1.552"
        transform="translate(-2649.09 -1664.6) scale(8.33333) translate(330.247 205.508)"
      ></path>
    </svg>
  );
}
