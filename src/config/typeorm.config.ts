import * as dotenv from 'dotenv';
dotenv.config();

import { ConfigService, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
const configService = new ConfigService();

const config = {
  type: 'postgres',
  host: configService.get(`DATABASE_HOST`),
  port: +configService.get(`DATABASE_PORT`),
  username: configService.get(`DATABASE_USERNAME`),
  password: configService.get(`DATABASE_PASSWORD`),
  database: configService.get(`DATABASE_NAME`),
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
