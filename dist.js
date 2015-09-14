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

	var _globby = __webpack_require__(3);

	var _globby2 = _interopRequireDefault(_globby);

	var _minimist = __webpack_require__(4);

	var _minimist2 = _interopRequireDefault(_minimist);

	var _async = __webpack_require__(5);

	var _async2 = _interopRequireDefault(_async);

	var _highlightStringPattern = __webpack_require__(6);

	var _highlightStringPattern2 = _interopRequireDefault(_highlightStringPattern);

	var _acornJsxWalk = __webpack_require__(7);

	var _acornJsxWalk2 = _interopRequireDefault(_acornJsxWalk);

	var _textEllipsis = __webpack_require__(8);

	var _textEllipsis2 = _interopRequireDefault(_textEllipsis);

	var _oneLiner = __webpack_require__(9);

	var _oneLiner2 = _interopRequireDefault(_oneLiner);

	var _srcLongestRepeatedStringJs = __webpack_require__(10);

	var _srcLongestRepeatedStringJs2 = _interopRequireDefault(_srcLongestRepeatedStringJs);

	var argv = (0, _minimist2['default'])(process.argv.slice(2));
	var file = argv['_'][0];

	if (!file) {
	  console.error('Please pass a js file to parse');
	  process.exit(-1);
	}

	var letterCounter = function letterCounter() {
	  var c = '0';
	  return function () {
	    return c = String.fromCharCode(c.charCodeAt(0) + 1);
	  };
	};

	var incCounter = letterCounter();

	var indexes = [],
	    encodedString = '';

	var _Object$keys$reduce = Object.keys(_acornJsxWalk.base).reduce(function (obj, walker) {
	  var counter = incCounter();
	  obj.mapping[walker] = counter;
	  obj.reverseMapping[counter] = walker;

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

	//
	// Walk!
	//

	var createTasksToReadFiles = function createTasksToReadFiles(files) {
	  return files.map(function (fileName) {
	    return function (callback) {
	      return _fs2['default'].readFile(fileName, callback);
	    };
	  });
	};

	var folderPath = '.';
	var jsGlob = ['**/*.js', '!node_modules/**'];
	var options = {};
	(0, _globby2['default'])(jsGlob).then(function (paths) {
	  _async2['default'].parallel(createTasksToReadFiles(paths), function (err, results) {
	    var bigString = results.join('\n');
	    parseContents(bigString);
	  });
	});

	var parseContents = function parseContents(str) {

	  (0, _acornJsxWalk2['default'])(str, walkOptions);

	  // Find the longest repeated substring

	  var repeat = (0, _srcLongestRepeatedStringJs2['default'])(encodedString);

	  console.log(encodedString);
	  console.log((0, _highlightStringPattern2['default'])(encodedString, repeat));

	  // Let's do it

	  var lastMatchIndex = -1;
	  while ((lastMatchIndex = encodedString.indexOf(repeat, lastMatchIndex)) >= 0) {
	    var start = indexes[lastMatchIndex].start;
	    var end = indexes[lastMatchIndex + repeat.length - 1].end;

	    console.log((0, _textEllipsis2['default'])((0, _oneLiner2['default'])(str.substring(start, end)), 100));

	    lastMatchIndex += repeat.length;
	  }
	};

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

	module.exports = require("globby");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("minimist");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("async");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("highlight-string-pattern");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("acorn-jsx-walk");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("text-ellipsis");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("one-liner");

/***/ },
/* 10 */
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

/***/ }
/******/ ]);