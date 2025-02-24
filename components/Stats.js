import Image from "next/image";

const stats = [
  { id: 1, name: "Autos en inventario", value: "+500" },
  { id: 2, name: "Autos vendidos", value: "+15000" },
  { id: 3, name: "Agencias", value: "8" },
];

export default function Stats() {
  return (
    <div className="pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="bg-secondary py-12">
          <dl className="grid grid-cols-1 gap-y-16 gap-x-6 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="mx-auto flex max-w-xs flex-col gap-y-4"
              >
                <dt className="text-2xl font-light leading-7 text-gray-200">
                  {stat.name}
                </dt>
                <dd className="order-first text-6xl font-black text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
            <div className="-m-20 lg:flex flex-col hidden ">
              <Image
                className="rounded-md"
                src="/auto-agencias.png"
                alt=""
                width={800}
                height={424}
              />
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
