import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";

const PHOTO_DURATION = 4000;
const FADE_DURATION = 500;
const REFRESH_INTERVAL = 13 * 60 * 1000; // ~13 min = 1 ciclo completo (40 autos × 5 fotos × 4s)

function formatPrice(prices) {
  if (!prices || !Array.isArray(prices)) return null;
  const sale = prices.find((p) => p.type === "SALE_COST");
  const raw = sale?.value;
  if (!raw) return null;
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(raw));
}

function formatKm(km) {
  if (!km || Number(km) === 0) return null;
  return new Intl.NumberFormat("es-EC").format(Number(km)) + " km";
}

function getTypeName(type) {
  if (!type) return null;
  if (typeof type === "string") return type;
  return type.name || null;
}

export default function GaleriaComercial() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [vehicleIdx, setVehicleIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const progressStartRef = useRef(null);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const fetchVehicles = useCallback(() => {
    axios
      .get("/api/galeriaVehiculos")
      .then(({ data }) => {
        setVehicles(data);
        setVehicleIdx(0);
        setPhotoIdx(0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchVehicles]);

  const currentVehicle = vehicles[vehicleIdx] || null;
  const currentImages = currentVehicle?.images || [];
  const currentPhoto =
    currentImages[photoIdx] || "/foto-autocor.jpg";

  const goToPhoto = useCallback(
    (nextPhotoIdx, nextVehicleIdx) => {
      setVisible(false);
      setTimeout(() => {
        if (nextVehicleIdx !== vehicleIdx) {
          setVehicleIdx(nextVehicleIdx);
          setPhotoIdx(0);
        } else {
          setPhotoIdx(nextPhotoIdx);
        }
        setProgress(0);
        setVisible(true);
      }, FADE_DURATION);
    },
    [vehicleIdx]
  );

  const advance = useCallback(() => {
    if (vehicles.length === 0) return;
    const photosCount = currentImages.length || 1;
    if (photoIdx < photosCount - 1) {
      goToPhoto(photoIdx + 1, vehicleIdx);
    } else {
      const nextVehicle = (vehicleIdx + 1) % vehicles.length;
      goToPhoto(0, nextVehicle);
    }
  }, [vehicles, vehicleIdx, photoIdx, currentImages, goToPhoto]);

  const prevVehicle = useCallback(() => {
    if (vehicles.length === 0) return;
    const prev = (vehicleIdx - 1 + vehicles.length) % vehicles.length;
    goToPhoto(0, prev);
  }, [vehicles, vehicleIdx, goToPhoto]);

  const nextVehicle = useCallback(() => {
    if (vehicles.length === 0) return;
    const next = (vehicleIdx + 1) % vehicles.length;
    goToPhoto(0, next);
  }, [vehicles, vehicleIdx, goToPhoto]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || vehicles.length === 0) return;

    setProgress(0);
    progressStartRef.current = Date.now();

    progressRef.current = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - progressStartRef.current;
      setProgress(Math.min((elapsed / PHOTO_DURATION) * 100, 100));
      if (elapsed < PHOTO_DURATION) {
        progressRef.current = requestAnimationFrame(tick);
      }
    });

    timerRef.current = setTimeout(() => {
      advance();
    }, PHOTO_DURATION);

    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(progressRef.current);
    };
  }, [isPlaying, vehicleIdx, photoIdx, vehicles, advance]);

  if (loading) {
    return (
      <>
        <Head><title>Galería Comercial | AUTOCOR</title></Head>
        <Header selected="gallery" />
        <div className="flex items-center justify-center h-screen bg-black">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-light tracking-widest uppercase">
              Cargando galería…
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || vehicles.length === 0) {
    return (
      <>
        <Head><title>Galería Comercial | AUTOCOR</title></Head>
        <Header selected="gallery" />
        <div className="flex items-center justify-center h-screen bg-black text-white">
          <p className="text-xl">No hay vehículos disponibles en este momento.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Galería Comercial | AUTOCOR</title>
      </Head>
      {!isFullscreen && <Header selected="gallery" />}

      <div
        className="relative w-full bg-black overflow-hidden"
        style={{ height: isFullscreen ? "100vh" : "calc(100vh - 60px)" }}
      >

        {/* Foto principal con fade */}
        <div
          className="absolute inset-0 transition-opacity"
          style={{
            opacity: visible ? 1 : 0,
            transitionDuration: `${FADE_DURATION}ms`,
          }}
        >
          <Image
            key={`${vehicleIdx}-${photoIdx}`}
            src={currentPhoto}
            alt={`${currentVehicle?.brand} ${currentVehicle?.model}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized
          />
        </div>

        {/* Gradiente inferior */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

        {/* Contador de vehículo + controles — arriba derecha */}
        <div className="absolute top-4 right-6 flex items-center gap-3 z-10">
          <span className="text-white/70 text-sm font-light tracking-widest uppercase">
            Auto {vehicleIdx + 1} de {vehicles.length}
          </span>
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition"
            title={isPlaying ? "Pausar" : "Reproducir"}
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-white/10 hover:bg-main text-white rounded-full p-2 transition"
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="w-4 h-4" />
            ) : (
              <ArrowsPointingOutIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Título galería — arriba izquierda */}
        <div className="absolute top-4 left-6 z-10">
          <span className="text-main text-xs font-semibold tracking-widest uppercase">
            Galería Comercial
          </span>
        </div>

        {/* Flechas de navegación entre vehículos */}
        <button
          onClick={prevVehicle}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-main text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <ChevronLeftIcon className="w-7 h-7" />
        </button>
        <button
          onClick={nextVehicle}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-main text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <ChevronRightIcon className="w-7 h-7" />
        </button>

        {/* Info del vehículo — abajo izquierda */}
        <div
          className="absolute bottom-16 left-6 z-10 transition-opacity"
          style={{
            opacity: visible ? 1 : 0,
            transitionDuration: `${FADE_DURATION}ms`,
          }}
        >
          <p className="text-main text-xs font-semibold tracking-widest uppercase mb-1">
            {getTypeName(currentVehicle?.type) || "Vehículo"}
          </p>
          <h2 className="text-white text-3xl font-bold leading-tight drop-shadow-lg">
            {currentVehicle?.brand} {currentVehicle?.model}
          </h2>
          <div className="flex items-center gap-4 mt-2 text-white/80 text-sm font-light">
            {currentVehicle?.year && <span>{currentVehicle.year}</span>}
            {formatKm(currentVehicle?.odometer) && (
              <>
                <span className="text-white/40">·</span>
                <span>{formatKm(currentVehicle.odometer)}</span>
              </>
            )}
            {currentVehicle?.color && (
              <>
                <span className="text-white/40">·</span>
                <span>{currentVehicle.color}</span>
              </>
            )}
          </div>
          {formatPrice(currentVehicle?.prices) && (
            <p className="text-main text-2xl font-bold mt-2 drop-shadow">
              {formatPrice(currentVehicle?.prices)}
            </p>
          )}
          {currentVehicle?.id && (
            <Link
              href={`/vehiculos/${currentVehicle.id}`}
              className="inline-block mt-3 px-5 py-2 bg-main hover:bg-red-700 text-white text-sm font-semibold rounded-full transition"
            >
              Ver detalles →
            </Link>
          )}
        </div>

        {/* Dots de fotos — abajo centro */}
        {currentImages.length > 1 && (
          <div className="absolute bottom-16 right-6 z-10 flex gap-2">
            {currentImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goToPhoto(i, vehicleIdx)}
                className={`rounded-full transition-all duration-300 ${
                  i === photoIdx
                    ? "w-6 h-2 bg-main"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}

        {/* Barra de progreso */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-10">
          <div
            className="h-full bg-main transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {!isFullscreen && <Footer />}
    </>
  );
}
