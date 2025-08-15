import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number; /* Expiration */
  [key: string]: any;
}

/**
 * Checks whether the JWT access token stored in localStorage is still valid.
 *
 * @returns {boolean} 'true' if the token exists and has not expired, otherwise 'false'.
 */
export function isTokenValid(): boolean {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return false;
  }

  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    return exp > now;     /* We just check if our Token has expired or not */
  } catch {
    return false;
  }
}