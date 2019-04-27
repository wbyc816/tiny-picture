#!/usr/bin/env node
const program = require('commander')
const start=require('../lib/start')
const tinify = require('../lib/tinify')


start()

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