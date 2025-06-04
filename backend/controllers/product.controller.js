import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    // fetch from mongodb 
    const products = await Product.find({}); // find all products
    res.status(200).json(products);
  } catch (error) {
    console.log("Error in get all products controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    // check for featured products in redis
    let featuredProducts = await redis.get("featured_products");

    // if in redis
    if (featuredProducts) {
      return res.status(200).json(JSON.parse(featuredProducts)); // convert string to object
    }

    // if not in redis, fetch from mongodb
    // .lean() to convert mongoose object to js object, good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    // check if no featured products
    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for faster access
    await redis.set("featured_products", JSON.stringify(featuredProducts)); // convert object to string

    return res.status(200).json(featuredProducts);
  } catch (error) {
    console.log("Error in get all products controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    // fetch 3 random products from mongodb and return specific fields only
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in get recommended products controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    // fetch from mongodb by category
    const products = await Product.find({ category: req.params.category });

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in get products by category controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    // get product details from request body
    const { name, description, price, image, category } = req.body;

    // upload image to cloudinary
    let cloudinaryResponse = null;

    // if image exists
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    // create product
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in create product controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    // get product by id
    const product = await Product.findById(req.params.id);

    // toggle isFeatured
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();

      // update featured products cache
      await updateFeaturedProductsCache();

      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggle featured product controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // get product by id
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // delete image from cloudinary
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; // get public id from url 

      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.log("Error deleting image from cloudinary:", error.message);
      }
    }

    // delete product from mongodb
    await Product.findByIdAndDelete(req.params.id);

    // update featured products cache
    await updateFeaturedProductsCache();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in delete product controller:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    // update featured products cache
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error updating featured products cache:", error.message);
  }
}