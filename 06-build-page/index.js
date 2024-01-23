const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const srcAssetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(distDir, 'assets');
const compDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const indexPath = path.join(distDir, 'index.html');
const stylePath = path.join(distDir, 'style.css');

// Function to copy a directory recursively
function copyDir(src, dst) {
    fs.readdirSync(src, { withFileTypes: true }).forEach((file) => {
        const filePath = path.join(src, file.name);
        if (file.isDirectory()) {
            fs.mkdirSync(path.join(dst, file.name), { recursive: true });
            copyDir(filePath, path.join(dst, file.name));
        } else {
            fs.copyFileSync(filePath, path.join(dst, file.name));
        }
    });
}

// Create project-dist folder and copy assets
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(distAssetsDir, { recursive: true });
copyDir(srcAssetsDir, distAssetsDir);

// Read and process template
let templateContent = fs.readFileSync(templatePath, 'utf-8');
const componentFiles = fs.readdirSync(compDir, { withFileTypes: true });

const promises = componentFiles.map((file) => {
    if (file.isFile() && path.extname(file.name) === '.html') {
        const filePath = path.join(compDir, file.name);
        const templateName = `{{${path.basename(file.name, '.html')}}}`;
        const componentContent = fs.readFileSync(filePath, 'utf-8');
        templateContent = templateContent.replace(new RegExp(templateName, 'g'), componentContent);
    }
});

// Write the modified template to index.html
Promise.all(promises)
    .then(() => {
        fs.writeFileSync(indexPath, templateContent);
        console.log('Index file created successfully!');
    })
    .catch((err) => {
        console.error('Error processing template:', err.message);
    });

// Compile styles
const styleStream = fs.createWriteStream(stylePath);
const styleFiles = fs.readdirSync(stylesDir, { withFileTypes: true });

styleFiles.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);
        const styleContent = fs.readFileSync(filePath);
        styleStream.write(styleContent);
    }
});

// Close the style stream
styleStream.end();

console.log('Build completed successfully!');
