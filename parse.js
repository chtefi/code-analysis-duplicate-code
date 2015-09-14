import fs from 'fs';
import path from 'path';
import globby from 'globby';
import minimist from 'minimist';
import async from 'async';
import highlight from 'highlight-string-pattern';
import walk, { base } from 'acorn-jsx-walk';
import ellipsis from 'text-ellipsis';
import oneliner from 'one-liner';

import getLongestRepeatedSubstring from './src/longestRepeatedString.js';

const argv = minimist(process.argv.slice(2));
const file = argv['_'][0];

if (!file) {
  console.error(`Please pass a js file to parse`);
  process.exit(-1);
}

const letterCounter = () => {
  let c = '0';
  return () => c = String.fromCharCode(c.charCodeAt(0) + 1);
}

const incCounter = letterCounter();

let indexes = [], encodedString = '';

const { walkOptions, mapping, reverseMapping } =
  Object.keys(base).reduce((obj, walker) => {
    const counter = incCounter();
    obj.mapping[walker] = counter;
    obj.reverseMapping[counter] = walker;

    obj.walkOptions[walker] = (node) => {
      indexes.push(node);
      encodedString += obj.mapping[walker];
    }

    return obj;
  }, {
    walkOptions: {},
    mapping: {},
    reverseMapping: {}
  });

//
// Walk!
//

const createTasksToReadFiles = (files) => files.map(fileName => callback => fs.readFile(fileName, callback));
 
const folderPath = '.';
const jsGlob = [ '**/*.js', '!node_modules/**',  ];
const options = {};
globby(jsGlob).then(paths => {
  async.parallel(createTasksToReadFiles(paths), (err, results) => {
    const bigString = results.join('\n');
    parseContents(bigString);
  });
});

const parseContents = (str) => {

  walk(str, walkOptions) 
    
  // Find the longest repeated substring

  const repeat = getLongestRepeatedSubstring(encodedString);

  console.log(encodedString);
  console.log(highlight(encodedString, repeat));

  // Let's do it

  let lastMatchIndex = -1;
  while ((lastMatchIndex = encodedString.indexOf(repeat, lastMatchIndex)) >= 0) {
    const start = indexes[lastMatchIndex].start;
    const end = indexes[lastMatchIndex + repeat.length - 1].end;
     
    console.log(ellipsis(oneliner(str.substring(start, end)), 100));

    lastMatchIndex += repeat.length;
  }

}
