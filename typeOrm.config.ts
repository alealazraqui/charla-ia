import { config } from 'dotenv';
import { Logger } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

config(); // Initialize dotenv

Logger.log(process.env);

const configObject: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.TYPEORM_SYNC === 'true',
  entities: ['./**/*.entity{.ts,.js}'],
  migrations: ['migrations/*.ts'],
};

export default new DataSource(configObject);
