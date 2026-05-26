import axios from "axios";

// Caché en memoria — sobrevive entre requests del mismo proceso
let cachedToken = null;
let tokenExpiry = 0;
const TOKEN_TTL = 50 * 60 * 1000; // 50 minutos en ms

// Evita llamadas simultáneas a PilotSolution (deduplicación)
let pendingFetch = null;

async function fetchFreshToken() {
  if (pendingFetch) return pendingFetch;

  pendingFetch = axios({
    method: "POST",
    url: `https://api.pilotsolution.net/v1/users/auth.php`,
    params: { username: "mcvasconez@autocor.com.ec", password: "Maca2026." },
  })
    .then((response) => {
      cachedToken = response.data.result;
      tokenExpiry = Date.now() + TOKEN_TTL;
      pendingFetch = null;
      return cachedToken;
    })
    .catch((err) => {
      pendingFetch = null;
      throw err;
    });

  return pendingFetch;
}

export const config = {
  api: {
    bodyParser: true,
  },
};

async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Devuelve el token cacheado si aún es válido
      if (cachedToken && Date.now() < tokenExpiry) {
        return res.status(200).json(cachedToken);
      }

      // Solicita uno nuevo (o espera si ya hay una solicitud en curso)
      const token = await fetchFreshToken();
      return res.status(200).json(token);
    } catch (err) {
      console.log(err);
      return res.status(404).end();
    }
  }

  return res.status(404).end();
}

export default handler;
