import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
  console.log(process.env.SECRET);
  console.log(process.env.EXPIRES_IN);
  console.log(process.env.IGNORE_EXPIRATION);
  return {
    secret: process.env.SECRET || 'sometestsecret',
    expiresIn: process.env.EXPIRES_IN || '1h',
    ignoreExpiration: stringToBoolean(process.env.IGNORE_EXPIRATION) || false,
  };
});

function stringToBoolean(boolAsStr: string): boolean {
  return boolAsStr === 'true' ? true : false;
}
