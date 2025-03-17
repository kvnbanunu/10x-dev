import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import { genericQueries, userQueries, nonceQueries, sessionQueries, requestQueries, adminQueries } from './sql.js';
import { validationSchemas, validateRequest } from './middleware.js';
import { generateObfuscatedCode } from './openai.js';
import { errMsg, successMsg, passwordMsg } from './lang/en.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const getNonce = async (req, res) => {
    try {
        const nonce = crypto.randomBytes(16).toString('hex');
        const expiryTime = Math.floor(Date.now() / 1000) + 300;
        await nonceQueries.createNonce(nonce, expiryTime);
        return res.json({ nonce: nonce });
    } catch (error) {
        console.error('getNonce error:', error);
        return res.status(500).json({ error: errMsg.nonceFail });
    }
};

const register = [validateRequest(validationSchemas.register), async (req, res) => {
    try {
        const { email, username, password, nonce } = req.body;

        const exists = await userQueries.getUserByEmail(email);
        if (exists) {
            return res.status(400).json({ error: errMsg.userExists });
        }

        const nonceRecord = await nonceQueries.getNonce(nonce);
        if (!nonceRecord) {
            return res.status(400).json({ error: errMsg.invNonce });
        }

        // check if the nonce is expired
        const now = Math.floor(Date.now() / 1000);
        if (nonceRecord.expires_at < now) {
            await nonceQueries.deleteNonce(nonce);
            return res.status(400).json({ error: errMsg.expNonce });
        }

        // decrypt then hash the pass
        const decryptedPass = CryptoJS.AES.decrypt(password, nonce).toString(CryptoJS.enc.Utf8);
        const hashedPass = await bcrypt.hash(decryptedPass, 10);

        const userId = await userQueries.createUser(email, username, hashedPass);

        await nonceQueries.deleteNonce(nonce);

        return res.status(201).json({ message: successMsg.userCreated });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ error: errMsg.registerFail });
    }
}];

const login = [validateRequest(validationSchemas.login), async (req, res) => {
    try {
        const { email, password, nonce } = req.body;
        // check if email registered
        const user = await userQueries.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: errMsg.invUserPass });
        }

        const nonceRecord = await nonceQueries.getNonce(nonce);
        if (!nonceRecord) {
            return res.status(400).json({ error: errMsg.invNonce });
        }

        const now = Math.floor(Date.now() / 1000);
        if (nonceRecord.expires_at < now) {
            await nonceQueries.deleteNonce(nonce);
            return res.status(400).json({ error: errMsg.expNonce });
        }

        const decryptedPass = CryptoJS.AES.decrypt(password, nonce).toString(CryptoJS.enc.Utf8);

        const passMatch = await bcrypt.compare(decryptedPass, user.password);
        if (!passMatch) {
            return res.status(401).json({ error: errMsg.invUserPass });
        }

        await nonceQueries.deleteNonce(nonce);
        await sessionQueries.deleteUserSessions(user.id);

        //generate token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const expiryTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
        await sessionQueries.createSession(user.id, token, expiryTime);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        });

        return res.json({
            message: successMsg.login,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.is_admin === 1
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: errMsg.loginFail });
    }
}];

const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if(token) {
            await sessionQueries.deleteSession(token);
            res.clearCookie('token');
        }
        return res.json({ message: successMsg.logout });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ error: errMsg.logoutFail });
    }
};

const resetPasswordRequest = [validateRequest(validationSchemas.resetRequest), async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userQueries.getUserByEmail(email);
        if (!user) {
            return res.json({ message: passwordMsg.reqSent });
        }

        const resetToken = uuidv4();
        const resetTokenExpiry = Math.floor(Date.now() / 1000) + 3600;
        await userQueries.setResetToken(email, resetToken, resetTokenExpiry);
        const resetUrl = `${process.env.FRONTEND_URL}/10x-dev/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: passwordMsg.subject,
            text: passwordMsg.click + resetUrl,
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        });
        return res.json({ message: passwordMsg.reqSent });
    } catch (error) {
        console.error('Reset password request error:', error);
        return res.status(500).json({ error: errMsg.passwordResetFail });
    }
}];

const resetPassword = [validateRequest(validationSchemas.resetPassword), async (req, res) => {
    try {
        const { token, password, nonce } = req.body;
        const user = await genericQueries.getRow('SELECT * FROM users WHERE reset_token = ?', [token]);
        if (!user) {
            return res.status(400).json({ error: passwordMsg.invToken });
        }

        const now = Math.floor(Date.now()/ 1000);
        if (user.reset_token_expiry < now) {
            return res.status(400).json({ error: passwordMsg.expToken });
        }

        const nonceRecord = await nonceQueries.getNonce(nonce);
        if (!nonceRecord) {
            return res.status(400).json({ error: errMsg.invNonce });
        }

        if (nonceRecord.expires_at < now) {
            await nonceQueries.deleteNonce(nonce);
            return res.status(400).json({ error: errMsg.expNonce });
        }

        const decryptedPass = CryptoJS.AES.decrypt(password, nonce).toString(CryptoJS.enc.Utf8);
        const hashedPass = await bcrypt.hash(decryptedPass, 10);

        await userQueries.resetUserPassword(hashedPass, user.id);
        await nonceQueries.deleteNonce(nonce);
        
        return res.json({ message: successMsg.passReset });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ error: errMsg.passwordResetFail });
    }
}];

const userInfo = async (req, res) => {
    try {
        const reqCount = await requestQueries.getRequestCountByUser(req.user.id);
        return res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                isAdmin: req.user.isAdmin
            },
            reqCount: reqCount
        });
    } catch (error) {
        console.error('User info error:', error);
        return res.status(500).json({ error: errMsg.userInfo });
    }
};

const chat = [validateRequest(validationSchemas.chat), async (req, res) => {
    try {
        const { program, language } = req.body;

        const code = await generateObfuscatedCode(program, language);
        await requestQueries.createRequest(req.user.id, `${program} in ${language}`, code);
        const count = await requestQueries.getRequestCountByUser(req.user.id);
        return res.json({ code, count });
    } catch (error) {
        console.error('Chat error:', error);
        return res.status(500).json({ error: errMsg.codeFail });
    }
}];

const adminDatabase = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: errMsg.notAdmin });
        }
        const users = await adminQueries.getAllUsers();
        const requests = await requestQueries.getAllRequests();
        return res.json({ users, requests });
    } catch (error) {
        console.error('Admin database error:', error);
        return res.status(500).json({ error: errMsg.adminDB });
    }
};

const adminUpdate = [validateRequest(validationSchemas.adminUpdate), async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: errMsg.notAdmin });
        }
        const { userId, email, username, isAdmin } = req.body;
        await adminQueries.updateUser(userId, { email, username, is_admin: isAdmin });
        return res.json({ message: successMsg.adminUpdate });
    } catch (error) {
        console.error('Admin update error:', error);
        return res.status(500).json({ error: errMsg.adminUpdate });
    }
}];

const adminDelete = [validateRequest(validationSchemas.adminDelete), async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: errMsg.notAdmin });
        }

        const { userId } = req.body;

        if (userId === req.user.id) {
            return res.status(400).json({ error: errMsg.adminDeleteSame });
        }
        await adminQueries.deleteUser(userId);
        return res.json({ message: successMsg.adminDelete });
    } catch (error) {
        console.error('Admin delete error:', error);
        return res.status(500).json({ error: errMsg.adminDelete });
    }
}];

export default {
    getNonce,
    register,
    login,
    logout,
    resetPasswordRequest,
    resetPassword,
    userInfo,
    chat,
    adminDatabase,
    adminUpdate,
    adminDelete,
};
