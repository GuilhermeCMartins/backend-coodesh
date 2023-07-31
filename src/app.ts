import express, { Application } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import router from './routes/router';
import TransactionController from './controllers/TransactionController';
import http from 'http';
import setupSwagger from './swagger/swagger';
import cors from 'cors';


class Server {
    public app: Application;
    protected prisma: PrismaClient;
    private server: http.Server | null = null;

    constructor() {
        this.app = express();
        this.prisma = new PrismaClient();
        this.config();
        this.routerConfig();

        (async () => {
            try {
                await TransactionController.seedTransactionTypes();
            } catch (err) {
                console.error('Error seeding transaction types:', err);
            }
        })();
    }

    private config() {
        this.app.use(cors({
            origin: '*',
            methods: 'GET,PUT,POST,DELETE',
            allowedHeaders: 'Content-Type,Authorization',
        }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({ limit: '1mb' }));

        setupSwagger(this.app, 4000);
    }

    private routerConfig() {
        this.app.use('/api', router);
    }

    public start = (port: number) => {
        this.server = this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        this.server.on('error', (err: Error) => {
            console.error('Error starting the server:', err);
        });
    }

    public stop = async () => {
        if (this.server) {
            await new Promise<void>((resolve, reject) => {
                this.server?.close((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        await this.prisma.$disconnect();
    }
}

const server = new Server();
const port = 4000;
server.start(port);

export const app: Application = server.app;
export const stopServer = server.stop;
