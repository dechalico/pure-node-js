
/**
 * Dependencies
 */
const fs = require('fs');
const path = require('path');
const _data = require('./data');
const https = require('https');
const http = require('http');
const url = require('url');
const helper = require('./helper');
const log = require('./logs');
const util = require('util');

const debug = util.debuglog('workers');

// worker container
const workers = {};

// Look-up all checks, get thei data, send to validator
workers.gatherAllChecks = () => {
  _data.list('checks',(err,listData) => {
    if(!err && listData){
      listData.forEach(check => {
        // read the check data
        _data.read('checks',check,(err,checkData) => {
          if(!err && checkData){
            // pass it to the check validator
            workers.validateCheckData(checkData);
          } else {
            debug(err,checkData);
          }
        });
      });
    } else {
      debug("Error: Could not find any checks to process");
    }
  });
};

// Sanity-check the check data
workers.validateCheckData = (originalCheckData) => {
  originalCheckData = typeof(originalCheckData) == 'object' &&
    originalCheckData != null ? originalCheckData : {};
  originalCheckData.id = typeof(originalCheckData.id) == 'string' && 
    originalCheckData.id.trim().length == 20 ? originalCheckData.id : false;
  originalCheckData.userPhone = typeof(originalCheckData.userPhone) == 'string' &&
    originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone : false;
  originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' &&
     ['https','http'].indexOf(originalCheckData.protocol.trim()) > -1 ? originalCheckData.protocol : false;
  originalCheckData.url = typeof(originalCheckData.url) == 'string' &&
    originalCheckData.url.trim().length > 0 ? originalCheckData.url: false;
  originalCheckData.method = typeof(originalCheckData.method) == 'string' &&
    ['post','get','put','delete'].indexOf(originalCheckData.method.trim()) > -1 ? originalCheckData.method : false;
  originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' &&
    originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ?
    originalCheckData.successCodes : false;
  originalCheckData.timeOutSeconds = typeof(originalCheckData.timeOutSeconds) == 'number' &&
    originalCheckData.timeOutSeconds > 0 && originalCheckData.timeOutSeconds <= 5 ? originalCheckData.timeOutSeconds : false;
  
  originalCheckData.state = typeof(originalCheckData.state) == 'string' && 
    ['up','down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
  originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' &&
    originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

  if(originalCheckData.id &&
    originalCheckData.userPhone &&
    originalCheckData.protocol &&
    originalCheckData.url &&
    originalCheckData.method &&
    originalCheckData.successCodes &&
    originalCheckData.timeOutSeconds){
      workers.performCheck(originalCheckData);
    } else {
      debug("Error: Check date is not formatted properly");
    }
};

// Perform the check send by the original data.
workers.performCheck = (originalCheckData) => {
  // prepare initial check outcome
  const checkOutcome = {
    error: false,
    responseCode: false
  }

  // mark the outcome sent
  let outcomeSent = false;

  // parse the hostname and the path of the original check data
  const parsedUrl = url.parse(originalCheckData.protocol + "://" + originalCheckData.url,true);
  const hostname = parsedUrl.hostname;
  const path = parsedUrl.path;

  const requestDetail = {
    protocol: originalCheckData.protocol + ":",
    hostname: hostname,
    method: originalCheckData.method.toUpperCase(),
    path: path,
    timeout: originalCheckData.timeOutSeconds * 1000
  };

  const moduleToUsed = originalCheckData.protocol == 'http' ? http : https;
  const request = moduleToUsed.request(requestDetail,(res) => {
    const statusCode = res.statusCode;

    checkOutcome.responseCode = statusCode;
    if(!outcomeSent){
      workers.processCheckOutcome(originalCheckData,checkOutcome);
      outcomeSent = true;
    }
  });

  request.on('error',(err) => {
    checkOutcome.error = {
      err: true,
      value: err
    }

    if(!outcomeSent){
      workers.processCheckOutcome(originalCheckData,checkOutcome);
      outcomeSent = true;
    }
  });

  request.on('timeout',(err) => {
    checkOutcome.error = {
      err: true,
      value: "timeout"
    }

    if(!outcomeSent){
      workers.processCheckOutcome(originalCheckData,checkOutcome);
      outcomeSent = true;
    }
  });

  request.end();
};

// process the check outcome and update the check date if needed and triggered an aler if needed
workers.processCheckOutcome = (originalCheckData,checkOutcome) => {
  // determined the state
  const state = !checkOutcome.error && checkOutcome.responseCode && 
    originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';
  // alert warranted
  const alert = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;
  // update the checkData

  const dateChecked = Date.now();
  workers.log(originalCheckData,checkOutcome,state,alert,dateChecked);

  const newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = dateChecked;
  
  _data.update('checks',newCheckData.id,newCheckData,(err) => {
    if(!err) {
      if(alert){
        workers.alertUserToStatusChange(newCheckData);
      } else {
        debug("Check outcome has not changed, no alert needed");
      }
    } else {
      debug("Error: Trying to update check data");
    }
  });
};

// aler user to change their check data
workers.alertUserToStatusChange = (newCheckData) => {
  const msg = "Alert: Your check for " + newCheckData.method.toUpperCase() + ' ' + 
    newCheckData.protocol + '://' + newCheckData.url + ' is currently ' + newCheckData.state;
  helper.sendTwilioSms(newCheckData.userPhone,msg,(err) => {
    if(!err) {
      debug("Success: User was alerted to a status change thier checks");
      debug(msg);
    } else {
      debug("Error: Could not alert the user to SMS aler");
    }
  });
}; 

// logging
workers.log = (originalCheckData,checkOutcome,state,alert,dateChecked) => {
  const data = {
    check: originalCheckData,
    outcome: checkOutcome,
    state: state,
    alert: alert,
    dateChecked: dateChecked
  };
  const strJsonData = JSON.stringify(data);
  log.append(originalCheckData.id,strJsonData,(err) => {
    if(!err){
      debug('Data logged succed');
    } else {
      debug('Data logged failed');
    }
  });
};

// Timers to execute the worker process once per minute
workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  },1000 * 60 * 60 * 24);
};

workers.rotateLog = ()=> {
  log.list(false,(err,logList) => {
    if(!err && logList && logList.length > 0){
      logList.forEach(logResult => {
        const logName = logResult.replace('.log','');
        const newName = logName + '-' + Date.now();

        log.compress(logName,newName,(err) => {
          if(!err) {
            log.truncate(logName,(err) => {
              if(!err){
                debug('Truncating logFile success');
              } else {
                debug('Truncating logFile failed');
              }
            });
          } else {
            debug('Error in compressing the log');
          }
        });
      });
    } else {
      debug('Could not found any logfile to rotate');
    }
  });
};

workers.rotateLogLoop = () => {
  setInterval(() => {
    workers.rotateLog();
  },1000 * 60 * 60 * 24);
};

workers.init = () => {
  console.log('\x1b[33m%s\x1b[0m','Background workers are runnings');
  // Execute checks immediately
  workers.gatherAllChecks();
  // Call the loop so the checks will execute later.
  workers.loop();
  // Execute compression immediately
  workers.rotateLog();
  // Call the loop rotation log
  workers.rotateLogLoop();
};



module.exports = workers;