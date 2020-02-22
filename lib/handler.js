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

/**
 *  HTML Handlers
 * 
 */

handler.index = (data,callback) => {
  if(data.method == 'get'){

    // construct the need data
    const data = {
      'head.title': 'Uptime Monitoring',
      'head.description': 'We offer uptime monitoring to your application, we will notify you through text if somthing happens to your site.',
      'body.class': 'index',
    }

    helper.getTemplate('index',data,(err,strIndex) => {
      if(!err){
        helper.addUniversalTemplate(strIndex,data,(err,dataStr) => {
          if(!err && dataStr){
            callback(200,dataStr,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(404,undefined,'html');
  }
};

/**
 * 
 * Create account form
 * 
 */
handler.accountCreate = (data,callback) => {
  if(data.method == 'get'){
    // construct the need data
    const data = {
      'head.title': 'Create your Account',
      'head.description': 'Signup is easy and only takes a few seconds.',
      'body.class': 'accountCreate',
    }

    helper.getTemplate('createAccount',data,(err,strIndex) => {
      if(!err){
        helper.addUniversalTemplate(strIndex,data,(err,dataStr) => {
          if(!err && dataStr){
            callback(200,dataStr,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(404,undefined,'html');
  }
};

// session login
handler.sessionCreate = (data,callback) => {
  if(data.method == 'get'){
    // construct the need data
    const data = {
      'head.title': 'Login Page',
      'head.description': 'Login you credential to administrate account',
      'body.class': 'sessionCreate',
    }

    helper.getTemplate('login',data,(err,strIndex) => {
      if(!err){
        helper.addUniversalTemplate(strIndex,data,(err,dataStr) => {
          if(!err && dataStr){
            callback(200,dataStr,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(404,undefined,'html');
  }
};

// session logout
handler.sessionDeleted = (data,callback) => {
  if(data.method == 'get'){
    // construct the need data
    const data = {
      'head.title': 'Logged Out',
      'head.description': 'You been logout',
      'body.class': 'sessionDeleted',
    }

    helper.getTemplate('logout',data,(err,strIndex) => {
      if(!err){
        helper.addUniversalTemplate(strIndex,data,(err,dataStr) => {
          if(!err && dataStr){
            callback(200,dataStr,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(404,undefined,'html');
  }
};

// account edit profile
handler.accountEdit = (data,callback) => {
  if(data.method == 'get'){
    // construct the need data
    const data = {
      'head.title': 'Logged Out',
      'body.class': 'accountEdit',
    }

    helper.getTemplate('account',data,(err,strIndex) => {
      if(!err){
        helper.addUniversalTemplate(strIndex,data,(err,dataStr) => {
          if(!err && dataStr){
            callback(200,dataStr,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(404,undefined,'html');
  }
};

// account delete
handler.accountDeleted = (data,callback) => {
  if(data.method == 'get'){
    // construct the need data
    const data = {
      'head.title': 'Logged Out',
      'head.description': 'Account Deleted Page',
      'body.class': 'accountDeleted',
    }

    helper.getTemplate('accountDeleted',data,(err,strIndex) => {
      if(!err){
        helper.addUniversalTemplate(strIndex,data,(err,dataStr) => {
          if(!err && dataStr){
            callback(200,dataStr,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(404,undefined,'html');
  }
};

// checks create handler
handler.checksCreate = (data,callback) => {
  if(data.method == 'get'){
    // construct the need data
    const data = {
      'head.title': 'Create Checks',
      'body.class': 'checksCreate',
    }

    helper.getTemplate('checksCreate',data,(err,strIndex) => {
      if(!err){
        helper.addUniversalTemplate(strIndex,data,(err,dataStr) => {
          if(!err && dataStr){
            callback(200,dataStr,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(404,undefined,'html');
  }
};

// list of checks handler
handler.checksList = (data,callback) => {
  if(data.method == 'get'){
    // construct the need data
    const data = {
      'head.title': 'List of Checks',
      'body.class': 'checksList',
    }

    helper.getTemplate('checksList',data,(err,strIndex) => {
      if(!err){
        helper.addUniversalTemplate(strIndex,data,(err,dataStr) => {
          if(!err && dataStr){
            callback(200,dataStr,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(404,undefined,'html');
  }
};

// Edit checks
handler.checksEdit = (data,callback) => {
  if(data.method == 'get'){
    // construct the need data
    const data = {
      'head.title': 'Edit Checks',
      'body.class': 'checksEdit',
    }

    helper.getTemplate('checksEdit',data,(err,strIndex) => {
      if(!err){
        helper.addUniversalTemplate(strIndex,data,(err,dataStr) => {
          if(!err && dataStr){
            callback(200,dataStr,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(404,undefined,'html');
  }
};

// request favicon
handler.favicon = (data,callback) => {
  if(data.method == 'get'){
    helper.getStaticAssets('favicon.ico',(err,data) => {
      if(!err && data){
        callback(200,data,'favicon');
      } else {
        callback(404);
      }
    });
  } else {
    callback(404);
  }
};

handler.public = (data,callback) => {
  if(data.method == 'get'){
    const trimmedAssetName = data.trimmedPath.replace('public/','');
    if(trimmedAssetName.trim().length > 0){
      helper.getStaticAssets(trimmedAssetName,(err,data) => {
        if(!err && data){
          let contentType = 'plain';
          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          } else if (trimmedAssetName.indexOf('.js') > -1){
            contentType = 'js';
          } else if (trimmedAssetName.indexOf('.png') > -1){
            contentType = "png";
          } else if (trimmedAssetName.indexOf('.jpg') > -1 || trimmedAssetName.indexOf('.jpeg') > -1) {
            contentType = 'jpg';
          } else if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'ico';
          }
          callback(200,data,contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(404);
  }
};

/**
 * 
 * API Handlers
 * 
 */

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
    callback(404,{'error': 'Missing required phone in querystring'});
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
                  const userChecks = typeof(data.checks) == 'object' &&
                    data.checks instanceof Array ? data.checks : [];
                  
                  const noOfChecksToDelete = userChecks.length;
                  if(noOfChecksToDelete > 0) {
                    let isHaveError = false;
                    let noOfDeleteChecks = 0;
                    userChecks.foreEch(checkId => {
                      _data.delete('ckecks',checkId,(err) => {
                        if(err){
                          isHaveError = true;
                        }
                        noOfChecksToDelete++;
                        if(noOfChecksToDelete == noOfDeleteChecks){
                          if(!isHaveError){
                            callback(200);
                          } else {
                            callback(500,{Error: "Error when attempting to delete associate checks data in user"});
                          }
                        }
                      });
                    });
                  } else {
                    callback(200);
                  }
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
  const timeOutSeconds = typeof(data.payload.timeoutSeconds) == 'number' &&
    data.payload.timeoutSeconds > 0 ? data.payload.timeoutSeconds : false;
  
  const tokenId = typeof(data.header.id) == 'string' &&
    data.header.id.trim().length == 20 ? data.header.id : false;
  
  if(protocol && url && method && successCodes && timeOutSeconds)
  {
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
  } else {
    callback(400,{Error : "Required missing fields"});
  }
};

// get check handler
handler._checks.get = (data,callback) => {
  const id = typeof(data.queryString.id) == 'string' &&
    data.queryString.id.trim().length > 0 ? data.queryString.id.trim() : false;

  if(id){

    _data.read('checks',id,(err,checkData) => {
      if(!err && checkData){
        const token = typeof(data.header.id) == 'string' &&
          data.header.id.trim().length == 20 ? data.header.id : false;
        
        if(token){
          handler._tokens.verifyToken(token,checkData.userPhone,(isTokenValid) => {
            if(isTokenValid){
              callback(200,checkData);
            } else {
              callback(400,{Error: "Invalid token"});
            }
          });
        } else {
          callback(400,{Error: "Missing required token field"});
        }
      } else {
        callback(400,{Error: "Check id is invalid"});
      }
    });
  } else {
    callback(400,{Error : "Missing required check id"});
  }
};

// put check handler
handler._checks.put = (data,callback) => {
  const id = typeof(data.payload.id) == 'string' &&
    data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  
  if(id){
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
    
    if(protocol || url || method || successCodes || timeOutSeconds){
      _data.read('checks',id,(err,checkData) => {
        if(!err && checkData) {
          const tokenId = typeof(data.header.id) == 'string' &&
            data.header.id.trim().length == 20 ? data.header.id.trim() : false;
          
          if(tokenId) {
            handler._tokens.verifyToken(tokenId,checkData.userPhone,(isTokenValid) => {
              if(isTokenValid){
                if(protocol){
                  checkData.protocol = protocol;
                }
                if(url) {
                  checkData.url = url;
                }
                if(method) {
                  checkData.method = method;
                }
                if(successCodes){
                  checkData.successCodes = successCodes;
                }
                if(timeOutSeconds){
                  checkData.timeOutSeconds = timeOutSeconds;
                }
                _data.update('checks',id,checkData,(err) => {
                  if(!err) {
                    callback(200);
                  } else {
                    callback(500,{Error: "Can't update check data"});
                  }
                })
              } else {
                callback(400,{Error: "Token id is invalid or token is expired"});
              }
            });
          } else {
            callback(400,{Error: "Required token id in headers"});
          }
        } else {
          callback(400,{Error : "Invalid check id"});
        }
      });
    } else {
      callback(404,{Error : "Missing field to update"})
    }
  } else {
    callback(400,{Error: "Missing required check id"});
  }
};

// delete check handler
handler._checks.delete = (data,callback) => {
  const id = typeof(data.payload.id) == 'string' &&
    data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
  
  if(id) {
    const tokenId = typeof(data.header.id) == 'string' &&
      data.header.id.trim().length == 20 ? data.header.id.trim() : false;
    if(tokenId){
      _data.read('checks',id,(err,checkData) => {
        if(!err && checkData) {
          handler._tokens.verifyToken(tokenId,checkData.userPhone,(isTokenValid) => {
            if(isTokenValid) {
              _data.read('users',checkData.userPhone,(err,userData) => {
                if(!err && userData){
                  const userChecks = typeof(userData.checks) == 'object' &&
                    userData.checks instanceof Array ? userData.checks : [];
                  
                  const indexToRemove = userChecks.indexOf(id);
                  if(indexToRemove > -1){
                    userChecks.splice(indexToRemove,1);
                  }

                  userData.checks = userChecks;
                  _data.update('users',userData.phone,userData,(err) => {
                    if(!err){
                      _data.delete('checks',id,(err) => {
                        if(!err) {
                          callback(200);
                        } else {
                          callback(500,{Error: "Can't delete check"});
                        }
                      });
                    } else {
                      callback(500,{Error: "Can't delete check id in user"});
                    }
                  });
                } else {
                  callback(500,{Error: "Can't read user's data"});
                }
              });
            } else {
              callback(400,{Error: "Token id is invalid or token is expired"});
            }
          });
        } else {
          callback(400,{Error: "Invalid check id"});
        }
      });
    } else {
      callback(400,{Error: "Missing required token id in header"});
    }
  } else {
    callback(400,{Error: "Missing required check id"});
  }
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