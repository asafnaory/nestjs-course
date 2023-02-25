import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
  return {
    secret: process.env.SECRET || 'sometestsecret',
    expiresIn: process.env.EXPIRES_IN || '1h',
    ignoreExpiration: stringToBoolean(process.env.IGNORE_EXPIRATION) || false,
  };
});

function stringToBoolean(boolAsStr: string): boolean {
  return boolAsStr === 'true';
}
