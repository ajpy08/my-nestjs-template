import { Logger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { NODE_ENV } from '../common/enums';
import { ZERO } from '../common/helpers';

class EnvironmentVariablesDto {
  @IsNumber()
  PORT: number;

  @IsString()
  @IsEnum(NODE_ENV)
  NODE_ENV: string;
}

let envVars: EnvironmentVariablesDto = {
  PORT: ZERO,
  NODE_ENV: 'test',
};

if (process.env.NODE_ENV !== NODE_ENV.TEST) {
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
};
