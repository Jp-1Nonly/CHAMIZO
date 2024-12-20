const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const roles = require('./roles');

const users = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  mail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: ['Ya el correo esta registrado']
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recoveryToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  recoveryTokenExpires:{
    type:DataTypes.DATE,
    allowNull:true,
  },
  
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  document: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: ['El documento ya esta registrado']
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idRole: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: roles,
      key: 'id'
    },
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports=users;


