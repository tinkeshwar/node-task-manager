'use strict'

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    const { DataTypes } = Sequelize
    await QueryInterface.createTable('users', {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      firstname: { type: DataTypes.STRING, allowNull: false },
      middlename: { type: DataTypes.STRING, allowNull: true },
      lastname: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, unique: true, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      emailVerifiedAt: { type: DataTypes.DATE, allowNull: true, field: 'email_verified_at' },
      phoneVerifiedAt: { type: DataTypes.DATE, allowNull: true, field: 'phone_verified_at' },
      status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
      deletedAt: { type: DataTypes.DATE, allowNull: true, field: 'deleted_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' }
    })
  },

  down: async (QueryInterface) => {
    await QueryInterface.dropTable('users')
  }
}
