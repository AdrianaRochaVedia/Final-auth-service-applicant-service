const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Applicant = sequelize.define('Applicant', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  document_type: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      isIn: [['CI', 'PASAPORTE', 'RUC']]
    }
  },
  document_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Bolivia'
  },
  employment_status: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['EMPLEADO', 'INDEPENDIENTE', 'DESEMPLEADO', 'ESTUDIANTE', 'JUBILADO', null]]
    }
  },
  monthly_income: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  profile_status: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'INCOMPLETE',
    validate: {
      isIn: [['INCOMPLETE', 'PENDING_REVIEW', 'READY', 'REJECTED']]
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'applicants',
  schema: 'applicant',
  timestamps: false
});

const IdentityDocument = require('./IdentityDocument');
Applicant.hasMany(IdentityDocument, { foreignKey: 'applicant_id', as: 'documents' });
IdentityDocument.belongsTo(Applicant, { foreignKey: 'applicant_id', as: 'applicant' });

module.exports = Applicant;