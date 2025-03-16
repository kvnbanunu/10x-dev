import db from './database.js';

// execute sql query
export const execute = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// get single row from db
export const getRow = async (query, params = []) => {
    const rows = await execute(query, params);
    return rows.length > 0 ? rows[0] : null;
};

// insert row and return ID
export const insert = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

// update rows and return #rows affected
export const update = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
};

// delete rows and return #rows affected
export const deleteRows = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
});
    });
};

// User queries
export const getUserByEmail = (email) => {
    return getRow('SELECT * FROM users WHERE email = ?', [email]);
};

export const getUserById = (id) => {
    return getRow('SELECT * FROM users WHERE id = ?', [id]);
};

export const createUser = (email, username, password, isAdmin = 0) => {
    return insert(
        'INSERT INTO users (email, username, password, is_admin) VALUES (?, ?, ?, ?)',
        [email, username, password, isAdmin]
    );
};

export const updateUserPassword = (userId, password) => {
    return update('UPDATE users SET password = ? WHERE id = ?', [password, userId]);
};

export const resetUserPassword = (password, userId) => {
    return update(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [password, userId]
    );
};

export const setResetToken = (email, token, expiry) => {
    return update(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
        [token, expiry, email]
    );
};

// Nonce queries
export const createNonce = (nonce, expiryTime) => {
    return insert(
        'INSERT INTO nonces (nonce, expires_at) VALUES (?, ?)',
        [nonce, expiryTime]
    );
};

export const getNonce = (nonce) => {
    return getRow('SELECT * FROM nonces WHERE nonce = ?', [nonce]);
};

export const deleteNonce = (nonce) => {
    return deleteRows('DELETE FROM nonces WHERE nonce = ?', [nonce]);
};

export const cleanupExpiredNonces = () => {
    const now = Math.floor(Date.now() / 1000);
    return deleteRows('DELETE FROM nonces WHERE expires_at < ?', [now]);
};

// Session queries
export const createSession = (userId, token, expiryTime) => {
    return insert(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
        [userId, token, expiryTime]
    );
};

export const getSessionByToken = (token) => {
    return getRow('SELECT * FROM sessions WHERE token = ?', [token]);
};

export const deleteSession = (token) => {
    return deleteRows('DELETE FROM sessions WHERE token = ?', [token]);
};

export const deleteUserSessions = (userId) => {
    return deleteRows('DELETE FROM sessions WHERE user_id = ?', [userId]);
};

export const cleanupExpiredSessions = () => {
    const now = Math.floor(Date.now() / 1000);
    return deleteRows('DELETE FROM sessions WHERE expires_at < ?', [now]);
};

// request queries
export const createRequest = (userId, prompt, response) => {
    return insert(
        'INSERT INTO requests (user_id, prompt, response) VALUES (?, ?, ?)',
        [userId, prompt, response]
    );
};

export const getRequestCountByUser = async (userId) => {
    const result = await getRow('SELECT COUNT(*) as count FROM requests WHERE user_id = ?', [userId]);
    return result ? result.count : 0;
};

export const getAllRequests = () => {
    return execute('SELECT * FROM requests ORDER BY timestamp DESC');
};

// admin queries
export const getAllUsers = () => {
    return execute('SELECT id, email, username, is_admin FROM users');
};

export const updateUser = (userId, updates) => {
    const { email, username, isAdmin } = updates;
    return update(
        'UPDATE users SET email = ?, username = ?, is_admin = ? WHERE id = ?',
        [email, username, isAdmin, userId]
    );
};

export const deleteUser = (userId) => {
    return deleteRows('DELETE FROM users WHERE id = ?', [userId]);
};

export const genericQueries = {
    execute,
    getRow,
    insert,
    update,
    deleteRows,
};

export const userQueries = {
    getUserByEmail,
    getUserById,
    createUser,
    updateUserPassword,
    resetUserPassword,
    setResetToken,
};

export const nonceQueries = {
    createNonce,
    getNonce,
    deleteNonce,
    cleanupExpiredNonces,
};

export const sessionQueries = {
    createSession,
    getSessionByToken,
    deleteSession,
    deleteUserSessions,
    cleanupExpiredSessions,
};

export const requestQueries = {
    createRequest,
    getRequestCountByUser,
    getAllRequests,
};

export const adminQueries = {
    getAllUsers,
    updateUser,
    deleteUser,
};
