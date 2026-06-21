import create from 'zustand';

type Item = { productId: string; qty: number };

type State = {
  items: Item[];
  setItems: (items: Item[]) => void;
  addItem: (productId: string, qty?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCart = create<State>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (productId, qty = 1) => set((s) => {
    const found = s.items.find((i) => i.productId === productId);
    if (found) return { items: s.items.map((i) => i.productId === productId ? { ...i, qty: i.qty + qty } : i) };
    return { items: [...s.items, { productId, qty }] };
  }),
  removeItem: (productId) => set((s) => ({ items: s.items.filter(i => i.productId !== productId) })),
  clear: () => set({ items: [] }),
}));

export default useCart;
