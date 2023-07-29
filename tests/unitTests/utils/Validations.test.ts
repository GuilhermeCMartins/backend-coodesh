import { Decimal } from "@prisma/client/runtime/library";
import { formatValueToReal, isValidData, isValidISODate } from "../../../src/utils/validations";


describe('isValidData', () => {
    test('should return an empty array for valid data', () => {
        const type = '1';
        const date = '2023-07-29T12:34:56-03:00';
        const product = 'Sample Product';
        const value = new Decimal('12345');
        const vendor = 'Sample Vendor';

        const errors = isValidData(type, date, product, value, vendor);

        expect(errors).toEqual([]);
    });

    test('should return an array with error message for invalid type', () => {
        const type = '5'; // Invalid type
        const date = '2023-07-29T12:34:56-03:00';
        const product = 'Sample Product';
        const value = new Decimal('12345');
        const vendor = 'Sample Vendor';

        const errors = isValidData(type, date, product, value, vendor);

        expect(errors).toContain('Invalid type: ' + type);
    });

    test('should return an array with error message for invalid date', () => {
        const type = '1';
        const date = 'invalid-date'; // Invalid date
        const product = 'Sample Product';
        const value = new Decimal('12345');
        const vendor = 'Sample Vendor';

        const errors = isValidData(type, date, product, value, vendor);

        expect(errors).toContain('Invalid date: ' + date);
    });

    test('should return an array with error message for empty product description', () => {
        const type = '1';
        const date = '2023-07-29T12:34:56-03:00';
        const product = ''; // Empty product description
        const value = new Decimal('12345');
        const vendor = 'Sample Vendor';

        const errors = isValidData(type, date, product, value, vendor);

        expect(errors).toContain('Product description is empty: ' + product);
    });

    test('should return an array with error message for invalid value', () => {
        const type = '1';
        const date = '2023-07-29T12:34:56-03:00';
        const product = 'Sample Product';
        const value = new Decimal('0'); // Invalid value
        const vendor = 'Sample Vendor';

        const errors = isValidData(type, date, product, value, vendor);

        expect(errors).toContain('Invalid value: ' + value);
    });

    test('should return an array with error message for empty vendor name', () => {
        const type = '1';
        const date = '2023-07-29T12:34:56-03:00';
        const product = 'Sample Product';
        const value = new Decimal('12345');
        const vendor = ''; // Empty vendor name

        const errors = isValidData(type, date, product, value, vendor);

        expect(errors).toContain('Vendor name is empty: ' + vendor);
    });
});

describe('isValidISODate', () => {
    test('should return true for a valid ISO date string', () => {
        const validISODate = '2023-07-29T12:34:56-03:00';

        const result = isValidISODate(validISODate);

        expect(result).toBe(true);
    });

    test('should return false for an invalid ISO date string', () => {
        const invalidISODate = 'invalid-date';

        const result = isValidISODate(invalidISODate);

        expect(result).toBe(false);
    });
});

describe('formatValueToReal', () => {
    test('should format the value to Real', () => {
        const valueString = '12345';

        const result = formatValueToReal(valueString);

        expect(result).toEqual(new Decimal('123.45'));
    });
});
