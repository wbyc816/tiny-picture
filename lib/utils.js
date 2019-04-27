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
    console.log('execute:', chalk.blue(command));
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(`command failed: ${error}`)
      }
      // console.log(`stdout: ${stdout}`);
      // console.log(`stderr: ${stderr}`);
      resolve(stdout)
    });
  })
}

exports.clear=function(){
  clear()
  console.log(chalk.yellow.bgBlue(figlet.textSync ('T-small', { horizontalLayout: 'full' })))
}