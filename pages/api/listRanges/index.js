import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [priceAgg, kmAgg] = await Promise.all([
        db.vehicle.aggregate({
          _min: { prices: true },
          _max: { prices: true },
          where: { prices: { gt: 0 } },
        }),
        db.vehicle.aggregate({
          _min: { odometer: true },
          _max: { odometer: true },
          where: { odometer: { gte: 0 } },
        }),
      ]);

      return res.status(200).json({
        priceMin: priceAgg._min.prices ?? 0,
        priceMax: priceAgg._max.prices ?? 0,
        kmMin: kmAgg._min.odometer ?? 0,
        kmMax: kmAgg._max.odometer ?? 0,
      });
    } catch (err) {
      return res.status(404).end();
    }
  }

  return res.status(404).end();
}

export default handler;
