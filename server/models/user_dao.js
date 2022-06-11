"use strict";

const sqlite = require("sqlite3");
const crypto = require("crypto");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM student WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = {
          id: row.id,
          email: row.email,
          name: row.name,
          surname: row.surname,
          option: row.option,
        };

        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.hash, "hex"),
              hashedPassword
            )
          )
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM student WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: "User not found!" });
      } else {
        const user = {
          id: row.id,
          email: row.email,
          name: row.name,
          surname: row.surname,
          option: row.option,
        };
        resolve(user);
      }
    });
  });
};

exports.setUserOption = (id, option) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE student SET option = ? WHERE id = ?";
    db.run(sql, [option, id], function (err, row) {
      if (err) {
        reject(err);
      } else {
        if (this.changes == 0) {
          reject(404);
        } else {
          resolve(200);
        }
      }
    });
  });
};
