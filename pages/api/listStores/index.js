import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const response =
        await db.$queryRaw`SELECT DISTINCT(TRIM(UPPER(location))) AS location, model, brand FROM Vehicle where location <> '' GROUP BY location ORDER BY location ASC`;

      return res.status(200).json(response);
    } catch (err) {
      return res.status(404).end();
    }
  }

  return res.status(404).end();
}

export default handler;
