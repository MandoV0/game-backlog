import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  iat?: number;
  [key: string]: any;
}

function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return false;

    const now = Date.now() / 1000; // current time in seconds
    return decoded.exp > now;
  } catch (e) {
    return false; // invalid token format
  }
}

/**
 * Checks if the User is logged in by checking if he has a jwt Token and if it is expired or not.
 * @returns True if token exists and is not expired, false otherwise.
 */
export function isUserLoggedIn(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;
    return isTokenValid(token);
}

/**
 * Gets the user ID from the JWT token stored in localStorage.
 * @returns The user ID if the token exists and is valid, otherwise -1.
 */
export const getTokenUserId = (): number => {
    const token = localStorage.getItem("token");
    if (!token) return -1;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.id || -1;
    } catch (e) {
        return -1;
    }
};

/**
 * Gets the current user ID from the JWT token (alias for getTokenUserId).
 * @returns The user ID if the token exists and is valid, otherwise null.
 */
export const getCurrentUserId = (): number | null => {
    const userId = getTokenUserId();
    return userId === -1 ? null : userId;
};