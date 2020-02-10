const fs = require('fs');
const path = require('path');
const helper = require('./helper');

const lib = {};
const dataDirectory = path.join(__dirname,"../.data");

lib.create = (dir,file,data,cb) => {
  fs.open(path.join(dataDirectory,dir,file + '.json'),'wx',(err,fd) => {
    if(!err && fd){
      const stringData = JSON.stringify(data);

      fs.write(fd,stringData,(err) => {
        if(!err){
          fs.close(fd,(err) => {
            if(!err){
              cb(false);
            }
            else{
              cb("could not close the file.");
            }
          });
        }
        else{
          cb("could not write the data.");
        }
      });
    }
    else{
      cb("Could not create a file, or file already exist.");
    }
  })
};

lib.read = (dir,file,cb) => {
  fs.readFile(path.join(dataDirectory,dir,file+'.json'),'utf-8',(err,data) => {
    if(!err && data){
      const objData = helper.parseJSONToObject(data);
      cb(false,objData);
    }
    else{
      cb(true,data);
    }
  });
};

lib.update = (dir,file,data,cb) => {
  fs.open(path.join(dataDirectory,dir,file + '.json'),'r+',(err,fd) => {
    if(!err && fd){
      const stringData = JSON.stringify(data);

      fs.ftruncate(fd,(err) => {
        if(!err){
          fs.writeFile(fd,stringData,(err) => {
            if(!err){
              fs.close(fd,(err) => {
                if(!err){
                  cb(false);
                }
                else{
                  cb("Error in clossing the file.");
                }
              });
            }
            else{
              cb("Error when writing data to file.");
            }
          });
        }
        else{
          cb("Error when truncating the file.")
        }
      })
    }
    else{
      cb("Cant open the file to update.")
    }
  });
};

lib.delete = (dir,file,cb) => {
  fs.unlink(path.join(dataDirectory,dir,file + ".json"),(err) => {
    if(!err){
      cb(false);
    }
    else{
      cb("Error when deleting a file.");
    }
  });
};

lib.list = (dir,callback) => {
  fs.readdir(path.join(dataDirectory,dir),(err,data) => {
    if(!err && data.length > 0){
      const trimmedFilenames = [];
      data.forEach(item => {
        trimmedFilenames.push(item.replace('.json',''));
      });
      callback(false,trimmedFilenames);
    } else {
      callback(err,data);
    }
  });
};

module.exports = lib;