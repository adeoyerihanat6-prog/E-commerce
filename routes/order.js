import { Router } from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrder, 
  deleteOrder 
} from '../controllers/orderController.js';

const router = Router();

// RESTful convention: Use root '/' for collection operations
router.post('/', createOrder);      // POST /api/orders
router.get('/', getOrders);        // GET /api/orders

// ID-based operations
router.get('/:id', getOrderById);   // GET /api/orders/:id
router.put('/:id', updateOrder);   // PUT /api/orders/:id
router.delete('/:id', deleteOrder);// DELETE /api/orders/:id

export default router;