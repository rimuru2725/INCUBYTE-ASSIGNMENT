import { CreateSweetDto, UpdateSweetDto, SearchSweetDto } from '../types/sweet.types';
import prisma from '../utils/prisma';

export class SweetsService {
    async createSweet(data: CreateSweetDto) {
        // Validate required fields
        if (!data.name || !data.category || data.price === undefined || data.quantity === undefined) {
            throw new Error('Name, category, price, and quantity are required');
        }

        // Validate price and quantity
        if (data.price < 0) {
            throw new Error('Price must be a positive number');
        }

        if (data.quantity < 0) {
            throw new Error('Quantity must be a positive number');
        }

        const sweet = await prisma.sweet.create({
            data: {
                name: data.name,
                category: data.category,
                price: data.price,
                quantity: data.quantity,
                description: data.description
            }
        });

        return sweet;
    }

    async getAllSweets() {
        const sweets = await prisma.sweet.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });

        return sweets;
    }

    async searchSweets(filters: SearchSweetDto) {
        const where: any = {};

        if (filters.name) {
            where.name = {
                contains: filters.name
            };
        }

        if (filters.category) {
            where.category = {
                equals: filters.category
            };
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined) {
                where.price.gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                where.price.lte = filters.maxPrice;
            }
        }

        const sweets = await prisma.sweet.findMany({
            where,
            orderBy: {
                createdAt: 'asc'
            }
        });

        return sweets;
    }

    async updateSweet(id: string, data: UpdateSweetDto) {
        // Check if sweet exists
        const existingSweet = await prisma.sweet.findUnique({
            where: { id }
        });

        if (!existingSweet) {
            throw new Error('Sweet not found');
        }

        // Validate price if provided
        if (data.price !== undefined && data.price < 0) {
            throw new Error('Price must be a positive number');
        }

        // Validate quantity if provided
        if (data.quantity !== undefined && data.quantity < 0) {
            throw new Error('Quantity must be a positive number');
        }

        const sweet = await prisma.sweet.update({
            where: { id },
            data
        });

        return sweet;
    }

    async deleteSweet(id: string) {
        // Check if sweet exists
        const existingSweet = await prisma.sweet.findUnique({
            where: { id }
        });

        if (!existingSweet) {
            throw new Error('Sweet not found');
        }

        await prisma.sweet.delete({
            where: { id }
        });

        return { message: 'Sweet deleted successfully' };
    }

    async getSweetById(id: string) {
        const sweet = await prisma.sweet.findUnique({
            where: { id }
        });

        if (!sweet) {
            throw new Error('Sweet not found');
        }

        return sweet;
    }
}

export default new SweetsService();
