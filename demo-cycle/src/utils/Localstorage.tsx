import { CART_STORAGE_KEY } from "../constants/Cart";
import { ICart } from "../models/Cart";

export const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    return [];
  }
};

export const saveCartToStorage = (cart: ICart[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
};
