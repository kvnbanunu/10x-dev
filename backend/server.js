import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { initDB } from './modules/database';
import { authMiddleware, errorHandler, reqLogger, validateRequest, validationSchemas } from './modules/middleware';
import { handlers } from './modules/handlers';

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
app.put('/admin/update', validateRequest(validationSchemas.adminUpdate), handlers.adminUpdate);
app.delete('/admin/delete', validateRequest(validationSchemas.adminDelete), handlers.adminDelete);

app.get('*', handlers.notFound);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});
