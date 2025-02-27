import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { Button } from "./Shared";
import { useRouter } from "next/router";

function getValue(array, id) {
  return array.find((element) => element.id === id);
}

const modelos = [
  {
    id: "HATCHBACK",
    image: "filtro-hachtback.jpg",
    title: "Hatchback",
  },
  {
    id: "SEDAN",
    image: "filtro-sedan.jpg",
    title: "Sedán",
  },
  {
    id: "CROSSOVER",
    image: "filtro-crossover.jpg",
    title: "Crossover",
  },
  {
    id: "SUV",
    image: "filtro-suv.jpg",
    title: "Suv",
  },
  {
    id: "JEEP",
    image: "filtro-todoterreno.jpg",
    title: "Todo Terreno",
  },
  {
    id: "CAMIONETA",
    image: "filtro-camioneta.jpg",
    title: "Camioneta",
  },
  {
    id: "HIBRIDO",
    image: "autocor-hibrido.jpg",
    title: "Híbrido",
  },
  {
    id: "MOTO",
    image: "autocor-moto.jpg",
    title: "Moto",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FiltersSection({ brands, years, buttonTitle }) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [selectedTransmision, setSelectedTransmision] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedLicense, setSelectedLicense] = useState("");
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedKm, setSelectedKm] = useState("");
  const [selectedMaintenance, setSelectedMaintenance] = useState("");
  const [selectedPriceFrom, setSelectedPriceFrom] = useState("");
  const [selectedPriceTo, setSelectedPriceTo] = useState("");
  const [selectedYearFrom, setSelectedYearFrom] = useState("");
  const [selectedYearTo, setSelectedYearTo] = useState("");

  const [selectedModelos, setSelectedModelos] = useState(null);
  const router = useRouter();

  // Ordena los años de mayor a menor
  const sortedYears = Array.isArray(years) ? [...years].sort((a, b) => b.year - a.year) : [];

  useEffect(() => {
    setSelectedBrand(router.query.brand);
  }, [router.query.brand]);

  useEffect(() => {
    setSelectedModel(router.query.model);
  }, [router.query.model]);

  useEffect(() => {
    setSelectedAgency(router.query.agency);
  }, [router.query.agency]);

  useEffect(() => {
    setSelectedFuel(router.query.fuel_name);
  }, [router.query.fuel_name]);

  useEffect(() => {
    setSelectedTransmision(router.query.saving_plan_order);
  }, [router.query.saving_plan_order]);

  useEffect(() => {
    setSelectedColor(router.query.color);
  }, [router.query.color]);

  useEffect(() => {
    setSelectedColor(router.query.license_plate);
  }, [router.query.license_plate]);

  useEffect(() => {
    if (router.query.owner) setSelectedOwner(router.query.owner);
  }, [router.query.owner]);

  useEffect(() => {
    if (router.query.kilometers) setSelectedKm(router.query.kilometers);
  }, [router.query.kilometers]);

  useEffect(() => {
    if (router.query.homeMaintenance)
      setSelectedMaintenance(router.query.homeMaintenance);
  }, [router.query.homeMaintenance]);

  useEffect(() => {
    if (router.query.type)
      setSelectedModelos(getValue(modelos, router.query.type));
  }, [router.query.type]);

  const brandsFiltered = brands
    ?.map((item) => {
      return item.brand;
    })
    .filter((item) => item !== null)
    .reduce(
      (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
      []
    );

  const modelsFiltered = brands
    ?.map((item) => {
      if (selectedBrand && item.brand === selectedBrand) return item.model;
      else if (!selectedBrand) return item.model;
      else return null;
    })
    .filter((item) => item !== null)
    .reduce(
      (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
      []
    );

  const storesFiltered = brands
    ?.map((item) => {
      if (
        selectedBrand &&
        selectedModel &&
        item.brand === selectedBrand &&
        item.model === selectedModel
      )
        return item.location;
      else if (selectedBrand && !selectedModel && item.brand === selectedBrand)
        return item.location;
      else if (!selectedBrand && selectedModel && item.model === selectedModel)
        return item.location;
      else if (!selectedBrand && !selectedModel) return item.location;
      else return null;
    })
    .filter((item) => item !== null)
    .reduce(
      (unique, item) => (unique.includes(item) ? unique : [...unique, item]),
      []
    );

  return (
    <form action="\vehiculos" method="GET" className="mx-auto w-full">
      <div className="mx-auto w-full max-w-6xl grid gap-x-2 gap-y-2 grid-cols-1 md:grid-cols-4 lg:grid-cols-8 pt-4 pb-6">
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <div className="flex bg-white">
            <label htmlFor="priceFrom" className="sr-only">
              Precio desde
            </label>
            <input
              type="text"
              id="priceFrom"
              name="priceFrom"
              defaultValue={router.query.priceFrom || ""}
              placeholder="Precio desde"
              onChange={(e) => setSelectedPriceFrom(e.target.value)}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            />
            <PriceIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <div className="flex bg-white">
            <label htmlFor="priceTo" className="sr-only">
              Precio hasta
            </label>
            <input
              type="text"
              id="priceTo"
              name="priceTo"
              defaultValue={router.query.priceTo || ""}
              placeholder="Precio hasta"
              onChange={(e) => setSelectedPriceTo(e.target.value)}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            />
            <PriceIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <div className="flex bg-white">
            <select
          id="yearFrom"
          name="yearFrom"
          onChange={(e) => setSelectedYearFrom(e.target.value)}
          value={selectedYearFrom}
          className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
        >
          <option value="">Año desde</option>
          {sortedYears.map((year, index) => (
            <option key={index} value={year.year}>
              {year.year}
            </option>
          ))}
        </select>
            <YearIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <div className="flex bg-white">
            <select
              id="yearTo"
              name="yearTo"
              onChange={(e) => setSelectedYearTo(e.target.value)}
              value={selectedYearTo}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            >
              <option value="">Año hasta</option>
              {sortedYears.map((year, index) => (
                  <option key={index} value={year.year}>
                    {year.year}
                  </option>
                ))}
            </select>
            <YearIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <label htmlFor="brand" className="sr-only">
            Marca
          </label>
          <div className="flex bg-white">
            <select
              id="brand"
              name="brand"
              onChange={(e) => setSelectedBrand(e.target.value)}
              value={selectedBrand}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            >
              <option value="">Marca</option>
              {brandsFiltered &&
                brandsFiltered.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
            </select>
            <BrandIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <label htmlFor="model" className="sr-only">
            Modelo
          </label>
          <div className="flex bg-white">
            <select
              id="model"
              name="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            >
              <option value="">Modelo</option>
              {modelsFiltered &&
                modelsFiltered.map((model, index) => (
                  <option key={index} value={model}>
                    {model}
                  </option>
                ))}
            </select>
            <BrandIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <label htmlFor="fuel_name" className="sr-only">
            Combustible
          </label>
          <div className="flex bg-white">
            <select
              id="fuel_name"
              name="fuel_name"
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            >
              <option value="">Combustible</option>
              <option key='Gasolina' value='Gasolina'>Gasolina</option>
              <option key='Diesel' value='Diesel'>Diesel</option>
              <option key='Hibrido ' value='Hibrido '>Hibrido </option>
              <option key='Eléctrico' value='Eléctrico'>Eléctrico</option>
            </select>
            <BrandIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <label htmlFor="agency" className="sr-only">
            Agencia
          </label>
          <div className="flex bg-white">
            <select
              id="agency"
              name="agency"
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            >
              <option value="">Agencia</option>
              {storesFiltered &&
                storesFiltered.map((store, index) => (
                  <option key={index} value={store}>
                    {store}
                  </option>
                ))}
            </select>
            <BrandIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <label htmlFor="saving_plan_order" className="sr-only">
            Transmisión
          </label>
          <div className="flex bg-white">
            <select
              id="saving_plan_order"
              name="saving_plan_order"
              value={selectedTransmision}
              onChange={(e) => setSelectedTransmision(e.target.value)}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            >
              <option value="">Transmisión</option>
              <option key='Automatica' value='Automatica'>Automatica</option>
              <option key='Manual' value='Manual'>Manual</option>
              <option key='Electrico ' value='Electrico '>Electrico </option>
            </select>
            <BrandIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <label htmlFor="color" className="sr-only">
            Color
          </label>
          <div className="flex bg-white">
            <select
              id="color"
              name="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            >
              <option value="">Color</option>
              <option key='AZUL' value='AZUL'>AZUL</option>
              <option key='BEIGE' value='BEIGE'>BEIGE</option>
              <option key='BLANCO ' value='BLANCO '>BLANCO</option>
              <option key='CAFE ' value='CAFE '>CAFE</option>
              <option key='CREMA ' value='CREMA '>CREMA</option>
              <option key='DORADO ' value='DORADO '>DORADO</option>
              <option key='NEGRO ' value='NEGRO '>NEGRO</option>
              <option key='PLATA ' value='PLATA '>PLATA</option>
              <option key='PLATEADO ' value='PLATEADO '>PLATEADO</option>
              <option key='PLOMO ' value='PLOMO '>PLOMO</option>
              <option key='ROJO ' value='ROJO '>ROJO</option>
              <option key='VERDE ' value='VERDE '>VERDE</option>
              <option key='VINO ' value='VINO '>VINO</option>
            </select>
            <BrandIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <label htmlFor="license_plate" className="sr-only">
            Último dígito de placa
          </label>
          <div className="flex bg-white">
            <select
              id="license_plate"
              name="license_plate"
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              className="relative block w-full pl-10 py-3 font-light shadow-lg rounded border-0 focus:z-10 focus:border-main focus:ring-main text-xs"
            >
              <option value="">Último dígito de placa</option>
              <option key='0' value='0'>0</option>
              <option key='1' value='1'>1</option>
              <option key='2' value='2'>2</option>
              <option key='3' value='3'>3</option>
              <option key='4' value='4'>4</option>
              <option key='5' value='5'>5</option>
              <option key='6' value='6'>6</option>
              <option key='7' value='7'>7</option>
              <option key='8' value='8'>8</option>
              <option key='9' value='9'>9</option>
            </select>
            <BrandIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-4 lg:col-span-3">
          <div className="flex bg-white">
            <div className="flex justify-between px-1 pl-6 py-3 items-center w-full shadow-lg rounded pr-2">
              <label
                htmlFor="owner"
                className="ml-3 block text-xs font-light text-gray-700"
              >
                Un solo dueño
              </label>
              <input
                type="checkbox"
                checked={selectedOwner}
                id="owner"
                name="owner"
                value="owner"
                onChange={(e) => setSelectedOwner(!selectedOwner)}
                className="h-4 border-gray-300  text-main focus:ring-main rounded-full"
              />
            </div>
            <StarIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-4 lg:col-span-3">
          <div className="flex bg-white">
            <div className="flex justify-between px-1 pl-6 py-3 items-center w-full shadow-lg rounded pr-2">
              <label
                htmlFor="kilometers"
                className="ml-3 block text-xs font-light text-gray-700"
              >
                Menor kilometraje
              </label>
              <input
                type="checkbox"
                checked={selectedKm}
                id="kilometers"
                name="kilometers"
                value="kilometers"
                onChange={(e) => setSelectedKm(!selectedKm)}
                className="h-4 border-gray-300  text-main focus:ring-main rounded-full"
              />
            </div>
            <KmIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-4 lg:col-span-2">
          <div className="flex bg-white">
            <div className="flex justify-between px-1 pl-6 py-3 items-center w-full shadow-lg rounded pr-2">
              <label
                htmlFor="homeMaintenance"
                className="ml-3 block text-xs font-light text-gray-700"
              >
                Mantenimiento en casa
              </label>
              <input
                type="checkbox"
                checked={selectedMaintenance}
                id="homeMaintenance"
                name="homeMaintenance"
                value="homeMaintenance"
                onChange={(e) => setSelectedMaintenance(!selectedMaintenance)}
                className="h-4 border-gray-300  text-main focus:ring-main rounded-full"
              />
            </div>
            <MaintenanceIcon />
          </div>
        </div>

        <div className="col-span-1 md:col-span-4 lg:col-span-8 bg-white">
          <label htmlFor="model" className="sr-only">
            Tipo
          </label>
          <input
            type="hidden"
            id="type"
            name="type"
            value={selectedModelos?.id || ""}
          />
          <div className="flex flex-col bg-white shadow-lg rounded pb-4 w-full">
            <RadioGroup value={selectedModelos} onChange={setSelectedModelos}>
              <RadioGroup.Label className="text-base font-semibold leading-6 text-gray-900">
                <div className="flex">
                  <p className="pl-10 py-3 font-light text-xs">Tipo</p>
                  <ModelIcon />
                </div>
              </RadioGroup.Label>

              <div className="mt-1 grid grid-cols-2 gap-y-6 md:grid-cols-4 md:gap-x-4 lg:grid-cols-4 px-2 divide-x divide-gray-500/20">
                {modelos.map((modelo) => (
                  <RadioGroup.Option
                    key={modelo.id}
                    value={modelo}
                    className="relative flex cursor-pointer bg-white p-1 focus:outline-none"
                  >
                    {({ checked, active }) => (
                      <>
                        <span className="flex flex-1 justify-center items-center">
                          <span className="flex flex-col justify-center items-center">
                            <Image
                              alt={modelo.title}
                              src={"/" + modelo.image}
                              width={150}
                              height={63}
                            />
                            <RadioGroup.Description
                              as="span"
                              className="mt-1 flex justify-center font-light items-center text-xs uppercase text-gray-500"
                            >
                              <p>{modelo.title}</p>
                            </RadioGroup.Description>
                          </span>
                        </span>
                        <CheckCircleIcon
                          className={classNames(
                            !checked ? "invisible" : "",
                            "h-5 w-5 text-main"
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={classNames(
                            active ? "border" : "border-2",
                            checked ? "border-main" : "border-transparent",
                            "pointer-events-none absolute -inset-px rounded"
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mx-auto">
        <Button title={buttonTitle} />
      </div>
    </form>
  );
}

function BrandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 375 184"
      className="w-5 absolute ml-3 mt-4 z-10"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-9.936a4.974 4.974 0 00-4.968 4.968A4.974 4.974 0 000 0a4.974 4.974 0 004.968-4.968A4.974 4.974 0 000-9.936M0-8.47a3.502 3.502 0 110 7.004A3.502 3.502 0 010-8.47"
        transform="translate(-1957.81 -4491.41) scale(8.33333) translate(269.328 561.045)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-9.748a4.88 4.88 0 00-4.874 4.874A4.88 4.88 0 000 0a4.879 4.879 0 004.874-4.874A4.88 4.88 0 000-9.748m0 1.466a3.408 3.408 0 110 6.816 3.408 3.408 0 010-6.816"
        transform="translate(-1957.81 -4491.41) scale(8.33333) translate(245.092 560.951)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-19.492c-3.417 0-6.945 1.39-10.485 4.132-2.615 2.025-4.29 4.082-4.472 4.31l-.072.089a16.28 16.28 0 00-3.646 4.95c-.966.366-1.763 1.254-1.763 2.604 0 2.353 1.554 2.828 2.803 3.209l.173.053.208.064.218.001 2.084.008 1.761.007-.312-1.733a3.273 3.273 0 01-.057-.585 3.28 3.28 0 013.276-3.276 3.28 3.28 0 013.276 3.276c0 .197-.02.397-.06.61l-.326 1.731 1.761.007L3.191 0h7.892l-.343-1.748a3.279 3.279 0 013.213-3.911 3.279 3.279 0 013.212 3.911L16.822 0h3.118l.187-.05c3.12-.84 3.635-1.484 3.829-1.726.471-.589.643-1.369.474-2.142-.2-.91-.839-1.685-1.804-2.191-.208-.318-.352-1.427-.293-2.309l.056-.841-.699-.472c-.125-.084-2.998-1.99-8.264-2.883C12.13-14.243 7.383-19.492 0-19.492m0 1.466c7.802 0 12.385 6.444 12.577 6.719l-.052.035c5.439.797 8.345 2.757 8.345 2.757s-.204 3.065 1.021 3.678c1.226.613 1.329 1.634.92 2.145-.409.511-3.065 1.226-3.065 1.226h-1.142a4.743 4.743 0 10-9.303 0H3.197l-8.824-.035a4.743 4.743 0 10-9.399-.882c0 .289.03.57.08.845l-2.085-.008c-1.328-.409-1.941-.533-1.941-1.861 0-1.328 1.329-1.328 1.329-1.328 1.109-2.606 2.666-4.334 3.861-5.374l-.031-.025c.258-.322 6.406-7.892 13.813-7.892"
        transform="translate(-1957.81 -4491.41) scale(8.33333) translate(255.376 558.461)"
      ></path>
      <path
        fill="#E53D30"
        d="M241.684 3963.47H268.532V3964.9359999999997H241.684z"
        transform="translate(-1957.81 -4491.41) scale(8.33333) matrix(-1 0 0 1 510.216 -3417.65)"
      ></path>
      <path
        fill="#E53D30"
        d="M-1.319 0.027H0.14600000000000013V7.099H-1.319z"
        transform="translate(-1957.81 -4491.41) scale(8.33333) scale(-1 1) rotate(-2.345 13049.936 6464.262)"
      ></path>
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 225 225"
      className="w-4 absolute ml-3 mt-3 z-10"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-.783c-1.913 1.907-3.822 3.819-5.732 5.73l-5.732 5.731c-.745.745-1.586.747-2.326.007l-8.708-8.708c-.752-.752-.749-1.588.008-2.346 3.796-3.796 7.595-7.588 11.383-11.392.468-.469.987-.634 1.637-.575 1.511.138 3.024.238 4.537.354 1.136.088 2.273.168 3.409.268.76.068 1.357.671 1.417 1.429.167 2.097.323 4.196.484 6.294.05.656.104 1.311.147 1.856C.55-1.526.347-1.129 0-.783m1.571-9.636c-.146-1.678-1.45-2.877-3.131-2.993-2.178-.15-4.354-.332-6.531-.503-.425-.034-.85-.081-1.275-.122h-.948c-.03.015-.059.039-.091.044-.7.112-1.285.442-1.783.94-3.857 3.858-7.718 7.714-11.572 11.576-1.323 1.326-1.314 3.257.01 4.583 2.945 2.948 5.891 5.894 8.839 8.839 1.298 1.296 3.249 1.309 4.546.014C-6.497 8.099-2.635 4.232 1.229.368c.346-.346.625-.736.784-1.201.082-.238.136-.485.202-.728v-.895c-.052-.547-.112-1.094-.154-1.642-.165-2.107-.307-4.216-.49-6.321"
        transform="translate(-6253.72 -4486.71) scale(8.33333) translate(775.195 552.442)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 3.032A1.514 1.514 0 11.031.005 1.514 1.514 0 010 3.032m.054-4.714c-1.715-.037-3.208 1.393-3.237 3.101-.029 1.785 1.357 3.263 3.093 3.297 1.813.035 3.274-1.363 3.305-3.165.03-1.747-1.386-3.195-3.161-3.233"
        transform="translate(-6253.72 -4486.71) scale(8.33333) translate(770.169 544.112)"
      ></path>
    </svg>
  );
}

function YearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 256 225"
      className="w-4 absolute ml-3 mt-3 z-10"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-3.924C-.385-1.261-1.178 1.271-2.614 3.56c-.527.84-1.19 1.596-1.808 2.377a.576.576 0 01-.403.183c-6.869.009-13.738.008-20.607.008h-.24c2.823-3.739 4.009-7.986 4.222-12.565H.261C.174-5.584.119-4.749 0-3.924m.235 13.63h-21.661V7.925h.346c5.531 0 11.061-.003 16.592.006.42.001.749-.124 1.046-.413C-1.918 6.033-.827 4.257.065 2.345c.044-.094.09-.188.17-.353v7.714zm-21.659-21.528h3.638c0 .268-.003.544 0 .819.008.554.388.955.901.953.513-.001.888-.402.895-.959.004-.268.001-.535.001-.82h4.494c0 .255-.002.52 0 .784.004.585.367.99.89.995.534.006.903-.404.907-1.007v-.767h4.554c0 .3-.005.579.001.857.012.529.405.923.907.917.489-.005.873-.393.887-.906.008-.287.001-.574.001-.875H.226v3.561h-21.65v-3.552zM.932-13.643h-4.279c0-.301.003-.577-.001-.854-.009-.55-.398-.95-.911-.943-.501.007-.876.403-.885.94-.004.269 0 .538 0 .832h-4.554c0-.256.002-.521 0-.786-.005-.581-.376-.986-.899-.986-.524 0-.894.406-.898.987-.002.258 0 .516 0 .791h-4.494c0-.286.004-.563-.001-.84-.009-.537-.385-.931-.886-.938-.514-.007-.901.394-.909.945-.004.269-.001.538-.001.852h-4.43c-.663.001-1.021.356-1.022 1.013-.002 1.917.03 3.834-.011 5.75-.077 3.661-.913 7.13-2.753 10.323-.621 1.077-1.36 2.065-2.298 2.895-.136.121-.222.298-.33.449v.479c.232.506.627.678 1.177.668 1.288-.026 2.576-.009 3.864-.009h.351v2.356c0 .12-.004.24.001.359a.906.906 0 00.885.879c.08.004.16.001.24.001H.919c.805 0 1.126-.319 1.126-1.12v-22.941c0-.779-.327-1.102-1.113-1.102"
        transform="translate(-10382.4 -4449.42) scale(8.33333) translate(1274.52 549.371)"
      ></path>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 237 225"
      className="w-4 absolute ml-3 mt-3 z-10"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-26.961l3.346 10.298h10.828l-8.76 6.365L8.76 0 0-6.365-8.76 0l3.346-10.298-8.76-6.365h10.828L0-26.961z"
        transform="translate(-2026.91 -5183.39) scale(8.33333) translate(257.403 648.968)"
      ></path>
    </svg>
  );
}

function KmIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 317 196"
      className="w-4 absolute ml-3 mt-4 z-10"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 20.205h-13.585c.356-1.235.136-2.352-.703-3.351l4.035-6.056-1.853-1.238c-.094.137-.17.245-.243.355-1.248 1.872-2.498 3.743-3.743 5.617-.108.163-.203.272-.436.254-2.328-.183-4.131 2.048-3.449 4.303.01.034.001.073.001.129h-13.562c.007-1.577-.074-3.14.201-4.731l2.124 1.102 1.034-1.974-2.652-1.395c.388-1.373.976-2.651 1.728-3.912l2.688 1.795 1.243-1.854-2.631-1.767c1.006-1.275 2.18-2.336 3.531-3.286l1.956 2.701 1.808-1.309-1.831-2.54A16.544 16.544 0 01-17.9 1.279v3.275h2.243V1.282c2.143.132 4.129.665 6.082 1.578l-1.965 2.723 1.803 1.313 2.125-2.929a16.656 16.656 0 013.7 3.291l-2.965 1.993 1.241 1.853 3.019-2.018c.053.061.107.11.143.17a16.916 16.916 0 011.615 3.449c.077.226.033.322-.175.428-.945.482-1.88.981-2.838 1.485l1.036 1.973 2.59-1.348c.32 1.656.237 3.295.246 4.962m-16.76.031a1.124 1.124 0 01-1.124-1.134 1.115 1.115 0 012.228.015c.001.605-.5 1.113-1.104 1.119m18.548-6.302C-.209 4.328-9.686-2.265-19.408-.826c-4.661.691-8.567 2.795-11.674 6.333-2.763 3.148-4.34 6.83-4.611 11.014-.126 1.947-.054 3.907-.071 5.861 0 .02.023.04.052.088h.423l37.151-.001c.124 0 .248-.003.371-.005v-5.642c-.021-.108-.048-.215-.064-.324-.126-.855-.205-1.72-.381-2.564"
        transform="translate(-6253.72 -5205.9) scale(8.33333) translate(786.216 625.731)"
      ></path>
    </svg>
  );
}

function MaintenanceIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 113 225"
      className="w-2 absolute ml-4 mt-3 z-10"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-16.943a1.804 1.804 0 011.807-1.791c.993.004 1.793.81 1.789 1.804a1.796 1.796 0 01-1.802 1.792A1.806 1.806 0 010-16.943m4.289-4.942a6.725 6.725 0 00-6.869 5.462c-.383 1.972.045 3.793 1.271 5.39C-.26-9.666 1.103-8.842 2.736-8.511c-.011.07-.018.142-.018.215V3.692a1.38 1.38 0 002.759 0V-8.296c0-.074-.008-.146-.019-.217 3.443-.741 5.619-3.966 5.342-7.192a6.772 6.772 0 00-6.511-6.18"
        transform="translate(-10453.8 -5172.58) scale(8.33333) translate(1257.17 642.6)"
      ></path>
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 320 225"
      className="w-5 absolute ml-3 mt-3 z-10"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-.015c-.303-.659-.6-1.334-.887-1.987l-.083-.19c3.196.256 6.875.279 10.437-1.113v1.292l-.286.019c-.372.024-.758.049-1.137.085-1.547.148-3.194.384-4.758 1.099-.317.144-.604.34-.882.529-.138.094-.281.191-.422.278l-.009.005c-.05.031-.143.089-.179.091A30.171 30.171 0 01.083.037.204.204 0 010-.015m-1.182 7.881c.152-.265.299-.537.441-.799.133-.246.271-.5.41-.746a.504.504 0 01.083-.107c.43.01.859.036 1.313.063l.23.014v2.175l-.239-.012a31.746 31.746 0 01-1.175-.071c-.381-.033-.762-.08-1.165-.129a54.306 54.306 0 00-.142-.018 4.14 4.14 0 00.244-.37m2.405-3.891v.252H.304l.109-2.121h.809l.001 1.869M9.524-7.289a28.24 28.24 0 01-.118 1.623c-.014.025-.069.091-.288.231-.837.535-1.785.768-2.602.925-3.223.619-6.391.6-9.416-.057-.156-.033-.321-.125-.481-.214l-.013-.007a83.284 83.284 0 01-1.881-1.067.436.436 0 01-.11-.09 36.44 36.44 0 01-.011-1.357v-.072c5.013 1.58 9.905 1.547 14.93-.103l-.01.188m-.227-2.46c-.474.272-1.029.576-1.607.751-2.106.638-4.459.859-7.402.698-1.701-.093-3.072-.335-4.312-.76a6.319 6.319 0 01-1.065-.474c-.372-.209-.406-.309-.409-.309.001-.004.032-.103.422-.307a8.171 8.171 0 011.422-.57c1.926-.579 3.905-.679 5.588-.701 1.951.031 4.034.157 6.053.856.392.135.803.34 1.296.644a.798.798 0 01.127.094.693.693 0 01-.113.078m-10.9 12.576C-1.665 6.781-4.909 9.96-8.857 9.96l-.102-.001a7.237 7.237 0 01-5.134-2.231c-1.343-1.389-2.062-3.197-2.025-5.091.078-3.987 3.27-7.187 7.141-7.187l.115.001c1.989.033 3.834.813 5.196 2.197a7.167 7.167 0 012.063 5.179m19.781 2.625c-.003.201-.115.356-.375.515-.647.396-1.41.672-2.4.868-3.758.743-7.185.658-10.476-.261-.365-.102-.713-.272-1.081-.451a19.907 19.907 0 00-.329-.159c-.144-.067-.238-.164-.229-.416.018-.461.014-.913.011-1.391l-.002-.21C5.929 5.018 8.641 5.149 10.74 5.14c2.233-.011 4.847-.172 7.442-1.256v.215c.002.467.003.908-.004 1.353m-.238-3.744c-.849.419-1.559.7-2.234.884-1.724.471-3.496.547-5.156.557-1.726-.019-3.757-.127-5.742-.78-.425-.14-.866-.355-1.428-.698a.644.644 0 01-.142-.107.782.782 0 01.16-.144C4.088.913 4.923.689 5.719.503c1.822-.426 3.824-.58 6.122-.472 1.497.07 3.257.224 4.959.831.389.139.764.317 1.113.529a.844.844 0 01.233.183.7.7 0 01-.206.134M3.361 8.369l.001-.165c4.967 1.546 9.943 1.514 14.803-.094l.001.187c.005.52.009 1.057-.018 1.58a.525.525 0 01-.227.214c-.13.058-.259.118-.389.177-.545.25-1.108.508-1.678.66-1.768.471-3.754.655-6.068.563-1.54-.061-3.346-.208-5.067-.83-.442-.16-.867-.412-1.189-.613a.447.447 0 01-.154-.278 25.266 25.266 0 01-.015-1.401M20.16 1.132c-.244-.646-.633-1.134-1.158-1.451a8.154 8.154 0 00-1.109-.583c-1.25-.51-2.642-.82-4.516-1.006-.47-.046-.931-.076-1.419-.109l-.431-.029v-.19l-.001-2.034c-.002-1.68-.004-3.417.006-5.124.006-.986-.386-1.741-1.166-2.243a8.307 8.307 0 00-1.627-.808c-1.484-.542-3.124-.834-5.317-.946-2.943-.15-5.362.077-7.613.715-.839.237-1.803.576-2.589 1.287-.524.474-.768 1.015-.745 1.654.03.86.053 1.736.074 2.582l.018.662v.014a27.935 27.935 0 01-.719-.026c-.69-.03-1.403-.062-2.087.058-3.949.689-6.561 3.027-7.552 6.761-1.004 3.787.108 7.124 3.216 9.651a8.976 8.976 0 005.681 2.005c1.95 0 3.917-.619 5.591-1.862a.639.639 0 01.245-.125c1.273.276 2.642.428 4.436.492a.275.275 0 01.066.023c.247.693.771 1.23 1.518 1.556.707.308 1.641.691 2.605.915 1.594.37 3.256.555 5.027.555 1.028 0 2.093-.062 3.201-.187 1.279-.143 2.948-.404 4.523-1.161.975-.469 1.561-1.062 1.844-1.865l.014-.041V1.175l-.016-.043z"
        transform="translate(-1985.33 -3770.41) scale(8.33333) translate(256.39 465.885)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-2.087a4.59 4.59 0 00-.733-.115l-.248-.027a1.075 1.075 0 01-.906-1.326c.138-.513.606-.862 1.107-.83.563.037.966.444 1.026 1.038.07.694.505 1.103 1.112 1.044a.958.958 0 00.668-.348c.185-.228.264-.547.225-.898-.137-1.234-.767-2.104-1.872-2.586-.176-.077-.191-.108-.195-.247-.015-.568-.443-.994-.995-.994h-.008c-.561.004-.987.438-.991 1.008-.001.12-.001.132-.175.202-.8.322-1.434.965-1.739 1.765a3.02 3.02 0 00.112 2.438C-3.065-.852-2.114-.258-.786-.198c.5.022.907.353 1.013.823.107.475-.114.969-.536 1.202a1.043 1.043 0 01-1.006.017c-.339-.18-.565-.536-.603-.952-.06-.647-.465-1.032-1.057-1.005-.579.027-.956.477-.938 1.121.017.641.237 1.239.653 1.778.353.458.826.796 1.442 1.031l-.001.038c-.004.167-.008.339.01.514.047.445.317.765.741.879.101.028.199.041.294.041a.836.836 0 00.739-.404c.14-.232.223-.539.221-.821-.002-.232.03-.283.225-.363 1.171-.485 1.95-1.74 1.853-2.986C2.159-.646 1.27-1.746 0-2.087"
        transform="translate(-1985.33 -3770.41) scale(8.33333) translate(248.36 469.538)"
      ></path>
    </svg>
  );
}

function ModelIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 444 209"
      className="w-5 absolute ml-3 mt-4 z-10"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-21.357a3.198 3.198 0 00-3.195 3.195v4.045l-23.452.11a3.208 3.208 0 00-3.187 3.201v7.612A3.198 3.198 0 00-26.64 0h3.239l-.182-1.929a4.052 4.052 0 014.027-4.44 4.052 4.052 0 014.028 4.44L-15.71 0H7.941l-.183-1.929a4.052 4.052 0 014.027-4.44 4.052 4.052 0 014.028 4.44L15.63 0h4.575a3.198 3.198 0 003.194-3.194v-6.989c0-1.537-1.098-3.068-2.555-3.56l-.228-.077-.241-.013-4.659-.252c-.902-.805-3.329-3.432-5.312-5.686l-.051-.058-.056-.053c-.897-.855-2.446-1.475-3.683-1.475H0zm0 1.763h6.614c.787 0 1.896.445 2.466.988 0 0 5.281 6.002 6.026 6.254l5.174.28c.746.252 1.355 1.102 1.355 1.889v6.989c0 .787-.643 1.431-1.43 1.431h-2.637a5.817 5.817 0 00-5.783-6.37 5.818 5.818 0 00-5.811 5.811c0 .189.011.374.029.559h-19.776a5.817 5.817 0 00-5.783-6.37 5.818 5.818 0 00-5.783 6.37h-1.301c-.787 0-1.43-.644-1.43-1.431v-7.612c0-.787.643-1.434 1.43-1.437l23.778-.113a1.442 1.442 0 001.431-1.437v-4.369c0-.788.643-1.432 1.431-1.432"
        transform="translate(-2041.7 -6076.86) scale(8.33333) translate(274.838 750.58)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-11.448a5.73 5.73 0 00-5.724 5.724c0 .213.014.432.042.673A5.72 5.72 0 000 0a5.72 5.72 0 005.682-5.052c.029-.24.042-.459.042-.672A5.73 5.73 0 000-11.448m0 1.764a3.96 3.96 0 110 7.922 3.96 3.96 0 010-7.922"
        transform="translate(-2041.7 -6076.86) scale(8.33333) translate(286.623 754.257)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-11.434a5.724 5.724 0 00-5.718 5.717c0 .209.014.429.043.672a5.714 5.714 0 0011.351-.002A5.723 5.723 0 000-11.434m0 1.763a3.953 3.953 0 110 7.907 3.953 3.953 0 010-7.907"
        transform="translate(-2041.7 -6076.86) scale(8.33333) translate(255.282 754.181)"
      ></path>
      <path
        fill="#E53D30"
        d="M271.39 3772.62H290.584V3774.383H271.39z"
        transform="translate(-2041.7 -6076.86) scale(8.33333) translate(0 -3036.26)"
      ></path>
    </svg>
  );
}
