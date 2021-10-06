'use strict'

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    const { DataTypes } = Sequelize
    await QueryInterface.createTable('tasks', {
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
      bucketId: {
        allowNull: true,
        type: DataTypes.BIGINT,
        field: 'bucket_id',
        primaryKey: false,
        references: {
          model: {
            tableName: 'buckets'
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      priority: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
      sort: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
      status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'pending' },
      history: { type: DataTypes.JSON, allowNull: true },
      deadlineAt: { type: DataTypes.DATE, allowNull: true, field: 'deadline_at' },
      isComplete: { type: DataTypes.BOOLEAN, allowNull: true, field: 'is_complete', defaultValue: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true, field: 'deleted_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' }
    })
  },

  down: async (QueryInterface) => {
    await QueryInterface.dropTable('tasks')
  }
}
