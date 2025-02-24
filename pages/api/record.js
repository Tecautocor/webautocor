export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      const {
        action,
        appkey,
        pilot_firstname,
        pilot_contact_type_id,
        pilot_business_type_id,
        pilot_suborigin_id,
      } = req.body;

      if (
        (!action,
        !appkey,
        !pilot_firstname,
        !pilot_contact_type_id,
        !pilot_business_type_id,
        !pilot_suborigin_id)
      ) {
        console.log("Missing data");
        return res.status(400).json({ message: "Invalid data" });
      }

      res.status(200).json({
        action,
        appkey,
        pilot_firstname,
        pilot_contact_type_id,
        pilot_business_type_id,
        pilot_suborigin_id,
      });

      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
