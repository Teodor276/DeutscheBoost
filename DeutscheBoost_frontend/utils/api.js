import { Platform } from "react-native";
import { useAuth } from "./auth";

export const API_URL = ""; // replace with ur own 

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
