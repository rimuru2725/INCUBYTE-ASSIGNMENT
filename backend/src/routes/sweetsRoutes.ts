import { Router } from 'express';
import sweetsController from '../controllers/sweetsController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', (req, res) => sweetsController.getAllSweets(req, res));
router.get('/search', (req, res) => sweetsController.searchSweets(req, res));

// Protected routes (require authentication)
router.post('/', authMiddleware, (req, res) => sweetsController.createSweet(req, res));
router.put('/:id', authMiddleware, (req, res) => sweetsController.updateSweet(req, res));

// Admin only routes
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => sweetsController.deleteSweet(req, res));

export default router;
