import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

const SUV_TYPES = ["SUV", "JEEP", "CROSSOVER", "TODOTERRENO", "TODO TERRENO"];
const CAMIONETA_TYPES = ["CAMIONETA", "DOBLE CABINA", "CAMION"];

function bucketCarroceria(type) {
  const t = (type || "").toUpperCase().trim();
  if (SUV_TYPES.includes(t)) return "SUV";
  if (CAMIONETA_TYPES.includes(t)) return "Camioneta";
  if (t === "SEDAN") return "Sedán";
  if (t === "HATCHBACK") return "Hatchback";
  return "Otros";
}

function parseDays(value) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const rows = await db.vehicle.findMany({
    select: {
      id: true,
      brand: true,
      model: true,
      year: true,
      prices: true,
      type: true,
      days_in_stock: true,
      owner_branch_code: true,
      created_dt: true,
    },
  });

  const vehicles = rows
    .filter((v) => v.brand && v.model)
    .map((v) => ({
      id: v.id,
      marca: v.brand.trim(),
      modelo: v.model.trim(),
      anio: v.year || null,
      valor: v.prices || 0,
      carroceria: bucketCarroceria(v.type),
      diasEnStock: parseDays(v.days_in_stock),
      agencia: (v.owner_branch_code || "").trim() || "Sin agencia",
      fechaIngreso: v.created_dt,
    }));

  return res.status(200).json({ vehicles });
}

export default handler;
