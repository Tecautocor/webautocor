import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  createRecord,
  listStock,
  listBrands,
  listModels,
  listStores,
  listYears,
  listStockFeatured,
  listStockViewed,
  getDetails,
  getImages,
} from "./api";

export function useCreate() {
  const queryClient = useQueryClient();

  return useMutation((data) => createRecord(data));
}

export function useListStockQuery(params) {
  return useQuery(["stock", params], () => listStock(params));
}

export function useListStockFeaturedQuery() {
  return useQuery(["stockFeatured"], () => listStockFeatured());
}

export function useListStockViewedQuery() {
  return useQuery(["stockViewed"], () => listStockViewed());
}

export function useGetStockDetailsQuery(id) {
  return useQuery(["stockDetails", id], () => getDetails(id));
}

export function useGetStockImagesQuery(id) {
  return useQuery(["stockImages", id], () => getImages(id));
}

export function useListModelQuery() {
  return useQuery(["models"], () => listModels());
}

export function useListBrandQuery() {
  return useQuery(["brands"], () => listBrands());
}

export function useListStoreQuery() {
  return useQuery(["stores"], () => listStores());
}

export function useListYearQuery() {
  return useQuery(["years"], () => listYears());
}
