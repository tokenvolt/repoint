'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity = exports.urlParamsTransformer = exports.missingParams = undefined;
exports.capitalize = capitalize;

var _constants = require('./constants');

var _ramda = require('../ramda/ramda.repoint');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

var missingParams = exports.missingParams = function missingParams(obj, attrs) {
  return attrs.filter(function (el) {
    return el !== _constants.IS_COLLECTION;
  }).filter(function (el) {
    return !_ramda2.default.contains(el, _ramda2.default.keys(obj));
  });
};

var removeFirstChar = function removeFirstChar(val) {
  return val.slice(1, val.length);
};

var urlParamsTransformer = exports.urlParamsTransformer = function urlParamsTransformer(url, params) {
  var pattern = /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/;
  return url.split('/').map(function (token) {
    return pattern.test(token) ? token.replace(pattern, params[removeFirstChar(token)]) : token;
  }).join('/');
};

var identity = exports.identity = function identity(val) {
  return val;
};