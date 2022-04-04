const { Sequelize, DataTypes } = require('Sequelize');
const db = require('../dbsql');
const Product = db.define(
  'users',
  {
    username: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    dob: { type: DataTypes.DATE },
  },
  { freezeTableName: true }
);
module.exports = Product;
