import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { setAuthHeader } from "@/utils/api";
import { API_ENDPOINTS } from "@/utils/endpoints";

const AuthContext = createContext(null);

const TOKEN_KEY = "peronline_token";
const USER_KEY = "peronline_user";

function readStoredSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (!token || !userRaw) return { user: null, token: null };
    const user = JSON.parse(userRaw);
    setAuthHeader(token);
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const stored = readStoredSession();
  const [user, setUserState] = useState(stored.user);
  const [token, setToken] = useState(stored.token);

  const persistSession = (profile, nextToken) => {
    setUserState(profile);
    if (nextToken) {
      setToken(nextToken);
      setAuthHeader(nextToken);
      localStorage.setItem(TOKEN_KEY, nextToken);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  };

  const applySession = (userData, nextToken) => {
    const { token: embeddedToken, ...profile } = userData || {};
    const activeToken = nextToken || embeddedToken;
    persistSession(profile, activeToken);
  };

  const setUser = (profile) => {
    setUserState(profile);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  };

  const login = async (identifier, password) => {
    const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, { identifier, password });
    applySession(res.data.user, res.data.token);
    toast.success("Login berhasil");
  };

  const register = async (payload) => {
    await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    toast.success("Register berhasil");
  };

  const becomeSeller = async () => {
    if (!user?.id) throw new Error("Belum login");
    const res = await api.patch(API_ENDPOINTS.USERS.BECOME_SELLER(user.id));
    applySession(res.data, res.data.token);
    toast.success("Akun berhasil diubah menjadi Seller");
  };

  const logout = useCallback(() => {
    setUserState(null);
    setToken(null);
    setAuthHeader(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    navigate("/", { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({ user, token, login, register, logout, setUser, becomeSeller, applySession }),
    [user, token, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
