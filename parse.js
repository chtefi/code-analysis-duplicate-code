/* jshint esnext: true */



var Node = function(){
  this.value = "";
  this.leaves = [];
  this.nodes = [];
};

Node.prototype.checkNodes = function(suf) {
  var node;
  for (var i = 0; i < this.nodes.length; i++) {
    node = this.nodes[i];
    if (node.value == suf[0]) {
      node.addSuffix(suf.slice(1));
      return true;
    }
  }
  return false;
};

Node.prototype.checkLeaves = function(suf) {
  var node, leaf;
  for (var i = 0; i < this.leaves.length; i++) {
    leaf = this.leaves[i];
    if (leaf[0] == suf[0]) {
      node = new Node();
      node.value = leaf[0];
      node.addSuffix(suf.slice(1));
      node.addSuffix(leaf.slice(1));
      this.nodes.push(node);
      this.leaves.splice(i,1);
      return;
    }
  }
  this.leaves.push(suf);
};

Node.prototype.addSuffix = function(suf) {
  if (!suf.length) return;
  if (!this.checkNodes(suf)) {
    this.checkLeaves(suf);
  }
};

Node.prototype.getLongestRepeatedSubString = function() {
  var str = "";
  var temp = "";
  for (var i = 0; i < this.nodes.length; i++) {
    temp = this.nodes[i].getLongestRepeatedSubString();
    if (temp.length > str.length) {
      str = temp;
    }
  }
  return this.value + str;
};

Node.prototype.toHTML = function() {
  var html = "<div class=node>";
  if (this.value.length) {
    html += "<h3>"+this.value+"</h3>";
  }
  if (this.nodes.length) {
    html += "<h4>nodes</h4><ul>";
    for (var i = 0; i < this.nodes.length; i++) {
      html += "<li>" + this.nodes[i].toHTML() + "</li>";
    }
    html += "</ul>";
  }
  if (this.leaves.length) {
    html += "<h4>leaves</h4><ul>";
    for (var i = 0; i < this.leaves.length; i++) {
      html += "<li>" + this.leaves[i] + "</li>";
    }
    html += "</ul>";
  }
  return html;
};

var SuffixTree = function(str) {
  this.node = new Node();
  for (var i = 0; i < str.length; i++) {
    this.node.addSuffix(str.slice(i));
  }
}



import fs from 'fs';
import minimist from 'minimist';
import { parse } from 'acorn-jsx';
import { base } from './node_modules/acorn-jsx/node_modules/acorn/src/walk/index.js';

const argv = minimist(process.argv.slice(2));
const file = argv['_'][0];

if (!file) {
  console.error(`Please pass a js file to parse`);
  process.exit(-1);
}

// Read physical file
const source = fs.readFileSync(file).toString();
const ast = parse(source, {
  ecmaVersion: 6,
  sourceType: 'module',
  plugins: { jsx: true }
});

let result = '';
const mapping = {};
const indexes = [];
const reverseMapping = {};

const letterCounter = () => {
  let c = '0';
  return () => c = String.fromCharCode(c.charCodeAt(0) + 1);
}

const myCounter = letterCounter();

const walk = (node, visitors, base2, state, override) => {
  if (!base2) base2 = base
  ;(function c(node, st, override) {
    let type = override || node.type, found = visitors[type]
    if (!mapping[type]) {
      const counter = myCounter();
      reverseMapping[counter] = type;
      mapping[type] = counter;
    }
    indexes.push(node);
    result += mapping[type];
    base2[type](node, st, c)
    if (found) found(node, st)
  })(node, state, override)
}

//
// Extends acorn walk with JSX elements
//

base.JSXElement = (node, st, c) => {
  //console.log('open', node.openingElement.name);
  node.children.forEach(function(node) {
    c(node, st);
  });
  //console.log('close', node.closingElement.name);
};

base.JSXExpressionContainer = (node, st, c) => {
    c(node.expression, st);
};

//
// Walk!
// 

walk(ast, {
  // VariableDeclaration: function(d) {
  //   console.log('var', d);
  // },
  // FunctionDeclaration: function(d) {
  //   console.log('fn', d);
  // }
});

//const repeat = maxRepeat(result);
const root = new SuffixTree(result).node;
const repeat = root.getLongestRepeatedSubString();

const highlightPattern = (str, pattern) => {
  let onlyRepeatedStr = '';
  let lastMatchIndex = 0;
  const spaces = (n) => new Array(n).fill(' ').join('');

  while (true) {
    lastMatchIndex = result.indexOf(pattern, lastMatchIndex);
    if (lastMatchIndex < 0) {
      break;
    }
    onlyRepeatedStr += spaces(lastMatchIndex) + pattern;
    lastMatchIndex += pattern.length;
  }

  console.log(str);
  console.log(onlyRepeatedStr);
};

highlightPattern(result, repeat);


let shift = 0;

while (true) {
  var index = result.indexOf(repeat);
  if (index < 0) {
    break;
  }
  
  result = result.substring(index + repeat.length);
  const start = indexes[shift+index].start;
  const end = indexes[shift+index+repeat.length - 1].end;
   
  console.log(start, end);
  console.log(source.substring(start, end));
  shift += index + repeat.length;
}
