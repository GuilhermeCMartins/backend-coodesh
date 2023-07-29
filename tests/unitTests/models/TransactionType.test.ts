import { TransactionType } from "../../../src/models/TransactionType";


describe('TransactionType Model', () => {
    test('TransactionType instance should be created with correct properties', () => {
        const transactionType = new TransactionType(1, 'Venda produtor', true);

        expect(transactionType.Id).toBe(1);
        expect(transactionType.Description).toBe('Venda produtor');
        expect(transactionType.Inbound).toBe(true);
    });

    test('getPredefinedTypes() should return an array of predefined TransactionTypes', () => {
        const predefinedTypes = TransactionType.getPredefinedTypes();

        expect(Array.isArray(predefinedTypes)).toBe(true);
        expect(predefinedTypes).toHaveLength(4);

        expect(predefinedTypes[0].Id).toBe(1);
        expect(predefinedTypes[0].Description).toBe('Venda produtor');
        expect(predefinedTypes[0].Inbound).toBe(true);

        expect(predefinedTypes[1].Id).toBe(2);
        expect(predefinedTypes[1].Description).toBe('Venda afiliado');
        expect(predefinedTypes[1].Inbound).toBe(true);

        expect(predefinedTypes[2].Id).toBe(3);
        expect(predefinedTypes[2].Description).toBe('Comissão paga');
        expect(predefinedTypes[2].Inbound).toBe(false);

        expect(predefinedTypes[3].Id).toBe(4);
        expect(predefinedTypes[3].Description).toBe('Comissão recebida');
        expect(predefinedTypes[3].Inbound).toBe(true);
    });
});
