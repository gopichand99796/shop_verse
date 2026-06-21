import create from 'zustand';
import { auth as apiAuth } from '../services/api';

type User = { id?: string; name?: string; email?: string; roles?: string[] } | null;

type State = {
  token?: string | null;
  user: User;
  setUser: (u: User) => void;
  setToken: (t?: string | null) => void;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
};

export const useAuth = create<State>((set) => ({
  token: null,
  user: null,
  setUser: (u) => set({ user: u }),
  setToken: (t) => set({ token: t }),
  login: async (email, password) => {
    const res = await apiAuth.login({ email, password });
    if ((res as any)?.data?.accessToken) {
      set({ token: (res as any).data.accessToken, user: (res as any).data.user });
    }
    return res;
  },
  logout: () => {
    set({ token: null, user: null });
    try { apiAuth.logout(); } catch (e) { /* ignore */ }
  },
}));

export default useAuth;
