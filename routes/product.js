import express from 'express';
import { 
  createProduct, 
  deleteProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct 
} from '../controllers/productController.js';
import upload from '../middlewares/upload.js';
import { authorize } from '../controllers/userController.js';

const router = express.Router();

// Public route: Allow standard users/shoppers to view products
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes: Only Admins can modify product data
router.post('/', authorize(["Admin"]), upload.single("image"), createProduct);
router.put('/:id', authorize(["Admin"]), upload.single("image"), updateProduct);
router.delete('/:id', authorize(["Admin"]), deleteProduct);

export default router;