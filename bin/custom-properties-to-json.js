#!/usr/bin/env node
const { main } = require('./../src/index');
const giveMeArgument = arg => {
  return process.argv
    .find(argFiltered => argFiltered.includes(arg))
    .split('=')[1];
};
const inputArgument = giveMeArgument('input');
const outputArgument = giveMeArgument('output');

main(inputArgument, outputArgument);
