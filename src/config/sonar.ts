import { ConfigService } from '@nestjs/config';
import scanner from 'sonarqube-scanner';
import { PROJECT_NAME } from '../common/helpers';
import { envs } from './envs';

interface ScannerOptions {
  serverUrl: string;
  token?: string;
  options: {
    [key: string]: string;
  };
}

type ScannerFunction = (options: ScannerOptions, callback: () => void) => void;

const exclusions: string = `
  src/common/decorators/*,
  src/common/dto/*,
  src/common/enums/*,
  src/common/filters/*,
  src/common/helpers/common.constants.ts,
  src/common/helpers/common.messages.ts,
  src/common/helpers/common.regex.ts,
  src/common/helpers/common.types.ts,
  src/common/interfaces/*,
  src/common/utils/*,
  src/config/**/*,
  src/migrations/**/*,
  src/**/index.ts,
  src/**/*.module.ts,
  src/**/*.mock.ts,
  src/**/*.facade.ts,
  src/**/*.decorator.ts,
  src/**/*.entity.ts,
  src/**/*.dto.ts,
  src/main.ts,
`;

const configService: ConfigService = new ConfigService();

const options: ScannerOptions = {
  serverUrl: envs.sonar.host,
  options: {
    'sonar.token': envs.sonar.token,
    'sonar.projectVersion':
      configService.get<string>('npm_package_version') ?? '1.0.0',
    'sonar.sources': 'src',
    'sonar.projectName': PROJECT_NAME,
    'sonar.tests': 'test',
    'sonar.inclusions': '**',
    'sonar.test.inclusions': 'src/**/*.spec.ts',
    'sonar.exclusions': exclusions,
    'sonar.typescript.jstest.reportsPath': 'coverage',
    'sonar.typescript.lcov.reportPath': 'coverage/lcov.info',
    'sonar.sourceEncoding': 'UTF-8',
  },
};

const runScanner = (
  scannerFn: ScannerFunction,
  scannerOptions: ScannerOptions,
): void => {
  scannerFn(scannerOptions, () => process.exit());
};

runScanner(scanner as ScannerFunction, options);
