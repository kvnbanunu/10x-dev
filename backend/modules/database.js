import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { execute } from './sql.js';
import 'dotenv/config';

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database');
    }
});

export const initializeDatabase = async () => {
    try {
        await execute(`
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

        await execute(`
            CREATE TABLE IF NOT EXISTS requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                prompt TEXT NOT NULL,
                response TEXT NOT NULL,
                timestamp INTEGER DEFAULT (strftime('%s', 'now')),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        await execute(`
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT NOT NULL,
                created_at INTEGER DEFAULT (strftime('%s', 'now')),
                expires_at INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        `);

        await execute(`
            CREATE TABLE IF NOT EXISTS nonces (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nonce TEXT NOT NULL,
                created_at INTEGER DEFAULT (strftime('%s', 'now')),
                expires_at INTEGER NOT NULL
            )
        `);
    
        // check if test users exist already
        const users = await execute('SELECT * FROM users WHERE email IN (?, ?)', [process.env.TEST_USER_EMAIL, process.env.TEST_ADMIN_EMAIL]);

        if (users.length < 2) {
            const saltRounds = parseInt(process.env.SALT_ROUNDS);

            if (!users.find(user => user.email === process.env.TEST_USER_EMAIL)) {
                const password = process.env.TEST_USER_PASSWORD;
                const firstHash = await bcrypt.hash(password, saltRounds);
                const secondHash = await bcrypt.hash(firstHash, saltRounds);

                await execute(
                    'INSERT INTO users (email, username, password, is_admin) VALUES (?, ?, ?, ?)',
                    [process.env.TEST_USER_EMAIL, 'john', secondHash, 0]
                );
            }

            if (!users.find(user => user.email === process.env.TEST_ADMIN_EMAIL)) {
                const password = process.env.TEST_USER_PASSWORD;
                const firstHash = await bcrypt.hash(password, saltRounds);
                const secondHash = await bcrypt.hash(firstHash, saltRounds);

                await execute(
                    'INSERT INTO users (email, username, password, is_admin) VALUES (?, ?, ?, ?)',
                    [process.env.TEST_ADMIN_EMAIL, 'admin', secondHash, 1]
                );
            }
        }
        console.log('Database initialized successfully');
    } catch(error) {
        console.error('Database initialization error:', error);
    }
};

export default db;
