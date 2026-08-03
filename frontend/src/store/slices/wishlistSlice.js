import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// **Dead code**

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/fav/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/fav/`,
        {productId},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to add item to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (favoriteId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/fav/${favoriteId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to remove item from wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlistItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist(state) {
      state.wishlistItems = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload?.data ?? [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addToWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload?.data ?? [];
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = state.wishlistItems.filter(
            item => item._id !== action.meta.arg // action.meta.arg holds the favoriteId you passed to the thunk.
        )
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
  },
});

export const {
  clearWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;