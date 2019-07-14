const fs = require('fs');
const {
  readCssFile,
  getCustomProperties,
  writeFileToJson,
  main
} = require('./../src/index');

describe('Custom properties to json', () => {
  it('should read the css file from the mocks folder', () => {
    const str = readCssFile('./mocks/index.css');
    expect(str).toBeDefined();
  });

  it('should throw an error if the file does not exist', () => {
    expect(() => readCssFile('./mocks/23332.css')).toThrow(
      'Cannot read the css file'
    );
  });

  it('should give a css with root and give us an array with properties and values', () => {
    const arr = getCustomProperties(`
      :root {
        --font-size: 16px;
        --bg-primary: #fff;
        --color-primary: red;
      }

      .hello {
        color: red;
      }
    `);

    expect(arr).toEqual([
      {
        property: '--font-size',
        value: '16px'
      },
      {
        property: '--bg-primary',
        value: '#fff'
      },
      {
        property: '--color-primary',
        value: 'red'
      }
    ]);
  });

  it('should write a file in disk', async () => {
    const destination = 'mocks/writing-json-in-disk.json';
    await writeFileToJson(destination, { value: 1 });
    expect(fs.existsSync(destination)).toBe(true);
  });

  it('should throw an error if the directory does not exist when writing', () => {
    const destination = 'mock/writing-json-in-disk.json';
    expect(() => writeFileToJson(destination, { value: 1 })).toThrow(
      'Cannot write the file'
    );
  });

  it('should do the integration', () => {
    main('./mocks/root.css', 'mocks/writing-json-in-disk-integration.json');
    try {
      const file = fs.readFileSync(
        'mocks/writing-json-in-disk-integration.json'
      );
      expect(file).toBeDefined();
    } catch (err) {
      console.log('err', err);
    }
  });
});
