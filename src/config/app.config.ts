import * as dotenv from 'dotenv';
dotenv.config();
import { ConfigService, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

interface IAppConfig {
  NODE_ENV: string;
  PORT: number;
  TZ: string;
  SECRET_KEY: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
}

const configService = new ConfigService();
const configs: IAppConfig = {
  NODE_ENV: configService.get(`NODE_ENV`),
  PORT: configService.get(`PORT`),
  TZ: configService.get(`TZ`),
  SECRET_KEY: configService.get(`SECRET_KEY`),
  DATABASE_HOST: configService.get(`DATABASE_HOST`),
  DATABASE_PORT: configService.get(`DATABASE_PORT`),
  DATABASE_USERNAME: configService.get(`DATABASE_USERNAME`),
  DATABASE_PASSWORD: configService.get(`DATABASE_PASSWORD`),
  DATABASE_NAME: configService.get(`DATABASE_NAME`),
};

const schema = Joi.object<IAppConfig>({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'local').required(),
  PORT: Joi.number().required(),
  TZ: Joi.string().valid('UTC').required(),
  SECRET_KEY: Joi.string().required(),
  DATABASE_HOST: Joi.string().optional(),
  DATABASE_PORT: Joi.number().optional(),
  DATABASE_USERNAME: Joi.string().optional(),
  DATABASE_PASSWORD: Joi.string().optional(),
  DATABASE_NAME: Joi.string().optional(),
});

export default registerAs('app_configs', () => {
  const { value, error } = schema.validate(configs, { abortEarly: false });

  if (error) {
    throw new Error(
      `Validation failed - Is there an environment variable missing? \n ${error.message.split('.').join('\n')}`,
    );
  }

  return value;
});
