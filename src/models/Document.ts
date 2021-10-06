import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import { AutoDate, Column, Entity, Nullable, PrimaryKey } from '../utilities/SequelizeDecorator'

@Entity('documents', { sequelize })
class Document extends Model {
  @PrimaryKey()
  public id!: number;

  @Column(DataTypes.STRING)
  public name!: string;

  @Column(DataTypes.STRING)
  public path!: string;

  @Column(DataTypes.STRING)
  public document?: string;

  @Column(DataTypes.STRING)
  public publicUrl!: string;

  @Column(DataTypes.INTEGER)
  public documentableId!: number;

  @Column(DataTypes.STRING)
  public documentableType!: string;

  @Nullable
  @Column(DataTypes.BOOLEAN)
  public status?: boolean;

  @AutoDate()
  public readonly createdAt!: Date;

  @AutoDate()
  public readonly updatedAt!: Date;

  public toJSON (): Record<string, any> {
    const document = this.get('', { plain: true }) as Record<string, any>
    return document
  }
}

export default Document
