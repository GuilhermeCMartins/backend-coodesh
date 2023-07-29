import { prisma } from "../../../src/client/prisma";


describe('Prisma Setup', () => {
    it('should connect to the database successfully', async () => {
        expect(await prisma.$connect()).toBeUndefined();
    });
});
