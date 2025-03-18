import db from "./database";

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

const fetchAll = async (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const fetchFirst = async (sql, params) => {
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

const createNonce = (nonce, expiryTime) => {
  return execute('INSERT INTO nonces (nonce, expires_at) VALUES (?, ?)', [nonce, expiryTime]);
};

const getNonce = (nonce) => {
  return fetchFirst('SELECT * FROM nonces WHERE nonce = ?', [nonce]);
};

const deleteNonce = (nonce) => {
  return execute('DELETE FROM nonces WHERE nonce = ?', [nonce]);
};

export default {
  execute,
  fetchAll,
  fetchFirst,
  getUserByEmail,
  getUserById,
  createUser,
  createNonce,
  getNonce,
  deleteNonce,
}
