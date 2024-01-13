import { registerAs } from '@nestjs/config';

export default registerAs('Config', () => ({
  Env: process.env.ENV,
  Version: process.env.APP_VERSION,
}));
