const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFileAsync = Promise.promisify(fs.readFile);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, counterString) => {
    console.log('Current Path: ', exports.dataDir);
    fs.writeFile(exports.dataDir + '/' + counterString + '.txt', text, function(err) {
      if (err) {
        throw ('error creating new file');
      } else {
        callback(null, { id: counterString, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, []);
    } else {
      let todoArray = _.map(files, (file) => {
      //   {id: file.slice(0, 5), text: file.slice(0, 5)}));
      // callback(null, todoArray)

      // files = ['00001.txt', '00002.txt'];
        var filePath = exports.dataDir + '/' + file;
        return readFileAsync(filePath).then((fileContent) => {
          return {
            id: file.slice(0, 5),
            text: fileContent.toString()
          };
        });
      });
      Promise.all(todoArray).then(items => callback(null, items), err => callback(err)).catch(console.log('error'));

      // Promise.all(todoArray).then(items => { return items; }, err => callback(err)).then(items => callback(null, items), err => callback(err));
    }

      // todoArray = [Promise1 , Promise2] =>
      //newArrayOfObjects = [{ id: '00001', text: todo1text }, { id: '00002', text: todo2text }]
    // let newArrayOfObjects = [];
    // for (let i = 0; i < todoArray.length; i++) {
    //   todoArray[i].then(item => { newArrayOfObjects.push(item); });
    // }
    // return newArrayOfObjects;
    // [promiseObj1, promiseObj2].then([{ id: '00001', text: todo1text }, { id: '00002', text: todo2text }] => callback(null, ...))
  });
};

exports.readOne = (id, callback) => {
  // read the file using fs.readFile
  // provide the pathname using the id parameter and exports.dataDir
  // provide a callback returning the contents of the file along with error handling
  let filePath = exports.dataDir + '/' + id + '.txt';
  console.log('outside of readFile:', filePath);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      // throw ('not an id');
      callback(err, {});
    } else {
      console.log('in readFile:', filePath);
      let fileData = {id: filePath.slice(-9).slice(0, 5), text: data};
      callback(null, fileData);
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }


  // check if the file path exists using fs.exists(path, cb)
  // if it does exists then run fs.writeFile with id and text
  // else throw error 'file does not exist'
  let filePath = exports.dataDir + '/' + id + '.txt';
  fs.exists(filePath, (exist) => {
    if (exist) {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err, {});
        } else {
          callback(null, { id: id, text: text });
        }
      });
    } else {
      callback(exist);
    }
  });


};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  // call fs.rm with the specified pathname and callback function to call the callback parameter
  let filePath = exports.dataDir + '/' + id + '.txt';
  fs.rm(filePath, (err) => {
    callback(err);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
