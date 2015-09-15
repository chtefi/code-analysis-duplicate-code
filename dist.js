/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _fs = __webpack_require__(1);

	var _fs2 = _interopRequireDefault(_fs);

	var _path = __webpack_require__(2);

	var _path2 = _interopRequireDefault(_path);

	var _acornJsxWalk = __webpack_require__(3);

	var _acornJsxWalk2 = _interopRequireDefault(_acornJsxWalk);

	var _textEllipsis = __webpack_require__(4);

	var _textEllipsis2 = _interopRequireDefault(_textEllipsis);

	var _oneLiner = __webpack_require__(5);

	var _oneLiner2 = _interopRequireDefault(_oneLiner);

	var _numberConverterAlphabet = __webpack_require__(6);

	var _numberConverterAlphabet2 = _interopRequireDefault(_numberConverterAlphabet);

	var _minimist = __webpack_require__(7);

	var _minimist2 = _interopRequireDefault(_minimist);

	var _srcLongestRepeatedStringJs = __webpack_require__(8);

	var _srcLongestRepeatedStringJs2 = _interopRequireDefault(_srcLongestRepeatedStringJs);

	var _srcGetAllFilesContentInOneStringJs = __webpack_require__(9);

	var _srcGetAllFilesContentInOneStringJs2 = _interopRequireDefault(_srcGetAllFilesContentInOneStringJs);

	var argv = (0, _minimist2['default'])(process.argv.slice(2));
	var folder = argv['_'][0];

	if (folder) {
	  try {
	    var stats = _fs2['default'].statSync(folder);
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
	var nextUniqueId = (0, _numberConverterAlphabet.generator)('0123456789abcdefghijklmnopqrstuvwyxzABCDEFGHIJKLMNOPQRSTUVWYXZ[]{}&$#~çù!:;,./-+*^');

	var indexes = [];
	var encodedString = '';

	// generate the mapping for all the possible walker (Declaration, ForStatement etc.)

	var _Object$keys$reduce = Object.keys(_acornJsxWalk.base).reduce(function (obj, walker) {
	  var id = nextUniqueId();
	  // ensure we still have one character only
	  if (id.length > 1) throw new Error('Too many tokens, increase the alphabet length.');

	  obj.mapping[walker] = id;
	  obj.reverseMapping[id] = walker;

	  // when this walker is going to be called
	  // append the node to the `indexes` array (to know at which position which
	  // token is) and append the id of this token to the string that will contain
	  // all the ids (it's basically the program itself with one letter only for
	  // every statement)
	  obj.walkOptions[walker] = function (node) {
	    indexes.push(node);
	    encodedString += obj.mapping[walker];
	  };

	  return obj;
	}, {
	  walkOptions: {},
	  mapping: {},
	  reverseMapping: {}
	});

	var walkOptions = _Object$keys$reduce.walkOptions;
	var mapping = _Object$keys$reduce.mapping;
	var reverseMapping = _Object$keys$reduce.reverseMapping;

	(0, _srcGetAllFilesContentInOneStringJs2['default'])(folder).then(function (str) {

	  // parse the string (containing every .js file contents)
	  // into one big AST
	  (0, _acornJsxWalk2['default'])(str, walkOptions);

	  // Find the longest repeated tokens sequence
	  var repeat = (0, _srcLongestRepeatedStringJs2['default'])(encodedString);

	  if (repeat.length === 0) {
	    console.log('no repeated code found, great!');
	    process.exit(0);
	  }

	  // Display the code corresponding to the longest repeated pattern
	  var lastMatchIndex = -1;
	  while ((lastMatchIndex = encodedString.indexOf(repeat, lastMatchIndex)) >= 0) {
	    var start = indexes[lastMatchIndex].start;
	    var end = indexes[lastMatchIndex + repeat.length - 1].end;

	    console.log('----------');
	    console.log((0, _textEllipsis2['default'])(str.substring(start, end)), 200);

	    lastMatchIndex += repeat.length;
	  }
	})['catch'](function (e) {
	  console.error(e.message);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("acorn-jsx-walk");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("text-ellipsis");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("one-liner");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("number-converter-alphabet");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("minimist");

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var Node = function Node() {
	  this.value = "";
	  this.leaves = [];
	  this.nodes = [];
	};

	Node.prototype.checkNodes = function (suf) {
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

	Node.prototype.checkLeaves = function (suf) {
	  var node, leaf;
	  for (var i = 0; i < this.leaves.length; i++) {
	    leaf = this.leaves[i];
	    if (leaf[0] == suf[0]) {
	      node = new Node();
	      node.value = leaf[0];
	      node.addSuffix(suf.slice(1));
	      node.addSuffix(leaf.slice(1));
	      this.nodes.push(node);
	      this.leaves.splice(i, 1);
	      return;
	    }
	  }
	  this.leaves.push(suf);
	};

	Node.prototype.addSuffix = function (suf) {
	  if (!suf.length) return;
	  if (!this.checkNodes(suf)) {
	    this.checkLeaves(suf);
	  }
	};

	Node.prototype.getLongestRepeatedSubString = function () {
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

	var SuffixTree = function SuffixTree(str) {
	  this.node = new Node();
	  for (var i = 0; i < str.length; i++) {
	    this.node.addSuffix(str.slice(i));
	  }
	};

	exports["default"] = function (str) {
	  var root = new SuffixTree(str).node;
	  return root.getLongestRepeatedSubString();
	};

	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = getAllFileContentInOneString;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _fs = __webpack_require__(1);

	var _fs2 = _interopRequireDefault(_fs);

	var _path = __webpack_require__(2);

	var _path2 = _interopRequireDefault(_path);

	var _globby = __webpack_require__(10);

	var _globby2 = _interopRequireDefault(_globby);

	var _async = __webpack_require__(11);

	var _async2 = _interopRequireDefault(_async);

	/**
	 * Read all the .js file in the current folder and return a string that contains
	 * all the content of all its files.
	 */

	function getAllFileContentInOneString(folder) {
	  return new Promise(function (resolve, reject) {
	    var jsGlob = ['**/*.js', '!node_modules/**'];
	    var options = {};

	    (0, _globby2['default'])(jsGlob, { cwd: folder }).then(function (paths) {
	      // paths = [ 'a.js' ]
	      // but we want the full path in front of it, we can be outside of '.'
	      paths = paths.map(function (p) {
	        return _path2['default'].resolve(folder, p);
	      });
	      console.log(paths.join('\n'));

	      _async2['default'].map(paths, _fs2['default'].readFile, function (err, results) {
	        if (err) {
	          reject(err);
	        } else {
	          var bigString = results.join('\n');
	          resolve(bigString);
	        }
	      });
	    });
	  });
	}

	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("globby");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("async");

/***/ }
/******/ ]);