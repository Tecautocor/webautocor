import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  const { license_plate } = req.query;

  if (!license_plate) {
    return res.status(200).json({ result: { entitydata: null } });
  }

  try {
    const rows = await db.$queryRaw`
      SELECT stock_value, bono FROM LiquidacionVehicle WHERE license_plate = ${license_plate}
    `;

    return res.status(200).json({ result: { entitydata: rows[0] || null } });
  } catch (err) {
    console.log(err);
    return res.status(404).end();
  }
}

export default handler;
