const apiKey = process.env.REACT_APP_API_KEY;

/*
Simply returns the games from the API as a Json object.
The API key is stored in the .env file as REACT_APP_API_KEY.
*/
export const getGames = async (page, pageSize) => {
    const url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${pageSize}`;

    return await fetchData(url);
}

export const getGameDetails = async (id) => {
  const url = `https://api.rawg.io/api/games/${id}?key=${process.env.REACT_APP_API_KEY}`;
  return await fetchData(url);
}

/*
Fetches multiple games at once. Used for the Favorites page.
Much more efficient than fetching each game one by one.
*/
export const bulkFetchGames = async (ids, limit=20) => {
  const url = `https://api.rawg.io/api/games?key=${apiKey}&limit=${limit}&ids=${ids.join(",")}`;
  return await fetchData(url);
}

export const getGamesWithQuery = async (query='', pageSize=20, page=1) => {
  const url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${pageSize}&search=${query}`;
  return await fetchData(url);
}

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}