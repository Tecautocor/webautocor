import axios from "axios";

export const config = {
  api: { bodyParser: true },
};

// Cache del token en memoria del servidor — se renueva cada 50 minutos
let tokenCache = { value: null, expiresAt: 0 };

async function getToken() {
  if (tokenCache.value && Date.now() < tokenCache.expiresAt) {
    return tokenCache.value;
  }
  const { data } = await axios({
    method: "POST",
    url: "https://api.pilotsolution.net/v1/users/auth.php",
    params: { username: "mcvasconez@autocor.com.ec", password: "Maca2026." },
  });
  const token = data?.result?.entitydata;
  if (token) {
    tokenCache = { value: token, expiresAt: Date.now() + 50 * 60 * 1000 };
  }
  return token;
}

// Cache del resultado completo — se renueva cada 15 minutos
let galleryCache = { data: null, expiresAt: 0 };

async function fetchVehicleImages(token, vehicleId) {
  try {
    const { data } = await axios({
      method: "GET",
      url: "https://api.pilotsolution.net/v1/stock/images_list.php",
      data: {
        data: { id: vehicleId },
        header: {
          FlowName: "stock_images_list",
          SequenceId: 1,
          TimeStamp: "",
          TrackingId: "",
          access_token: token,
        },
      },
    });
    return (
      data?.result?.entitydata
        ?.filter((p) => p.size === "desktop")
        ?.slice(0, 5)
        ?.map((p) => p.full_path) || []
    );
  } catch {
    return [];
  }
}

async function handler(req, res) {
  if (req.method !== "GET") return res.status(404).end();

  // Devolver cache si todavía es válido
  if (galleryCache.data && Date.now() < galleryCache.expiresAt) {
    return res.status(200).json(galleryCache.data);
  }

  try {
    const token = await getToken();
    if (!token) return res.status(401).end();

    const { data: stockData } = await axios({
      method: "POST",
      url: "https://api.pilotsolution.net/v1/stock/list.php",
      data: {
        data: {
          filters: [
            { field: "availability_status_code", operation: "=", value: "1" },
          ],
          sort: [{ field: "created", order: "DESC" }],
          show_media: true,
          limit: 40,
          page: 1,
        },
        header: {
          FlowName: "stock_list",
          SequenceId: 1,
          TimeStamp: "",
          TrackingId: "",
          access_token: token,
        },
      },
    });

    const vehicles = stockData?.result?.entitydata || [];

    const imagesResults = await Promise.all(
      vehicles.map((v) => fetchVehicleImages(token, v.id))
    );

    const result = vehicles
      .map((v, i) => ({
        id: v.id,
        brand: v.brand,
        model: v.model,
        year: v.year,
        prices: v.prices,
        color: v.color,
        odometer: v.odometer,
        fuel_name: v.fuel_name,
        type: v.type,
        images: imagesResults[i],
      }))
      .filter((v) => v.images.length > 0);

    // Guardar en cache por 15 minutos
    galleryCache = { data: result, expiresAt: Date.now() + 15 * 60 * 1000 };

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    // Si hay cache viejo, devolverlo antes de fallar
    if (galleryCache.data) return res.status(200).json(galleryCache.data);
    return res.status(500).end();
  }
}

export default handler;
