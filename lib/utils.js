const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

exports.resolve = function (name) {
  return path.resolve(process.cwd(), name);
};

exports.executeCommand = function(command){
  return new Promise((resolve,reject)=>{
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(`command failed: ${error}`)
      }
      resolve(stdout)
    });
  })
}

exports.clear=function(){
  clear()
  console.log(chalk.yellow.bgBlue(figlet.textSync ('T-small', { horizontalLayout: 'full' })))
}

function unitKb(num){
  return num?(num/1024).toFixed(2)+'kb':'0kb'
}

exports.report=function(temp){
  console.log(chalk.green('Sucess compress:'))
  let count=temp.length
  let totalFrom=0;
  let totalTo=0;
  temp.forEach(({name,fromSize,toSize})=>{
    totalFrom+=fromSize
    totalTo+=toSize
    console.log(chalk.blue(name+'  '),'from  ',chalk.red(unitKb(fromSize)),'  to  ',chalk.red(unitKb(toSize)),'  saved:',chalk.red(`-${parseInt((fromSize-toSize)/fromSize*100)}%`))
  })
  console.log(chalk.blue('Total compression:'+count+' pictures , saved: '+parseInt((totalFrom-totalTo)/totalFrom*100)+'%'))
}
