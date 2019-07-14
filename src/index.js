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
  const AST = csstree.parse(cssFile, { parseCustomProperty: true });

  const DECLARATIONS = [];
  const VALUES = [];

  csstree.walk(AST, function(node) {
    if (node.type === 'PseudoClassSelector' && node.name === 'root') {
      csstree.walk(this.rule.block, function(node) {
        if (node.type === 'Declaration') {
          DECLARATIONS.push({ property: node.property });
        }

        if (node.type === 'Dimension') {
          VALUES.push({ value: node.value + node.unit });
        }

        if (node.type === 'Identifier') {
          VALUES.push({ value: node.name });
        }

        if (node.type === 'Number') {
          VALUES.push({ value: node.value });
        }

        if (node.type === 'Percentage') {
          VALUES.push({ value: node.value + '%' });
        }

        if (
          node.type === 'HexColor' &&
          node.value !== undefined &&
          typeof node.value !== 'object'
        ) {
          VALUES.push({ value: '#' + node.value });
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

function findPropertyInArray(arr, property) {
  let item;

  for (let index = 0; index < arr.length; index++) {
    if (arr[index].property === property.value) {
      item = arr[index];
      break;
    }
  }

  if (item === undefined) {
    return undefined;
  }

  return { ...property, value: item.value };
}

function resolveCustomProperties(properties) {
  const newProperties = properties.map(property => {
    const pattern = new RegExp(/^--/);
    return pattern.test(property.value)
      ? findPropertyInArray(properties, property)
      : property;
  });
  return newProperties;
}

function main(inputDirectory, outputDirectory) {
  const cssFile = readCssFile(inputDirectory);
  const ROOT_PROPERTIES = resolveCustomProperties(getCustomProperties(cssFile));

  writeFileToJson(outputDirectory, ROOT_PROPERTIES);
}

module.exports = {
  main,
  readCssFile,
  getCustomProperties,
  writeFileToJson,
  resolveCustomProperties,
  findPropertyInArray
};
