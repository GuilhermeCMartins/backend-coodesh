import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../src/client/prisma';
import AuthController from '../../../src/controllers/AuthController';
import { CustomRequest } from '../../../src/types/customTypes';

jest.mock('../../../src/client/prisma', () => ({
    prisma: {
        vendors: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
    },
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('AuthController', () => {
    let mockResponse: Partial<Response>;
    let mockRequest: Partial<Request>;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        mockRequest = {
            body: {},
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should return 400 if vendor name already registered', async () => {
            (prisma.vendors.findFirst as jest.Mock).mockResolvedValue({ Id: 1, Name: 'existingVendorName' });

            mockRequest.body = {
                name: 'existingVendorName',
                password: 'password',
                type: 'vendorType',
            };

            await AuthController.register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Vendor name already registered' });
        });

        it('should register a new vendor successfully', async () => {
            (prisma.vendors.findFirst as jest.Mock).mockResolvedValue(null);

            (prisma.vendors.create as jest.Mock).mockResolvedValue({ Id: 2 });

            mockRequest.body = {
                name: 'newVendorName',
                password: 'password',
                type: 'vendorType',
            };

            await AuthController.register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Vendor registered successfully', vendorId: 2 });
        });
    });

    describe('login', () => {
        it('should return 401 if vendor does not exist', async () => {
            (prisma.vendors.findFirst as jest.Mock).mockResolvedValue(null);

            mockRequest.body = {
                name: 'nonExistingVendor',
                password: 'password',
            };

            await AuthController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Authentication failed. Vendor does not exist' });
        });

        it('should return 401 if invalid credentials', async () => {
            (prisma.vendors.findFirst as jest.Mock).mockResolvedValue({ Id: 1, Name: 'existingVendor', Password: 'hashedPassword' });

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            mockRequest.body = {
                name: 'existingVendor',
                password: 'invalidPassword',
            };

            await AuthController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Authentication failed. Invalid credentials' });
        });

        it('should return 200 with a valid token on successful login', async () => {
            (prisma.vendors.findFirst as jest.Mock).mockResolvedValue({ Id: 1, Name: 'existingVendor', Password: 'hashedPassword' });

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            (jwt.sign as jest.Mock).mockReturnValue('validToken');

            mockRequest.body = {
                name: 'existingVendor',
                password: 'password',
            };

            await AuthController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Authentication successful', name: "existingVendor", type: undefined, token: 'validToken' });
        });
    });

    describe('protectedRoute', () => {
        it('should return the vendor for a valid vendorId', async () => {
            (prisma.vendors.findFirst as jest.Mock).mockResolvedValue({ Id: 1, Name: 'Test Vendor', Password: 'hashedPassword' });

            await AuthController.protectedRoute(mockRequest as CustomRequest, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Protected route access granted', vendor: { Id: 1, Name: 'Test Vendor', Password: 'hashedPassword' } });
        });

        it('should return 404 for an invalid vendorId', async () => {
            (prisma.vendors.findFirst as jest.Mock).mockResolvedValue(null);

            await AuthController.protectedRoute(mockRequest as CustomRequest, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Vendor not found' });
        });
    });
});
