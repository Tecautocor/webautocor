import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Token missing or malformed." });
  }
  

  if (req.method === "POST") {
    try {
      const filters = req.body || {};

      const response = await db.vehicle.findMany({
        where: filters,
        orderBy: {
          year: "desc",
        },
        select: {
          id: true,
          brand: true,
          model: true,
          media: true,
          prices: true,
          year: true,
          odometer: true,
          type: true,
          location: true,
          color: true,
          accesories: true,
          fuel_name: true,
          saving_plan_group: true,
          saving_plan_order: true,
        },
      });

      return res.status(200).json(response);
    } catch (err) {
      console.error("Failed to filter vehicles:", err);
      return res.status(500).json({ error: "Failed to fetch filtered vehicles." });
    }
  }

  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}

export default handler;
