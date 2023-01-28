import { User } from '@prisma/client';

export interface JwtPayload {
  id: string;
}

export interface TokenCookie {
  token: string;
  maxAge: number;
  sameSite: boolean | 'strict' | 'lax' | 'none';
}

export interface UserTokens {
  user: User;
  accessTokenCookieDetails: TokenCookie;
  refreshTokenCookieDetails: TokenCookie;
}
