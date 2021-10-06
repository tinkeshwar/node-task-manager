import cryptoRandomString from 'crypto-random-string'
import { Association, BelongsToGetAssociationMixin, DataTypes, Model } from 'sequelize'
import { User } from '.'
import sequelize from '../config/database'
import moment from 'moment'
import { AutoDate, AutoString, Column, Entity, ForeignKey, Nullable, PrimaryKey, Unique } from '../utilities/SequelizeDecorator'

@Entity('account_verifications', { sequelize })
class AccountVerification extends Model {
    public static associations: {
        user: Association<AccountVerification, User>;
    };

    @PrimaryKey()
    public id!: number;

    @ForeignKey()
    public userId!: number;

    @Unique
    @Column(DataTypes.UUID, { defaultValue: DataTypes.UUIDV4 })
    public verificationToken!: string;

    @AutoString()
    public verificationMethod!: string;

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

export default AccountVerification

function generateRandomCode (length: number): any {
  return cryptoRandomString({ length, type: 'alphanumeric' }).toUpperCase()
}
