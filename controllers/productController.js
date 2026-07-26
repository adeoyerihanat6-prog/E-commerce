import Product from "../models/product.js";

// @desc    Create a new product (with Cloudinary image upload)
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    // req.file path comes from Multer/Cloudinary storage middleware
    const image = req.file?.path; 

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = new Product({
      name,
      price,
      description,
      image,
      category
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fixed lowercase 'product' to capitalized 'Product'
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product); // Fixed returning 'order' to returning 'product'
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const { id } = req.params; // Fixed capitalized 'Id' to lowercase 'id'
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  try {
    let updateData = { name, price, description };

    // If a new image file was uploaded, update the image field too
    if (req.file?.path) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" }); // Changed 400 to 404 Not Found
    }

    res.status(200).json(updatedProduct); // Return the updated product object instead of just a message
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct };