import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

export default function setupSwagger(app: Application, port: number) {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Sua API Node Express',
                version: '1.0.0',
                description: 'Documentação da sua API com Swagger',
            },
            servers: [
                {
                    url: `http://localhost:${port}`,
                },
            ],
        },
        apis: ['./src/routes/*.ts'],
    };

    const specs = swaggerJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
