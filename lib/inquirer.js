const inquirer = require('inquirer');

module.exports = {
  askSetKey: ()=>{
    const questions = [
      {
        name:'key',
        type:'input',
        message:'Enter your tinify key:',
        validate:(value)=>{
          if(value.length){
            return true;
          }else{
            return 'Please enter tinify key'
          }
        }
      }
    ];
    return inquirer.prompt(questions);
  }
}