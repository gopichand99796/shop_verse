import create from 'zustand';
import { toast } from 'react-toastify';
import { auth as apiAuth } from '../services/api';
import { clearAuthTokens, setAuthHeader } from '../services/http';
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
  setUser: (u) => {
    console.log('Auth State: setUser', u);
    set({ user: u, isAuthenticated: !!u });
  },
  setToken: (t) => set({ token: t }),
  register: async (name, email, password) => {
    const res = await apiAuth.register({ name, email, password });
    toast.success('Account created. Welcome to ShopVerse!');
    // auto-login after register
    try {
      await (set as any).getState().login(email, password);
    } catch (e) {
      console.warn('Auth State: auto-login after register failed', e);
      // ignore login failure; user can still sign in manually
    }
    return res;
  },
  login: async (email, password) => {
    const res = await apiAuth.login({ email, password });
    const data = (res as any);
    console.log('Auth State: login response', data);
    if (!data?.accessToken) {
      throw new Error('Authentication failed: missing access token');
    }

    // persist tokens
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    setAuthHeader(data.accessToken);

    // fetch user profile
    let userProfile = null;
    try {
      const me = await apiAuth.me();
      if (me?.data) {
        userProfile = me.data;
      } else {
        throw new Error('Unable to load profile after login');
      }
    } catch (e) {
      console.error('Auth State: login me() failed', e);
      clearAuthTokens();
      setAuthHeader(null);
      set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
      throw e;
    }

    console.log('Login success');
    console.log('Fetched profile:', userProfile);
    set({ token: data.accessToken, refreshToken: data.refreshToken, user: userProfile, isAuthenticated: true });
    console.log('Store updated:', { user: userProfile, isAuthenticated: true });

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
      console.warn('Auth State: cart merge failed', e);
    }

    toast.success('Signed in successfully');
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
    console.log('Auth State: restore empty');
    useAuth.setState({ loading: false });
    return;
  }
  console.log('Auth State: restore starting', { accessPresent: !!access, refreshPresent: !!refresh });
  if (access) {
    setAuthHeader(access);
    try {
      const me = await apiAuth.me();
      if (me?.data) {
        console.log('Auth State: restore success', me.data);
        useAuth.setState({ token: access, refreshToken: refresh, user: me.data, isAuthenticated: true, loading: false });
        return;
      }
    } catch (e) {
      console.warn('Auth State: restore me() failed', e);
      // try refresh
    }
  }
  if (refresh) {
    try {
      const r = await apiAuth.refresh(refresh);
      const newAccess = r?.accessToken;
      const newRefresh = r?.refreshToken;
      console.log('Auth State: refresh result', r);
      if (newAccess) {
        localStorage.setItem('accessToken', newAccess);
        if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
        setAuthHeader(newAccess);
        const me = await apiAuth.me();
        if (me?.data) {
          useAuth.setState({ token: newAccess, refreshToken: newRefresh, user: me.data, isAuthenticated: true, loading: false });
          return;
        }
      }
    } catch (e) {
      console.warn('Auth State: refresh failed', e);
      // fallthrough
    }
  }
  // failed to restore
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  setAuthHeader(null);
  useAuth.setState({ token: null, refreshToken: null, user: null, isAuthenticated: false, loading: false });
})();

useAuth.subscribe((state) => {
  console.log('Store updated:', {
    token: state.token,
    refreshToken: state.refreshToken,
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
  });
});

export default useAuth;
