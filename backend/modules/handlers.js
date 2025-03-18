import 'dotenv/config';
import crypto from 'crypto';
import CryptoJS from 'crypto-js';

import sql from './sql.js';
import { errMsg, successMsg } from './lang/en';

export const handlers = {
  async getNonce(req, res) {
    try {
      const nonce = crypto.randomBytes(16).toString('hex');
      const expiryTime = Math.floor(Date.now() / 1000) + 300; // 5min
      await sql.createNonce(nonce, expiryTime);
      return res.status(200).json({ nonce: nonce });
    } catch (error) {
      console.error('getNonce error:', error);
      return res.status(500).json({ error: errMsg.handlerGetNonce });
    }
  },

  async register(req, res) {
    try {
      const { email, username, password, nonce } = req.body;
      const exists = await sql.getUserByEmail(email);
      if (exists) {
        return res.status(400).json({ error: errMsg.userExists });
      }

      const nonceRecord = await sql.getNonce(nonce);
      if (!nonceRecord) {
        return res.status(400).json({ error: errMsg.nonceInv });
      }

      const now = Math.floor(Date.now() / 1000);
      if (nonceRecord.expires_at < now) {
        await sql.deleteNonce(nonce);
        return res.status(400).json({ error: errMsg.nonceExp });
      }

      const decryptedPass = CryptoJS.AES.decrypt(password, nonce).toString(CryptoJS.enc.Utf8);
      const salt = await bcrypt.genSalt()
      const hashedPass = await bcrypt.hash(decryptedPass, 10);
      const userId = await sql.createUser(email, username, hashedPass);

      await sql.deleteNonce(nonce);

      return res.status(201).json({ message: successMsg.handlerRegister });

    } catch (error) {
      console.error('register error:', error);
      return res.status(500).json({ error: errMsg.handlerRegister });
    }
  },

  async login(req, res) {
    try {

    } catch (error) {
      console.error('login error:', error);
      return res.status(500).json({ })
    }
  },

  notFound(req, res) {
    return res.status(404).json({error: errMsg.handlerNotFound});
  }
};
