'use strict';
const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('studyplan.db', (err) => {
  if (err) throw err;
});

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const student = {id: row.matricola, username: row.email, name: row.name, type: row.type};
        
        crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(student);
        });
      }
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE matricola = ?';
    db.get(sql, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({error: 'Student not found!'}); 
      }
      else {
        const student = {id: row.matricola, username: row.email, name: row.name, totalCredits: row.totalCredits};
        resolve(student);
      }
    });
  });
};

exports.updateTypeStudyPlan = (body) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Users SET type = ? WHERE matricola = ?';
    db.run(sql, [body.type, body.matricola], function(err) {
      console.log(body.matricola);
      console.log(body.type);
      if(err) reject(err);
      else resolve(true);
    });
  });
};
