/**
 * 
 * Helper functions
 * 
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const queryString = require('querystring');
const path = require('path');
const fs = require('fs');

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

helper.sendTwilioSms = (phoneToSend,msg,callback) => {
  const phone = typeof(phoneToSend) == 'string' &&
  phoneToSend.trim().length == 10 ? phoneToSend : false;
  const message = typeof(msg) == 'string' &&
    msg.trim().length <= 1600 ? msg : false;
  
  if(phone && message){

    const payload = {
      From: config.twilio.phone,
      To: '+1'+phone,
      Body: message
    };

    const stringPayload = queryString.stringify(payload);
    
    const requestDetails = {
      protocol: "https:",
      hostname: 'api.twilio.com',
      method: 'post',
      path: '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
      auth: config.twilio.accountSid + ':' + config.twilio.authToken,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    const req = https.request(requestDetails,(res) => {
      const status = res.statusCode;

      if(status == 200 || 201){
        callback(false);
      }
      else{
        callback('Status code returned was: ' + status);
      }
    });

    req.on('error',(e) => {
      callback(e);
    });

    req.write(stringPayload);
    req.end();
  } else {
    callback('Given parameters were missing or invalid');
  }
};

helper.getTemplate = (templateName,data,callback) => {
  templateName = typeof(templateName) == 'string' && templateName.trim().length > 1 ? templateName : false;
  data = typeof(data) == 'object' && data != null ? data : {};
  if(templateName){
    const baseDir = path.join(__dirname,"../templates");
    fs.readFile(path.join(baseDir,templateName + '.html'),'utf8',(err,str) => {
      if(!err && str){
        const finalStr = helper.interpolate(str,data);
        callback(false,finalStr);
      } else {
        callback('Template name does not exist');
      }
    });
  } else {
    callback('Template name does not exist');
  }
  
};

helper.addUniversalTemplate = (str,data,callback) => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str : "";
  data = typeof(data) == 'object' && data !== null ? data : {};

  helper.getTemplate('_header',data,(err,headerString) => {
    if(!err && headerString){
      helper.getTemplate('_footer',data,(err,footerString) => {
        if(!err && footerString){
          const fullString = headerString+str+footerString;
          callback(false,fullString);
        } else {
          callback('Could not find the footer template');
        }
      });
    } else {
      callback('Could not find the header template');
    }
  });
}

helper.interpolate = (str,data) => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str : "";
  data = typeof(data) == 'object' && data !== null ? data : {};

  // add the templateGlobals do the data object and find/replace all the keys with it
  for(const keyName in config.templateGlobals){
    if(config.templateGlobals.hasOwnProperty(keyName)){
      data['global.' + keyName] = config.templateGlobals[keyName];
    }
  }

  // for each key in the data object, insert its value into the string
  for(const key in data){
    if(data.hasOwnProperty(key) && typeof(data[key]) == 'string'){
      var replace = data[key];
      var find = '{' + key + '}';
      str = str.replace(find,replace);
    }
  }
  return str;
};

helper.getStaticAssets = (filename,callback) => {
  filename = typeof(filename) == 'string' && filename.trim().length > 0 ? filename : false;

  if(filename){
    const publicDir = path.join(__dirname,'../public');
    fs.readFile(path.join(publicDir,filename),(err,data) => {
      if(!err && data){
        callback(false,data);
      } else {
        callback('Could not read filename');
      }
    });
  } else {
    callback('Could not find valid filename');
  }
};

module.exports = helper;