import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

export interface CustomRequest extends Request {
    prisma: PrismaClient;
}
