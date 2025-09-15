const BASE_URL = "http://localhost:3000/api/v1";

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}${endpoint}`;
    
    console.log('Making API request to:', url);
    console.log('Request options:', options);
    
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });
        
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);
        
        if (!res.ok) {
            const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
            console.error('API Error Response:', err);
            throw new Error(err.message || "API Error");
        }
        
        const data = await res.json();
        console.log('API Response data:', data);
        console.log('Response data type:', typeof data);
        
        return data;
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

export default apiFetch;