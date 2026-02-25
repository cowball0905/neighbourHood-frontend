import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token: string): boolean {
    try {
        const { exp } = jwtDecode(token);
        if (!exp) return true;
        return exp * 1000 < Date.now();
    } catch {
        return true;
    }
}
