const Sequelize = require('Sequelize');
const db = new Sequelize('westsidenode', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});
module.exports = db;
