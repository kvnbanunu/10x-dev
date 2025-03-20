import jwt from 'jsonwebtoken';
import Joi from 'joi';
import 'dotenv/config';

import sql from './sql.js';
import { errMsg } from './lang/en.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: errMsg.auth });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: errMsg.token });
    }

    const session = await sql.getSessionByToken(token);
    if (!session) {
      return res.status(401).json({ error: errMsg.token });
    }

    const now = Math.floor(Date.now() / 1000);
    if (session.expires_at < now) {
      return res.status(401).json({ error: errMsg.session });
    }

    const user = await sql.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: errMsg.userNotFound });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      is_admin: user.is_admin
    };

    if (req.path.startsWith('/admin') && !req.user.is_admin) {
      return res.status(403).json({ error: errMsg.admin });
    }
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: errMsg.middlewareAuth});
  }
};

export const reqLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
};

export const errorHandler = (err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: errMsg.server,
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

export const validationSchemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(3).required()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    resetRequest: Joi.object({
        email: Joi.string().email().required()
    }),

    resetPassword: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(3).required()
    }),

    chat: Joi.object({
        language: Joi.string().required(),
        program: Joi.string().required()
    }),

    adminUpdate: Joi.object({
        id: Joi.number().required(),
        email: Joi.string().email().required(),
        username: Joi.string().min(3).max(30).required(),
        is_admin: Joi.number().valid(0, 1).required()
    }),

    adminDelete: Joi.object({
        id: Joi.number().required()
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
