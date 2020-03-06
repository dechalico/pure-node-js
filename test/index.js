
process.env.NODE_ENV = 'testing'; 

const app = {};

app.test = {};

app.test.unit = require('./unit');

app.test.api = require('./api');

app.countTest = () =>{ 
  let counter = 0;
  for(key in app.test){
    if(app.test.hasOwnProperty(key)){
      const test = app.test[key];
      for(testValue in test){
        if(test.hasOwnProperty(testValue)){
          counter++;
        }
      }
    }
  }
  return counter;
};

app.runTest = () => {
  const error = [];
  let successes = 0;
  const limit = app.countTest();
  let counter = 0;
  
  for(key in app.test){
    if(app.test.hasOwnProperty(key)){
      const test = app.test[key];
      for(unitTest in test){
        if(test.hasOwnProperty(unitTest)){
          (function() {
            const testName = unitTest;
            const testValue = test[unitTest];

            try{
              testValue(() => {
                console.log('\x1b[32m%s\x1b[0m',testName);
                counter++;
                successes++;
                if(counter == limit){
                  app.produceReport(limit,successes,error);
                }
              });
            } catch(e){
              counter++;
              error.push({
                'name': testName,
                'error': e
              });
              console.log('\x1b[31m%s\x1b[0m',testName);
              if(counter == limit){
                app.produceReport(limit,successes,error);
              }
            }
          })();
        }
      }
    }
  }
};

app.produceReport = (limit,successes,error) => {
  console.log("-------Unit Test Starting---------");
  console.log();

  console.log("Success: ",successes);
  console.log("Limit: ",limit);
  console.log("Error: ",error.length);

  if(error.length > 0){
    console.log();
    console.log("-------Error Test Starting---------");
    console.log();

    error.forEach(e => {
      console.log("Error Name: ",e.name);
      console.log("Error Details: ",e.error);
      console.log();
    });

    console.log();
    console.log("-------Error Test Ending---------");
    console.log();
  }

  console.log();
  console.log("-------Unit Test Ending---------");
  process.exit(0);
};

app.runTest();