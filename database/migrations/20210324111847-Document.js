'use strict'

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    const { DataTypes } = Sequelize
    await QueryInterface.createTable('documents', {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      path: { type: DataTypes.STRING, allowNull: false },
      document: { type: DataTypes.STRING, allowNull: false },
      publicUrl: { type: DataTypes.TEXT, allowNull: false, field: 'public_url' },
      documentableType: { type: DataTypes.STRING, allowNull: false, field: 'documentable_type' },
      documentableId: { type: DataTypes.BIGINT, allowNull: false, field: 'documentable_id' },
      status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' }
    })
  },
  down: async (QueryInterface) => {
    await QueryInterface.dropTable('documents')
  }
}
