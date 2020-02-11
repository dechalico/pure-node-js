/**
 * module for logging 
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const lib = {};

lib.baseDir = path.join(__dirname,"../.logs")

lib.append = (filename,str,callback) => {
  fs.open(path.join(lib.baseDir,filename + ".log"),'a',(err,fileDescriptor) => {
    if(!err && fileDescriptor){
      fs.appendFile(fileDescriptor,str + '\n',(err) => {
        if(!err){
          fs.close(fileDescriptor,(err) => {
            if(!err){
              callback(false);
            } else {
              callback("Could not close the file");
            }
          })
        } else {
          callback("Could not append data to file");
        }
      });
    } else {
      callback("Error could not create or append file");
    }
  });
};

lib.list = (isCompressFileInclude,callback) => {
  fs.readdir(lib.baseDir,(err,dataList) => {
    if(!err && dataList && dataList.length > 0){
      const listResult = [];
      dataList.forEach(data => {
        if(data.indexOf('.log') > -1){
          listResult.push(data.replace('.log',''));
        }

        if(isCompressFileInclude && data.indexOf('.gz.b64') > -1){
          listResult.push(data.replace('.gz.b64',''));
        }
      });
      callback(false,listResult);
    } else {
      callback('Could not find any log or compress file');
    }
  });
};

lib.compress = (fileName,newFileName,callback) => {
  const sourceFile = fileName + '.log';
  const destFile = newFileName + '.gz.b64';

  fs.readFile(path.join(lib.baseDir,sourceFile),'utf8',(err,data) => {
    if(!err && data){
      zlib.gzip(data,(err,buffer) => {
        if(!err && buffer){
          fs.open(path.join(lib.baseDir,destFile),'wx',(err,fileDescriptor) => {
            if(!err && fileDescriptor){
              fs.writeFile(fileDescriptor,buffer.toString('base64'),(err) =>{
                if(!err){
                  fs.close(fileDescriptor,(err) => {
                    if(!err) {
                      callback(false);
                    } else {
                      callback(err);
                    }
                  });
                } else {
                  callback(err);
                }
              });
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

lib.decompress = (filename,callback) => {
  fs.readFile(path.join(lib.baseDir,filename + '.gzip.b64'),'utf8',(err,data) => {
    if(!err && data) {
      const inputBuffer = Buffer.from(data,'base64');
      zlib.unzip(inputBuffer,(err,outputBuffer) => {
        if(!err && outputBuffer){
          const result = outputBuffer.toString();
          callback(false,result);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
};

lib.truncate = (logFile,callback) => {
  fs.truncate(path.join(lib.baseDir,logFile + '.log'),(err) => {
    if(!err){
      callback(false);
    } else {
      callback(err);
    }
  });
};

module.exports = lib;