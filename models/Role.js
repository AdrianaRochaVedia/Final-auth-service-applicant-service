const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      isIn: [['SOLICITANTE', 'ANALISTA', 'GESTOR_COBRANZA', 'INVERSIONISTA', 'REGULADOR', 'COMERCIO']]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'roles',
  schema: 'auth',
  timestamps: false
});

module.exports = Role;