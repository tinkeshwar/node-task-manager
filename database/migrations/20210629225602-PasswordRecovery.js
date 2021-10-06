'use strict'

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    const { DataTypes } = Sequelize
    await QueryInterface.createTable('password_recoveries', {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      recoveryToken: { type: DataTypes.UUID, unique: true, allowNull: false, field: 'recovery_token' },
      recoveryMethod: { type: DataTypes.STRING, allowNull: false, field: 'recovery_method' },
      verificationCode: { type: DataTypes.STRING, allowNull: false, field: 'verification_code' },
      status: { type: DataTypes.STRING, allowNull: false },
      sentAt: { type: DataTypes.DATE, allowNull: true, field: 'sent_at' },
      expiresAt: { type: DataTypes.DATE, allowNull: true, field: 'expires_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' }
    })
    await QueryInterface.addIndex('password_recoveries', { fields: ['created_at'] })
  },

  down: async (QueryInterface) => {
    await QueryInterface.dropTable('password_recoveries')
  }
}
