const fs = require('fs');
const path = require('path');
const csstree = require('css-tree');

function readCssFile(fileDestination) {
  try {
    const cssFile = fs.readFileSync(
      path.resolve(process.cwd(), fileDestination),
      'utf8'
    );
    return cssFile;
  } catch (err) {
    throw new Error('Cannot read the css file');
  }
}

function getCustomProperties(cssFile) {
  const AST = csstree.parse(cssFile);

  const DECLARATIONS = [];
  const VALUES = [];

  csstree.walk(AST, function(node) {
    if (node.type === 'PseudoClassSelector' && node.name === 'root') {
      csstree.walk(this.rule.block, function(subNode) {
        if (subNode.type === 'Declaration') {
          DECLARATIONS.push({ property: subNode.property });
        }
        if (subNode.type === 'Raw') {
          VALUES.push({ value: subNode.value.trim() });
        }
      });
    }
  });

  const ROOT_PROPERTIES = DECLARATIONS.map((declaration, index) => {
    return {
      property: declaration.property,
      value: VALUES[index].value
    };
  });

  return ROOT_PROPERTIES;
}

function writeFileToJson(destination, obj) {
  try {
    fs.writeFileSync(
      path.resolve(process.cwd(), destination),
      JSON.stringify(obj, null, 2)
    );
  } catch (err) {
    throw new Error('Cannot write the file');
  }
}

function main(inputDirectory, outputDirectory) {
  const cssFile = readCssFile(inputDirectory);
  const ROOT_PROPERTIES = getCustomProperties(cssFile);

  writeFileToJson(outputDirectory, ROOT_PROPERTIES);
}

module.exports = {
  main,
  readCssFile,
  getCustomProperties,
  writeFileToJson
};
