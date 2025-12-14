import { Request, Response } from 'express';
import authService from '../services/authService';
import { RegisterDto, LoginDto } from '../types/auth.types';

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const data: RegisterDto = req.body;
            const result = await authService.register(data);
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const data: LoginDto = req.body;
            const result = await authService.login(data);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                const statusCode = error.message === 'Invalid credentials' ? 401 : 400;
                res.status(statusCode).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
}

export default new AuthController();
