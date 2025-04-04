import 'dotenv/config';
import sqlite3 from 'sqlite3';
import sql from './sql.js';
import bcrypt from 'bcryptjs';

export const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

export const initDB = async () => {
  try {
    await sql.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0,
        reset_token TEXT,
        reset_token_expiry INTEGER
      )
    `);

    await sql.execute(`
      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    await sql.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        expires_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    await sql.execute(`
      CREATE TABLE IF NOT EXISTS api_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        method TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    const users = await sql.fetchAll('SELECT * FROM users WHERE email IN (?, ?)',
      [process.env.TEST_USER_EMAIL, process.env.TEST_ADMIN_EMAIL]
    );

    if (users.length < 2) {
      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
      if (!users.find(user => user.email === process.env.TEST_USER_EMAIL)) {
        const password = process.env.TEST_USER_PASSWORD;
        const hashed = await bcrypt.hash(password, saltRounds);
        await sql.createUser(process.env.TEST_USER_EMAIL, 'john', hashed, 0);
      }

      if (!users.find(user => user.email === process.env.TEST_ADMIN_EMAIL)) {
        const password = process.env.TEST_ADMIN_PASSWORD;
        const hashed = await bcrypt.hash(password, saltRounds);
        await sql.createUser(process.env.TEST_ADMIN_EMAIL, 'admin', hashed, 1);
      }
    }

    console.log('Database init success');
  } catch (err) {
    console.error('Database init error:', err);
  }
};
