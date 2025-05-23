import express from 'express';
import { 
  register, 
  login, 
  logout, 
  currentUser,
} from '../controllers/authController.js';
import { requireLogin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', requireLogin, logout);
router.get('/me', requireLogin, currentUser);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password', resetPassword);

export default router;