import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { API_PREFIX } from './common/helpers';
import {
  createDatabaseIfNotExists,
  envs,
  getVersion,
  initSwagger,
} from './config';

async function bootstrap() {
  await createDatabaseIfNotExists();
  const logger = new Logger(`Main ${process.env.NODE_ENV}`);
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(helmet());
  app.enableCors();

  getVersion();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix(API_PREFIX);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  initSwagger(app, configService);

  await app
    .listen(envs.port)
    .then(() => logger.debug(`Server running on port ${envs.port}`));
}
bootstrap().catch((error) => {
  Logger.error('Failed to start application:', error);
  process.exit(1);
});
