import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { devtools } from "zustand/middleware";
import { useCartStore } from "./useCartStore";

export const useProductStore = create(
  devtools((set) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
      set({ loading: true });
      try {
        const res = await axios.post("/products", productData);
        set((prevState) => ({
          products: [...prevState.products, res.data],
          loading: false,
        }));
        toast.success("Product created successfully");
      } catch (error) {
        set({ loading: false });
        toast.error(error.response.data.message || "Failed to create product");
      }
    },

    fetchAllProducts: async () => {
      set({ loading: true });
      try {
        const res = await axios.get("/products");
        set({ products: res.data, loading: false });
      } catch (error) {
        set({ loading: false });
        toast.error(error.response.data.message || "Failed to fetch products");
      }
    },

    fetchFeaturedProducts: async () => {
      set({ loading: true });
      try {
        const res = await axios.get("/products/featured");
        set({ products: res.data, loading: false });
      } catch (error) {
        set({ loading: false });
        console.log("Error fetching featured products:", error);
      }
    },

    fetchProductsByCategory: async (category) => {
      set({ loading: true });
      try {
        const res = await axios.get(`/products/category/${category}`);
        set({ products: res.data, loading: false });
      } catch (error) {
        set({ loading: false });
        toast.error(error.response.data.message || "Failed to fetch products");
      }
    },

    toggleFeaturedProduct: async (productId) => {
      set({ loading: true });
      try {
        const res = await axios.patch(`/products/${productId}`);
        set((prevState) => ({
          products: prevState.products.map((product) =>
            product._id === productId
              ? { ...product, isFeatured: res.data.isFeatured }
              : product
          ),
          loading: false,
        }));
        set({ loading: false });
      } catch (error) {
        set({ loading: false });
        toast.error(error.response.data.message || "Failed to toggle product");
      }
    },

    deleteProduct: async (productId) => {
      set({ loading: true });
      try {
        await axios.delete(`/products/${productId}`);
        set((prevState) => ({
          products: prevState.products.filter(
            (product) => product._id !== productId
          ),
          loading: false,
        }));

        // Remove product from cart if it exists
        const cartStore = useCartStore.getState();
        const cartItem = cartStore.cart.find(item => item._id === productId);
        if (cartItem) {
          await cartStore.removeFromCart(productId);
        }

        toast.success("Product deleted successfully");
      } catch (error) {
        set({ loading: false });
        toast.error(error.response.data.message || "Failed to delete product");
      }
    },
  }))
);
