import db from "../../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "GET") {
    const query = {
      distinct: ["brand", "model"],
      select: {
        brand: true,
        model: true,
      },
      take: 10,
    };

    if (req.query.s) {
      query.where = {
        OR: [
          {
            brand: {
              contains: req.query.s,
            },
          },
          {
            model: {
              contains: req.query.s,
            },
          },
        ],
      };
    }

    const items = await db.vehicle.findMany(query);

    return res.status(200).json({ items });
  }

  return res.status(404).end();
}

export default handler;
