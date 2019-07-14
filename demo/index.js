const path = require('path');
const { main } = require('./../src');

main(
  path.resolve(__dirname, './theme.css'),
  path.resolve(__dirname, './theme.json')
);
