import { Router } from 'express';
import inventoryController from '../controllers/inventoryController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Purchase endpoint (authenticated users)
router.post('/:id/purchase', authMiddleware, (req, res) =>
    inventoryController.purchaseSweet(req, res)
);

// Restock endpoint (admin only)
router.post('/:id/restock', authMiddleware, adminMiddleware, (req, res) =>
    inventoryController.restockSweet(req, res)
);

export default router;
