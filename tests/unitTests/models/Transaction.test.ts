import { VendorType } from "../../../src/enum/EVendorType";
import { Product } from "../../../src/models/Product";
import { Transaction } from "../../../src/models/Transaction";
import { TransactionType } from "../../../src/models/TransactionType";
import { Vendor } from "../../../src/models/Vendor";

describe('Transaction Model', () => {
    test('Transaction instance should be created with correct properties', () => {
        const product = new Product({
            Name: 'Sample Product',
            Description: 'This is a sample product.',
            Quantity: 10,
            Price: 99.99,
        });

        const transactionType = new TransactionType(1, 'Sample Transaction', true);

        const vendor = new Vendor({
            Id: 123,
            Name: 'Sample Vendor',
            Password: "Senha123",
            Type: VendorType.Member
        });

        const transactionProps = {
            TransactionTypeId: 1,
            TransactionType: transactionType,
            MadeAt: new Date('2023-07-28'),
            ProductId: 1,
            Product: product,
            VendorId: 1,
            Vendor: vendor,
            Price: 99.99,
        };

        const transaction = new Transaction(transactionProps);

        expect(transaction.Id).toBe(0);
        expect(transaction.TransactionTypeId).toBe(1);
        expect(transaction.TransactionType).toBe(transactionType);
        expect(transaction.MadeAt).toEqual(new Date('2023-07-28'));
        expect(transaction.ProductId).toBe(1);
        expect(transaction.Product).toBe(product);
        expect(transaction.VendorId).toBe(1);
        expect(transaction.Vendor).toBe(vendor);
        expect(transaction.Price).toBe(99.99);
    });
});
