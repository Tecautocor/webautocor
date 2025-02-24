import axios from "axios";

export const createRecord = async (body) => {
  const { data } = await axios({
    method: "POST",
    data: body,
    url: `/api/record`,
  });

  return data;
};

export const listStock = async (params) => {
  const { data: list } = await axios({
    method: "POST",
    url: `/api/listPilot`,
    params: params,
  });

  return list;
};

export const listStockViewed = async () => {
  const { data: token } = await axios({
    method: "POST",
    url: `/api/token`,
  });

  if (token && token.status === "success") {
    const { data: list } = await axios({
      method: "POST",
      url: `/api/listPilotViewed`,
      params: { token: token.entitydata },
    });

    return list;
  }

  return null;
};

export const listStockFeatured = async () => {
  const { data: token } = await axios({
    method: "POST",
    url: `/api/token`,
  });

  if (token && token.status === "success") {
    const { data: list } = await axios({
      method: "POST",
      url: `/api/listPilotFeatured`,
      params: { token: token.entitydata },
    });

    return list;
  }

  return null;
};

export const getDetails = async (id) => {
  const { data: token } = await axios({
    method: "POST",
    url: `/api/token`,
  });

  if (token && token.status === "success") {
    const { data: list } = await axios({
      method: "POST",
      url: `/api/listPilotDetails`,
      params: { token: token.entitydata, id: id },
    });

    return list;
  }

  return null;
};

export const getImages = async (id) => {
  const { data: token } = await axios({
    method: "POST",
    url: `/api/token`,
  });

  if (token && token.status === "success") {
    const { data: list } = await axios({
      method: "POST",
      url: `/api/listPilotImages`,
      params: { token: token.entitydata, id: id },
    });

    return list;
  }

  return null;
};

export const listYears = async () => {
  const { data: list } = await axios({
    method: "GET",
    url: `/api/listYears`,
  });

  return list;
};

export const listModels = async () => {
  const { data: list } = await axios({
    method: "GET",
    url: `/api/listModels`,
  });

  return list;
};

export const listBrands = async () => {
  const { data: list } = await axios({
    method: "GET",
    url: `/api/listBrands`,
  });

  return list;
};

export const listStores = async () => {
  const { data: list } = await axios({
    method: "GET",
    url: `/api/listStores`,
  });

  return list;
};

export async function getItems(params) {
  const { data } = await axios({
    method: "GET",
    url: "/api/listPilot/items",
    params,
  });

  return data;
}
