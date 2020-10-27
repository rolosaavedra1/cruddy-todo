const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const promReadFile = Promise.promisify(fs.readFile);

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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return callback(err);
    }
    var promiseArray = _.map(files, (filename) => {
      var id = filename.split('.')[0];
      return promReadFile(path.join(exports.dataDir, filename), {encoding: 'utf-8'}).then((data) => {
        return {
          id: id,
          text: data
        };
      });
    });
    Promise.all(promiseArray)
      .then((filesInfo) => {
        callback(null, filesInfo);
      });
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
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
