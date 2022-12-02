import { User } from "src/user/entities/user.entity";

export interface JwtPayload {
  id: string;
}
export interface TokenCookie {
  cookie: string;
  token: string;
}

export interface UserTokens {
  user: User;
  accessTokenCookie: TokenCookie;
  refreshTokenCookie: TokenCookie;
}
