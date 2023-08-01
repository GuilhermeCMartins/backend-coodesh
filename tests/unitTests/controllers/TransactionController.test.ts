import fs, { ReadStream, createReadStream } from 'fs';
import { NextFunction, Request, Response } from 'express';
import TransactionController from '../../../src/controllers/TransactionController';
import { prisma } from '../../../src/client/prisma';
import multer from 'multer';

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
        $transaction: jest.fn(),
    },
}));

jest.mock('fs', () => ({
    createReadStream: jest.fn(),
    unlinkSync: jest.fn(),
    existsSync: jest.fn(),
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

jest.mock('multer', () => () => ({
    single: jest.fn().mockImplementation((fieldName: string) => (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        next();
    }),
}));

jest.mock('readline', () => ({
    createInterface: jest.fn(),
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
            (prisma.transactions.findFirst as jest.Mock).mockRejectedValue(new Error());

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
            (prisma.transactions.findMany as jest.Mock).mockRejectedValue(new Error());

            const mockRequest = {};
            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;;

            await TransactionController.getAllTransactions(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error' });
        });

    });

    describe('getTransactionsByVendor', () => {
        it('should return 200 with transactions for a valid vendor name', async () => {
            const mockedTransactions = [
                { Id: 1, Amount: 100, Description: 'Transaction 1', Date: '2023-07-31', Vendor: 'Test Vendor' },
                { Id: 2, Amount: 200, Description: 'Transaction 2', Date: '2023-08-01', Vendor: 'Test Vendor' },
            ];
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
    })

    describe('uploadSalesFile', () => {
        it('should return 400 if no file is uploaded', async () => {
            const mockRequest = {} as Request;
            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            await TransactionController.uploadSalesFile(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'No file uploaded' });
        });

        it('should return 500 if there is an error during file processing', async () => {
            const mockFile = {
                fieldname: 'salesFile',
                originalname: 'mock-file.txt',
                mimetype: 'text/plain',
                buffer: Buffer.from('Mock file content'),
            };
            const mockRequest = {
                file: mockFile,
            } as Request;

            const mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            const createReadStreamSpy = jest.spyOn(fs, 'createReadStream');

            (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

            await TransactionController.uploadSalesFile(mockRequest, mockResponse);

            expect(createReadStreamSpy).toHaveBeenCalled();

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({ success: false, message: 'Error during file processing' });
        });

    });

})



