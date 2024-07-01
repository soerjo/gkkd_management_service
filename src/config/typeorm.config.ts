import * as dotenv from 'dotenv';
dotenv.config();

import { ConfigService, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
const configService = new ConfigService();

const config = {
  url: configService.get(`DATABASE_URL`),
  type: configService.get(`DATABASE_TYPE`),
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
