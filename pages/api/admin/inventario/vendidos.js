import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method === "POST") {
    const { placa, marca, modelo, anio, agencia, diasEnStockCierre, fechaCierre } = req.body || {};
    if (!placa || !fechaCierre) {
      return res.status(400).json({ message: "Faltan campos (placa, fechaCierre)" });
    }

    const registro = await db.vehiculoVendido.upsert({
      where: { licensePlate: placa },
      update: {
        marca: marca || null,
        modelo: modelo || null,
        anio: anio ? parseInt(anio, 10) : null,
        agencia: agencia || null,
        diasEnStockCierre: diasEnStockCierre !== undefined && diasEnStockCierre !== null ? parseInt(diasEnStockCierre, 10) : null,
        fechaCierre: new Date(fechaCierre),
        registradoPor: session.user?.email || null,
      },
      create: {
        licensePlate: placa,
        marca: marca || null,
        modelo: modelo || null,
        anio: anio ? parseInt(anio, 10) : null,
        agencia: agencia || null,
        diasEnStockCierre: diasEnStockCierre !== undefined && diasEnStockCierre !== null ? parseInt(diasEnStockCierre, 10) : null,
        fechaCierre: new Date(fechaCierre),
        registradoPor: session.user?.email || null,
      },
    });

    return res.status(200).json({ entitydata: registro });
  }

  if (req.method === "DELETE") {
    const { placa } = req.body || {};
    if (!placa) {
      return res.status(400).json({ message: "Falta placa" });
    }
    await db.vehiculoVendido.deleteMany({ where: { licensePlate: placa } });
    return res.status(200).json({ ok: true });
  }

  return res.status(404).end();
}

export default handler;
