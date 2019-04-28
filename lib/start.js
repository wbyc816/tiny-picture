const fs = require('fs')
const chalk = require('chalk');
const files = require('./files')
const tinify = require('./tinify')
const { executeCommand,clear,resolve,report } = require('./utils');

const cmd='git ls-files -om --exclude-standard'
const excludeCmd='git ls-files -d --exclude-standard'

module.exports=async function(){
  // 非git项目提示
  if (!files.directoryExists('.git')) {
    console.log(chalk.red('This is not a git repository'))
    process.exit()
  }

  clear()
  // 校验key,未设置则提示输入
  tinify.validKey()
  // 获取未跟踪及修改的图片
  let gitRes= await executeCommand(cmd)
  let excludeRes=await executeCommand(excludeCmd)
  gitRes=gitRes.replace(excludeRes,'')
  let imgList = gitRes.split('\n')
  .filter(name=>/\.(png|jpg|jpeg)$/i.test(name))
  .map(name=>{
    return {
      name,
      fromSize:fs.statSync(name).size
    }
  })

  if(imgList.length===0){
    console.log(chalk.red('There are no untracked pictures in the current directory'))
    process.exit()
  }

  let tempJSON={
    total:0,
    tempList:[]
  }
  const tempPath = resolve('t_temp.json')
  if(fs.existsSync(tempPath)){
    try{
      tempJSON=require(tempPath)
      const {tempList}=tempJSON
      // 与本地记录对比,去除已压缩图片
      if(tempList.length!==0){
        imgList=imgList.filter((img)=>!tempList.find(({name,toSize})=>img.name===name&&img.fromSize===toSize))
      }
    } catch(e){
      tempJSON={
        total:0,
        tempList:[]
      }
    }
  }
  if(imgList.length!==0){
    console.log(chalk.green('The following pictures need to be compressed:'))
    let list=imgList.map(({name})=>name).join('\n')
    console.log(chalk.blue(list))
    await tinify.compress(imgList)
    imgList.forEach((img)=>{
      img.toSize=fs.statSync(img.name).size
      img.date=new Date().toGMTString()
    })
    tempJSON.tempList=tempJSON.tempList.concat(imgList)
    tempJSON.total+=imgList.length
    fs.writeFileSync('t_temp.json',JSON.stringify(tempJSON,null,'    '))

    // 生成压缩报告
    report(imgList)

    // 打印剩余次数
    tinify.getCount()
  }else{
    console.log(chalk.red('There is no pictures need to compress!'))
    process.exit()
  }
}