import fs from 'fs';
import multer from 'multer';
import bcrypt from "bcrypt"
import { prisma } from '../client/prisma';
import { isValidData, formatValueToReal } from '../utils/validations';
import { TransactionType } from '../models/TransactionType';
import { createInterface } from 'readline';
import { Request, Response } from 'express';
import { DataToProcessItem } from '../types/customTypes';

class TransactionController {
    async getTransactionById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const transaction = await prisma.transactions.findFirst({ where: { Id: Number(id) } });

            if (transaction) {
                res.status(200).json({ success: true, payload: { transaction } });
            } else {
                res.status(404).json({ success: false, message: 'Transaction not found' });
            }
        } catch (error) {
            console.error('Error while fetching transaction by ID:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getAllTransactions(req: Request, res: Response) {
        try {
            const transactions = await prisma.transactions.findMany({
                include: { Product: true, TransactionType: true, Vendor: true },
            });

            res.status(200).json({ success: true, payload: { transactions } });
        } catch (error) {
            console.error('Error while fetching all transactions:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async seedTransactionTypes() {
        const predefinedTypes = TransactionType.getPredefinedTypes();
        const transactionTypesData = predefinedTypes.map((type) => ({
            Id: type.Id,
            Description: type.Description,
            Inbound: type.Inbound,
        }));

        try {
            const existingTypes = await prisma.transactionTypes.findMany({
                where: { Id: { in: predefinedTypes.map((type) => type.Id) } },
            });

            const missingTypes = predefinedTypes.filter(
                (type) => !existingTypes.some((existingType) => existingType.Id === type.Id)
            );

            if (missingTypes.length > 0) {
                await prisma.transactionTypes.createMany({
                    data: transactionTypesData.filter((type) =>
                        missingTypes.some((missingType) => missingType.Id === type.Id)
                    ),
                });
                console.log('Transaction types seeded successfully.');
            } else {
                console.log('Transaction types already seeded.');
            }
        } catch (error) {
            console.error('Error seeding transaction types:', error);
        }
    }

    async uploadSalesFile(req: Request, res: Response) {
        try {
            const upload = multer({
                dest: 'uploads/',
            }).single('salesFile');

            upload(req, res, async function (err) {
                if (err) {
                    console.error('Error while uploading sales file:', err);
                    return res.status(500).json({ success: false, message: 'Error during file upload' });
                }

                if (!req.file) {
                    return res.status(400).json({ success: false, message: 'No file uploaded' });
                }

                const { path } = req.file;

                try {
                    const stream = fs.createReadStream(path, 'utf8');
                    const lineReader = createInterface({ input: stream });
                    const dataToProcess: DataToProcessItem[] = [];
                    const errors = [];

                    for await (const line of lineReader) {
                        if (!line.trim()) continue;

                        const typeId = line.substring(0, 1);
                        const date = line.substring(1, 26);
                        const product = line.substring(26, 56);
                        const value = formatValueToReal(line.substring(56, 66));
                        const vendor = line.substring(66, 86);

                        const validationErrors = isValidData(typeId, date, product, value, vendor);

                        if (validationErrors.length > 0) {
                            const errorLine = { line, errors: validationErrors };
                            errors.push(errorLine);
                        } else {
                            dataToProcess.push({ typeId, date, product, value, vendor });
                        }
                    }

                    if (errors.length > 0) {
                        fs.unlinkSync(path);
                        return res.status(400).json({ success: false, errors });
                    }

                    await prisma.$transaction(async (tx) => {
                        for (const data of dataToProcess) {
                            const { typeId, date, product, value, vendor } = data;

                            let productRecord = await tx.products.findFirst({ where: { Name: product } });
                            if (!productRecord) {
                                productRecord = await tx.products.create({
                                    data: { Name: product, Price: value, Description: product, Quantity: 1 },
                                });
                            } else {
                                productRecord = await tx.products.update({
                                    where: { Id: productRecord.Id },
                                    data: { Quantity: productRecord.Quantity + 1 },
                                });
                            }

                            let vendorRecord = await tx.vendors.findFirst({ where: { Name: vendor } });
                            if (!vendorRecord) {
                                const hashedPassword = await bcrypt.hash('Senha123', 10);

                                vendorRecord = await tx.vendors.create({
                                    data: { Name: vendor, Password: hashedPassword, Type: 'Member' },
                                });
                            }

                            await tx.transactions.create({
                                data: {
                                    TransactionTypeId: Number(typeId),
                                    MadeAt: date,
                                    ProductId: productRecord.Id,
                                    Price: Number(value),
                                    VendorId: vendorRecord.Id,
                                },
                            });
                        }
                    });

                    fs.unlinkSync(path);

                    res.status(200).json({ success: true, message: 'Sales file uploaded and processed successfully' });
                } catch (error) {
                    console.error('Error while processing sales file:', error);
                    res.status(500).json({ success: false, message: 'Error during file processing' });
                }
            });
        } catch (error) {
            console.error('Error while handling file upload:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }



    }

    async getTransactionsByVendor(req: Request, res: Response) {
        try {
            const vendorName = req.params.vendorName;

            const vendor = await prisma.vendors.findFirst({ where: { Name: vendorName } });

            if (!vendor) {
                return res.status(404).json({ success: false, message: 'Vendor not found' });
            }

            const transactions = await prisma.transactions.findMany({
                where: {
                    Vendor: {
                        Name: vendorName,
                    },
                },
                include: { Product: true, TransactionType: true, Vendor: true },
            });

            if (transactions.length === 0) {
                return res.status(404).json({ success: false, message: 'No transactions found for the vendor' });
            }

            res.status(200).json({ success: true, payload: { transactions } });
        } catch (error) {
            console.error('Error while fetching transactions by vendor:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

}


export default new TransactionController();
