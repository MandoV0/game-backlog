import { mapGame } from "./GameMapper";

export async function fetchPaginatedData(
  fetchFunction: (offset: number, limit: number) => Promise<any>,
  page: number,
  pageSize: number,
  mapFunction: (item: any) => any
) {
  const offset = (page - 1) * pageSize;
  const data = await fetchFunction(offset, pageSize);
  console.log("Fetched Data:", data);
  return {
    results: data.results.map(mapFunction),
    total: Math.ceil(Number(data.total) / pageSize)
  };
}