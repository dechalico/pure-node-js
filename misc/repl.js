const repl = require('repl');

repl.start({
  'prompt': '>>',
  'eval': str => {
    console.log('Evaluation stage: ',str);
    if(str.indexOf('foo') > -1){
      console.log("fee");
    } else{
      console.log("Try again later");
    }
  }
});