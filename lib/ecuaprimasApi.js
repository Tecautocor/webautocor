import axios from "axios";

const BASE_URL =
  process.env.ECUAPRIMAS_BASE_URL || "https://ecuaprimaspreproduccion-api.masivosec.com";
const AUTH_NAME = process.env.ECUAPRIMAS_AUTH_NAME || "SERVICIOS ECUAPRIMAS";
const AUTH_PASSWORD = process.env.ECUAPRIMAS_AUTH_PASSWORD || "U2VydmljaW9zRWN1YVAyMg==";

export async function obtenerToken() {
  const { data } = await axios({
    method: "POST",
    url: `${BASE_URL}/api/autenticacion/obtenerToken`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({ name: AUTH_NAME, password: AUTH_PASSWORD }),
  });
  return data.token;
}

// payload: { informacion_titular, cotizador, objeto_asegurado } - ver manual Ecuaprimas
export async function cotizar(payload) {
  const token = await obtenerToken();
  const { data } = await axios({
    method: "POST",
    url: `${BASE_URL}/api/autocor/cotizaciones`,
    headers: { Authorization: `Bearer ${token}` },
    data: payload,
  });
  return data;
}

// El link de "documento" que devuelve cotizar() vence en 10 minutos - hay
// que descargarlo de inmediato, no basta con guardar la URL.
export async function descargarDocumento(url) {
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(data);
}
