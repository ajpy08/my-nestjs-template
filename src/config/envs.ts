import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import dotenv from 'dotenv';
import { NODE_ENV } from '../common/enums';
import { ZERO } from '../common/helpers';

// Cargar variables de entorno al inicio
dotenv.config();

class EnvironmentVariablesDto {
  @IsNumber()
  PORT: number;

  @IsString()
  @IsEnum(NODE_ENV)
  NODE_ENV: NODE_ENV;

  @IsString()
  POSTGRES_HOST: string;

  @IsNumber()
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_USERNAME: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DATABASE: string;

  @IsString()
  @IsOptional()
  POSTGRES_LOG: string;

  @IsString()
  @IsOptional()
  SONAR_HOST: string;

  @IsString()
  @IsOptional()
  SONAR_TOKEN: string;
}

let envVars: EnvironmentVariablesDto = {
  PORT: ZERO,
  NODE_ENV: NODE_ENV.TEST,
  POSTGRES_HOST: 'localhost',
  POSTGRES_PORT: ZERO,
  POSTGRES_USERNAME: 'postgres',
  POSTGRES_PASSWORD: 'postgres',
  POSTGRES_DATABASE: 'postgres',
  POSTGRES_LOG: 'false',
  SONAR_HOST: 'http://localhost:9000',
  SONAR_TOKEN: 'sonar-token',
};

if ((process.env.NODE_ENV as NODE_ENV) !== NODE_ENV.TEST) {
  const validatedConfig = plainToClass(EnvironmentVariablesDto, process.env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    const message = `Config validation error (envs): ${errors
      .map((error) => Object.values(error.constraints ?? {}).join(', '))
      .join('; ')}`;
    Logger.error(message);
    throw new Error(message);
  }

  envVars = validatedConfig;
}

export const envs = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  postgresql: {
    host: envVars.POSTGRES_HOST,
    port: envVars.POSTGRES_PORT,
    username: envVars.POSTGRES_USERNAME,
    password: envVars.POSTGRES_PASSWORD,
    database: envVars.POSTGRES_DATABASE,
    log: envVars.POSTGRES_LOG,
  },
  sonar: {
    host: envVars.SONAR_HOST,
    token: envVars.SONAR_TOKEN,
  },
};
