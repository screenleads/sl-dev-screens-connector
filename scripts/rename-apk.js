const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

const apkDir = path.join(__dirname, '../android/app/build/outputs/apk/release');
const oldApkName = 'app-release.apk';
const newApkName = `app-v${version}.apk`;

const oldApkPath = path.join(apkDir, oldApkName);
const newApkPath = path.join(apkDir, newApkName);

if (fs.existsSync(oldApkPath)) {
    fs.renameSync(oldApkPath, newApkPath);
    console.log(`✅ APK renombrado a: ${newApkName}`);
} else {
    console.error(`❌ No se encontró ${oldApkName} en ${apkDir}`);
}
