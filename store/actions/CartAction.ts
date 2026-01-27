import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItemType = {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  discount?: number;
};

interface CartState {
  items: CartItemType[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItemType>) {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);

      if (existing) {
        existing.qty += item.qty;
      } else {
        state.items.push(item);
      }
    },

    increaseQty(state, action: PayloadAction<number>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.qty += 1;
    },

    decreaseQty(state, action: PayloadAction<number>) {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.qty > 1) item.qty -= 1;
    },

    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
