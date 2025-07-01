import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ZERO } from '../common/helpers';
import { envs } from './envs';

const logger = new Logger('Database Creator');

export async function createDatabaseIfNotExists(): Promise<void> {
  // se conectará a la db por defecto que siempre existe, ${envs.postgresql.database} no existe hasta ahora
  const defaultDataSource = new DataSource({
    type: 'postgres',
    host: envs.postgresql.host,
    port: envs.postgresql.port,
    username: envs.postgresql.username,
    password: envs.postgresql.password,
    database: 'postgres',
    synchronize: false,
    logging: false,
  });

  try {
    await defaultDataSource.initialize();
    logger.debug('Connected to PostgreSQL server');

    const checkQuery = `
      SELECT 1 FROM pg_database 
      WHERE datname = $1
    `;

    const result: unknown[] = await defaultDataSource.query(checkQuery, [
      envs.postgresql.database,
    ]);

    if (result.length === ZERO) {
      const createQuery = `CREATE DATABASE "${envs.postgresql.database}"`;
      await defaultDataSource.query(createQuery);
      logger.debug(
        `Database '${envs.postgresql.database}' created successfully`,
      );
    } else {
      logger.debug(`Database '${envs.postgresql.database}' already exists`);
    }
  } catch (error) {
    logger.error('Error creating database:', error);
    throw error;
  } finally {
    await defaultDataSource.destroy();
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  createDatabaseIfNotExists()
    .then(() => {
      logger.debug('Database setup completed');
      process.exit(ZERO);
    })
    .catch((error: unknown) => {
      logger.error('Database setup failed:', error);
      process.exit(1);
    });
}
