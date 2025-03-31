import { db } from './database.js';

// generic
const execute = async (sql, params = []) => {
  if (params && params.length > 0) {
    return new Promise((res, rej) => {
      db.run(sql, params, (err) => {
        if (err) rej(err);
        res();
      });
    });
  }
  return new Promise((res, rej) => {
    db.exec(sql, (err) => {
      if (err) rej(err);
      res();
    })
  })
}

const fetchAll = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const fetchFirst = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
};

const getUserByEmail = (email) => {
  return fetchFirst('SELECT * FROM users WHERE email = ?', [email]);
};

const getUserById = (id) => {
  return fetchFirst('SELECT * FROM users WHERE id = ?', [id]);
};

const createUser = (email, username, password, is_admin = 0) => {
  return execute(
    'INSERT INTO users (email, username, password, is_admin) VALUES (?, ?, ?, ?)',
    [email, username, password, is_admin]
  );
};

const resetPassword = (id, password) => {
  return execute(
    'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
    [password, id]
  );
};

const setResetToken = (email, token, expiry) => {
  return execute(
    'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
    [token, expiry, email]
  );
};

const getUserByResetToken = (token) => {
  return fetchFirst('SELECT * FROM users WHERE reset_token = ?', [token]);
};

const createSession = (id, token, expiry) => {
  return execute(
    'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
    [id, token, expiry]
  );
};

const getSessionByToken = (token) => {
    return fetchFirst('SELECT * FROM sessions WHERE token = ?', [token]);
};

const deleteSession = (token) => {
    return execute('DELETE FROM sessions WHERE token = ?', [token]);
};

const deleteUserSessions = (userId) => {
    return execute('DELETE FROM sessions WHERE user_id = ?', [userId]);
};

const cleanupExpiredSessions = () => {
    const now = Math.floor(Date.now() / 1000);
    return execute('DELETE FROM sessions WHERE expires_at < ?', [now]);
};

const createRequest = (userId, prompt, response) => {
    return execute(
        'INSERT INTO requests (user_id, prompt, response) VALUES (?, ?, ?)',
        [userId, prompt, response]
    );
};

const getRequestCountByUser = async (userId) => {
    const result = await fetchFirst('SELECT COUNT(*) as count FROM requests WHERE user_id = ?', [userId]);
    return result ? result.count : 0;
};

const getDatabase = async () => {
  const users = await fetchAll(`
      SELECT
        users.id,
        users.email,
        users.username,
        users.is_admin,
        COUNT(DISTINCT requests.id) AS request_count,
        COUNT(DISTINCT api_requests.id) AS api_request_count
      FROM users
      LEFT JOIN requests ON users.id = requests.user_id
      LEFT JOIN api_requests ON users.id = api_requests.user_id
      GROUP BY users.id
  `);
  const requests = await fetchAll('SELECT * FROM requests ORDER BY timestamp DESC');
  return { users, requests };
};

const updateUser = (id, updates) => {
    const { email, username, is_admin } = updates;
    return execute(
        'UPDATE users SET email = ?, username = ?, is_admin = ? WHERE id = ?',
        [email, username, is_admin, id]
    );
};

const deleteUser = async (id) => {
  await execute('DELETE FROM users WHERE id = ?', [id]);
  await execute('DELETE FROM requests WHERE user_id = ?', [id]);
  await execute('DELETE FROM sessions WHERE user_id = ?', [id]);
};

const recordApiRequest = (id, method, endpoint) => {
  return execute(
    'INSERT INTO api_requests (user_id, method, endpoint) VALUES (?, ?, ?)',
    [id, method, endpoint]
  );
};

const getTotalApiRequestsByUser = async (id) => {
  const res = await fetchFirst('SELECT COUNT(*) as count FROM api_requests WHERE user_id = ?', [id]);
  return res ? res.count : 0;
};

const getApiRequestsSummary = async () => {
  return fetchAll(`
    SELECT method, endpoint, COUNT(*) as request_count
    FROM api_requests
    GROUP BY method, endpoint
    ORDER BY request_count DESC
  `);
};

const getUserApiUsageSummary = async () => {
  return fetchAll(`
    SELECT users.id, users.username, COUNT(api_requests.id) as api_request_count
    FROM users
    LEFT JOIN api_requests ON users.id = api_requests.user_id
    GROUP BY users.id
  `);
};

export default {
  execute,
  fetchAll,
  fetchFirst,
  getUserByEmail,
  getUserById,
  createUser,
  resetPassword,
  setResetToken,
  getUserByResetToken,
  createSession,
  getSessionByToken,
  deleteSession,
  deleteUserSessions,
  cleanupExpiredSessions,
  createRequest,
  getRequestCountByUser,
  getDatabase,
  updateUser,
  deleteUser,
  recordApiRequest,
  getTotalApiRequestsByUser,
  getApiRequestsSummary,
  getUserApiUsageSummary
}
