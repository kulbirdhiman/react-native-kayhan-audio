// store/slices/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItemType = {
  cart_id: number;

  // backend expects these:
  product_id: number;
  name: string;
  slug: string;
  weight: number;
  variations: any[];
  images: string[]; // array of full urls (or relative, your choice)
  quantity: number;

  regular_price: number;
  discount_price: number;
  price: number; // final price used

  department_id: number;
  category_id: number;
  model_id: number;

  // optional flags
  is_free?: 1 | 0;
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

      // ✅ match by product_id (backend key)
      const existing = state.items.find((i) => i.product_id === item.product_id);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },

    increaseQty(state, action: PayloadAction<number>) {
      const product_id = action.payload;
      const item = state.items.find((i) => i.product_id === product_id);
      if (item) item.quantity += 1;
    },

    decreaseQty(state, action: PayloadAction<number>) {
      const product_id = action.payload;
      const item = state.items.find((i) => i.product_id === product_id);
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    removeItem(state, action: PayloadAction<number>) {
      const product_id = action.payload;
      state.items = state.items.filter((i) => i.product_id !== product_id);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, increaseQty, decreaseQty, removeItem, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
