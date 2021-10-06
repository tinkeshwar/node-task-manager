import cryptoRandomString from 'crypto-random-string'
import { Association, BelongsToGetAssociationMixin, DataTypes, Model } from 'sequelize'
import { User } from '.'
import sequelize from '../config/database'
import moment from 'moment'
import { AutoDate, AutoString, Column, Entity, ForeignKey, Nullable, PrimaryKey, Unique } from '../utilities/SequelizeDecorator'

@Entity('password_recoveries', { sequelize })
class PasswordRecovery extends Model {
    public static associations: {
        user: Association<PasswordRecovery, User>;
    };

    @PrimaryKey()
    public id!: number;

    @ForeignKey()
    public userId!: number;

    @Unique
    @Column(DataTypes.UUID, { defaultValue: DataTypes.UUIDV4 })
    public recoveryToken!: string;

    @AutoString()
    public recoveryMethod!: string;

    @AutoString({ defaultValue: generateRandomCode(6) })
    public verificationCode!: string;

    @AutoString({ defaultValue: 'CREATED' })
    public status!: string;

    @Nullable
    @Column(DataTypes.DATE)
    public sentAt?: Date;

    @Nullable
    @Column(DataTypes.DATE)
    public expiresAt?: Date;

    @AutoDate()
    public readonly createdAt!: Date;

    @AutoDate()
    public readonly updatedAt!: Date;

    public getUser!: BelongsToGetAssociationMixin<User>;
    public readonly user?: User[];

    public get isExpired (): boolean {
      if (!this.get('expiresAt')) {
        return false
      }
      if (moment() > moment(this.get('expiresAt'))) {
        return true
      }
      return false
    }
}

export default PasswordRecovery

function generateRandomCode (length: number): any {
  return cryptoRandomString({ length, type: 'alphanumeric' }).toUpperCase()
}
