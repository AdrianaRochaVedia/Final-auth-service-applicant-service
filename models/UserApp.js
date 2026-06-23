const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const UserApp = sequelize.define('UserApp', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  full_name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['student', 'professor', 'admin']]
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
    }
}, {
  tableName: 'users_app',
  timestamps: false
});

module.exports = UserApp;