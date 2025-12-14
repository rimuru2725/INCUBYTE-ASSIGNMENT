import request from 'supertest';
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from '../src/routes/authRoutes';
import sweetsRoutes from '../src/routes/sweetsRoutes';

const prisma = new PrismaClient();
let app: Express;
let authToken: string;
let adminToken: string;

beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use('/api/sweets', sweetsRoutes);
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

describe('POST /api/sweets', () => {
    it('should create a new sweet with authentication', async () => {
        const response = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 2.99,
                quantity: 100,
                description: 'Delicious milk chocolate'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Chocolate Bar');
        expect(response.body.category).toBe('Chocolate');
        expect(response.body.price).toBe(2.99);
        expect(response.body.quantity).toBe(100);
    });

    it('should fail without authentication', async () => {
        const response = await request(app)
            .post('/api/sweets')
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 2.99,
                quantity: 100
            });

        expect(response.status).toBe(401);
    });

    it('should fail with missing required fields', async () => {
        const response = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Chocolate Bar'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should fail with invalid price', async () => {
        const response = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: -5,
                quantity: 100
            });

        expect(response.status).toBe(400);
    });

    it('should fail with invalid quantity', async () => {
        const response = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 2.99,
                quantity: -10
            });

        expect(response.status).toBe(400);
    });
});

describe('GET /api/sweets', () => {
    beforeEach(async () => {
        // Create some test sweets
        await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Chocolate Bar',
                category: 'Chocolate',
                price: 2.99,
                quantity: 100
            });

        await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Gummy Bears',
                category: 'Gummy',
                price: 1.99,
                quantity: 50
            });
    });

    it('should get all sweets', async () => {
        const response = await request(app)
            .get('/api/sweets');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
    });

    it('should return sweets sorted by creation date', async () => {
        const response = await request(app)
            .get('/api/sweets');

        expect(response.status).toBe(200);
        expect(response.body[0].name).toBe('Chocolate Bar');
    });
});

describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
        // Create test sweets with different properties
        await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Dark Chocolate Bar',
                category: 'Chocolate',
                price: 3.99,
                quantity: 100
            });

        await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Milk Chocolate Bar',
                category: 'Chocolate',
                price: 2.99,
                quantity: 50
            });

        await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Gummy Bears',
                category: 'Gummy',
                price: 1.99,
                quantity: 75
            });
    });

    it('should search sweets by name', async () => {
        const response = await request(app)
            .get('/api/sweets/search?name=Dark');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Dark Chocolate Bar');
    });

    it('should search sweets by category', async () => {
        const response = await request(app)
            .get('/api/sweets/search?category=Chocolate');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it('should search sweets by price range', async () => {
        const response = await request(app)
            .get('/api/sweets/search?minPrice=2&maxPrice=3');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Milk Chocolate Bar');
    });

    it('should search with multiple filters', async () => {
        const response = await request(app)
            .get('/api/sweets/search?category=Chocolate&maxPrice=3.5');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Milk Chocolate Bar');
    });

    it('should return empty array when no matches', async () => {
        const response = await request(app)
            .get('/api/sweets/search?name=NonExistent');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
    });
});

describe('PUT /api/sweets/:id', () => {
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

    it('should update a sweet with authentication', async () => {
        const response = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Updated Chocolate Bar',
                price: 3.49
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Updated Chocolate Bar');
        expect(response.body.price).toBe(3.49);
        expect(response.body.category).toBe('Chocolate'); // Unchanged
    });

    it('should fail without authentication', async () => {
        const response = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .send({
                name: 'Updated Chocolate Bar'
            });

        expect(response.status).toBe(401);
    });

    it('should fail with non-existent sweet', async () => {
        const response = await request(app)
            .put('/api/sweets/non-existent-id')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Updated Sweet'
            });

        expect(response.status).toBe(404);
    });

    it('should fail with invalid price', async () => {
        const response = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                price: -10
            });

        expect(response.status).toBe(400);
    });
});

describe('DELETE /api/sweets/:id', () => {
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

    it('should delete a sweet as admin', async () => {
        const response = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sweet deleted successfully');
    });

    it('should fail as regular user', async () => {
        const response = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(403);
    });

    it('should fail without authentication', async () => {
        const response = await request(app)
            .delete(`/api/sweets/${sweetId}`);

        expect(response.status).toBe(401);
    });

    it('should fail with non-existent sweet', async () => {
        const response = await request(app)
            .delete('/api/sweets/non-existent-id')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
    });
});
