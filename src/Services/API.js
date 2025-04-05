/*
Simply returns the games from the API as a Json object.
The API key is stored in the .env file as REACT_APP_API_KEY.
*/
export const getGames = async (page, pageSize) => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const url = `https://api.rawg.io/api/games?key=${apiKey}&page=${page}&page_size=${pageSize}`;
    console.log("URL: " + url);

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error.message);
        return { results: [], count: 0 };
    }
}