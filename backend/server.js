import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv/config';
import { initializeDatabase } from './modules/database.js';
import { authMiddleware, errorHandler, reqLogger } from './modules/middleware.js';
import handlers from './modules/handlers.js';

await initializeDatabase();

const app = express();

app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.LOCAL_HOST],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());
app.use(reqLogger);

// public routes
app.post('/api/getNonce', handlers.getNonce);
app.post('/api/register', handlers.register);
app.post('/api/login', handlers.login);
app.post('/api/resetPasswordRequest', handlers.resetPasswordRequest);
app.post('/api/resetPassword', handlers.resetPassword);

// protected routes
app.use('/api/protected', authMiddleware);
app.get('/api/protected/userInfo', handlers.userInfo);
app.post('/api/protected/chat', handlers.chat);
app.post('/api/protected/logout', handlers.logout);

// admin routes
app.get('/api/protected/admin/database', handlers.adminDatabase);
app.put('/api/protected/admin/update', handlers.adminUpdate);
app.delete('/api/protected/admin/delete', handlers.adminDelete);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
