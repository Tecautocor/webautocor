import axios from "axios";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "POST") {
    const { token } = req.query;

    try {
      const response = await axios({
        method: "POST",
        url: `https://api.pilotsolution.net/v1/stock/list.php`,
        data: {
          data: {
            filters: [
              {
                field: "availability_status_code",
                operation: "=",
                value: "1",
              },
            ],
            sort: [
              {
                field: "created",
                order: "ASC",
              },
            ],
            show_media: true,
            limit: 20,
            page: 1,
          },
          header: {
            FlowName: "stock_images_list",
            SequenceId: 1,
            TimeStamp: 1248377,
            TrackingId: "55A6BCD4-0857-4A86-85FB-09A228B641B4",
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
