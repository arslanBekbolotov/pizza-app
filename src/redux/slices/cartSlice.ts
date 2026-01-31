import {createSlice} from "@reduxjs/toolkit";
import {IGoodsMutation} from "../../types";

export interface dishesState {
  totalPrice: number;
  items: IGoodsMutation[];
}

const initialState: dishesState = {
  totalPrice: 0,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProducts(state, action) {
      const findItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (findItem) {
        findItem.count++;
      } else {
        state.items.push({ ...action.payload, count: 1 });
      }

      state.totalPrice = state.items.reduce((acc, value) => {
        return acc + value.price * value.count;
      }, 0);
    },
    minusProducts(state, action) {
      const findItem = state.items.find((item) => item.id === action.payload);

      if (findItem) {
        if (!findItem.count) {
          return;
        }

        findItem.count--;
      }

      state.totalPrice = state.items.reduce((acc, value) => {
        return acc + value.price * value.count;
      }, 0);
    },
    removeProducts(state, action) {
      state.items = state.items.filter(
        (product) => product.id !== action.payload,
      );
      state.totalPrice = state.items.reduce((acc, value) => {
        return acc + value.price * value.count;
      }, 0);
    },
    clearProducts(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const { addProducts, removeProducts, clearProducts, minusProducts } =
  cartSlice.actions;

export default cartSlice.reducer;
