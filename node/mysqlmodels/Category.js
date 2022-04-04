const { Sequelize, DataTypes } = require('Sequelize');
const db = require('../dbsql');
const Product = db.define(
  'categories',
  {
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
  },
  { freezeTableName: true }
);
module.exports = Product;
