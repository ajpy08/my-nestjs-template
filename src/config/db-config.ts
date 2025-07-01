import { Logger } from '@nestjs/common';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { NODE_ENV } from '../common/enums';
import { envs } from './envs';

const logger = new Logger('PostgreSQL Config');

export const postgresqlConfig: DataSourceOptions = {
  type: 'postgres',
  host: envs.postgresql.host,
  port: envs.postgresql.port,
  username: envs.postgresql.username,
  password: envs.postgresql.password,
  database: envs.postgresql.database,
  synchronize: false,
  migrationsRun: true,
  logging:
    envs.nodeEnv === NODE_ENV.DEVELOP ? true : envs.postgresql.log === 'true',
  entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
  migrations: [join(__dirname + '/../migrations/**/*{.ts,.js}')],
  extra: {
    decimalNumbers: true,
    supportBigNumbers: true,
    bigNumberStrings: false,
  },
  ssl:
    envs.nodeEnv === NODE_ENV.DEVELOP ? false : { rejectUnauthorized: false },
};

export const connectionSource = new DataSource(postgresqlConfig);

if (envs.nodeEnv !== NODE_ENV.TEST) {
  connectionSource
    .initialize()
    .then(() => {
      logger.debug('Database has been initialized');
    })
    .catch((err) => {
      logger.error('Error during database initialization:', err);
    });
}
