import { Product } from "../../../src/models/Product";

describe('Product Model', () => {
    test('Product instance should be created with correct properties', () => {
        const productProps = {
            Name: 'Sample Product',
            Description: 'This is a sample product.',
            Quantity: 10,
            Price: 99.99,
        };

        const product = new Product(productProps);

        expect(product.Id).toBe(0);
        expect(product.Name).toBe('Sample Product');
        expect(product.Description).toBe('This is a sample product.');
        expect(product.Quantity).toBe(10);
        expect(product.Price).toBe(99.99);
    });
});
