import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import db from "../../../../lib/db";

async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "No autorizado" });
  }

  if (req.method !== "GET") {
    return res.status(404).end();
  }

  // Comparativa interanual: solo anios con volumen real (excluye ruido de
  // fechas mal cargadas en Pilot, ej. un par de filas sueltas en 2004/2010/2019).
  const ventasPorAnioMes = await db.$queryRawUnsafe(
    `SELECT YEAR(factory_invoicing_dt) AS anio, MONTH(factory_invoicing_dt) AS mes, COUNT(*) AS n
     FROM AllVehicle
     WHERE availability_status_code = '3' AND factory_invoicing_dt IS NOT NULL
       AND YEAR(factory_invoicing_dt) >= 2023
     GROUP BY anio, mes
     ORDER BY anio, mes`
  );

  // Vendedores: usa reserved_by_user_name como proxy de quien vendio (no
  // viene de un campo "vendedor" explicito en Vehicle/AllVehicle) - se
  // reemplaza por el campo real del webhook (vendedorNombre) cuando haya
  // datos acumulados.
  const porVendedor = await db.$queryRawUnsafe(
    `SELECT reserved_by_user_name AS vendedor, owner_branch_code AS agencia, COUNT(*) AS n
     FROM AllVehicle
     WHERE availability_status_code = '3' AND factory_invoicing_dt IS NOT NULL
       AND YEAR(factory_invoicing_dt) = YEAR(CURDATE())
       AND reserved_by_user_name IS NOT NULL AND reserved_by_user_name != ''
     GROUP BY vendedor, agencia
     ORDER BY n DESC
     LIMIT 30`
  );

  const rentabilidad = await db.ventaWebhookLog.findMany({
    where: { estado: "Registrado" },
    select: {
      ventaId: true,
      precioLista: true,
      totalTransaccion: true,
      descuentoVendedor: true,
      descuentoGerente: true,
      montoFinanciado: true,
      banco: true,
      usadoValorEstimado: true,
      usadoCostoReparacion: true,
      usadoRentabilidadEstimada: true,
      comisionVendedor: true,
      sucursal: true,
      receivedAt: true,
    },
    orderBy: { receivedAt: "desc" },
    take: 500,
  });

  return res.status(200).json({
    ventasPorAnioMes: ventasPorAnioMes.map((r) => ({ anio: Number(r.anio), mes: Number(r.mes), n: Number(r.n) })),
    porVendedor: porVendedor.map((r) => ({ vendedor: r.vendedor, agencia: r.agencia, n: Number(r.n) })),
    rentabilidad,
  });
}

export default handler;
