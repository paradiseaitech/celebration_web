import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PlateItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface PlateState {
  items: PlateItem[];
  guestCount: number;
  pricingMode: "per-plate" | "package";
  selectedPackageId: string | null;
  addItem: (item: Omit<PlateItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setGuestCount: (count: number) => void;
  setPricingMode: (mode: "per-plate" | "package") => void;
  setSelectedPackageId: (id: string | null) => void;
  clearPlate: () => void;
  perPlateTotal: () => number;
  totalEstimate: () => number;
  itemCount: () => number;
}

export const usePlateStore = create<PlateState>()(
  persist(
    (set, get) => ({
      items: [],
      guestCount: 100,
      pricingMode: "per-plate",
      selectedPackageId: null,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        })),

      setGuestCount: (count) => set({ guestCount: count }),

      setPricingMode: (mode) => set({ pricingMode: mode }),

      setSelectedPackageId: (id) => set({ selectedPackageId: id }),

      clearPlate: () => set({ items: [], selectedPackageId: null }),

      perPlateTotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      totalEstimate: () => {
        const state = get();
        return state.perPlateTotal() * state.guestCount;
      },

      itemCount: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "celebration-plate",
      partialize: (state) => ({
        items: state.items,
        guestCount: state.guestCount,
        pricingMode: state.pricingMode,
        selectedPackageId: state.selectedPackageId,
      }),
    }
  )
);
