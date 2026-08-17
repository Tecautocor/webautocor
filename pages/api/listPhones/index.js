import db from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(404).end();
  }

  try {
    const phones = await db.phone.findMany({ orderBy: [{ category: "asc" }, { label: "asc" }] });
    return res.status(200).json({ entitydata: phones });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ entitydata: [] });
  }
}

export default handler;
