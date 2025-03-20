import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

import sql from './sql.js';
import { generateCode } from './openai.js';
import { errMsg, successMsg } from './lang/en.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export const handlers = {
  async register(req, res) {
    try {
      const { email, username, password } = req.body;
      const exists = await sql.getUserByEmail(email);
      if (exists) {
        return res.status(400).json({ error: errMsg.userExists });
      }

      const hashedPass = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS, 10));
      await sql.createUser(email, username, hashedPass);

      return res.status(201).json({ message: successMsg.handlerRegister });

    } catch (error) {
      console.error('register error:', error);
      return res.status(500).json({ error: errMsg.handlerRegister });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await sql.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: errMsg.userInvalid });
      }

      const passMatch = await bcrypt.compare(password, user.password);
      if (!passMatch) {
        return res.status(401).json({ error: errMsg.userInvalid });
      }

      await sql.deleteUserSessions(user.id);

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const expiryTime = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
      await sql.createSession(user.id, token, expiryTime);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'None',
        partitioned: true,
      });

      return res.status(200).json({
        message: successMsg.handlerLogin,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          is_admin: user.is_admin
        }
      });
    } catch (error) {
      console.error('login error:', error);
      return res.status(500).json({ error: errMsg.handlerLogin });
    }
  },

  async logout(req, res) {
    try {
      const token = req.cookies.token;
      if(token) {
        await sql.deleteSession(token);
        res.clearCookie('token');
      }
      return res.status(200).json({ message: successMsg.handlerLogout });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: errMsg.handlerLogout });
    }
  },

  async resetPasswordRequest(req, res) {
    try {
      const { email } = req.body;
      const user = await sql.getUserByEmail(email);
      if (!user) {
        return res.status(200).json({ message: successMsg.handlerResetPasswordRequest });
      }
      const token = uuidv4();
      const tokenExpiry = Math.floor(Date.now() / 1000) + 3600 // 1hr
      await sql.setResetToken(email, token, tokenExpiry);
      const resetUrl = `${process.env.FRONTEND_URL}/10x-dev/reset-password?token=${token}`;

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: passwordMsg.subject,
        text: passwordMsg.click + resetUrl,
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
      });
      return res.status(200).json({ message: successMsg.handlerResetPasswordRequest });
    } catch (error) {
      console.error('Reset password request error:', error);
      return res.status(500).json({ error: errMsg.handlerResetPasswordRequest });
    }
  },

  async resetPasswordHandle(req, res) {
    try {
      const { token, password } = req.body;
      const user = await sql.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: errMsg.resetToken });
      }
      
      const now = Math.floor(Date.now() / 1000);
      if (user.reset_token_expiry < now) {
        return res.status(400).json({ error: errMsg.resetToken });
      }

      const hashedPass = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS, 10));
      await sql.resetPassword(user.id, hashedPass);
      return res.status(200).json({ error: successMsg.handlerResetPasswordHandle });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({ error: errMsg.handlerResetPasswordHandle });
    }
  },

  async userInfo(req, res) {
    try {
      const request_count = await sql.getRequestCountByUser(req.user.id);
      return res.status(200).json({
        user: {
          id: req.user.id,
          email: req.user.email,
          username: req.user.username,
          is_admin: req.user.is_admin
        },
        request_count: request_count
      });
    } catch (error) {
      console.error('User info error:', error);
      return res.status(500).json({ error: errMsg.handlerUserInfo });
    }
  },

  async chat(req, res) {
    try {
      const { program, language } = req.body;
      const code = await generateCode(program, language);
      await sql.createRequest(req.user.id, `${program} in ${language}`, code);
      const count = await sql.getRequestCountByUser(req.user.id);
      return res.status(200).json({ code, count });
    } catch (error) {
      console.error('Chat error:', error);
      return res.status(500).json({ error: errMsg.handlerChat });
    }
  },

  async adminDatabase(req, res) {
    try {
      if (!req.user.is_admin) {
        return res.status(403).json({ error: errMsg.admin });
      }
      const { users, requests } = await sql.getDatabase();
      return res.json({ users, requests });
    } catch (error) {
      console.error('Admin database error:', error);
      return res.status(500).json({ error: errMsg.handlerAdminDatabase });
    }
  },

  async adminUpdate(req, res) {
    try {
      if (!req.user.is_admin) {
        return res.status(403).json({ error: errMsg.admin });
      }
      const {id, email, username, is_admin } = req.body;
      await sql.updateUser(id, { email, username, is_admin });
      return res.status(200).json({ message: successMsg.handlerAdminUpdate });
    } catch (error) {
      console.error('Admin update error:', error);
      return res.status(500).json({ error: errMsg.handlerAdminUpdate });
    }
  },

  async adminDelete(req, res) {
    try {
      if (!req.user.is_admin) {
        return res.status(403).json({ error: errMsg.admin });
      }

      const { id } = req.body;

      if (id === req.user.id) {
        return res.status(400).json({ message: errMsg.adminDeleteSame });
      }

      await sql.deleteUser(id);
      return res.status(200).json({ message: successMsg.handlerAdminDelete});
    } catch (error) {
      console.error('Admin delete error:', error);
      return res.status(500).json({ error: errMsg.handlerAdminDelete });
    }
  },

  notFound(req, res) {
    return res.status(404).json({ error: errMsg.handlerNotFound });
  }
};
