import { PrismaClient } from '@prisma/client';
import { PurchaseDto, RestockDto } from '../types/sweet.types';

const prisma = new PrismaClient();

export class InventoryService {
    async purchaseSweet(id: string, data: PurchaseDto) {
        // Validate quantity
        if (data.quantity === undefined || data.quantity === null) {
            throw new Error('Quantity is required');
        }

        if (data.quantity <= 0) {
            throw new Error('Quantity must be a positive number');
        }

        // Get sweet
        const sweet = await prisma.sweet.findUnique({
            where: { id }
        });

        if (!sweet) {
            throw new Error('Sweet not found');
        }

        // Check stock
        if (sweet.quantity < data.quantity) {
            throw new Error('Insufficient stock available');
        }

        // Update quantity
        const updatedSweet = await prisma.sweet.update({
            where: { id },
            data: {
                quantity: sweet.quantity - data.quantity
            }
        });

        return {
            ...updatedSweet,
            message: 'Purchase successful'
        };
    }

    async restockSweet(id: string, data: RestockDto) {
        // Validate quantity
        if (data.quantity === undefined || data.quantity === null) {
            throw new Error('Quantity is required');
        }

        if (data.quantity <= 0) {
            throw new Error('Quantity must be a positive number');
        }

        // Get sweet
        const sweet = await prisma.sweet.findUnique({
            where: { id }
        });

        if (!sweet) {
            throw new Error('Sweet not found');
        }

        // Update quantity
        const updatedSweet = await prisma.sweet.update({
            where: { id },
            data: {
                quantity: sweet.quantity + data.quantity
            }
        });

        return {
            ...updatedSweet,
            message: 'Restock successful'
        };
    }
}

export default new InventoryService();
