import axios from "axios";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "POST") {
    const { token, id } = req.query;
    try {
      const response = await axios({
        method: "GET",
        url: `https://api.pilotsolution.net/v1/stock/images_list.php`,
        data: {
          data: {
            id: id,
          },
          header: {
            FlowName: "stock_images_list",
            SequenceId: 1,
            TimeStamp: "",
            TrackingId: "",
            access_token: token,
          },
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
