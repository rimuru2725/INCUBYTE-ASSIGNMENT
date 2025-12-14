import { Response } from 'express';
import sweetsService from '../services/sweetsService';
import { AuthRequest } from '../types/express.types';
import { CreateSweetDto, UpdateSweetDto, SearchSweetDto } from '../types/sweet.types';

export class SweetsController {
    async createSweet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const data: CreateSweetDto = req.body;
            const sweet = await sweetsService.createSweet(data);
            res.status(201).json(sweet);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async getAllSweets(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sweets = await sweetsService.getAllSweets();
            res.status(200).json(sweets);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async searchSweets(req: AuthRequest, res: Response): Promise<void> {
        try {
            const filters: SearchSweetDto = {
                name: req.query.name as string,
                category: req.query.category as string,
                minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
                maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined
            };

            const sweets = await sweetsService.searchSweets(filters);
            res.status(200).json(sweets);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateSweet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const data: UpdateSweetDto = req.body;
            const sweet = await sweetsService.updateSweet(id, data);
            res.status(200).json(sweet);
        } catch (error) {
            if (error instanceof Error) {
                const statusCode = error.message === 'Sweet not found' ? 404 : 400;
                res.status(statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async deleteSweet(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const result = await sweetsService.deleteSweet(id);
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

export default new SweetsController();
