import db from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).end();
  }

  try {
    const agencies = await db.agency.findMany({ orderBy: { id: "asc" } });
    return res.status(200).json({ entitydata: agencies });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ entitydata: [] });
  }
}

export default handler;
