'use strict'

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    const { DataTypes } = Sequelize
    await QueryInterface.createTable('account_verifications', {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      userId: {
        allowNull: false,
        type: DataTypes.BIGINT,
        field: 'user_id',
        primaryKey: false,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      verificationToken: { type: DataTypes.UUID, unique: true, allowNull: false, field: 'verification_token' },
      verificationMethod: { type: DataTypes.STRING, allowNull: false, field: 'verification_method' },
      verificationCode: { type: DataTypes.STRING, allowNull: false, field: 'verification_code' },
      status: { type: DataTypes.STRING, allowNull: false },
      sentAt: { type: DataTypes.DATE, allowNull: true, field: 'sent_at' },
      expiresAt: { type: DataTypes.DATE, allowNull: true, field: 'expires_at' },
      deletedAt: { type: DataTypes.DATE, allowNull: true, field: 'deleted_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' }
    })
  },

  down: async (QueryInterface) => {
    await QueryInterface.dropTable('account_verifications')
  }
}
