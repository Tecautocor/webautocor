import axios from "axios";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function getGraphToken() {
  const { data } = await axios({
    method: "POST",
    url: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default",
    }),
  });

  return data.access_token;
}

async function handler(req, res) {
  if (req.method === "POST") {
    const { name, lastname, phone, email, aceptaPolitica, autorizaDatos } = req.body;

    try {
      const token = await getGraphToken();

      await axios({
        method: "POST",
        url: `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/drive/items/${process.env.SHAREPOINT_RACETRACK_ITEM_ID}/workbook/tables/${process.env.SHAREPOINT_RACETRACK_TABLE_NAME}/rows/add`,
        headers: { Authorization: `Bearer ${token}` },
        data: {
          values: [
            [
              name,
              lastname,
              phone,
              email,
              aceptaPolitica ? "Sí" : "No",
              autorizaDatos ? "Sí" : "No",
              new Date().toISOString(),
            ],
          ],
        },
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      console.log(err?.response?.data || err);
      return res.status(404).end();
    }
  }

  return res.status(404).end();
}

export default handler;
