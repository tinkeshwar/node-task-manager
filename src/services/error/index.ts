/**
 * @module services/error
 *
 * Module for authentication and authorization.
 * Covers registration, login, session maintenance, access control and other related aspects.
 */
export { default as UserNotActiveError } from './UserNotActiveError'
export { default as UserNotExistError } from './UserNotExistError'
export { default as UserAlreadyExistError } from './UserAlreadyExistError'
export { default as UserInvalidCredentialError } from './UserInvalidCredentialError'
export { default as AccountVerificationDoesNotExistError } from './AccountVerificationDoesNotExistError'
export { default as PasswordRecoveryDoesNotExistError } from './PasswordRecoveryDoesNotExistError'
export { default as PasswordRecoveryExpiredError } from './PasswordRecoveryExpiredError'
export { default as InvalidJWTError } from './InvalidJWTError'
export { default as InvalidTokenTypeError } from './InvalidTokenTypeError'
export { default as UploadFailError } from './UploadFailError'
export { default as FileNotFoundError } from './FileNotFoundError'
export { default as FileAlreadyExistsError } from './FileAlreadyExistsError'
export { default as UserEmailMissingError } from './UserNotExistError'
