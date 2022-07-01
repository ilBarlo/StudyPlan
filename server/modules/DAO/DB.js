'use strict';

const sqlite = require('sqlite3');

exports.db = new sqlite.Database('studyplan.db', (err) => {
  if (err) throw err;
});