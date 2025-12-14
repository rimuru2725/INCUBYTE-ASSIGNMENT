import { Response } from 'express';
import inventoryService from '../services/inventoryService';
import { AuthRequest } from '../types/express.types';
import { PurchaseDto, RestockDto } from '../types/sweet.types';

export class InventoryController {
    async purchaseSweet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const data: PurchaseDto = req.body;
            const result = await inventoryService.purchaseSweet(id, data);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                const statusCode = error.message === 'Sweet not found' ? 404 : 400;
                res.status(statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async restockSweet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const data: RestockDto = req.body;
            const result = await inventoryService.restockSweet(id, data);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                const statusCode = error.message === 'Sweet not found' ? 404 : 400;
                res.status(statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

export default new InventoryController();
