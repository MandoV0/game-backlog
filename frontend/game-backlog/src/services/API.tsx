export async function getGames(offset: number = 0, limit: number = 20) {
  return await fetchJson(`http://localhost:3000/games?offset=${offset}&limit=${limit}`);
}

export async function fetchJson(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}