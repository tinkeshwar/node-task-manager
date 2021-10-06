import Joi from 'joi'
import { ImageResponseSchema } from './Image'

const date = new Date()

const RegisteredUserResponse = Joi.object({
  id: Joi.number().required().example(1),
  firstname: Joi.string().required().example('John'),
  email: Joi.string().email().required().example('john@doe.com'),
  phone: Joi.number().required().example('9876543210')
}).unknown().label('Register User')

const UserResponse = Joi.object({
  id: Joi.number().required().example(1),
  firstname: Joi.string().required().example('John'),
  middlename: Joi.string().optional().allow(null).example('Unknown'),
  lastname: Joi.string().optional().allow(null).example('Doe'),
  email: Joi.string().email().required().example('john@doe.com'),
  phone: Joi.string().required().example('9876543210'),
  email_verified_at: Joi.date().optional().allow(null),
  phone_verified_at: Joi.date().optional().allow(null),
  status: Joi.boolean().default(false),
  created_at: Joi.date().optional().allow(null).example(date),
  updated_at: Joi.date().optional().allow(null).example(date),
  image: ImageResponseSchema
}).unknown().label('User')

const AuthResponse = Joi.object({
  id: Joi.number().required().example(1),
  firstname: Joi.string().required().example('John'),
  middlename: Joi.string().optional().allow(null).example('Unknown'),
  lastname: Joi.string().optional().allow(null).example('Doe'),
  email: Joi.string().email().required().example('john@doe.com'),
  phone: Joi.string().required().example('9876543210'),
  email_verified_at: Joi.date().optional().allow(null),
  phone_verified_at: Joi.date().optional().allow(null),
  status: Joi.boolean().default(false),
  created_at: Joi.date().optional().allow(null).example(date),
  updated_at: Joi.date().optional().allow(null).example(date)
}).unknown().label('Auth')

const UserCreateUpdateResponse = Joi.object({
  id: Joi.number().required().example(1),
  firstname: Joi.string().required().example('John'),
  middlename: Joi.string().optional().allow(null).example('Unknown'),
  lastname: Joi.string().optional().allow(null).example('Doe'),
  email: Joi.string().email().required().example('john@doe.com'),
  phone: Joi.string().required().example('9876543210'),
  email_verified_at: Joi.date().optional().allow(null),
  phone_verified_at: Joi.date().optional().allow(null),
  status: Joi.boolean().default(false),
  created_at: Joi.date().optional().allow(null).example(date),
  updated_at: Joi.date().optional().allow(null).example(date)
}).unknown().label('User Create Update')

const UserResponseList = Joi.object({
  list: Joi.array().items(UserResponse).required().label('List Data'),
  meta: Joi.object({
    total: Joi.number().required().example(0),
    page: Joi.number().required().example(1),
    per_page: Joi.number().required().example(1)
  }).unknown().label('List Meta')
}).unknown().label('User List')

const UserSettingList = Joi.object({
  key: Joi.string().optional(),
  value: Joi.string().optional()
})

const AuthUserResponse = Joi.object({
  user: AuthResponse.required(),
  setting: Joi.array().items(UserSettingList).optional().label('Setting'),
  token: Joi.string().required(),
  refresh: Joi.string().required()
}).unknown().label('Auth User')

const AuthUserProfileResponse = Joi.object({
  user: UserResponse.required(),
  setting: Joi.array().items(UserSettingList).optional().label('Setting')
}).unknown().label('Auth User')

const PasswordRecoveryResponse = Joi.object({
  expires_at: Joi.date().optional().allow(null).example(date)
}).unknown().label('Password Recover')

const PasswordResetResponse = Joi.object({
  id: Joi.number().required(),
  user_id: Joi.number().optional(),
  recovery_token: Joi.string().uuid().optional(),
  recovery_method: Joi.string().optional(),
  verification_code: Joi.string().optional(),
  status: Joi.string().optional(),
  sent_at: Joi.date().optional().allow(null).example(date),
  expires_at: Joi.date().optional().allow(null).example(date),
  created_at: Joi.date().optional().allow(null).example(date),
  updated_at: Joi.date().optional().allow(null).example(date)
}).unknown().label('Password Reset')

export const UserResponseSchema = UserResponse
export const RegisteredUserResponseSchema = RegisteredUserResponse
export const UserCreateUpdateResponseSchema = UserCreateUpdateResponse
export const UserListResponseSchema = UserResponseList
export const AuthUserResponseSchema = AuthUserResponse
export const AuthUserProfileResponseSchema = AuthUserProfileResponse
export const PasswordRecoveryResponseSchema = PasswordRecoveryResponse
export const PasswordResetResponseSchema = PasswordResetResponse
