import create from 'zustand';
import { toast } from 'react-toastify';
import { auth as apiAuth } from '../services/api';
import { setAuthHeader } from '../services/http';
import useCart from './useCart';
import { cart as apiCart } from '../services/api';

type User = { id?: string; name?: string; email?: string; roles?: string[] } | null;

type State = {
  token?: string | null;
  refreshToken?: string | null;
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (u: User) => void;
  setToken: (t?: string | null) => void;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
};

export const useAuth = create<State>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  loading: true,
  setUser: (u) => set({ user: u, isAuthenticated: !!u }),
  setToken: (t) => set({ token: t }),
  register: async (name, email, password) => {
    const res = await apiAuth.register({ name, email, password });
    toast.success('Account created. Welcome to ShopVerse!');
    // auto-login after register
    try {
      await (set as any).getState().login(email, password);
    } catch (e) {
      // ignore login failure; user can still sign in manually
    }
    return res;
  },
  login: async (email, password) => {
    const res = await apiAuth.login({ email, password });
    const data = (res as any);
    if (data?.accessToken) {
      // persist tokens
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
      setAuthHeader(data.accessToken);
      set({ token: data.accessToken, refreshToken: data.refreshToken });

      // fetch user profile
      try {
        const me = await apiAuth.me();
        if (me?.data) set({ user: me.data });
      } catch (e) {
        // ignore
      }

      // merge local guest cart into user's cart
      try {
        const guest = useCart.getState().items;
        for (const it of guest) {
          await apiCart.add(it.productId, it.qty);
        }
        // refresh server cart into local state
        const serverCart = await apiCart.get();
        if (serverCart?.data?.items) {
          const mapped = serverCart.data.items.map((i: any) => ({ productId: String(i.product._id || i.product), qty: i.qty }));
          useCart.getState().setItems(mapped);
        }
      } catch (e) {
        // ignore merge errors
      }
      toast.success('Signed in successfully');
    }
    return res;
  },
  logout: () => {
    const state: any = (set as any).getState();
    const rt = state.refreshToken || localStorage.getItem('refreshToken');
    try { apiAuth.logout(rt); } catch (e) { /* ignore */ }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthHeader(null);
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
    useCart.getState().clear();
    toast.info('You have been signed out');
  },
}));

// restore session on startup
(async function restore() {
  const access = localStorage.getItem('accessToken');
  const refresh = localStorage.getItem('refreshToken');
  if (!access && !refresh) {
    useAuth.setState({ loading: false });
    return;
  }
  if (access) {
    setAuthHeader(access);
    try {
      const me = await apiAuth.me();
      if (me?.data) {
        useAuth.setState({ token: access, refreshToken: refresh, user: me.data, isAuthenticated: true, loading: false });
        return;
      }
    } catch (e) {
      // try refresh
    }
  }
  if (refresh) {
    try {
      const r = await apiAuth.refresh(refresh);
      const newAccess = r?.accessToken;
      const newRefresh = r?.refreshToken;
      if (newAccess) {
        localStorage.setItem('accessToken', newAccess);
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
        setAuthHeader(newAccess);
        const me = await apiAuth.me();
        useAuth.setState({ token: newAccess, refreshToken: newRefresh, user: me?.data || null, isAuthenticated: !!me?.data, loading: false });
        return;
      }
    } catch (e) {
      // fallthrough
    }
  }
  // failed to restore
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  setAuthHeader(null);
  useAuth.setState({ token: null, refreshToken: null, user: null, isAuthenticated: false, loading: false });
})();

export default useAuth;
