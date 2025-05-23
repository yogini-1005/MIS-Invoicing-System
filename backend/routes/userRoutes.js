import express from 'express';
import User from '../models/User.js';
import { requireLogin, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET all users (admin only)
router.get('/', requireLogin, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password_hash -__v');
    res.json(users);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch users',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// DELETE user (admin only)
router.delete('/:id', requireLogin, requireAdmin, async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(403).json({ error: 'Cannot delete your own account' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to delete user',
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;