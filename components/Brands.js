import { useRouter } from "next/router"; // Importar el hook useRouter
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import { Autoplay, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Brands() {
  const router = useRouter(); // Inicializar el router

  // Función para manejar el clic en una imagen
  const handleClick = (index) => {
    switch (index) {
      case 1:
        // Redirigir a la URL específica para Nissan
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=NISSAN&model=&agency=&type=";
        break;
      case 2:
        // Redirigir a la URL específica para Toyota
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=TOYOTA&model=&agency=&type=";
        break;
      case 3:
        // Redirigir a la URL específica para Kia
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=KIA&model=&agency=&type=";
        break;
      case 4:
        // Redirigir a la URL específica para Volkswagen
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=VOLKSWAGEN&model=&agency=&type=";
        break;
      case 5:
        // Redirigir a la URL específica para Chevrolet
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=CHEVROLET&model=&agency=&type=";
        break;
      case 6:
        // Redirigir a la URL específica para Mazda
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=MAZDA&model=&agency=&type=";
        break;
      case 7:
        // Redirigir a la URL específica para Renault
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=RENAULT&model=&agency=&type=";
        break;
      case 8:
        // Redirigir a la URL específica para Suzuki
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=SUZUKI&model=&agency=&type=";
        break;
      case 9:
        // Redirigir a la URL específica para Audi
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=AUDI&model=&agency=&type=";
        break;
      case 10:
        // Redirigir a la URL específica para Mercedes
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=MERCEDES+BENZ&model=&agency=&type=";
        break;
      case 11:
        // Redirigir a la URL específica para BMW
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=BMW&model=&agency=&type=";
        break;
      case 12:
        // Redirigir a la URL específica para Peugeot
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=PEUGEOT&model=&agency=&type=";
        break;
      case 13:
        // Redirigir a la URL específica para Jeep
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=JEEP&model=&agency=&type=";
        break;
      case 14:
        // Redirigir a la URL específica para Hyundai
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=HYUNDAI&model=&agency=&type=";
        break;
      case 15:
        // Redirigir a la URL específica para Great Wall
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=GREAT+WALL&model=&agency=&type=";
        break;
      case 16:
        // Redirigir a la URL específica para Ford
        window.location.href = "https://www.autocor.com.ec/vehiculos?priceFrom=&priceTo=&yearFrom=&yearTo=&brand=FORD&model=&agency=&type=";
        break;
      default:
        // Redirigir a una página interna para otras marcas
        const brandName = `Marca${index}`; // Nombre dinámico de la marca
        router.push(`/autos?marca=${brandName}`);
        break;
    }
  };

  return (
    <div className="bg-[url('/fondo-marcas.jpg')] py-20 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 overflow-hidden">
        <h2 className="text-center text-3xl font-bold leading-8 text-white">
          EL CONCESIONARIO DE TODAS LAS MARCAS
        </h2>
        <div className="mx-auto mt-10 max-w-lg items-center gap-x-8 gap-y-10 sm:max-w-xl sm:gap-x-10 lg:mx-0 lg:max-w-none">
          <Swiper
            modules={[Autoplay, Navigation]}
            slidesPerView={6} // Mantener 6 imágenes en vista de escritorio
            spaceBetween={10}
            navigation={false}
            autoplay={{
              delay: 2500,
              disableOnInteraction: true,
            }}
            breakpoints={{
              // Para pantallas más pequeñas (tabletas o móviles)
              320: {
                slidesPerView: 2, // Mostrar 2 imágenes por vista en móviles
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 3, // Mostrar 3 imágenes por vista en pantallas medianas
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 4, // Mostrar 4 imágenes por vista en pantallas más grandes
                spaceBetween: 10,
              },
              1024: {
                slidesPerView: 6, // Mantener 6 imágenes en pantallas grandes
                spaceBetween: 10,
              },
            }}
            className="mySwiper"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((index) => (
              <SwiperSlide key={index}>
                <div
                  className={`bg-white py-8 px-6 rounded-lg flex justify-center items-center ${index === 13 ? 'h-[210px]' : 'h-[210px]'
                    }`}
                >
                  <button onClick={() => handleClick(index)}>
                    <Image
                      src={`/marca${index}.png`}
                      alt={`Marca${index}`}
                      width={index === 13 ? 800 : 696}
                      height={index === 13 ? 800 : 709}
                    />
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}