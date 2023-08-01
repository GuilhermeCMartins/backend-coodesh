import express from 'express';
import setupSwagger from '../../../src/swagger/swagger';
import request from 'supertest';


describe('setupSwagger', () => {
    it('should set up Swagger documentation', async () => {
        const app = express();
        const port = 3000;

        setupSwagger(app, port);

        const response = await request(app).get('/api-docs').redirects(1);

        expect(response.status).toBe(200);

        expect(response.header['content-type']).toMatch("text/html; charset=utf-8");
        expect(response.body).toBeDefined();
    });
});
