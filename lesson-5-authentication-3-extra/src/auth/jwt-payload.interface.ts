import { Agent } from "@prisma/client";

export interface JwtPayload {
    id: string;
  }

  export interface TokenCookie {
    cookie: string;
    token: string
  }

  export interface UserTokens {
    agent: Agent;
    accessTokenCookie: TokenCookie;
    refreshTokenCookie: TokenCookie;
  }