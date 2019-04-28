#!/usr/bin/env node
const program = require('commander')
const tinify = require('../lib/tinify')
const package = require('../package.json')
const chalk = require('chalk');


program
  .command('start')
  .description('compress pictures in current working directory')
  .action(options => {
    require('../lib/start')
  })

program
  .command('set <key>')
  .description('set your tinify key')
  .action((key) => {
    tinify.setKey(key)
  })

program
  .command('count')
  .description('print release count')
  .action((key) => {
    tinify.getCount()
  })


program
  .version(package.version, '-v, --version')

// add some useful info on help
program.on('--help', () => {
  console.log();
  console.log(`  Run ${chalk.cyan(`tiny <command> --help`)} for detailed usage of given command.`);
  console.log();
});

program.commands.forEach(c => c.on('--help', () => console.log()));

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}