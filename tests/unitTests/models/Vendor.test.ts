import { VendorType } from "../../../src/enum/EVendorType";
import { Vendor } from "../../../src/models/Vendor";

describe('Vendor Model', () => {
    test('Vendor instance should be created with correct properties', () => {
        const vendorProps = {
            Id: 0,
            Name: 'Sample Vendor',
            Password: 'samplePassword',
            Type: VendorType.Member,
        };

        const vendor = new Vendor(vendorProps);

        expect(vendor.Id).toBe(0);
        expect(vendor.Name).toBe('Sample Vendor');
        expect(vendor.Password).toBe('samplePassword');
        expect(vendor.Type).toBe(VendorType.Member);
    });
});
