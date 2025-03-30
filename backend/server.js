import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { initDB } from './modules/database.js';
import { authMiddleware, errorHandler, reqLogger, validateRequest, validationSchemas, apiTrackingMiddleware } from './modules/middleware.js';
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
app.use('/protected', apiTrackingMiddleware);
app.get('/protected/userInfo', handlers.userInfo);
app.post('/protected/chat', validateRequest(validationSchemas.chat), handlers.chat);
app.post('/protected/logout', handlers.logout);

app.use('/admin', authMiddleware);
app.use('/admin', apiTrackingMiddleware);
app.get('/admin/database', handlers.adminDatabase);

// for some reason swagger wont display the put request within admin.js
/**
 * @swagger
 * /admin/update:
 *   put:
 *     summary: Update a user
 *     tags: [Admin]
 *     description: Server-level documentation for admin update endpoint
 */
app.put('/admin/update', validateRequest(validationSchemas.adminUpdate), handlers.adminUpdate);
app.delete('/admin/delete', validateRequest(validationSchemas.adminDelete), handlers.adminDelete);

app.get('*', handlers.notFound);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});
