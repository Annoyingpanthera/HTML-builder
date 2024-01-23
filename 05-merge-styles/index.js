const fs = require('fs');
const path = require('path');
const src = 'styles';
const bundle = 'bundle.css';
const bundleDir = 'project-dist';
const srcPath = path.join(__dirname, src);
const bundlePath = path.join(__dirname, bundleDir, bundle);
const streamBundle = fs.createWriteStream(bundlePath);

fs.readdir(srcPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.error(err.message);
        return;
    }

    // Create an array to store promises for each file reading
    const fileReadingPromises = [];

    files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.css') {
            const filePath = path.join(srcPath, file.name);
            const streamToRead = fs.createReadStream(filePath);

            // Create a promise for each file reading
            const fileReadingPromise = new Promise((resolve, reject) => {
                streamToRead.on('data', (data) => {
                    // Write data to the bundle.css file
                    streamBundle.write(data);
                });

                streamToRead.on('end', () => {
                    resolve();
                });

                streamToRead.on('error', (err) => {
                    reject(err);
                });
            });

            fileReadingPromises.push(fileReadingPromise);
        }
    });

    // After all promises are resolved, close the write stream
    Promise.all(fileReadingPromises)
        .then(() => {
            streamBundle.end();
            console.log('Bundle created successfully!');
        })
        .catch((err) => {
            console.error('Error reading files:', err.message);
        });
});
