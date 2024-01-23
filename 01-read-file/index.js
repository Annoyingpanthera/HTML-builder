const fs = require('fs');
const path = require('path');
const file = 'text.txt';
const filePath = path.join(__dirname, file);
const streamToRead = fs.createReadStream(filePath);
streamToRead.on('data', (x) => console.log(x.toString()));