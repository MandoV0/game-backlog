export async function getGames(offset: number = 0, limit: number = 20) {
  const token = getAccessToken();

  return await fetchJson(
    `http://localhost:3000/games?offset=${offset}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function login(email: string = "", password: string = "") {
  try {
    console.log("Attempting login to:", "http://localhost:3000/auth/login");
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error("JSON parse error:", err);
      throw new Error("Invalid response from server");
    }

    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || data.error || "Login Failed");
    }

    localStorage.setItem("accessToken", data.jwtToken);
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function fetchJson(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function toggleFavorite(gameid: number) {
  try {
    const token = getAccessToken();
    const response = await fetch(`http://localhost:3000/favorite/${gameid}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log("Error while toggling Favorite:", err);
  }
}

export async function getFavorites(offset: number = 0, limit: number = 20) {
  const token = getAccessToken();
  return await fetchJson(
    `http://localhost:3000/favorite?offset=${offset}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
}

export async function getGameById(gameid: string) {
  const token = getAccessToken();
  return await fetchJson(`http://localhost:3000/games/${gameid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function getReviewsByGameId(gameid: string) {
  const token = getAccessToken();
  return await fetchJson(`http://localhost:3000/review/stats/${gameid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function getGameReviews(gameid: string) {
  const token = getAccessToken();
  return await fetchJson(`http://localhost:3000/review/${gameid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function postReview(
  gameid: string,
  rating: number,
  reviewText: string
) {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("No access token found. User is not logged in.");
    }
    console.log("Using token:", token);
    console.log("gameid:", gameid, "rating:", rating, "reviewText:", reviewText);
    const response = await fetch(`http://localhost:3000/review`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameid,
        rating,
        review_text: reviewText,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Failed to post review: ${JSON.stringify(errorBody)}`);
    }
    return await response.json();
  } catch (err: any) {
    console.error("Error posting review:", err);
    throw err;
  }
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}
