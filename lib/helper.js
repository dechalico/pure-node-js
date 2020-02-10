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

module.exports = helper;