import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const normalizeCartResponse = (payload, fallbackState) => {
  const cartItems =
    payload?.cartItems ??
    fallbackState?.cartData ??
    [];

  return {
    cartData: Array.isArray(cartItems) ? cartItems : [],
    cartQuantity:
      payload?.itemCount ?? (Array.isArray(cartItems) ? cartItems.length : 0),
    total: payload?.total ?? fallbackState?.total ?? 0,
  };
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (prodId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/${prodId}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to add item to cart");
    }
  }
);

export const removeCart = createAsyncThunk(
  "cart/removeCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/${itemId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to remove item from cart");
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ itemId, newQuantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/${itemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to update quantity");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartData: [],
    cartQuantity: 0,
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {

    clearCart(state) {
      state.cartData = [];
      state.cartQuantity = 0;
      state.total = 0;
      state.error = null;
    },

    setCartData(state,action) {
      state.cartData = action.payload;
    },

    setCartQuantity(state,action) {
      state.cartQuantity = action.payload;
    },

    setTotal(state,action) {
      state.total = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const normalized = normalizeCartResponse(action.payload, state);
        state.cartData = normalized.cartData;
        state.cartQuantity = normalized.cartQuantity;
        state.total = normalized.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const normalized = normalizeCartResponse(action.payload, state);
        state.cartData = normalized.cartData;
        state.cartQuantity = normalized.cartQuantity;
        state.total = normalized.total;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(removeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        state.loading = false;
        const normalized = normalizeCartResponse(action.payload, state);
        state.cartData = normalized.cartData;
        state.cartQuantity = normalized.cartQuantity;
        state.total = normalized.total;
      })
      .addCase(removeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const normalized = normalizeCartResponse(action.payload, state);
        state.cartData = normalized.cartData;
        state.cartQuantity = normalized.cartQuantity;
        state.total = normalized.total;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  clearCart,
  setCartData,
  setCartQuantity,
  setTotal,
} = cartSlice.actions;

export default cartSlice.reducer;