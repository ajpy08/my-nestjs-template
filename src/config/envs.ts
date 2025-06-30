import { Logger } from '@nestjs/common';
import * as joi from 'joi';
import { NODE_ENV } from '../common/enums';
import { ZERO } from '../common/helpers';

interface EnvVars {
  PORT: number;
  NODE_ENV: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    NODE_ENV: joi
      .string()
      .valid(
        NODE_ENV.DEVELOP,
        NODE_ENV.QA,
        NODE_ENV.PROD,
        NODE_ENV.TEST,
      )
      .required(),
  })
  .unknown(true);

let envVars: EnvVars = {
  PORT: ZERO,
  NODE_ENV: 'test',
};

if (process.env.NODE_ENV !== NODE_ENV.TEST) {
  const { error, value } = envsSchema.validate(process.env);

  if (error) {
    const message = `Config validation error (envs): ${error.message}`;
    Logger.error(message);
    throw new Error(message);
  }

  envVars = value;
}

export const envs = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
};
