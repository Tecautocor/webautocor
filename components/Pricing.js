import {
  calcCuota12Meses,
  calcCuota24Meses,
  calcCuota36Meses,
  calcCuota48Meses,
} from "../lib/utils";

export default function Pricing({ value }) {
  const tiers = [
    {
      id: "12",
      cuota: calcCuota12Meses(value),
      entrada: (Number(value) / 2).toFixed(2).toLocaleString("es-ES"),
      interes: "14,50%",
      entradaPorcentaje: 20000,
    },
    {
      id: "24",
      cuota: calcCuota24Meses(value),
      entrada: (Number(value) / 2).toFixed(2).toLocaleString("es-ES"),
      interes: "29%",
      entradaPorcentaje: 20000,
    },
    {
      id: "36",
      cuota: calcCuota36Meses(value),
      entrada: (Number(value) / 2).toFixed(2).toLocaleString("es-ES"),
      interes: "43,50%",
      entradaPorcentaje: 20000,
    },
    {
      id: "48",
      cuota: calcCuota48Meses(value),
      entrada: (Number(value) / 2).toFixed(2).toLocaleString("es-ES"),
      interes: "58%",
      entradaPorcentaje: 20000,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-10 py-10">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-4 px-8">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex flex-col justify-between rounded-3xl bg-[#F4F4F4] py-6 px-8 shadow-xl ring-1 ring-gray-900/10"
          >
            <div className="text-gray-600">
              <h3 id={tier.id} className="text-xl text-center font-bold">
                Plazo
              </h3>
              <div className="flex justify-center items-baseline -my-2">
                <span className="text-8xl font-bold tracking-tight">
                  {tier.id}
                </span>
              </div>
              <p className="text-xl text-center font-bold">meses</p>

              <div className="bg-main -mx-10 text-white mt-4">
                <div className="px-4 py-4 flex flex-col justify-center items-center">
                  <p className="text-lg font-semibold -mb-1">Cuota</p>
                  <p className="text-3xl mb-1">
                    <span className="font-bold">
                      $
                      {new Intl.NumberFormat("es-EC", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(tier.cuota | 0)}
                    </span>
                    <span className="text-sm font-semibold">/mes</span>
                  </p>
                </div>
              </div>

              <ul className="mt-4 font-light flex flex-col items-center gap-y-4 justify-center text-gray-600 list-disc">
                <li className="flex flex-col text-center">
                  Tasa de interés desde
                  <span className="font-bold">el 14,50% anual</span>
                </li>
                <li className="flex flex-col text-xs">*Aplica restricciones</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
