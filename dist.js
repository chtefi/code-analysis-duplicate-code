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

	"use strict";

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _fs = __webpack_require__(1);

	var _fs2 = _interopRequireDefault(_fs);

	var _minimist = __webpack_require__(2);

	var _minimist2 = _interopRequireDefault(_minimist);

	var _acornJsx = __webpack_require__(3);

	var _node_modulesAcornJsxNode_modulesAcornSrcWalkIndexJs = __webpack_require__(4);

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

	Node.prototype.toHTML = function () {
	  var html = "<div class=node>";
	  if (this.value.length) {
	    html += "<h3>" + this.value + "</h3>";
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

	var SuffixTree = function SuffixTree(str) {
	  this.node = new Node();
	  for (var i = 0; i < str.length; i++) {
	    this.node.addSuffix(str.slice(i));
	  }
	};

	var argv = (0, _minimist2["default"])(process.argv.slice(2));
	var file = argv['_'][0];

	if (!file) {
	  console.error("Please pass a js file to parse");
	  process.exit(-1);
	}

	// Read physical file
	var source = _fs2["default"].readFileSync(file);
	var ast = (0, _acornJsx.parse)(source, {
	  ecmaVersion: 6,
	  sourceType: 'module',
	  plugins: { jsx: true }
	});

	var result = '';
	var mapping = {};
	var indexes = [];
	var reverseMapping = {};

	var letterCounter = function letterCounter() {
	  var c = '0';
	  return function () {
	    return c = String.fromCharCode(c.charCodeAt(0) + 1);
	  };
	};

	var myCounter = letterCounter();

	var walk = function walk(node, visitors, base2, state, override) {
	  if (!base2) base2 = _node_modulesAcornJsxNode_modulesAcornSrcWalkIndexJs.base;(function c(node, st, override) {
	    var type = override || node.type,
	        found = visitors[type];
	    if (!mapping[type]) {
	      var counter = myCounter();
	      reverseMapping[counter] = type;
	      mapping[type] = counter;
	    }
	    indexes.push(node);
	    result += mapping[type];
	    base2[type](node, st, c);
	    if (found) found(node, st);
	  })(node, state, override);
	};

	//
	// Extends acorn walk with JSX elements
	//

	_node_modulesAcornJsxNode_modulesAcornSrcWalkIndexJs.base.JSXElement = function (node, st, c) {
	  //console.log('open', node.openingElement.name);
	  node.children.forEach(function (node) {
	    c(node, st);
	  });
	  //console.log('close', node.closingElement.name);
	};

	_node_modulesAcornJsxNode_modulesAcornSrcWalkIndexJs.base.JSXExpressionContainer = function (node, st, c) {
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
	var repeat = new SuffixTree(result).node.getLongestRepeatedSubString();
	var index = result.indexOf(repeat);
	console.log(result);
	console.log(reverseMapping);
	console.log(repeat);
	console.log(index);
	console.log(indexes[index]);

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("minimist");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("acorn-jsx");

/***/ },
/* 4 */
/***/ function(module, exports) {

	// AST walker module for Mozilla Parser API compatible trees

	// A simple walk is one where you simply specify callbacks to be
	// called on specific nodes. The last two arguments are optional. A
	// simple use would be
	//
	//     walk.simple(myTree, {
	//         Expression: function(node) { ... }
	//     });
	//
	// to do something with all expressions. All Parser API node types
	// can be used to identify node types, as well as Expression,
	// Statement, and ScopeBody, which denote categories of nodes.
	//
	// The base argument can be used to pass a custom (recursive)
	// walker, and state can be used to give this walked an initial
	// state.

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.simple = simple;
	exports.ancestor = ancestor;
	exports.recursive = recursive;
	exports.findNodeAt = findNodeAt;
	exports.findNodeAround = findNodeAround;
	exports.findNodeAfter = findNodeAfter;
	exports.findNodeBefore = findNodeBefore;
	exports.make = make;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function simple(node, visitors, base, state, override) {
	  if (!base) base = exports.base;(function c(node, st, override) {
	    var type = override || node.type,
	        found = visitors[type];
	    //console.log(type);
	    base[type](node, st, c);
	    if (found) found(node, st);
	  })(node, state, override);
	}

	// An ancestor walk builds up an array of ancestor nodes (including
	// the current node) and passes them to the callback as the state parameter.

	function ancestor(node, visitors, base, state) {
	  if (!base) base = exports.base;
	  if (!state) state = [];(function c(node, st, override) {
	    var type = override || node.type,
	        found = visitors[type];
	    if (node != st[st.length - 1]) {
	      st = st.slice();
	      st.push(node);
	    }
	    base[type](node, st, c);
	    if (found) found(node, st);
	  })(node, state);
	}

	// A recursive walk is one where your functions override the default
	// walkers. They can modify and replace the state parameter that's
	// threaded through the walk, and can opt how and whether to walk
	// their child nodes (by calling their third argument on these
	// nodes).

	function recursive(node, state, funcs, base, override) {
	  var visitor = funcs ? exports.make(funcs, base) : base;(function c(node, st, override) {
	    visitor[override || node.type](node, st, c);
	  })(node, state, override);
	}

	function makeTest(test) {
	  if (typeof test == "string") return function (type) {
	    return type == test;
	  };else if (!test) return function () {
	    return true;
	  };else return test;
	}

	var Found = function Found(node, state) {
	  _classCallCheck(this, Found);

	  this.node = node;this.state = state;
	}

	// Find a node with a given start, end, and type (all are optional,
	// null can be used as wildcard). Returns a {node, state} object, or
	// undefined when it doesn't find a matching node.
	;

	function findNodeAt(node, start, end, test, base, state) {
	  test = makeTest(test);
	  if (!base) base = exports.base;
	  try {
	    ;(function c(node, st, override) {
	      var type = override || node.type;
	      if ((start == null || node.start <= start) && (end == null || node.end >= end)) base[type](node, st, c);
	      if ((start == null || node.start == start) && (end == null || node.end == end) && test(type, node)) throw new Found(node, st);
	    })(node, state);
	  } catch (e) {
	    if (e instanceof Found) return e;
	    throw e;
	  }
	}

	// Find the innermost node of a given type that contains the given
	// position. Interface similar to findNodeAt.

	function findNodeAround(node, pos, test, base, state) {
	  test = makeTest(test);
	  if (!base) base = exports.base;
	  try {
	    ;(function c(node, st, override) {
	      var type = override || node.type;
	      if (node.start > pos || node.end < pos) return;
	      base[type](node, st, c);
	      if (test(type, node)) throw new Found(node, st);
	    })(node, state);
	  } catch (e) {
	    if (e instanceof Found) return e;
	    throw e;
	  }
	}

	// Find the outermost matching node after a given position.

	function findNodeAfter(node, pos, test, base, state) {
	  test = makeTest(test);
	  if (!base) base = exports.base;
	  try {
	    ;(function c(node, st, override) {
	      if (node.end < pos) return;
	      var type = override || node.type;
	      if (node.start >= pos && test(type, node)) throw new Found(node, st);
	      base[type](node, st, c);
	    })(node, state);
	  } catch (e) {
	    if (e instanceof Found) return e;
	    throw e;
	  }
	}

	// Find the outermost matching node before a given position.

	function findNodeBefore(node, pos, test, base, state) {
	  test = makeTest(test);
	  if (!base) base = exports.base;
	  var max = undefined;(function c(node, st, override) {
	    if (node.start > pos) return;
	    var type = override || node.type;
	    if (node.end <= pos && (!max || max.node.end < node.end) && test(type, node)) max = new Found(node, st);
	    base[type](node, st, c);
	  })(node, state);
	  return max;
	}

	// Used to create a custom walker. Will fill in all missing node
	// type properties with the defaults.

	function make(funcs, base) {
	  if (!base) base = exports.base;
	  var visitor = {};
	  for (var type in base) visitor[type] = base[type];
	  for (var type in funcs) visitor[type] = funcs[type];
	  return visitor;
	}

	function skipThrough(node, st, c) {
	  c(node, st);
	}
	function ignore(_node, _st, _c) {}

	// Node walkers.

	var base = {};

	exports.base = base;
	base.Program = base.BlockStatement = function (node, st, c) {
	  for (var i = 0; i < node.body.length; ++i) {
	    c(node.body[i], st, "Statement");
	  }
	};
	base.Statement = skipThrough;
	base.EmptyStatement = ignore;
	base.ExpressionStatement = base.ParenthesizedExpression = function (node, st, c) {
	  return c(node.expression, st, "Expression");
	};
	base.IfStatement = function (node, st, c) {
	  c(node.test, st, "Expression");
	  c(node.consequent, st, "Statement");
	  if (node.alternate) c(node.alternate, st, "Statement");
	};
	base.LabeledStatement = function (node, st, c) {
	  return c(node.body, st, "Statement");
	};
	base.BreakStatement = base.ContinueStatement = ignore;
	base.WithStatement = function (node, st, c) {
	  c(node.object, st, "Expression");
	  c(node.body, st, "Statement");
	};
	base.SwitchStatement = function (node, st, c) {
	  c(node.discriminant, st, "Expression");
	  for (var i = 0; i < node.cases.length; ++i) {
	    var cs = node.cases[i];
	    if (cs.test) c(cs.test, st, "Expression");
	    for (var j = 0; j < cs.consequent.length; ++j) {
	      c(cs.consequent[j], st, "Statement");
	    }
	  }
	};
	base.ReturnStatement = base.YieldExpression = function (node, st, c) {
	  if (node.argument) c(node.argument, st, "Expression");
	};
	base.ThrowStatement = base.SpreadElement = function (node, st, c) {
	  return c(node.argument, st, "Expression");
	};
	base.TryStatement = function (node, st, c) {
	  c(node.block, st, "Statement");
	  if (node.handler) {
	    c(node.handler.param, st, "Pattern");
	    c(node.handler.body, st, "ScopeBody");
	  }
	  if (node.finalizer) c(node.finalizer, st, "Statement");
	};
	base.WhileStatement = base.DoWhileStatement = function (node, st, c) {
	  c(node.test, st, "Expression");
	  c(node.body, st, "Statement");
	};
	base.ForStatement = function (node, st, c) {
	  if (node.init) c(node.init, st, "ForInit");
	  if (node.test) c(node.test, st, "Expression");
	  if (node.update) c(node.update, st, "Expression");
	  c(node.body, st, "Statement");
	};
	base.ForInStatement = base.ForOfStatement = function (node, st, c) {
	  c(node.left, st, "ForInit");
	  c(node.right, st, "Expression");
	  c(node.body, st, "Statement");
	};
	base.ForInit = function (node, st, c) {
	  if (node.type == "VariableDeclaration") c(node, st);else c(node, st, "Expression");
	};
	base.DebuggerStatement = ignore;

	base.FunctionDeclaration = function (node, st, c) {
	  return c(node, st, "Function");
	};
	base.VariableDeclaration = function (node, st, c) {
	  for (var i = 0; i < node.declarations.length; ++i) {
	    c(node.declarations[i], st);
	  }
	};
	base.VariableDeclarator = function (node, st, c) {
	  c(node.id, st, "Pattern");
	  if (node.init) c(node.init, st, "Expression");
	};

	base.Function = function (node, st, c) {
	  if (node.id) c(node.id, st, "Pattern");
	  for (var i = 0; i < node.params.length; i++) {
	    c(node.params[i], st, "Pattern");
	  }c(node.body, st, node.expression ? "ScopeExpression" : "ScopeBody");
	};
	// FIXME drop these node types in next major version
	// (They are awkward, and in ES6 every block can be a scope.)
	base.ScopeBody = function (node, st, c) {
	  return c(node, st, "Statement");
	};
	base.ScopeExpression = function (node, st, c) {
	  return c(node, st, "Expression");
	};

	base.Pattern = function (node, st, c) {
	  if (node.type == "Identifier") c(node, st, "VariablePattern");else if (node.type == "MemberExpression") c(node, st, "MemberPattern");else c(node, st);
	};
	base.VariablePattern = ignore;
	base.MemberPattern = skipThrough;
	base.RestElement = function (node, st, c) {
	  return c(node.argument, st, "Pattern");
	};
	base.ArrayPattern = function (node, st, c) {
	  for (var i = 0; i < node.elements.length; ++i) {
	    var elt = node.elements[i];
	    if (elt) c(elt, st, "Pattern");
	  }
	};
	base.ObjectPattern = function (node, st, c) {
	  for (var i = 0; i < node.properties.length; ++i) {
	    c(node.properties[i].value, st, "Pattern");
	  }
	};

	base.Expression = skipThrough;
	base.ThisExpression = base.Super = base.MetaProperty = ignore;
	base.ArrayExpression = function (node, st, c) {
	  for (var i = 0; i < node.elements.length; ++i) {
	    var elt = node.elements[i];
	    if (elt) c(elt, st, "Expression");
	  }
	};
	base.ObjectExpression = function (node, st, c) {
	  for (var i = 0; i < node.properties.length; ++i) {
	    c(node.properties[i], st);
	  }
	};
	base.FunctionExpression = base.ArrowFunctionExpression = base.FunctionDeclaration;
	base.SequenceExpression = base.TemplateLiteral = function (node, st, c) {
	  for (var i = 0; i < node.expressions.length; ++i) {
	    c(node.expressions[i], st, "Expression");
	  }
	};
	base.UnaryExpression = base.UpdateExpression = function (node, st, c) {
	  c(node.argument, st, "Expression");
	};
	base.BinaryExpression = base.LogicalExpression = function (node, st, c) {
	  c(node.left, st, "Expression");
	  c(node.right, st, "Expression");
	};
	base.AssignmentExpression = base.AssignmentPattern = function (node, st, c) {
	  c(node.left, st, "Pattern");
	  c(node.right, st, "Expression");
	};
	base.ConditionalExpression = function (node, st, c) {
	  c(node.test, st, "Expression");
	  c(node.consequent, st, "Expression");
	  c(node.alternate, st, "Expression");
	};
	base.NewExpression = base.CallExpression = function (node, st, c) {
	  c(node.callee, st, "Expression");
	  if (node.arguments) for (var i = 0; i < node.arguments.length; ++i) {
	    c(node.arguments[i], st, "Expression");
	  }
	};
	base.MemberExpression = function (node, st, c) {
	  c(node.object, st, "Expression");
	  if (node.computed) c(node.property, st, "Expression");
	};
	base.ExportNamedDeclaration = base.ExportDefaultDeclaration = function (node, st, c) {
	  if (node.declaration) c(node.declaration, st);
	  if (node.source) c(node.source, st, "Expression");
	};
	base.ExportAllDeclaration = function (node, st, c) {
	  c(node.source, st, "Expression");
	};
	base.ImportDeclaration = function (node, st, c) {
	  for (var i = 0; i < node.specifiers.length; i++) {
	    c(node.specifiers[i], st);
	  }c(node.source, st, "Expression");
	};
	base.ImportSpecifier = base.ImportDefaultSpecifier = base.ImportNamespaceSpecifier = base.Identifier = base.Literal = ignore;

	base.TaggedTemplateExpression = function (node, st, c) {
	  c(node.tag, st, "Expression");
	  c(node.quasi, st);
	};
	base.ClassDeclaration = base.ClassExpression = function (node, st, c) {
	  return c(node, st, "Class");
	};
	base.Class = function (node, st, c) {
	  if (node.id) c(node.id, st, "Pattern");
	  if (node.superClass) c(node.superClass, st, "Expression");
	  for (var i = 0; i < node.body.body.length; i++) {
	    c(node.body.body[i], st);
	  }
	};
	base.MethodDefinition = base.Property = function (node, st, c) {
	  if (node.computed) c(node.key, st, "Expression");
	  c(node.value, st, "Expression");
	};
	base.ComprehensionExpression = function (node, st, c) {
	  for (var i = 0; i < node.blocks.length; i++) {
	    c(node.blocks[i].right, st, "Expression");
	  }c(node.body, st, "Expression");
	};

/***/ }
/******/ ]);