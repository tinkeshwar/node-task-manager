import { User } from '../../models'

export interface AuthUserSettings {
    key: string,
    value: string | number | null
}

export interface AuthUser {
    user: User;
    token: string;
    refresh: string;
}

export interface AuthUserJWT {
    user: User;
    scope: string[];
    setting: AuthUserSettings[];
    tokenType: string;
}

export interface AuthUserJWTVerify {
    isValid: boolean,
    credentials?: {
        user: User
    }
}

export interface ResetToken {
    name: string,
    email: string
}
