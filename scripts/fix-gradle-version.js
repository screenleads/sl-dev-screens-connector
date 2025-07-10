const fs = require('fs');
const path = require('path');

const gradleFile = path.join(__dirname, '../android/app/capacitor.build.gradle');

fs.readFile(gradleFile, 'utf8', (err, data) => {
    if (err) throw err;

    const updated = data.replace(/JavaVersion\.VERSION_21/g, 'JavaVersion.VERSION_17');

    fs.writeFile(gradleFile, updated, 'utf8', err => {
        if (err) throw err;
        console.log('✅ build.gradle actualizado a Java 17');
    });
});
