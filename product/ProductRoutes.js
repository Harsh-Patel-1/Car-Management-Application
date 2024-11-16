const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware"); // Assuming you have middleware in a separate file
const Product = require("../models/Product"); // Assuming Product model is in a `models` folder

const router = express.Router();

// Create Product
router.post("/", authenticateToken, async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      createdBy: req.user.id,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
});

// Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Get Product by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
});

// Update Product
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !description || !price)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },
      { name, description, price },
      { new: true }
    );

    if (!updatedProduct)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    res
      .status(200)
      .json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
});

// Delete Product
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      createdBy: req.user.id,
    });

    if (!deletedProduct)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    res
      .status(200)
      .json({ message: "Product deleted", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
});

module.exports = router;
