const tinify = require("tinify");
const Configstore = require('configstore');
const chalk = require('chalk');
const CLI         = require('clui');
const Spinner     = CLI.Spinner;
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);
const {askSetKey} = require('./inquirer')

function getKey(){
  return conf.get('tinify.key')
}
function setKey(key){
  tinify.key=key
  conf.set('tinify.key',key);
  console.log(chalk.blue('Success set key '+key))
}
function validKey(){
  if(!getKey()){
    return new Promise(async(reslove,reject)=>{
      const {key} = await askSetKey()
      setKey(key)
      reslove()
    })
  }
}
function handleError(err){
  if(err instanceof tinify.AccountError){
    console.log('error:',err.message)
  }else if (err instanceof tinify.ClientError) {
    // Check your source image and request options.
    console.log('error: Check your source image and request options')
  } else if (err instanceof tinify.ServerError) {
    // Temporary issue with the Tinify API.
    console.log('error: Temporary issue with the Tinify API')
  } else if (err instanceof tinify.ConnectionError) {
    // A network connection error occurred.
    console.log('error: A network connection error occurred')
  } else {
    console.log('error',err.message)
    // Something else went wrong, unrelated to the Tinify API.
  }
}
module.exports={
  setKey,
  getKey,
  validKey,
  getCount:async()=>{
    await validKey()
    tinify.key=conf.get('tinify.key')
    tinify.validate(function(err) {
      if (err){
        return handleError(err)
      };
      console.log(chalk.blue(`Current month , this key release counts: ${chalk.red(500-tinify.compressionCount)} `))
    })
  },
  compress: (list,path)=>{
    tinify.key=conf.get('tinify.key')
    return new Promise((reslove,reject)=>{
      const status = new Spinner('Compressing, please wait...');
      status.start();
      let promiseList=list.map(({name})=>tinify.fromFile(name).toFile(path+name))
      try{
        Promise.all(promiseList).then(res=>{
          status.stop();
          reslove()
        })
      }
      catch(err){
        handleError(err)
        status.stop();
        reject(err)
      }
    })
  }
}