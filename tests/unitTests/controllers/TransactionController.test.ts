import fs from 'fs';
import express from 'express';
import { createReadStream } from 'fs';
import path from 'path';
import supertest from 'supertest';
import { Request, Response } from 'express';

import TransactionController from '../../../src/controllers/TransactionController';
import router from '../../../src/routes/router';
import { prisma } from '../../../src/client/prisma';


jest.mock('../../../src/client/prisma', () => ({
    prisma: {
        transactions: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
        },
        products: {
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        vendors: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
    },
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

jest.mock('fs', () => ({
    createReadStream: jest.fn(),
    unlinkSync: jest.fn(),
}));

jest.mock('readline', () => ({
    createInterface: jest.fn(),
}));

jest.mock('multer', () => ({
    __esModule: true,
    default: () => ({
        single: jest.fn().mockReturnValue((req: Request, res: Response, next: () => void) => next()),
    }),
}));

describe('TransactionController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTransactionById', () => {
        it('should return 200 with the transaction for a valid transaction ID', async () => {
            const mockedTransaction = { Id: 1 };
            (prisma.transactions.findFirst as jest.Mock).mockResolvedValue(mockedTransaction);

            const mockRequest = {
                params: {
                    id: '1',
                },
            } as unknown as Request;

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await TransactionController.getTransactionById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: true, payload: { transaction: mockedTransaction } });
        });

        it('should return 404 for an invalid transaction ID', async () => {
            (prisma.transactions.findFirst as jest.Mock).mockResolvedValue(null);

            const mockRequest = { params: { id: '123' } } as unknown as Request;
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await TransactionController.getTransactionById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Transaction not found' });
        });

        it('should return 500 if there is an error while fetching the transaction', async () => {
            (prisma.transactions.findFirst as jest.Mock).mockRejectedValue(new Error('Database error'));

            const mockRequest = { params: { id: '1' } } as unknown as Request;
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await TransactionController.getTransactionById(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error' });
        });
    });

    describe('getAllTransactions', () => {
        it('should return 200 with all transactions', async () => {
            const mockedTransactions: [] = [];
            (prisma.transactions.findMany as jest.Mock).mockResolvedValue(mockedTransactions);

            const mockRequest = {};
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;;

            await TransactionController.getAllTransactions(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: true, payload: { transactions: mockedTransactions } });
        });

        it('should return 500 if there is an error while fetching all transactions', async () => {
            (prisma.transactions.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

            const mockRequest = {};
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;;

            await TransactionController.getAllTransactions(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error' });
        });
    });

    describe('uploadSalesFile', () => {
        it('should return 200 and process the sales file successfully', async () => {
            const testFilePath = path.join(__dirname, 'test_sales_file.txt');
            const readStream = createReadStream(testFilePath);
            (fs.createReadStream as jest.Mock).mockReturnValue(readStream);

            const mockedTransaction = { Id: 1 };
            (prisma.$transaction as jest.Mock).mockResolvedValue({});

            const mockRequest = { file: { path: testFilePath } };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;;

            await TransactionController.uploadSalesFile(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: true, message: 'Sales file uploaded and processed successfully' });
        });

        it('should return 500 if there is an error during file processing', async () => {
            const testFilePath = path.join(__dirname, 'test_sales_file.txt');
            const readStream = createReadStream(testFilePath);
            (fs.createReadStream as jest.Mock).mockReturnValue(readStream);

            (prisma.$transaction as jest.Mock).mockRejectedValue(new Error('Database error'));

            const mockRequest = { file: { path: testFilePath } };
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;;

            await TransactionController.uploadSalesFile(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Error during file processing' });
        });

        it('should return 400 if no file is uploaded', async () => {
            const mockRequest = {};
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;;

            await TransactionController.uploadSalesFile(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'No file uploaded' });
        });
    });

    describe('getTransactionsByVendor', () => {
        it('should return 200 with transactions for a valid vendor name', async () => {
            const mockedTransactions: [] = [];
            (prisma.vendors.findFirst as jest.Mock).mockResolvedValue({ Name: 'Test Vendor' });
            (prisma.transactions.findMany as jest.Mock).mockResolvedValue(mockedTransactions);

            const mockRequest = { params: { vendorName: 'Test Vendor' } } as unknown as Request;
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await TransactionController.getTransactionsByVendor(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: true, payload: { transactions: mockedTransactions } });
        });

        it('should return 404 for an invalid vendor name', async () => {
            (prisma.vendors.findFirst as jest.Mock).mockResolvedValue(null);

            const mockRequest = { params: { vendorName: 'Non-Existing Vendor' } } as unknown as Request;
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;;

            await TransactionController.getTransactionsByVendor(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Vendor not found' });
        });

        it('should return 500 if there is an error while fetching transactions by vendor', async () => {
            (prisma.vendors.findFirst as jest.Mock).mockRejectedValue(new Error('Database error'));

            const mockRequest = { params: { vendorName: 'Test Vendor' } } as unknown as Request;
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await TransactionController.getTransactionsByVendor(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error' });
        });
    });

});


function createTestServer() {
    const app = express();
    app.use('/api', router);
    return supertest(app);
}
