/**
 * 
 * Route Handlers
 * 
 */

// Dependencies
const _data = require("./data");
const helper = require("./helper");
const config = require('./config');

const handler = {};

// User handler
handler.users = (data,callback) => {
  const acceptedMethod = ['post','get','put','delete'];
  if(acceptedMethod.indexOf(data.method) > -1){
    handler._users[data.method](data,callback);
  }
  else{
    callback(404);
  }
};

handler._users = {};

// users post route
// required fields
// firstName,lastName,phone,password,tosAgreement
handler._users.post = (data,callback) => {
  const firstName = typeof(data.payload.firstName) == "string" && 
    data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) == "string" &&
    data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = typeof(data.payload.phone) == "string" &&
    data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == "string" &&
    data.payload.password.trim().length > 0 ? data.payload.password : false;
  const tosAgreement = typeof(data.payload.tosAgreement) == "boolean" &&
    data.payload.tosAgreement == true ? true : false;

  if(firstName && lastName && phone && password && tosAgreement){
    _data.read('users',phone,(error,data) => {
      if(error){
        const hashPassword = helper.hashPassword(password);
        if(hashPassword){
          const userObj = {
            firstName : firstName,
            lastName : lastName,
            phone : phone,
            hashPassword : hashPassword
          }

          _data.create('users',phone,userObj,(err) => {
            if(!err){
              callback(200,{status: "Success"});
            }
            else{
              callback(500,{Error: "Error when creating user"});
            }
          });
        }
        else{
          callback(500,{Error: "Error when hashing user's password"});
        }
      }
      else{
        callback(500,{Erro: "User\'s phone already registered"});
      }
    });
  }
  else{
    callback(405,{error : "Missing required fields"});
  }
};

// users get route
handler._users.get = (data,callback) => {
  const phone = typeof(data.queryString.phone) == "string" && 
    data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false;

  if(phone){

    const tokenId = typeof(data.header.id) == 'string' &&
      data.header.id.trim().length == 20 ? data.header.id : false;
    if(tokenId){
      handler._tokens.verifyToken(tokenId,phone,(isTokenValid) => {
        if(isTokenValid){
          _data.read('users',phone,(err,data) => {
            if(!err && data){
              delete data.hashPassword;
      
              callback(200,data)
            }
            else{
              callback(500)
            }
          });
        }
        else{
          callback(400,{Error: "Token is invalid or expired"});
        }
      });
    }
    else{
      callback(400,{Error: "Missing required token id or token missing in header"});
    }
  }
  else{
    callback(404);
  }
};

// users update route
handler._users.put = (data,callback) => {
  const phone = typeof(data.payload.phone) == "string" && 
    data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  
  if(phone){

    const tokenId = typeof(data.header.id) == 'string' &&
      data.header.id.trim().length == 20 ? data.header.id : false;
    
    if(tokenId){
      handler._tokens.verifyToken(tokenId,phone,(isTokenValid) => {
        if(isTokenValid){
          const firstName = typeof(data.payload.firstName) == "string" && 
            data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
          const lastName = typeof(data.payload.lastName) == "string" &&
            data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
          const password = typeof(data.payload.password) == "string" &&
            data.payload.password.trim().length > 0 ? data.payload.password : false;

          if(firstName || lastName || password){
            _data.read('users',phone,(err,data) => {
              if(!err && data){
                if(firstName){
                  data.firstName = firstName;
                }
                if(lastName){
                  data.lastName = lastName;
                }
                if(password){
                  data.hashPassword = helper.hashPassword(password);
                }
                _data.update('users',phone,data,(err) => {
                  if(!err){
                    callback(200);
                  }
                  else{
                    callback(500,{Error: "Can't update user"});
                  }
                })
              }
              else{
                callback(400,{Error: "Phone not Found"});
              }
            });
          }
          else{
            callback(400,{Error: "Missing required fields"});
          }
        } else {
          callback(400,{Error: "Token is invalid or token is expired"});
        }
      });
    } else{
      callback(400,{Error: "Missing required token id or token missing in header"});
    }
  }
  else{
    callback(400,{Error: "Missing required fields"});
  }
};

// users delete route
handler._users.delete = (data,callback) => {
  const phone = typeof(data.queryString.phone) == "string" && 
    data.queryString.phone.trim().length == 10 ? data.queryString.phone.trim() : false;

  if(phone){
    const tokenId = typeof(data.header.id) == 'string' &&
      data.header.id.trim().length == 20 ? data.header.id : false;
    
    if(tokenId){
      handler._tokens.verifyToken(tokenId,phone,(isTokenValid) => {
        if(isTokenValid){
          _data.read('users',phone,(err,data) => {
            if(!err){
              _data.delete('users',phone,(err) => {
                if(!err){
                  callback(200);
                }
                else{
                  callback(500,{Error: "Can't delete user"});
                }
              });
            }
            else{
              callback(400,{Error: "Can't find user"})
            }
          });
        } else {
          callback(400,{Error: "Token is invalid or token is expired"});
        }
      });
    } else {
      callback(400,{Error: "Missing required token or token missing in header"});
    }
  }
  else{
    callback(400,{Error: "Missing required fields"});
  }
}

// Token handler
handler.tokens = (data,callback) => {
  const acceptedMethod = ['post','get','put','delete'];
  if(acceptedMethod.indexOf(data.method) > -1){
    handler._tokens[data.method](data,callback);
  }
  else{
    callback(404);
  }
};

handler._tokens = {};

// Token post handler
handler._tokens.post = (data,callback) => {
  const phone = typeof(data.payload.phone) == "string" && 
    data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == "string" &&
    data.payload.password.trim().length > 0 ? data.payload.password : false;

  if(phone && password){
    _data.read('users',phone,(err,data) => {
      if(!err && data){
        const hashedPassword = helper.hashPassword(password);
        if(hashedPassword == data.hashPassword){
          const randomString = helper.randomString(20);

          const tokenData = {
            phone: phone,
            id: randomString,
            dataExpire: Date.now() + 1000 * 60 * 60
          };

          _data.create('tokens',randomString,tokenData,(err) => {
            if(!err){
              callback(200,tokenData);
            }
            else{
              callback(400,{Error: "Can't create token"});
            }
          });
        }
        else{
          callback(400,{Error: "Password did not match"});
        }
      }
      else{
        callback(400,{Error: "Specified user not found"});
      }
    });
  }
  else{
    callback(404,{Error: "Missing required fields"});
  }
};

// Token get handler
handler._tokens.get = (data,callback) => {
  const id = typeof(data.queryString.id) == "string" && 
    data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
  
  if(id){
    _data.read('tokens',id,(err,data) => {
      if(!err && data){
        callback(200,data);
      }
      else{
        callback(400, {Error: "Token not found"});
      }
    });
  }
  else{
    callback(400,{Error: "Missing required field"})
  }
};

// Token put handler
handler._tokens.put = (data,callback) => {
  const id = typeof(data.payload.id) == "string" && 
    data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  const extend = typeof(data.payload.extend) == "boolean" &&
    data.payload.extend == true ? true : false;
  const phone = typeof(data.payload.phone) == "string" && 
    data.payload.phone.trim().length == 10 ? data.payload.phone : false;

  if(id && extend && phone){
    _data.read('tokens',id,(err,data) => {
      if(!err && data){
        if(data.phone == phone){
          data.dataExpire = Date.now() + 1000 * 60 * 60;

          _data.update('tokens',id,data,(err) => {
            if(!err){
              callback(200,data);
            }
            else{
              callback(500,{Error: "Can't extend the token expiration date"});
            }
          });
        }
        else{
          callback(400,{Error: "Phone did not march"});
        }
      }
      else{
        callback(404,{Error: "Token id not found"});
      }
    });
  }
  else{
    callback(400,{Error: "Missing required field"});
  }
};

// Token delete handler
handler._tokens.delete = (data,callback) => {
  const id = typeof(data.queryString.id) == "string" && 
    data.queryString.id.trim().length == 20 ? data.queryString.id.trim() : false;
  
  if(id){
    _data.read('tokens',id,(err,data) => {
      if(!err){
        _data.delete('tokens',id,(err) => {
          if(!err){
            callback(200);
          }
          else{
            callback(500,{Error: "Can't delete token"});
          }
        });
      }
      else{
        callback(400,{Error: "Can't find token"});
      }
    });
  }
  else{
    callback(400,{Error: "Missing required fields"});
  }
};

handler._tokens.verifyToken = (tokenId,phone,callback) => {
  _data.read('tokens',tokenId,(err,data) => {
    if(!err && data){
      if(data.phone == phone && data.dataExpire > Date.now()){
        callback(true);
      } else{
        callback(false);
      }
    }
    else{
      callback(false);
    }
  }); 
};

handler.checks = (data,callback) => {
  const acceptedMethod = ['post','get','put','delete'];
  if(acceptedMethod.indexOf(data.method) > -1){
    handler._checks[data.method](data,callback);
  }
  else{
    callback(404);
  }
};

handler._checks = {};

// post check handler
handler._checks.post = (data,callback) => {
  const protocol = typeof(data.payload.protocol) == 'string' &&
    data.payload.protocol.trim().length > 0 ? data.payload.protocol.trim() : false;
  const url = typeof(data.payload.url) == "string" &&
    data.payload.url.trim().length > 0 ? data.payload.url : false;
  const method = typeof(data.payload.method) == 'string' &&
    data.payload.method.trim().length > 0 ? data.payload.method.trim() : false;
  const successCodes = typeof(data.payload.successCodes) == 'object' &&
    data.payload.successCodes instanceof Array ? data.payload.successCodes : false;
  const timeOutSeconds = typeof(data.payload.timeOutSeconds) == 'number' &&
    data.payload.timeOutSeconds > 0 ? data.payload.timeOutSeconds : false;
  
  const tokenId = typeof(data.header.id) == 'string' &&
    data.header.id.trim().length == 20 ? data.header.id : false;
  
  if(tokenId){
    _data.read('tokens',tokenId,(err,tokenData) => {
      if(!err && tokenData){
        const userPhone = tokenData.phone;
        _data.read('users',userPhone,(err,userData) => {
          if(!err && userData){
              const userChecks = typeof(userData.checks) == 'object' 
                && userData.checks instanceof Array ? userData.checks : [];
              
              if(userChecks.length < config.maxChecks){
                const checkId = helper.randomString(20);

                const checkObj = {
                  id: checkId,
                  userPhone: userPhone,
                  protocol: protocol,
                  url: url,
                  method: method,
                  successCodes: successCodes,
                  timeOutSeconds: timeOutSeconds
                };

                _data.create('checks',checkId,checkObj,(err) => {
                  if(!err) {
                    userChecks.push(checkId);
                    userData.checks = userChecks;
                    _data.update('users',userPhone,userData,(err) => {
                      if(!err) {
                        callback(200,checkObj);
                      } else {
                        callback(500, {Error: "Error when updating user's data"});
                      }
                    })
                  } else {
                    callback(500, {Error: "Error when creating check"});
                  }
                });
              }
              else{
                callback(400,{Error: "Already created maximum of " + config.maxChecks + " Checks"});
              }
          } else {
            callback(400,{Error: "Invalid phone in token specified"});
          }
        });
      } else {
        callback(400,{Error: "Invalid token specified"});
      }
    });
  } else {
    callback(400,{Error: "Missing required token Id"});
  }
};

// get check hancler
handler._checks.get = (data,callback) => {

};

// put check handler
handler._checks.put = (data,callback) => {

};

// delete check handler
handler._checks.delete = (data,callback) => {

};

// Ping handler
handler.ping = (data,callback) => {
  callback(200);
};

// Not found handler
handler.notFound = (data,callback) => {
  callback(404);
};

module.exports = handler;