import request from 'supertest';
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from '../src/routes/authRoutes';
import sweetsRoutes from '../src/routes/sweetsRoutes';
import inventoryRoutes from '../src/routes/inventoryRoutes';

const prisma = new PrismaClient();
let app: Express;
let authToken: string;
let adminToken: string;

beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use('/api/sweets', sweetsRoutes);
    app.use('/api/sweets', inventoryRoutes);
});

beforeEach(async () => {
    // Clean up database
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const adminResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'admin@example.com',
            password: 'password123',
            name: 'Admin User'
        });
    adminToken = adminResponse.body.token;

    // Create regular user
    const userResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'user@example.com',
            password: 'password123',
            name: 'Regular User'
        });
    authToken = userResponse.body.token;
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('POST /api/sweets/:id/purchase', () => {
    let sweetId: string;

    beforeEach(async () => {
        const response = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 2.99,
                quantity: 100
            });
        sweetId = response.body.id;
    });

    it('should purchase a sweet with sufficient stock', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                quantity: 10
            });

        expect(response.status).toBe(200);
        expect(response.body.quantity).toBe(90);
        expect(response.body.message).toBe('Purchase successful');
    });

    it('should fail without authentication', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .send({
                quantity: 10
            });

        expect(response.status).toBe(401);
    });

    it('should fail with insufficient stock', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                quantity: 150
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Insufficient stock');
    });

    it('should fail with invalid quantity', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                quantity: -5
            });

        expect(response.status).toBe(400);
    });

    it('should fail with missing quantity', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({});

        expect(response.status).toBe(400);
    });

    it('should fail with non-existent sweet', async () => {
        const response = await request(app)
            .post('/api/sweets/non-existent-id/purchase')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                quantity: 10
            });

        expect(response.status).toBe(404);
    });

    it('should correctly reduce quantity', async () => {
        await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                quantity: 25
            });

        const sweet = await prisma.sweet.findUnique({
            where: { id: sweetId }
        });

        expect(sweet?.quantity).toBe(75);
    });

    it('should handle multiple purchases correctly', async () => {
        await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                quantity: 20
            });

        const response = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                quantity: 30
            });

        expect(response.status).toBe(200);
        expect(response.body.quantity).toBe(50);
    });
});

describe('POST /api/sweets/:id/restock', () => {
    let sweetId: string;

    beforeEach(async () => {
        const response = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 2.99,
                quantity: 50
            });
        sweetId = response.body.id;
    });

    it('should restock a sweet as admin', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                quantity: 100
            });

        expect(response.status).toBe(200);
        expect(response.body.quantity).toBe(150);
        expect(response.body.message).toBe('Restock successful');
    });

    it('should fail as regular user', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                quantity: 100
            });

        expect(response.status).toBe(403);
    });

    it('should fail without authentication', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .send({
                quantity: 100
            });

        expect(response.status).toBe(401);
    });

    it('should fail with invalid quantity', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                quantity: -10
            });

        expect(response.status).toBe(400);
    });

    it('should fail with missing quantity', async () => {
        const response = await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({});

        expect(response.status).toBe(400);
    });

    it('should fail with non-existent sweet', async () => {
        const response = await request(app)
            .post('/api/sweets/non-existent-id/restock')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                quantity: 100
            });

        expect(response.status).toBe(404);
    });

    it('should correctly increase quantity', async () => {
        await request(app)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                quantity: 75
            });

        const sweet = await prisma.sweet.findUnique({
            where: { id: sweetId }
        });

        expect(sweet?.quantity).toBe(125);
    });
});
