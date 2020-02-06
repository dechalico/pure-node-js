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
  maxChecks: 5
}

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "Production",
  secret: "thisissecret",
  maxChecks: 5
}

const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : "";

module.exports = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;