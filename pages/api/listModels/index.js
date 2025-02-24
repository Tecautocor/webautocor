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
        await db.$queryRaw`SELECT DISTINCT(TRIM(UPPER(model))) AS model, brand FROM Vehicle where model <> '' GROUP BY model ORDER BY model ASC`;

      return res.status(200).json(response);
    } catch (err) {
      return res.status(404).end();
    }
  }

  return res.status(404).end();
}

export default handler;
