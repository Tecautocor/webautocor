import { useEffect } from "react";
import { SectionTextWhite, SectionText } from "./Shared";
import FormBudget from "./FormBudget";
import { calcCuotaXMeses } from "../lib/utils";

export default function BudgetTool({
  value,
  amount,
  setAmount,
  time,
  setTime,
}) {
  const initialPayment = Number(value) * 0.3;
  useEffect(() => {
    setAmount(initialPayment);
  }, [value]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="">
        <div className="mx-auto lg:flex">
          <div className="lg:w-1/2 px-4 py-10 bg-[#F4F4F4] flex flex-col justify-center">
            <SectionText title="Compra tu auto" subtitle="COTIZADOR EN LÍNEA" />

            <div className="mb-2 mt-6 ">
              <label htmlFor="budget" className="sr-only">
                Entrada 1
              </label>
              <div className="flex bg-white shadow-lg rounded pr-4">
                <p className="pl-10 py-4 font-light pr-10 text-xs">Entrada 2</p>
                <div className="flex flex-col flex-1">
                  <input
                    type="range"
                    id="amount"
                    name="amount"
                    min={initialPayment}
                    step="1"
                    defaultValue={initialPayment}
                    max={Number(value) * 0.8}
                    className="block w-full rounded-md py-2 px-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-none text-xs sm:leading-6 accent-main"
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                    }}
                  />
                  <div className="flex justify-between text-xs -mt-2">
                    <span>
                      ${" x3 "}
                      {new Intl.NumberFormat("es-EC", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(initialPayment))}
                    </span>
                    <span>
                      ${" x4 "}
                      {new Intl.NumberFormat("es-EC", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(value) * 0.8)}
                    </span>
                  </div>
                </div>
                <BudgetIcon />
              </div>
            </div>

            <div className="my-2">
              <label htmlFor="budget" className="sr-only">
                Plazo
              </label>
              <div className="flex bg-white shadow-lg rounded pr-4">
                <p className="pl-10 py-4 font-light pr-10 text-xs">Plazo</p>
                <div className="flex flex-col flex-1">
                  <input
                    type="range"
                    id="time"
                    name="time"
                    min="12"
                    step="1"
                    max="48"
                    defaultValue={12}
                    className="block w-full rounded-md py-2 px-3.5 text-gray-900 placeholder:text-gray-400 focus:ring-none text-xs sm:leading-6 accent-main"
                    onChange={(e) => {
                      setTime(Number(e.target.value));
                    }}
                  />
                  <div className="flex justify-between text-xs -mt-2">
                    <span>12</span>
                    <span>48 meses</span>
                  </div>
                </div>
                <YearIcon />
              </div>
            </div>

            <div className="flex justify-center divide-x-2 mt-4">
              <div className="bg-[#666666] text-white mt-4 w-full px-4">
                <div className="px-4 py-6 flex flex-col justify-center items-start">
                  <p className="text-lg font-semibold -mb-1">Entrada</p>
                  <p className="text-5xl mb-1">
                    <span className="font-bold">
                      ${" "}
                      {new Intl.NumberFormat("es-EC", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(amount))}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center divide-x-2">
              <div className="bg-main text-white mt-2 w-3/5 px-4">
                <div className="px-4 py-6 flex flex-col justify-center items-start">
                  <p className="text-lg font-semibold -mb-1">Cuota</p>
                  <p className="text-5xl mb-1">
                    <span className="font-bold">
                      ${" "}
                      {new Intl.NumberFormat("es-EC", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(Number(calcCuotaXMeses(amount, time)))}
                    </span>
                    <span className="text-sm font-semibold">/mes</span>
                  </p>
                </div>
              </div>
              <div className="bg-main text-white mt-2 w-2/5 px-4">
                <div className="px-4 py-6 flex flex-col justify-center items-start">
                  <p className="text-lg font-semibold -mb-1">Plazo</p>
                  <p className="text-5xl mb-1">
                    <span className="font-bold">{time}</span>
                    <span className="text-sm font-semibold">meses</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 px-4 py-10 bg-[#666666] flex flex-col justify-center">
            <div>
              <SectionTextWhite
                title="DÉJANOS TUS DATOS"
                subtitle="UN ASESOR TE CONTACTARÁ DE INMEDIATO"
              />
              <FormBudget
                time={time}
                initialPayment={amount}
                monthlyPayment={calcCuotaXMeses(amount, time)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
      className="w-5 absolute ml-3 mt-4 z-10"
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

function YearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 256 225"
      className="w-4 absolute ml-3 mt-4 z-10"
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
