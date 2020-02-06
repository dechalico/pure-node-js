/**
 * 
 * Helper functions
 * 
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');

const helper = {};

helper.hashPassword = (str) => {
  if(str.length > 0){
    const hash = crypto.createHmac("sha256",config.secret).update(str).digest("hex");
    return hash;
  }else{
    return false;
  }
};

helper.parseJSONToObject = (str) => {
  try{
    return JSON.parse(str);
  }
  catch(e){
    return {};
  }
};

helper.randomString = (strLength) => {
  strLength = typeof(strLength) == "number" && strLength > 0 ? strLength : false;

  if(strLength){
    const defaultRandString = "abcdefghijklmnopqrstuvwxyz1234567890";
    let str = "";

    for(i = 0; i < strLength; i++){
      const randomStr = defaultRandString.charAt(Math.floor(Math.random() * defaultRandString.length));
      str += randomStr;
    }

    return str;
  }
  else
  {
    return false;
  }
};

module.exports = helper;