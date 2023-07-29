import { prisma } from "../client/prisma";
import { Request, Response } from 'express';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { CustomRequest } from "../types/customTypes";


const saltRounds = 10;
const secretKey = 'iadsjoadsij!!@!@#fdslajdoiasdj__dsaoahddais!';

class AuthController {

    async register(req: Request, res: Response) {
        try {
            const { name, password, type } = req.body;

            const existingVendor = await prisma.vendors.findFirst({ where: { Name: name } });
            if (existingVendor) {
                return res.status(400).json({ message: 'Vendor name already registered' });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newVendor = await prisma.vendors.create({
                data: {
                    Name: name,
                    Password: hashedPassword,
                    Type: type,
                },
            });

            res.status(201).json({ message: 'Vendor registered successfully', vendorId: newVendor.Id });
        } catch (error) {
            console.error('Error while registering vendor:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { name, password } = req.body;

            const vendor = await prisma.vendors.findFirst({ where: { Name: name } });
            if (!vendor) {
                return res.status(401).json({ message: 'Authentication failed. Vendor does not exists' });
            }

            const isPasswordValid = await bcrypt.compare(password, vendor.Password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Authentication failed. Invalid credentials' });
            }

            const token = jwt.sign({ vendorId: vendor.Id }, secretKey, { expiresIn: '1h' });

            res.status(200).json({ message: 'Authentication successful', token });
        } catch (error) {
            console.error('Error while authenticating vendor:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async protectedRoute(req: CustomRequest, res: Response) {
        try {
            const vendorId = req.vendorId;

            const vendor = await prisma.vendors.findFirst({ where: { Id: vendorId } });

            if (!vendor) {
                return res.status(404).json({ message: 'Vendor not found' });
            }

            res.status(200).json({ message: 'Protected route access granted', vendor });
        } catch (error) {
            console.error('Error while accessing protected route:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}

export default new AuthController();
