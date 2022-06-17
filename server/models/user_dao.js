"use strict";

const sqlite = require("sqlite3");
const crypto = require("crypto");

const db = new sqlite.Database("./db.sqlite", (err) => {
  if (err) throw err;
});

// Get the user given email and password
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

        // Check if the passwords match through scrypt
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
