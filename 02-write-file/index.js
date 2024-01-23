const fs = require('fs');
const path = require('path');
const file = 'text.txt';
const filePath = path.join(__dirname, file);
const { stdin, stdout } = process;
const streamToWrite = fs.createWriteStream(filePath);

stdout.write('Hello! Input a text:\n');
stdin.on('data', (data) => {
    if (data.toString().toLowerCase().includes('exit')) process.exit();
    streamToWrite.write(data, 'utf-8');
    }
);

process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('Have a nice day!'));