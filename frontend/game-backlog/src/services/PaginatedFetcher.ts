import { mapGame } from "./GameMapper";

export async function fetchPaginatedData(
  fetchFunction: (offset: number, limit: number) => Promise<any>,
  page: number,
  pageSize: number
) {
  const offset = (page - 1) * pageSize;
  const data = await fetchFunction(offset, pageSize);

  return {
    games: data.results.map(mapGame),
    totalPages: Math.ceil(Number(data.count) / pageSize)
  };
}
