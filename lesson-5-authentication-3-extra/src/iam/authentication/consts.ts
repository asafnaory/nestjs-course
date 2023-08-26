export const jwtConstants = {
    JWT_SECRET: "YOUR_SECRET_KEY_HERE",
    REFRESH_JWT_SECRET: "YOUR_REFRESH_SECRET_KEY_HERE",
    JWT_TOKEN_AUDIENCE: "localhost:3000",
    JWT_TOKEN_ISSUER: "localhost:3000",
    JWT_ACCESS_TOKEN_TTL: "3600", // 1 hour
    JWT_REFRESH_TOKEN_TTL: "86400", // 1 day
}

export const REQUEST_USER_KEY = 'user';