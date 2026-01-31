import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IGoods,
  IGoodsMutation,
  ISizeOption,
  IDoughOption,
  IAddOnIngredient,
} from "../../types";

export interface AddToCartPayload extends IGoods {
  selectedSize?: ISizeOption;
  selectedDough?: IDoughOption;
  addedIngredients?: IAddOnIngredient[];
}

function getCartItemKey(item: {
  id: string;
  selectedSize?: ISizeOption;
  selectedDough?: IDoughOption;
  addedIngredients?: IAddOnIngredient[];
}): string {
  const sizeId = item.selectedSize?.id ?? "";
  const doughId = item.selectedDough?.id ?? "";
  const addIds = (item.addedIngredients ?? [])
    .map((i) => i.id)
    .sort()
    .join(",");
  return `${item.id}-${sizeId}-${doughId}-${addIds}`;
}

function getTotalUnitPrice(
  dish: IGoods,
  selectedSize?: ISizeOption,
  addedIngredients?: IAddOnIngredient[]
): number {
  const base = dish.price;
  const sizeMod = selectedSize?.priceModifier ?? 0;
  const addSum = (addedIngredients ?? []).reduce((s, i) => s + i.price, 0);
  return base + sizeMod + addSum;
}

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
    addProducts(state, action: PayloadAction<AddToCartPayload | IGoodsMutation>) {
      const payload = action.payload;
      const key =
        "cartItemKey" in payload && payload.cartItemKey
          ? payload.cartItemKey
          : getCartItemKey(payload);
      const findItem = state.items.find((item) => item.cartItemKey === key);

      if (findItem) {
        findItem.count++;
      } else {
        const totalUnitPrice =
          "totalUnitPrice" in payload && typeof payload.totalUnitPrice === "number"
            ? payload.totalUnitPrice
            : getTotalUnitPrice(
                payload,
                payload.selectedSize,
                payload.addedIngredients
              );
        state.items.push({
          ...payload,
          count: 1,
          cartItemKey: key,
          totalUnitPrice,
        });
      }

      state.totalPrice = state.items.reduce(
        (acc, value) => acc + value.totalUnitPrice * value.count,
        0
      );
    },
    minusProducts(state, action: PayloadAction<string>) {
      const cartItemKey = action.payload;
      const findItem = state.items.find(
        (item) => item.cartItemKey === cartItemKey
      );

      if (findItem && findItem.count > 0) {
        findItem.count--;
      }

      state.totalPrice = state.items.reduce(
        (acc, value) => acc + value.totalUnitPrice * value.count,
        0
      );
    },
    removeProducts(state, action: PayloadAction<string>) {
      const cartItemKey = action.payload;
      state.items = state.items.filter(
        (product) => product.cartItemKey !== cartItemKey
      );
      state.totalPrice = state.items.reduce(
        (acc, value) => acc + value.totalUnitPrice * value.count,
        0
      );
    },
    clearProducts(state) {
      state.items = [];
      state.totalPrice = 0;
    },
    updateCartItem(
      state,
      action: PayloadAction<{ oldKey: string; newItem: AddToCartPayload }>
    ) {
      const { oldKey, newItem } = action.payload;
      const idx = state.items.findIndex((item) => item.cartItemKey === oldKey);
      if (idx === -1) return;

      const oldCount = state.items[idx].count;
      const newKey = getCartItemKey(newItem);
      const totalUnitPrice = getTotalUnitPrice(
        newItem,
        newItem.selectedSize,
        newItem.addedIngredients
      );

      const existingIdx = state.items.findIndex(
        (item, i) => i !== idx && item.cartItemKey === newKey
      );

      if (existingIdx !== -1) {
        state.items[existingIdx].count += oldCount;
        state.items.splice(idx, 1);
      } else {
        state.items[idx] = {
          ...newItem,
          count: oldCount,
          cartItemKey: newKey,
          totalUnitPrice,
        };
      }

      state.totalPrice = state.items.reduce(
        (acc, value) => acc + value.totalUnitPrice * value.count,
        0
      );
    },
  },
});

export const {
  addProducts,
  removeProducts,
  clearProducts,
  minusProducts,
  updateCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;
