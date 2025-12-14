import request from 'supertest';
import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import authRoutes from '../src/routes/authRoutes';

const prisma = new PrismaClient();
let app: Express;

beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
});

beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.email).toBe('test@example.com');
        expect(response.body.user.name).toBe('Test User');
        expect(response.body.user).not.toHaveProperty('password');
    });

    it('should fail with duplicate email', async () => {
        // First registration
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            });

        // Duplicate registration
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password456',
                name: 'Another User'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should fail with invalid email format', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'invalid-email',
                password: 'password123',
                name: 'Test User'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should fail with missing required fields', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('should hash the password before storing', async () => {
        const password = 'password123';
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password,
                name: 'Test User'
            });

        const user = await prisma.user.findUnique({
            where: { email: 'test@example.com' }
        });

        expect(user).toBeTruthy();
        expect(user?.password).not.toBe(password);
    });

    it('should set first user as admin', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'admin@example.com',
                password: 'password123',
                name: 'Admin User'
            });

        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe('admin');
    });

    it('should set subsequent users as regular users', async () => {
        // First user (admin)
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'admin@example.com',
                password: 'password123',
                name: 'Admin User'
            });

        // Second user (regular)
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'user@example.com',
                password: 'password123',
                name: 'Regular User'
            });

        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe('user');
    });
});

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        // Create a test user before each login test
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User'
            });
    });

    it('should login with correct credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe('test@example.com');
    });

    it('should fail with incorrect password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });

    it('should fail with non-existent user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error');
    });

    it('should fail with missing credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com'
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});
