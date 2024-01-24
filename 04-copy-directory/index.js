const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
    const srcDir = path.join(__dirname, 'files');
    const destDir = path.join(__dirname, 'files-copy');

    try {
        await fs.mkdir(destDir, { recursive: true });
        await clearDir(destDir);

        const files = await fs.readdir(srcDir);

        for (const file of files) {
            const [srcPath, destPath] = [path.join(srcDir, file), path.join(destDir, file)];
            const stats = await fs.stat(srcPath);

            stats.isDirectory() ? await copyDirRecursive(srcPath, destPath) : await fs.copyFile(srcPath, destPath);
        }

        console.log('Directory copied successfully!');
    } catch (err) {
        console.error('Error copying directory:', err.message);
    }
}

async function copyDirRecursive(src, dest) {
    const files = await fs.readdir(src);

    for (const file of files) {
        const [srcPath, destPath] = [path.join(src, file), path.join(dest, file)];
        const stats = await fs.stat(srcPath);

        stats.isDirectory() ? await copyDirRecursive(srcPath, destPath) : await fs.copyFile(srcPath, destPath);
    }
}

async function clearDir(dir) {
    const files = await fs.readdir(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);

        stats.isDirectory() ? (await clearDir(filePath), await fs.rmdir(filePath)) : await fs.unlink(filePath);
    }
}

copyDir();