import axios from "axios";
import crypto from "crypto";

const BASE_URL = "https://api.pilotsolution.net/v1";
const TOKEN_TTL = 50 * 60 * 1000;

let cachedToken = null;
let tokenExpiry = 0;
let pendingFetch = null;

async function obtenerToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  if (pendingFetch) return pendingFetch;

  pendingFetch = axios
    .post(`${BASE_URL}/users/auth.php`, null, {
      params: { username: "mcvasconez@autocor.com.ec", password: "Maca2026." },
    })
    .then(({ data }) => {
      pendingFetch = null;
      if (data?.result?.status !== "success") {
        throw new Error(data?.result?.message || "No se pudo autenticar con Pilot");
      }
      cachedToken = data.result.entitydata;
      tokenExpiry = Date.now() + TOKEN_TTL;
      return cachedToken;
    })
    .catch((err) => {
      pendingFetch = null;
      throw err;
    });

  return pendingFetch;
}

function headerBase(flowName) {
  return {
    FlowName: flowName,
    SequenceId: 1,
    TimeStamp: Math.floor(Date.now() / 1000),
    TrackingId: crypto.randomUUID(),
  };
}

export async function leerVenta(guid) {
  const token = await obtenerToken();
  const { data } = await axios.post(`${BASE_URL}/sales/read.php`, {
    data: { id: guid },
    header: { ...headerBase("read_sale"), access_token: token },
  });
  if (data?.result?.status !== "success") {
    throw new Error(data?.result?.message || "No se pudo leer la venta en Pilot");
  }
  return data.result.entitydata;
}

export async function actualizarObservacionesVenta(guid, observations) {
  const token = await obtenerToken();
  const { data } = await axios.post(`${BASE_URL}/sales/update.php`, {
    data: { id: guid, observations },
    header: { ...headerBase("sales_update"), access_token: token },
  });
  if (data?.result?.status !== "success") {
    throw new Error(data?.result?.message || "No se pudo actualizar la venta en Pilot");
  }
  return data.result;
}
