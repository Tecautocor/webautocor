import axios from "axios";

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const response = await axios({
        method: "POST",
        url: `https://api.pilotsolution.net/v1/users/auth.php`,
        params: { username: "jsalcedo@autocor.com.ec", password: "12345" },
      });
      return res.status(200).json(response.data.result);
    } catch (err) {
      console.log(err);
      return res.status(404).end();
    }
  }

  return res.status(404).end();
}

export default handler;
