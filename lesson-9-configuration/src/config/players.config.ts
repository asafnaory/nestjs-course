
import { registerAs } from '@nestjs/config';

export default registerAs('players', () => ({
    foo: process.env.FOO || "test"
  }));