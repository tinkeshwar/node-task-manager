import { DataTypes, Model, Sequelize } from 'sequelize'
import sequelize from '../config/database'
import { AutoDate, AutoString, Column, Entity, Nullable, PrimaryKey } from '../utilities/SequelizeDecorator'

@Entity('jobs', { sequelize })
class Job extends Model {
  @PrimaryKey()
  public id!: number;

  @AutoString()
  public jobName!: string;

  @Nullable
  @Column(DataTypes.INTEGER)
  public jobId?: number;

  @Column(DataTypes.JSON)
  public jobData!: { [key: string]: string; };

  @AutoString({ defaultValue: 'CREATED' })
  public status!: string;

  @Nullable
  @Column(DataTypes.JSON)
  public history!: { status: string; updatedAt: string; }[];

  @AutoDate()
  public readonly createdAt!: Date;

  @AutoDate()
  public readonly updatedAt!: Date;

  @Nullable
  @Column(DataTypes.DATE)
  public readonly deletedAt?: Date;

  public toJSON (): Record<string, any> {
    const job = this.get('', { plain: true }) as Record<string, any>
    if (!job.deletedAt) {
      delete job.deletedAt
    }
    return job
  }

  updateStatus (status: string) {
    return this.update({
      status,
      history: Sequelize.fn(
        'JSON_ARRAY_APPEND',
        Sequelize.col('history'),
        '$',
        JSON.stringify({ status, updated_at: new Date() })
      )
    })
  }
}

export default Job
