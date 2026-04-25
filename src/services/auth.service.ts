import { User, IUser } from '../models/user.model';
import { signAccessToken, signRefreshToken, JwtPayload } from '../utils/jwt';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role = 'investor'
): Promise<{ user: IUser; tokens: AuthTokens }> {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');

  const user = new User({ name, email, passwordHash: password, role });
  await user.save();

  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return {
    user,
    tokens: {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    },
  };
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const valid = await user.comparePassword(password);
  if (!valid) throw new Error('Invalid credentials');

  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}
