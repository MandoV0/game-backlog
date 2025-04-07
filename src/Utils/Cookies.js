const cookieMaxAge = 31536000; // 1 year

// Helper function to get a cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Save a favorite game ID to the cookie
export const saveFavorite = (id) => {
  const favorites = JSON.parse(getCookie('favorites') || '[]');
  if (!favorites.includes(id)) {
    favorites.push(id);
    document.cookie = `favorites=${JSON.stringify(favorites)}; path=/; max-age=${cookieMaxAge}`; // 1 year
  }
};

// Delete a favorite game ID from the cookie
export const deleteFavorite = (id) => {
  const favorites = JSON.parse(getCookie('favorites') || '[]');
  const updatedFavorites = favorites.filter((favId) => favId !== id);
  document.cookie = `favorites=${JSON.stringify(updatedFavorites)}; path=/; max-age=${cookieMaxAge}`; // 1 year
};

// Check if a game ID is a favorite
export const isFavorite = (id) => {
  const favorites = JSON.parse(getCookie('favorites') || '[]');
  return favorites.includes(id);
};

// Get all favorite game IDs from the cookie
export const getFavorites = () => {
  return JSON.parse(getCookie('favorites') || '[]');
};