import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import { AutoDate, Column, Entity, ForeignKey, Nullable, PrimaryKey } from '../utilities/SequelizeDecorator'
import Task from './Task'

@Entity('buckets', { sequelize, paranoid: true })
class Bucket extends Model {
  @PrimaryKey()
  public id!: number;

  @ForeignKey()
  public userId!: number;

  @Column(DataTypes.STRING)
  public name!: string;

  @Nullable
  @Column(DataTypes.TEXT)
  public description?: string;

  @Nullable
  @Column(DataTypes.BOOLEAN)
  public status?: boolean;

  @AutoDate()
  public readonly createdAt!: Date;

  @AutoDate()
  public readonly updatedAt!: Date;

  @Nullable
  @Column(DataTypes.DATE)
  public readonly deletedAt?: Date;

  public toJSON (): Record<string, any> {
    const bucket = this.get('', { plain: true }) as Record<string, any>
    if (!bucket.deletedAt) {
      delete bucket.deletedAt
    }
    return bucket
  }
}

Bucket.hasMany(Task, { as: 'tasks' })
Task.belongsTo(Bucket, { as: 'bucket' })

export default Bucket
