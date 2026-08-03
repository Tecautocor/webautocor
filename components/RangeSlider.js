const numberFormat = new Intl.NumberFormat("es-EC");

function onlyDigits(value) {
  return value.replace(/\D/g, "");
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
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #ffffff;
          border: 2px solid #e43d30;
          cursor: pointer;
        }
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #ffffff;
          border: 2px solid #e43d30;
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
