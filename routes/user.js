import express from 'express';
import { 
  deleteUser, 
  getAllUsers, 
  login, 
  registerUser, 
  updateUser,
  authorize 
} from '../controllers/userController.js';

const router = express.Router();

// Public routes (Anyone can sign up or log in)
router.post('/register', registerUser);
router.post('/login', login);

// Protected routes (Require authentication / authorization)
router.put('/:userId', authorize(['User', 'Admin']), updateUser);
router.get('/all', authorize(['Admin']), getAllUsers);
router.delete('/:userId', authorize(['Admin']), deleteUser);

export default router;