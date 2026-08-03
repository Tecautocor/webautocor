const numberFormat = new Intl.NumberFormat("es-EC");

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

// Silueta de auto ya usada en los filtros (Marca/Modelo/etc, ver BrandIcon en
// FiltersSection.js) - se reexporta aca sin las clases de posicionamiento
// absoluto para poder reusarla como manija del slider y en el menu Ordenar.
export function CarIcon({ className = "w-4 h-4", fill = "#E53D30" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 375 184"
      className={className}
    >
      <path
        fill={fill}
        fillRule="nonzero"
        d="M0-9.936a4.974 4.974 0 00-4.968 4.968A4.974 4.974 0 000 0a4.974 4.974 0 004.968-4.968A4.974 4.974 0 000-9.936M0-8.47a3.502 3.502 0 110 7.004A3.502 3.502 0 010-8.47"
        transform="translate(-1957.81 -4491.41) scale(8.33333) translate(269.328 561.045)"
      ></path>
      <path
        fill={fill}
        fillRule="nonzero"
        d="M0-9.748a4.88 4.88 0 00-4.874 4.874A4.88 4.88 0 000 0a4.879 4.879 0 004.874-4.874A4.88 4.88 0 000-9.748m0 1.466a3.408 3.408 0 110 6.816 3.408 3.408 0 010-6.816"
        transform="translate(-1957.81 -4491.41) scale(8.33333) translate(245.092 560.951)"
      ></path>
      <path
        fill={fill}
        fillRule="nonzero"
        d="M0-19.492c-3.417 0-6.945 1.39-10.485 4.132-2.615 2.025-4.29 4.082-4.472 4.31l-.072.089a16.28 16.28 0 00-3.646 4.95c-.966.366-1.763 1.254-1.763 2.604 0 2.353 1.554 2.828 2.803 3.209l.173.053.208.064.218.001 2.084.008 1.761.007-.312-1.733a3.273 3.273 0 01-.057-.585 3.28 3.28 0 013.276-3.276 3.28 3.28 0 013.276 3.276c0 .197-.02.397-.06.61l-.326 1.731 1.761.007L3.191 0h7.892l-.343-1.748a3.279 3.279 0 013.213-3.911 3.279 3.279 0 013.212 3.911L16.822 0h3.118l.187-.05c3.12-.84 3.635-1.484 3.829-1.726.471-.589.643-1.369.474-2.142-.2-.91-.839-1.685-1.804-2.191-.208-.318-.352-1.427-.293-2.309l.056-.841-.699-.472c-.125-.084-2.998-1.99-8.264-2.883C12.13-14.243 7.383-19.492 0-19.492m0 1.466c7.802 0 12.385 6.444 12.577 6.719l-.052.035c5.439.797 8.345 2.757 8.345 2.757s-.204 3.065 1.021 3.678c1.226.613 1.329 1.634.92 2.145-.409.511-3.065 1.226-3.065 1.226h-1.142a4.743 4.743 0 10-9.303 0H3.197l-8.824-.035a4.743 4.743 0 10-9.399-.882c0 .289.03.57.08.845l-2.085-.008c-1.328-.409-1.941-.533-1.941-1.861 0-1.328 1.329-1.328 1.329-1.328 1.109-2.606 2.666-4.334 3.861-5.374l-.031-.025c.258-.322 6.406-7.892 13.813-7.892"
        transform="translate(-1957.81 -4491.41) scale(8.33333) translate(255.376 558.461)"
      ></path>
      <path
        fill={fill}
        d="M241.684 3963.47H268.532V3964.9359999999997H241.684z"
        transform="translate(-1957.81 -4491.41) scale(8.33333) matrix(-1 0 0 1 510.216 -3417.65)"
      ></path>
      <path
        fill={fill}
        d="M-1.319 0.027H0.14600000000000013V7.099H-1.319z"
        transform="translate(-1957.81 -4491.41) scale(8.33333) scale(-1 1) rotate(-2.345 13049.936 6464.262)"
      ></path>
    </svg>
  );
}

// Slider de rango de doble manija: dos <input type="range"> superpuestos
// (truco clasico, cada uno solo reacciona a clicks sobre su propia manija
// via pointer-events) + dos campos numericos editables arriba, todos
// atados al mismo par de valores. Los inputs numericos llevan el `name`
// real para que el <form method="GET"> del proyecto los incluya en la
// query string al enviar - el slider es solo una capa visual/interactiva
// sobre el mismo estado.
export default function RangeSlider({
  label,
  icon: Icon,
  nameFrom,
  nameTo,
  min,
  max,
  valueFrom,
  valueTo,
  onChangeFrom,
  onChangeTo,
  step = 1,
  suffix = "",
  prefix = "",
}) {
  const hasRange = Number.isFinite(min) && Number.isFinite(max) && max > min;
  const from = valueFrom === "" || valueFrom == null ? min : Number(valueFrom);
  const to = valueTo === "" || valueTo == null ? max : Number(valueTo);

  const pctFrom = hasRange ? ((from - min) / (max - min)) * 100 : 0;
  const pctTo = hasRange ? ((to - min) / (max - min)) * 100 : 100;

  const format = (v) => `${prefix}${numberFormat.format(v)}${suffix}`;

  const handleSlideFrom = (e) => {
    const next = Math.min(Number(e.target.value), to - step);
    onChangeFrom(String(next));
  };

  const handleSlideTo = (e) => {
    const next = Math.max(Number(e.target.value), from + step);
    onChangeTo(String(next));
  };

  return (
    <div className="flex flex-col gap-2 bg-white shadow-lg rounded p-3 w-full">
      <div className="flex items-center gap-1.5 text-xs font-light text-gray-600">
        {Icon && <Icon />}
        <p>{label}</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name={nameFrom}
          value={valueFrom ?? ""}
          placeholder={hasRange ? format(min) : ""}
          onChange={(e) => onChangeFrom(onlyDigits(e.target.value))}
          className="w-1/2 text-xs font-light border border-gray-300 rounded px-2 py-1.5 focus:border-main focus:ring-main"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name={nameTo}
          value={valueTo ?? ""}
          placeholder={hasRange ? format(max) : ""}
          onChange={(e) => onChangeTo(onlyDigits(e.target.value))}
          className="w-1/2 text-xs font-light border border-gray-300 rounded px-2 py-1.5 focus:border-main focus:ring-main"
        />
      </div>

      {hasRange && (
        <>
          <div className="relative h-4">
            <div className="absolute top-1/2 -translate-y-1/2 h-1.5 w-full rounded-full bg-gray-200" />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-main"
              style={{ left: `${pctFrom}%`, right: `${100 - pctTo}%` }}
            />
            <input
              type="range"
              aria-label={`${label} desde`}
              min={min}
              max={max}
              step={step}
              value={from}
              onChange={handleSlideFrom}
              className="range-thumb absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent"
            />
            <input
              type="range"
              aria-label={`${label} hasta`}
              min={min}
              max={max}
              step={step}
              value={to}
              onChange={handleSlideTo}
              className="range-thumb absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent"
            />

            {/* Manijas visibles - el input range real queda invisible pero
                mantiene el mismo tamaño de hit-target (ver CSS abajo); esto
                es solo la decoracion encima, no bloquea el arrastre. */}
            <div
              className="pointer-events-none absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-main bg-white shadow"
              style={{ left: `${pctFrom}%` }}
            >
              <CarIcon className="w-3.5 h-3.5" />
            </div>
            <div
              className="pointer-events-none absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-main bg-white shadow"
              style={{ left: `${pctTo}%` }}
            >
              <CarIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400">
            <span>{format(min)}</span>
            <span>{format(max)}</span>
          </div>
        </>
      )}

      <style jsx>{`
        .range-thumb {
          height: 0;
          pointer-events: none;
        }
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 24px;
          height: 24px;
          border-radius: 9999px;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .range-thumb::-webkit-slider-runnable-track {
          background: transparent;
        }
        .range-thumb::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
