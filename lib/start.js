const fs = require('fs')
const chalk = require('chalk');
const files = require('./files')
const tinify = require('./tinify')
const {askSetKey} = require('./inquirer')
const { executeCommand,clear,resolve } = require('./utils');

const cmd='git status -s'


module.exports=async function(){

  if (!files.directoryExists('.git')) {
    console.log(chalk.red('This is not a git repository'))
    process.exit()
  }

  clear()
  if(!tinify.getKey()){
    // console.log(chalk.red('Please get key from https://tinypng.com/developers'))
    // console.log(chalk.blue("type small set 'your key'"))
    // process.exit()
    const {key} = await askSetKey()
    tinify.setKey(key)
  }

  // console.log(tinify.getCount())
  let res= await executeCommand(cmd)
  let imgList = res.split('\n')
  .filter(name=>/^\?\?.*\.(png|jpg)$/i.test(name))
  .map(name=>{
    name=name.replace('?? ','')
    return {
      name,
      size:fs.statSync(name).size
    }
  })

  await tinify.compress(imgList)
  let tempJSON={}
  const tempPath = resolve('t_temp.json')
  if(fs.existsSync(tempPath)){
    try{
      tempJSON=require(tempPath)
    } catch(e){
      tempJSON={}
    }
  }else{

  }
}