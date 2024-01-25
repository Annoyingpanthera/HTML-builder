const fs = require('fs').promises;
const path = require('path');

const distDir = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const srcAssetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
const compDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const indexPath = path.join(distDir, 'index.html');
const stylePath = path.join(distDir, 'style.css');

async function copyDir(src, dst) {
    try {
        await fs.mkdir(dst, { recursive: true });
        const files = await fs.readdir(src, { withFileTypes: true });

        for (const file of files) {
            const [srcPath, destPath] = [path.join(src, file.name), path.join(dst, file.name)];

            if (file.isDirectory()) await copyDir(srcPath, destPath);
            else await fs.copyFile(srcPath, destPath);
        }
    } catch (err) {
        console.error('Error copying directory:', err.message);
    }
}

async function setupDistDir() {
    try {
        await copyDir(srcAssetsDir, distAssetsDir);
        console.log('Assets copied successfully!');
    } catch (err) {
        console.error('Error setting up project-dist directory:', err.message);
    }
}

async function processTemplate() {
    try {
        let templateContent = await fs.readFile(templatePath, 'utf-8');
        const componentFiles = await fs.readdir(compDir, { withFileTypes: true });

        await Promise.all(componentFiles.map(async (file) => {
            if (file.isFile() && path.extname(file.name) === '.html') {
                const filePath = path.join(compDir, file.name);
                const templateName = `{{${path.basename(file.name, '.html')}}}`;
                const componentContent = await fs.readFile(filePath, 'utf-8');
                templateContent = templateContent.replace(new RegExp(templateName, 'g'), componentContent);
            }
        }));

        await fs.writeFile(indexPath, templateContent);
        console.log('Index file created successfully!');
    } catch (err) {
        console.error('Error processing template:', err.message);
    }
}

async function compileStyles() {
    try {
        const styleStream = fs.createWriteStream(stylePath);
        const styleFiles = await fs.readdir(stylesDir, { withFileTypes: true });

        for (const file of styleFiles) {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const filePath = path.join(stylesDir, file.name);
                const styleContent = await fs.readFile(filePath);
                styleStream.write(styleContent);
            }
        }

        styleStream.end();
        console.log('Styles compiled successfully!');
    } catch (err) {
        console.error('Error compiling styles:', err.message);
    }
}

async function build() {
    await setupDistDir();
    await processTemplate();
    await compileStyles();
    console.log('Build completed successfully!');
}

build();