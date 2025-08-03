export async function getGames(offset: number = 0, limit: number = 20) {
  return await fetchJson(
    `http://localhost:3000/games?offset=${offset}&limit=${limit}`
  );
}

export async function login(email: string = "", password: string = "") {
  try {
    console.log('Attempting login to:', "http://localhost:3000/auth/login");
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      }),
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error('JSON parse error:', err);
      throw new Error('Invalid response from server');
    }
    
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Login Failed');
    }
    
    localStorage.setItem('token', data.jwtToken);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function fetchJson(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
