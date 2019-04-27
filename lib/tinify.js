const tinify = require("tinify");
const Configstore = require('configstore');
const chalk = require('chalk');
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);

module.exports={
  setKey:(key)=>{
    tinify.key=key
    conf.set('tinify.key',key);
    // console.log(chalk.blue(`Your tinify key rlease ${300-tinify.compressionCount} counts`))
  },
  getKey:()=>{
    return conf.get('tinify.key')
  },
  getCount:()=>{
    return conf.get('tinify.count')||0
  },
  compress:async (list)=>{
    tinify.key=conf.get('tinify.key')
    return new Promise((reslove,reject)=>{
      let promiseList=list.map(({name})=>tinify.fromFile(name).toFile(name))
    try{
      await Promise.all(promiseList)
      reslove()
    }catch(err){
        if(err instanceof tinify.AccountError){
          console.log('error:',err.message)
        }
        reject(err)
      }
    })
  }
}