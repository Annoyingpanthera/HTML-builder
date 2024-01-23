const fs = require('fs');
const path = require('path');
const dir = 'secret-folder';
const dirPath = path.join(__dirname, dir);
fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err.message); else
    files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(dirPath, file.name);
          const fileExt = path.extname(filePath).slice(1);
          const fileName = file.name.replace(`.${fileExt}`, '');
          fs.stat(filePath, (err, stats) => {
            if (err) console.log(err.message); else
            console.log(`${fileName} - ${fileExt} - ${stats.size} bytes`);
          });
        }
    });
});