const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
    const srcDir = path.join(__dirname, 'files');
    const destDir = path.join(__dirname, 'files-copy');

    try {
        // Create the destination directory if it doesn't exist
        await fs.mkdir(destDir, { recursive: true });

        // Read the contents of the source directory
        const files = await fs.readdir(srcDir);

        // Move each file from the source to the destination
        for (const file of files) {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(destDir, file);

            // Use rename to move the file
            await fs.rename(srcPath, destPath);
        }

        console.log('Directory moved successfully!');
    } catch (err) {
        console.error('Error moving directory:', err.message);
    }
}

// Call the function to move the directory
copyDir();
