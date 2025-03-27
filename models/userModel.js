const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    createUser: async (fullName , email, password, role = 'user') => {
        const hashedPassword = await bcrypt.hash(password, 10);

        return new Promise((resolve, reject) => {
            db.query(
                `INSERT INTO users (name, email, password, role_id) 
                 VALUES (?, ?, ?, (SELECT id FROM roles WHERE name = ?))`,
                [fullName, email, hashedPassword, role],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    },

    findByEmail: (email) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT users.*, roles.name as role FROM users 
                 JOIN roles ON users.role_id = roles.id 
                 WHERE email = ?`, 
                [email], 
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else if (result.length === 0) {
                        resolve(null);
                    } else {
                        resolve(result[0]);
                    }
                }
            );
        });
    },

    findUserByRole: (roleId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT * FROM users WHERE role_id = ?`, 
                [roleId], 
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else if (result.length === 0) {
                        resolve(null);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    },

    findById: (userId) => {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT users.*, roles.name as role FROM users 
                 JOIN roles ON users.role_id = roles.id 
                 WHERE users.id = ?`, 
                [userId], 
                (err, result) => {
                    if (err) {
                        reject(err);
                    } else if (result.length === 0) {
                        resolve(null);
                    } else {
                        resolve(result[0]);
                    }
                }
            );
        });
    },

    updateUserRole: (userId, newRole) => {
        return new Promise((resolve, reject) => {
            db.query(
                `UPDATE users SET role_id = (SELECT id FROM roles WHERE name = ?) WHERE id = ?`,
                [newRole, userId],
                (err, result) => {
                    if (err) reject(err);
                    resolve(result);
                }
            );
        });
    }
};

module.exports = User;
