const fs = require('fs');
const chalk = require('chalk');
const files = require('./files');
const tinify = require('./tinify');
const { executeCommand, clear, resolve, report, createImgList } = require('./utils');

const cmd = 'git ls-files -om --exclude-standard';
const excludeCmd = 'git ls-files -d --exclude-standard';
const dirName = 'result'
module.exports = async function({ isGit }) {
  // 非git项目提示
  if (isGit && !files.directoryExists('.git')) {
    console.log(chalk.red('This is not a git repository'));
    process.exit();
  }

  clear();
  // 校验key,未设置则提示输入
  await tinify.validKey();

  let imgList = [];
  // 获取未跟踪及修改的图片
  if (isGit) {
    let gitRes = await executeCommand(cmd);
    let excludeRes = await executeCommand(excludeCmd);
    gitRes = gitRes.replace(excludeRes, '');
    imgList = createImgList(gitRes.split('\n'));
  } else {
    imgList = createImgList(fs.readdirSync(process.cwd()));
  }

  if (imgList.length === 0) {
    console.log(chalk.red(`There are no ${isGit ? 'untracked' : ''} pictures in the current directory`));
    process.exit();
  }

  let tempJSON = {
    total: 0,
    tempList: [],
  };
  if (isGit) {
    const tempPath = resolve('t_temp.json');
    if (fs.existsSync(tempPath)) {
      try {
        tempJSON = require(tempPath);
        const { tempList } = tempJSON;
        // 与本地记录对比,去除已压缩图片
        if (tempList.length !== 0) {
          imgList = imgList.filter(img => !tempList.find(({ name, toSize }) => img.name === name && img.fromSize === toSize));
        }
      } catch (e) {
        tempJSON = {
          total: 0,
          tempList: [],
        };
      }
    }
  }
  if (imgList.length === 0) {
    console.log(chalk.red('There is no pictures need to compress!'));
    process.exit();
  }

  console.log(chalk.green('The following pictures need to be compressed:'));
  let list = imgList.map(({ name }) => name).join('\n');
  console.log(chalk.blue(list));

  if (!isGit&&!files.directoryExists(dirName)) {
    fs.mkdirSync(dirName)
  }
  // 压缩图片
  await tinify.compress(imgList,isGit?'':dirName+'/');
  imgList.forEach(img => {
    img.toSize = fs.statSync(img.name).size;
    img.date = new Date().toGMTString();
  });
  tempJSON.tempList = tempJSON.tempList.concat(imgList);
  tempJSON.total += imgList.length;

  if(isGit){
    fs.writeFileSync('t_temp.json', JSON.stringify(tempJSON, null, '    '));
  }
  
  // 生成压缩报告
  report(imgList);

  // 打印剩余次数
  tinify.getCount();
};
