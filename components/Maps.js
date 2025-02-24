import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { useState } from "react";
import "animate.css/animate.min.css";
import { SectionText } from "../components/Shared";
import Image from "next/image";

export default function Maps({ agencias }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [mapId, setMapId] = useState(10000);
  const [latitude, setLatitude] = useState(-0.17946725681236703);
  const [longitude, setLongitude] = useState(-78.46521528538901);
  const [zoom, setZoom] = useState(12);

  function handleClickAgencie(lat, lon, id, zoom) {
    setLatitude(lat);
    setLongitude(lon);
    setMapId(id);
    setZoom(zoom);
  }

  let center = { lat: latitude, lng: longitude };

  return (
    <main className="max-w-7xl mx-auto">
      <div className="w-full flexjustify-start items-center">
        <div className="px-12 lg:px-8">
          <div className="py-2">
            <div className="mx-auto">
              <SectionText
                title="Ven a nuestros concesionarios"
                subtitle="Tu Seminuevo espera por ti"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row py-8">
        <div className="w-full flex flex-col justify-start items-center h-full">
          <div className="px-12 lg:px-8">
            <div className="">
              <ul role="list" className="overflow-scroll md:max-h-[780px]">
                {agencias.map((position, index) => (
                  <li key={position.id} className="py-2">
                    <div
                      key={index}
                      className="bg-white shadow-2xl rounded-lg py-6 px-6 text-gray-600 flex gap-4 hover:bg-main hover:text-white"
                    >
                      <button
                        onClick={() => {
                          handleClickAgencie(
                            position.location.latitude,
                            position.location.longitude,
                            position.id,
                            16
                          );
                        }}
                        className="flex flex-col md:flex-row w-full gap-2 justify-center items-center"
                      >
                        <div className="w-60 h-48 relative">
                          <Image
                            src={position.src}
                            alt=""
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                            className="absolute object-cover rounded-lg"
                          />
                        </div>
                        <div className="space-y-1 flex flex-col flex-1 px-2 text-sm">
                          <p className="font-bold text-lg">{position.name}</p>
                          <p className="font-light">Dirección: {position.address}</p>
                          <p className="font-light">Horario: {position.time}</p>
                          <p className="font-light">
                            Teléfono:
                            <a
                              href={`https://wa.me/${position.phone.replace(/[^0-9]/g, '')}`} // Asegúrate de que el número esté en formato internacional sin caracteres no numéricos
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-white cursor-pointer"
                            >
                              {position.phone}
                            </a>
                          </p>
                        </div>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full py-8 px-6 h-full lg:h-[780px] flex justify-center items-center mx-auto my-auto shadow-2xl rounded-xl">
          {isLoaded && (
            <GoogleMap
              zoom={zoom}
              center={center}
              mapId={1}
              mapContainerClassName="map-container"
            >
              {agencias.map((position, index) => (
                <MarkerF
                  key={index + 1}
                  position={{
                    lat: position.location.latitude,
                    lng: position.location.longitude,
                  }}
                  title={position.name}
                  visible={true}
                />
              ))}
            </GoogleMap>
          )}
        </div>
      </div>
    </main>
  );
}
