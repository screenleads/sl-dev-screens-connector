// scripts/update-version.js
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const versionTsPath = path.resolve(__dirname, '../src/environments/version.ts');

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = pkg.version;

const content = `export const APP_VERSION = '${version}';\n`;
fs.writeFileSync(versionTsPath, content);
console.log(`✔ APP_VERSION actualizado a ${version} en version.ts`);
