import bcrypt from 'bcrypt'
import {
  DataTypes,
  HasOneCreateAssociationMixin,
  HasOneGetAssociationMixin,
  Model
} from 'sequelize'
import sequelize from '../config/database'
import { AutoDate, Column, Entity, Nullable, PrimaryKey, Unique } from '../utilities/SequelizeDecorator'
import AccountVerification from './AccountVerification'
import Image from './Image'
import PasswordRecovery from './PasswordRecovery'

@Entity('users', { sequelize, paranoid: true })
class User extends Model {
  @PrimaryKey()
  public id!: number;

  @Column(DataTypes.STRING)
  public firstname?: string;

  @Nullable
  @Column(DataTypes.STRING)
  public middlename?: string;

  @Nullable
  @Column(DataTypes.STRING)
  public lastname?: string;

  @Unique
  @Column(DataTypes.STRING)
  public phone?: string;

  @Unique
  @Column(DataTypes.STRING)
  public email?: string;

  @Nullable
  @Column(DataTypes.STRING)
  public password?: string;

  @Nullable
  @Column(DataTypes.DATE)
  public emailVerifiedAt?: Date;

  @Nullable
  @Column(DataTypes.DATE)
  public phoneVerifiedAt?: Date;

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

  public createImage!: HasOneCreateAssociationMixin<Image>;
  public getImage!: HasOneGetAssociationMixin<Image>;

  public async authenticate (password: string) {
    const userPassword = this.get('password')
    if (!userPassword) {
      return false
    }

    const validPassword = await bcrypt.compare(password, userPassword as string)
    if (!validPassword) {
      return false
    }

    return true
  }

  public toJSON (): Record<string, any> {
    const user = this.get('', { plain: true }) as Record<string, any>
    delete user.password
    if (!user.deletedAt) {
      delete user.deletedAt
    }
    return user
  }
}

const hashPassword = async (user: User) => {
  if (!user.changed('password')) {
    return
  }
  const hash = await bcrypt.hash(user.get('password'), 10)
  user.set('password', hash)
}

User.beforeCreate(hashPassword)
User.beforeUpdate(hashPassword)

User.hasOne(Image, {
  as: 'image',
  foreignKey: 'imageable_id',
  constraints: false,
  scope: {
    imageableType: 'user'
  }
})

User.hasOne(PasswordRecovery)
PasswordRecovery.belongsTo(User)

User.hasOne(AccountVerification)
AccountVerification.belongsTo(User)

export default User
