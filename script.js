const fs = require('fs');
const { Transform } = require('stream');

let prevChunk = '';

const readStream = fs.createReadStream('book.txt', { highWaterMark: 10 });
const writeStream = fs.createWriteStream('1.txt')

const transformStream = new Transform({
  transform(chunk, encoding, done) {
    let str = prevChunk + chunk.toString();
    let words = str.split(/(\s+)/);

    prevChunk = words.pop();

    words = words.map((word) => {
      return word.replace(/(^|\s)\S/g, function(match) {
        return match.toUpperCase();
      });
    });

    done(null, words.join(''));
  },
});

transformStream.on('end', () => {
  console.log('\nTransform ended');
});

readStream.pipe(transformStream).pipe(writeStream);
