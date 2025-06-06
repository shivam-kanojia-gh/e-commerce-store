import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { devtools } from "zustand/middleware";

export const useCartStore = create(
  devtools((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    clearCart: async () => {
      await axios.delete("/cart", { data: { productId: null } });
      set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    },

    fetchCartItems: async () => {
      try {
        const res = await axios.get("/cart");
        set({ cart: res.data });
        get().calculateTotals();
      } catch (error) {
        set({ cart: [] });
        toast.error(
          error.response.data.message || "Failed to fetch cart items"
        );
      }
    },

    addToCart: async (product) => {
      try {
        await axios.post("/cart", { productId: product._id });
        toast.success("Product added to cart");
        set((prevState) => {
          const existingItem = prevState.cart.find(
            (item) => item._id === product._id
          );
          const newCart = existingItem
            ? prevState.cart.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...prevState.cart, { ...product, quantity: 1 }];
          return { cart: newCart };
        });
        get().calculateTotals();
      } catch (error) {
        toast.error(error.response.data.message || "Failed to add to cart");
      }
    },

    removeFromCart: async (productId) => {
      try {
        await axios.delete("/cart", { data: { productId } });
        set((prevState) => ({
          cart: prevState.cart.filter((item) => item._id !== productId),
        }));
        get().calculateTotals();
      } catch (error) {
        toast.error(
          error.response.data.message || "Failed to remove from cart"
        );
      }
    },

    updateQuantity: async (productId, quantity) => {
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      } else {
        try {
          await axios.put(`/cart/${productId}`, { quantity });
          set((prevState) => ({
            cart: prevState.cart.map((item) =>
              item._id === productId ? { ...item, quantity } : item
            ),
          }));
          get().calculateTotals();
        } catch (error) {
          toast.error(
            error.response.data.message || "Failed to update quantity"
          );
        }
      }
    },

    calculateTotals: () => {
      const { cart, coupon } = get();
      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      let total = subtotal;
      if (coupon) {
        const discount = subtotal * (coupon.discountPercentage / 100);
        total = total - discount;
      }
      set({ subtotal, total });
    },

    getMyCoupon: async () => {
      try {
        const res = await axios.get("/coupons");
        set({ coupon: res.data });
      } catch (error) {
        console.error("Error fetching coupon:", error);
      }
    },

    applyCoupon: async (code) => {
      try {
        const res = await axios.post("/coupons/validate", { code });
        set({ coupon: res.data, isCouponApplied: true });
        get().calculateTotals();
        toast.success("Coupon applied successfully");
      } catch (error) {
        toast.error(error.response.data.message || "Failed to apply coupon");
      }
    },

    removeCoupon: () => {
      set({ coupon: null, isCouponApplied: false });
      get().calculateTotals();
      toast.success("Coupon removed");
    },
  }))
);
