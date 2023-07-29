import { Router } from 'express';
import TransactionController from '../controllers/TransactionController';
import AuthController from '../controllers/AuthController';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Rotas de autenticação da API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: usuario123
 *               password: senha123
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Erro de validação ou usuário já existe
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Efetuar login de usuário
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: usuario123
 *               password: senha123
 *     responses:
 *       200:
 *         description: Sucesso
 *       401:
 *         description: Falha na autenticação
 */


/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Rotas de transações da API
 */

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Obter uma transação por ID
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da transação a ser obtida
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Transação não encontrada
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Obter todas as transações
 *     tags: [Transaction]
 *     responses:
 *       200:
 *         description: Sucesso
 */

/**
 * @swagger
 * /api/upload-sales:
 *   post:
 *     summary: Enviar um arquivo de vendas para processamento
 *     tags: [Transaction]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               salesFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Arquivo não fornecido ou formato inválido
 */

/**
 * @swagger
 * /api/transactions/vendor/{vendorName}:
 *   get:
 *     summary: Obter todas as transações de um fornecedor específico
 *     tags: [Transaction]
 *     parameters:
 *       - in: path
 *         name: vendorName
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do fornecedor para filtrar as transações
 *     responses:
 *       200:
 *         description: Sucesso
 *       404:
 *         description: Nenhuma transação encontrada para o fornecedor especificado
 */


// Authentication routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Transaction routes
router.get('/transactions/:id', TransactionController.getTransactionById);
router.get('/transactions', TransactionController.getAllTransactions);
router.post('/upload-sales', TransactionController.uploadSalesFile);
router.get('/transactions/vendor/:vendorName*', TransactionController.getTransactionsByVendor);

export default router;
