import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { initDB } from './modules/database.js';
import { authMiddleware, errorHandler, reqLogger, validateRequest, validationSchemas } from './modules/middleware.js';
import { handlers } from './modules/handlers.js';
import { setupSwagger } from './modules/swagger.js';

await initDB();

const app = express();

app.use(cors({
    origin: [process.env.CLIENT_URL, process.env.LOCAL_URL],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());
app.use(reqLogger);

setupSwagger(app);

/**
 * @swagger
 * /:
 *   get:
 *     summary: API health check
 *     description: Returns API status
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: API running
 */
app.get('/', (req, res) => {
    res.status(200).json({ status: 'API running' });
});

app.post('/register', validateRequest(validationSchemas.register), handlers.register);
app.post('/login', validateRequest(validationSchemas.login), handlers.login);
app.post('/resetPasswordRequest', validateRequest(validationSchemas.resetRequest), handlers.resetPasswordRequest);
app.post('/resetPasswordHandle', validateRequest(validationSchemas.resetPassword), handlers.resetPasswordHandle);

app.use('/protected', authMiddleware);
app.get('/protected/userInfo', handlers.userInfo);
app.post('/protected/chat', validateRequest(validationSchemas.chat), handlers.chat);
app.post('/protected/logout', handlers.logout);

app.use('/admin', authMiddleware);
app.get('/admin/database', handlers.adminDatabase);

// For some reason Swagger keeps missing this put request, so it's placed here

/**
 * @swagger
 * /admin/update:
 *   put:
 *     summary: Update a user
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - email
 *               - username
 *               - is_admin
 *             properties:
 *               id:
 *                 type: integer
 *                 description: User ID
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 description: Username
 *               is_admin:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: Admin status (0: regular user, 1: admin)
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User info successfully updated
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 *       500:
 *         description: Server error
 */
app.put('/admin/update', validateRequest(validationSchemas.adminUpdate), handlers.adminUpdate);
app.delete('/admin/delete', validateRequest(validationSchemas.adminDelete), handlers.adminDelete);

app.get('*', handlers.notFound);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});
