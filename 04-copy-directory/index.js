const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
    const srcDir = path.join(__dirname, 'files');
    const destDir = path.join(__dirname, 'files-copy');

    try {
        // Create the destination directory if it doesn't exist
        await fs.mkdir(destDir, { recursive: true });

        // Read the contents of the source directory
        const files = await fs.readdir(destDir);

        // Remove each file from the destination directory
        for (const file of files) {
            const filePath = path.join(destDir, file);
            await fs.unlink(filePath);
        }

        // Read the contents of the source directory again
        const newFiles = await fs.readdir(srcDir);

        // Copy each file from the source to the destination
        for (const file of newFiles) {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(destDir, file);

            // Use copyFile for individual files
            await fs.copyFile(srcPath, destPath);
        }

        console.log('Directory copied successfully!');
    } catch (err) {
        console.error('Error copying directory:', err.message);
    }
}

// Call the function to copy the directory
copyDir();
