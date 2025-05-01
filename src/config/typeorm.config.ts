import * as dotenv from 'dotenv';
dotenv.config();

import { ConfigService, registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const configService = new ConfigService();

const config: DataSourceOptions = {
  url: configService.get(`DATABASE_URL`),
  type: 'postgres',
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/../migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
