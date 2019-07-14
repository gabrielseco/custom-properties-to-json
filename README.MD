# custom-properties-to-json

[![NPM Version](https://img.shields.io/npm/v/@rogal/custom-properties-to-json.svg)](https://www.npmjs.com/package/@rogal/custom-properties-to-json) [![NPM Downloads](https://img.shields.io/npm/dm/@rogal/custom-properties-to-json.svg)](https://www.npmjs.com/package/@rogal/custom-properties-to-json)[![Travis](https://travis-ci.org/gabrielseco/custom-properties-to-json.svg?branch=master)](https://travis-ci.org/gabrielseco/custom-properties-to-json) [![Coverage Status](https://coveralls.io/repos/github/gabrielseco/custom-properties-to-json/badge.svg?branch=master)](https://coveralls.io/github/gabrielseco/custom-properties-to-json?branch=master)

> Package that parses a css file with a :root pseudoselector with custom properties to a json object

## Use Cases

- Theme modes so you can change your themes based in custom properties in the fly

## Installation

```sh
$ npm install @rogal/custom-properties-to-json --save-dev
```

## Use

You'll need to create a css file with a :root pseudoselector

```css
:root {
  --primary-bg-color: blue;
  --color: #ffffff;
}
```

After creating the file create a task or execute the command

```sh
custom-properties-to-json input=src/styles/base-theme.css output=src/styles/variables/base-theme.json
```

This will create a json with the next structure

```json
[
  {
    "property": "--primary-bg-color",
    "value": "blue"
  },
  {
    "property": "--color",
    "value": "#ffffff"
  }
]
```
