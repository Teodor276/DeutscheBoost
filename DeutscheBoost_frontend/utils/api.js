import { Platform } from "react-native";
import { useAuth } from "./auth";

export const API_URL = "http://192.168.1.9:8000";

export function useApi() {
  const { getValidToken } = useAuth();

  const fetchWithAuth = async (url, opts = {}) => {
    const idToken = await getValidToken();
    const headers = {
      ...(opts.headers || {}),
      Authorization: `Bearer ${idToken}`,
    };
    return fetch(url, { ...opts, headers });
  };

  return { fetchWithAuth };
}
