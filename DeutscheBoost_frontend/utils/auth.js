import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

const FIRE_KEY = "";   // replace with ur own   
const AUTH_URL = `https://identitytoolkit.googleapis.com/v1`;

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

async function refreshWithToken(refreshToken) {

  const res = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${FIRE_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    }
  );

  if (!res.ok) 
    throw new Error("Token refresh failed");

  const data = await res.json();

  return {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresAt: dayjs().add(+data.expires_in - 60, "second").valueOf(), // 60-sec buffer
    email: data.user_id,
  };

}

export function AuthProvider({ children }) {
  const [state, setState] = useState({ loaded: false });

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("@auth");
      if (raw) setState({ ...JSON.parse(raw), loaded: true });
      else setState({ loaded: true });
    })();
  }, []);

  useEffect(() => {
    if (state.loaded) AsyncStorage.setItem("@auth", JSON.stringify(state));
  }, [state]);

  const signIn = async (email, password, isSignup = false) => {
    const path = isSignup ? "accounts:signUp" : "accounts:signInWithPassword";
    const res = await fetch(`${AUTH_URL}/${path}?key=${FIRE_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    if (!res.ok) 
        throw new Error("Auth failed");

    const data = await res.json();

    setState({
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresAt: dayjs().add(+data.expiresIn - 60, "second").valueOf(),
      loaded: true,
    });

  };

  const signOut = async () => {
    await AsyncStorage.removeItem("@auth");
    setState({ loaded: true });
  };

  const getValidToken = useCallback(async () => {
    if (!state.idToken) return null;
    if (dayjs().valueOf() < state.expiresAt) return state.idToken;

    try {
      const fresh = await refreshWithToken(state.refreshToken);
      setState((s) => ({ ...s, ...fresh }));
      return fresh.idToken;
    } catch {
      await signOut();
      return null;
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, getValidToken }}>
      {state.loaded ? children : null}
    </AuthContext.Provider>
  );
}
