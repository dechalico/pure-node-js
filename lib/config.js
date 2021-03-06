/*
* Application configutation settings
*
*/

const environments = {};

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "Staging",
  secret: "thisissecret",
  maxChecks: 5,
  twilio: {
    accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    fromPhone: '+15005550006'    
  },
  templateGlobals: {
    yearCreated: '2020',
    companyName: 'dechalico, Inc',
    baseUrl: 'http://localhost:3000/',
    appName: 'dechalico'
  }
}

environments.testing = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: "Testing",
  secret: "thisissecret",
  maxChecks: 5,
  twilio: {
    accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    fromPhone: '+15005550006'    
  },
  templateGlobals: {
    yearCreated: '2020',
    companyName: 'dechalico, Inc',
    baseUrl: 'http://localhost:3000/',
    appName: 'dechalico'
  }
}

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "Production",
  secret: "thisissecret",
  maxChecks: 5,
  twilio: {
    accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    fromPhone: '+15005550006'    
  },
  templateGlobals: {
    yearCreated: '2020',
    companyName: 'dechalico, Inc',
    baseUrl: 'http://localhost:5000/',
    appName: 'dechalico'
  }
}

const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : "";

module.exports = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;