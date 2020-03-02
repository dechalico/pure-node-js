/**
 *  CLI 
 * 
 */

// Dependencies
const readline = require('readline');
const os = require('os');
const v8 = require('v8');
const util = require('util');
const data = require('./data');
const logs = require('./logs');
const helper = require('./helper');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};

const e = new _events();

// Instantiate the cli module

const cli = {};

cli.responders = {};

// event listener
e.on('man',() => {
  cli.responders.man();
});

e.on('help',() => {
  cli.responders.man();
});

e.on('stats',() => {
  cli.responders.stats();
});

e.on('exit',() => {
  process.exit(0);
});

e.on('list users',() => {
  cli.responders.listUsers();
});

e.on('more user info',(str) => {
  cli.responders.moreUserInfo(str);
});

e.on('list checks',(str) => {
  cli.responders.listChecks(str);
});

e.on('more check info',(str) => {
  cli.responders.moreCheckInfo(str);
});

e.on('list logs',() => {
  cli.responders.listLogs();
});

e.on('more log info',(str) => {
  cli.responders.moreLogInfo(str);
});

// responders
cli.responders.man = () => {
  const commands = {
    'man': 'The help page',
    'help': 'The alias of (man) command',
    'exit': 'Exit the cli and the app',
    'stats': 'Get some information about the OS and the resources used',
    'list users': 'List of all users in the system',
    'more user info --{userId}': 'More user info about the specified user Id',
    'list checks --{up/down}': 'List of all checks. and also filter checks --up or --down',
    'more check info --{checkId}': 'More check info about about the specified check Id',
    'list logs': 'List of all logs, compress logs or uncompress logs',
    'more log info --{filname}': 'More log info about specified filename'
  };

  cli.horizontalLine();
  cli.verticalLine();
  cli.centered('Manual Page');
  cli.verticalLine();
  cli.horizontalLine();

  for(key in commands){
    if(commands.hasOwnProperty(key)){
      const value = commands[key];
      let line = '\x1b[33m' + key + '\x1b[0m';
      const padding = 60 - line.length;
      for(i =0; i < padding; i++){
        line += ' ';
      }
      console.log(line + value);
      cli.verticalLine();
    }
  }

  cli.verticalLine();
  cli.horizontalLine();
};

cli.responders.exit = () => {
  console.log('You asked for exit');
};

cli.responders.stats = () => {
  const stats = {
    'Load Average': os.loadavg().join(' '),
    'CPU Count': os.cpus().length,
    'Free Memory': os.freemem(),
    'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
    'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
    'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
    'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
    'Uptime': os.uptime() + ' Seconds'
  };

  cli.horizontalLine();
  cli.verticalLine();
  cli.centered('System Statistics Page');
  cli.verticalLine();
  cli.horizontalLine();

  for(key in stats){
    if(stats.hasOwnProperty(key)){
      const value = stats[key];
      let line = '\x1b[33m' + key + '\x1b[0m';
      const padding = 60 - line.length;
      for(i =0; i < padding; i++){
        line += ' ';
      }
      console.log(line + value);
      cli.verticalLine();
    }
  }

  cli.verticalLine();
  cli.horizontalLine();
};

cli.responders.listUsers = () => {
  cli.verticalLine();
  data.list('users',(err,filenames) => {
    if(!err && typeof(filenames) == 'object' &&
      filenames instanceof Array && filenames.length > 0){
        filenames.forEach((filename) => {
          data.read('users',filename,(err,userData) => {
            if(!err && userData){
              let line = 'Name: ' + userData.firstName + ' ' + userData.lastName + ', Phone: ' + userData.phone;
              const checkCount = typeof(userData.checks) == 'object' &&
                userData.checks instanceof Array ? userData.checks.length : 0;
              line += ', Check Count: ' + checkCount;
              console.log(line);
              cli.verticalLine();
            }
          });
        });
      }
  });
};

cli.responders.moreUserInfo = (str) => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  if(str){
    const array = str.split('--');
    const userId = typeof(array[1]) == 'string' && array[1].trim().length > 0 ? array[1].trim() : false;
    if(userId){
      data.read('users',userId,(err,userData) => {
        delete userData.hashPassword;
        if(!err && userData){
          cli.verticalLine();
          console.dir(userData,{'colors': true})
          cli.verticalLine();
        }
      });
    }
  }
};

cli.responders.listChecks = (str) => {
  data.list('checks',(err,listChecks) => {
    if(!err && listChecks && listChecks.length > 0){
      listChecks.forEach((checkId) => {
        data.read('checks',checkId,(err,checkData) => {
          if(!err && checkData){
            const state = typeof(checkData.state) == 'string' ? checkData.state : 'down'
            const stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'Unknown'

            str = str.toLowerCase();
            if(str.indexOf('--' + state) >- 1 || (str.indexOf('--up') == -1 && str.indexOf('--down') == -1)){
              cli.verticalLine();
              const line = 'Id: ' + checkData.id + ', ' + checkData.protocol + '://' + checkData.url + ', state: ' + stateOrUnknown;
              console.log(line);
            }
          }
        });
      });
    }
    cli.verticalLine();
  });
};

cli.responders.moreCheckInfo = (str) => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  if(str){
    const array = str.split('--');
    const checkId = typeof(array[1]) == 'string' && array[1].trim().length > 0 ? array[1].trim() : false;
    if(checkId){
      data.read('checks',checkId,(err,checkData) => {

        if(!err && checkData){
          cli.verticalLine();
          console.dir(checkData,{'colors': true})
          cli.verticalLine();
        }
      });
    }
  }
};

cli.responders.listLogs = () => {
  logs.list(true,(err,filenames) => {
    if(!err && filenames && filenames.length > 0){
      filenames.forEach((filename) => {
        if(filename.indexOf('-') > -1){
          cli.verticalLine();
          console.log(filename);
        }
      });
    }
  });
};

cli.responders.moreLogInfo = (str) => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  if(str){
    const array = str.split('--');
    const logFileName = typeof(array[1]) == 'string' && array[1].trim().length > 0 ? array[1].trim() : false;
    if(logFileName){
      cli.verticalLine();
      logs.decompress(logFileName,(err,data) => {
        if(!err && data){
          const arr = data.split('\n');
          arr.forEach((jsonString) => {
            const logObject = helper.parseJSONToObject(jsonString);
            if(logObject && JSON.stringify(logObject) !== '{}'){
              console.dir(logObject,{'colors' : true});
              cli.verticalLine();
            }
          });
        }
      });
    }
  }
};

cli.processInput = (str) => {
  str = typeof(str) == 'string' &&
    str.trim().length > 0 ? str.trim() : false;

  if(str){
    const uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'list users',
      'more user info',
      'list checks',
      'more check info',
      'list logs',
      'more log info'
    ];
    
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some((input) => {
      if(str.toLowerCase().indexOf(input) > -1){
        matchFound = true;

        e.emit(input,str);
        return true;
      }
    });

    if(!matchFound){
      console.log('Sorry, Try again');
    }
  }
};

cli.horizontalLine = () => {
  const width = process.stdout.columns;
  let line = '';
  for(i =0; i < width; i++){
    line += '-';
  }
  console.log(line);
};

cli.verticalLine = (lines) => {
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for(i =0; i < lines; i++){
    console.log('');
  }
};

cli.centered = (str) => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';
  const width = process.stdout.columns;
  const padding = Math.floor((width - str.length) /2);
  let line = '';
  for(i =0; i < padding; i++){
    line += ' ';
  }
  line += str;
  console.log(line);
};

cli.init = () => {
  console.log('\x1b[34m%s\x1b[0m',"The cli is running");

  const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">>"
  });

  interface.prompt();

  interface.on('line',(str) => {
    cli.processInput(str);

    interface.prompt();
  });

  interface.on('close',() => {
    process.exit(0);
  });
};


module.exports = cli;