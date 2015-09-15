import fs from 'fs';
import path from 'path';
import createAST, { base } from 'acorn-jsx-walk';
import ellipsis from 'text-ellipsis';
import oneliner from 'one-liner';
import convert, { generator } from 'number-converter-alphabet';
import minimist from 'minimist';

import getLongestRepeatedSubstring from './src/longestRepeatedString.js';
import getAllFilesContentInOneString from './src/getAllFilesContentInOneString.js';

const argv = minimist(process.argv.slice(2));
let folder = argv['_'][0];

if (folder) {
  try {
    const stats = fs.statSync(folder);
    if (!stats.isDirectory()) {
      console.error(folder, 'is not a directory');
      process.exit(1);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
} else {
  folder = '.'; // current folder, no need to check anything
}


// we are going to encode all tokens to one letter
const nextUniqueId = generator('0123456789abcdefghijklmnopqrstuvwyxzABCDEFGHIJKLMNOPQRSTUVWYXZ[]{}&$#~çù!:;,./-+*^');

let indexes = [];
let encodedString = '';

// generate the mapping for all the possible walker (Declaration, ForStatement etc.)
const { walkOptions, mapping, reverseMapping } =
  Object.keys(base).reduce((obj, walker) => {
    const id = nextUniqueId();
    // ensure we still have one character only
    if (id.length > 1) throw new Error('Too many tokens, increase the alphabet length.');

    obj.mapping[walker] = id;
    obj.reverseMapping[id] = walker;

    // when this walker is going to be called
    // append the node to the `indexes` array (to know at which position which
    // token is) and append the id of this token to the string that will contain
    // all the ids (it's basically the program itself with one letter only for
    // every statement)
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


getAllFilesContentInOneString(folder).then(str => {

  // parse the string (containing every .js file contents)
  // into one big AST
  createAST(str, walkOptions) 
    
  // Find the longest repeated tokens sequence
  const repeat = getLongestRepeatedSubstring(encodedString);

  if (repeat.length === 0) {
    console.log('no repeated code found, great!');
    process.exit(0);
  }

  // Display the code corresponding to the longest repeated pattern
  let lastMatchIndex = -1;
  while ((lastMatchIndex = encodedString.indexOf(repeat, lastMatchIndex)) >= 0) {
    const start = indexes[lastMatchIndex].start;
    const end = indexes[lastMatchIndex + repeat.length - 1].end;
     
    console.log('----------');
    console.log(ellipsis(str.substring(start, end)), 200);

    lastMatchIndex += repeat.length;
  }

}).catch(e => {
  console.error(e.message);
});
