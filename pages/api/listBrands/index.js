import db from "../../../lib/db";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // const response =
      //   await db.$queryRaw`SELECT DISTINCT(TRIM(UPPER(brand))) AS brand FROM Vehicle where brand <> '' GROUP BY brand ORDER BY brand ASC`;

      const response = await db.$queryRaw`SELECT 
        DISTINCT 
        TRIM(UPPER(brand)) AS brand, 
        TRIM(UPPER(model)) AS model, 
        TRIM(UPPER(location)) AS location 
        FROM Vehicle 
        WHERE model <> '' 
        AND brand <> ''
        AND location <> '' 
        GROUP BY brand, model, location 
        ORDER BY brand ASC, model ASC, location ASC`;
      return res.status(200).json(response);
    } catch (err) {
      return res.status(404).end();
    }
  }

  return res.status(404).end();
}

export default handler;
