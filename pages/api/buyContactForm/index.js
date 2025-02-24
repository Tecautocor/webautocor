import axios from "axios";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "POST") {
    const { name, lastname, phone, city, email, model, amount, brand, year } =
      req.body;
    try {
      const response = await axios({
        method: "POST",
        url: `https://api.pilotsolution.net/webhooks/welcome.php`,
        data: {
          action: "create",
          appkey: "11508DCA-78D4-4442-AF87-72D918D3026B",
          pilot_firstname: name,
          pilot_lastname: lastname,
          pilot_contact_type_id: 1,
          pilot_business_type_id: 3,
          pilot_suborigin_id: "ESDR4JXUIH7Y797BK",
          pilot_email: email,
          pilot_phone: phone,
          pilot_city: city,
          pilot_car_modelo: model,
          pilot_notes:
            "Cantidad que deseas obtener por tu vehículo: USD " +
            amount +
            ", marca: " +
            brand +
            ", year: " +
            year,
        },
      });

      return res.status(200).json(response.data);
    } catch (err) {
      console.log(err);
      return res.status(404).end();
    }
  }

  return res.status(404).end();
}

export default handler;
