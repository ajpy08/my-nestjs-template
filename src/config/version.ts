import { readFileSync } from 'fs';

interface PackageJson {
  version: string;
}

export const getVersion = (): string => {
  const packageJson: PackageJson = JSON.parse(
    readFileSync('././package.json', 'utf8'),
  ) as PackageJson;

  const version: string =
    process.env.npm_package_version ?? packageJson.version;

  // eslint-disable-next-line camelcase
  process.env.npm_package_version = version;

  return version;
};
