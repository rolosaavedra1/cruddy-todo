const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  //read file takes a path string and a callback
  fs.readFile(exports.counterFile, (err, fileData) => {
    //if readFile(path) fails, call cb(null, 0)
    if (err) {
      callback(null, 0);
    } else {
      //if it succeeds, call CB(null, someNumber)
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
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
  //if it succeeds, counterWrite(counter+1, callback
  //if it fails,

  //function(arg1, args2) = {...}
  //function(arg1, arg2, callback) = {...}
  //function(1, 2, (error, data) => {
  // if (err) {

  // } else {
  //   do whatever with data
  // }

  //})

  readCounter((err, count) => {
    if (err) {
      callback(err, null);
    } else {
      writeCounter(count + 1, (err2, counterString) => {
        callback(err2, counterString);
      });
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');