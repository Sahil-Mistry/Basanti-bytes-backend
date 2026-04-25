import { IUser } from '../models/user.model';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export declare function register(name: string, email: string, password: string, role?: string): Promise<{
    user: IUser;
    tokens: AuthTokens;
}>;
export declare function login(email: string, password: string): Promise<AuthTokens>;
//# sourceMappingURL=auth.service.d.ts.map