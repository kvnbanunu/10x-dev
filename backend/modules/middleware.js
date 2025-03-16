import jwt from 'jsonwebtoken';
import Joi from 'joi';
import dotenv from 'dotenv/config';
import { getSessionByToken, getUserById } from './sql.js';
import { errMessage } from './lang/en.js';

// auth for protected routes
export const authMiddleware = async (req, res, next) => {
    try {
        // get token
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: errMessage.authMiss });
        }

        // check token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: errMessage.invToken });
        }

        // check session exists
        const session = await getSessionByToken(token);
        if (!session) {
            return res.status(401).json({ error: errMessage.invSesh });
        }

        // check expired
        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at < now) {
            return res.status(401).json({ error: errMessage.invSesh })
        }

        // get user
        const user = await getuserById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: errMessage.userNotFound });
        }

        // add user details to the request
        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.is_admin === 1
        };

        // Check if this route is admin and if user is allowed
        if (req.path.startsWith('/admin') && !req.user.isAdmin) {
            return res.status(403).json({ error: errMessage.notAdmin });
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ error: errMessage.authFail });
    }
};

export const reqLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

export const errorHandler = (err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: errMessage.serverFail,
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

export const validationSchemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(3).required(),
        nonce: Joi.string().required()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        nonce: Joi.string().required()
    }),

    resetRequest: Joi.object({
        email: Joi.string().email().required()
    }),

    resetPassword: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(3).required(),
        nonce: Joi.string().required()
    }),

    chat: Joi.object({
        language: Joi.string().required(),
        program: Joi.string().required()
    }),

    adminUpdate: Joi.object({
        userId: Joi.number().required(),
        email: Joi.string().email().required(),
        username: Joi.string().min(3).max(30).required(),
        isAdmin: Joi.number().valid(0, 1).required()
    }),

    adminDelete: Joi.object({
        userId: Joi.number().required()
    })
};

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        next();
    };
};
