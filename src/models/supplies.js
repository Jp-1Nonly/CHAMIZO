const { DataTypes } = require('sequelize');
const db = require('../config/database');

const supplies = db.define('supplies', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: ['Ya existe este registro']
    }
  },
  stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  unit: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
  state: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'supplies',
  timestamps: false,
});

module.exports = supplies;