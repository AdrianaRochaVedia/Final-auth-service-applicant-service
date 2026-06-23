const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const IdentityDocument = sequelize.define('IdentityDocument', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  applicant_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  document_front_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  document_back_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  selfie_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  validation_status: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'PENDING',
    validate: {
      isIn: [['PENDING', 'REVIEWING', 'VERIFIED', 'REJECTED']]
    }
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'identity_documents',
  schema: 'applicant',
  timestamps: false
});

module.exports = IdentityDocument;