const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  console.log('outer counter:', count);
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {

  readCounter((err, counter) => {
    writeCounter(counter + 1, (err, counterString) => {
      callback(null, counterString);
    });
  });
  // readCounter that is saved in the external file
  // increment the counter received from the external file
  // writeCounter to update the counter variable in the external file
  // let currentCounter;
  // readCounter((data1, data2) => {
  //   if (typeof data2 !== 'number') {
  //     currentCounter = 0;
  //   } else {
  //     currentCounter = data2;
  //   }
  // });

  // currentCounter++;
  // writeCounter(currentCounter, (data1, data2) => {
  //   currentCounter = data2;
  // });
  // return zeroPaddedNumber(currentCounter);
};


// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
