import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { PROJECT_NAME, SWAGGER_URL } from '../common/helpers';
import { envs } from './envs';

const swaggerOptions: SwaggerCustomOptions = {
  customCss: `.swagger-ui 
  .topbar { background-color: #89bf04; border-bottom: 15px solid #547f00; }`,
  customSiteTitle: `${PROJECT_NAME} Docs`,
  customfavIcon: '',
  swaggerOptions: {
    tagsSorter: 'alpha',
  },
};

export function initSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const config = new DocumentBuilder()
    .setTitle(
      `${PROJECT_NAME.replaceAll('-', ' ').toUpperCase()} (${envs.nodeEnv.toUpperCase()})`,
    )
    .setDescription(`${PROJECT_NAME} By Javier Puc`)
    .setContact('Support', '', 'angelpuc08@gmail.com')
    .setLicense('ISC', 'https://github.com/ajpy08')
    .setVersion(configService.get('npm_package_version') ?? '1.0.0')
    .addBearerAuth({
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_URL, app, document, swaggerOptions);
}
