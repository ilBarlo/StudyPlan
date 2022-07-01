'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('studyplan.db', (err) => {
  if (err) throw err;
});

exports.getTypeUser = (matricola) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM UserStudyPlan WHERE matricola = ?';
    db.get(sql, [matricola], (err, row) => {
      if (err) { 
        reject(err); 
        console.log(err)
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const student = {id: row.matricola, type: row.type};
        resolve(student);
      }
    });
  });
};

exports.updateTypeStudyPlan = (body) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE UserStudyPlan SET type = ? WHERE matricola = ?';
    db.run(sql, [body.type, body.matricola], function(err) {
      console.log(body.matricola);
      console.log(body.type);
      if(err) reject(err);
      else resolve(true);
    });
  });
};