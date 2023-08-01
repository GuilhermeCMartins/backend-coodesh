import { app, stopServer } from '../../../src/app';
import TransactionController from '../../../src/controllers/TransactionController';
import request from 'supertest';

describe('Express App Configuration', () => {
    beforeAll(async () => {
        await TransactionController.seedTransactionTypes();
    });

    afterAll(async () => {
        await stopServer();
    });

    it('should parse JSON and handle CORS middleware', async () => {
        const response = await request(app).get('/api/transactions');
        expect(response.status).toBe(200);
        expect(response.header['access-control-allow-origin']).toBe('*');
    });

    it('should access the API documentation (Swagger)', async () => {

        const response = await request(app).get('/api-docs').redirects(1);

        expect(response.status).toBe(200);
        expect(response.header['content-type']).toMatch("text/html; charset=utf-8");
        expect(response.body).toBeDefined();
    });

});