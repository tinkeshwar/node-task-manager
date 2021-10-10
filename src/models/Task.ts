import { DataTypes, Model, Sequelize } from 'sequelize'
import sequelize from '../config/database'
import { AutoDate, Column, Entity, ForeignKey, Nullable, PrimaryKey } from '../utilities/SequelizeDecorator'

@Entity('tasks', { sequelize, paranoid: true })
class Task extends Model {
  @PrimaryKey()
  public id!: number;

  @ForeignKey()
  public userId!: number;

  @Nullable
  @Column(DataTypes.BIGINT)
  public bucketId?: number;

  @Column(DataTypes.STRING)
  public name!: string;

  @Column(DataTypes.TEXT)
  public description?: string;

  @Nullable
  @Column(DataTypes.INTEGER)
  public priority?: number;

  @Nullable
  @Column(DataTypes.INTEGER)
  public sort?: number;

  @Nullable
  @Column(DataTypes.STRING)
  public status?: string;

  @Nullable
  @Column(DataTypes.DATE)
  public deadlineAt?: Date;

  @Nullable
  @Column(DataTypes.JSON)
  public history?: { status: string; updatedAt: string; }[];

  @Nullable
  @Column(DataTypes.BOOLEAN)
  public isComplete?: boolean;

  @AutoDate()
  public readonly createdAt!: Date;

  @AutoDate()
  public readonly updatedAt!: Date;

  @Nullable
  @Column(DataTypes.DATE)
  public readonly deletedAt?: Date;

  public toJSON (): Record<string, any> {
    const task = this.get('', { plain: true }) as Record<string, any>
    if (!task.deletedAt) {
      delete task.deletedAt
    }
    return task
  }

  updateStatus (status: string) {
    return this.update({
      status,
      history: Sequelize.fn(
        'JSON_ARRAY_APPEND',
        Sequelize.col('history'),
        '$',
        JSON.stringify({ status, updatedAt: new Date() })
      )
    })
  }
}

const setOrder = async (task: Task) => {
  const exist = await Task.findOne({ where: { userId: task.userId }, order: [['sort', 'DESC']] })
  task.set('sort', 1)
  if (exist && exist.sort) {
    task.set('sort', exist?.sort + 1)
  }
}

Task.beforeCreate(setOrder)

export default Task
