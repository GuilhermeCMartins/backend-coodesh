import { Decimal } from '@prisma/client/runtime/library';
import { Request } from 'express';

export interface CustomRequest extends Request {
  vendorId: number;
}

export interface DataToProcessItem {
  typeId: string;
  date: string;
  product: string;
  value: Decimal;
  vendor: string;
}