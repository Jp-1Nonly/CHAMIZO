const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MotiveDevolutions = sequelize.define('MotiveDevolutions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: {
      msg: 'Ya existe este registro'
    }
  },
  actions: {
    type: DataTypes.STRING(1000),
    allowNull: false
  }
}, {
  tableName: 'motiveDevolutions',
  timestamps: false,
});

module.exports = MotiveDevolutions;
