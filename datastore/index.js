const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //generate a new id
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log(err);
    } else {
      items[id] = text;
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err, data) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //fs.readdir(...)     files = array of files in directory
  var data = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      if (!files.length) {
        callback(null, []);
      }
      _.map(files, (filename) => {
        fs.readFile(path.join(exports.dataDir, filename), 'utf8', (err2, text) => {
          if (err2) {
            callback(err2);
          }
          data.push({
            id: filename.slice(0, filename.length - 4),
            text: text
          });
        });
        callback(null, data);
      });
    }
  });

};

exports.readOne = (id, callback) => {
  var text = fs.readFile(
    path.join(exports.dataDir, id + '.txt'), 'utf8', (err, text) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, data) => {
    if (err) {
      callback(new Error('No item with id:' + id));
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, { encoding: 'utf8' }, (err, data) => {
        if (err) {
          callback(new Error('No item with id:' + id));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {

  fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
      // something
    }
  });
  // fs.readdir(exports.dataDir, (err, files) => {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     if (files.includes(id + '.txt')) {

  //     }
  //   }
  // });

  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
