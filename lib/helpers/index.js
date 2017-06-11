'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectToFormData = exports.identity = exports.urlParamsTransformer = exports.missingParams = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var objectToFormData = exports.objectToFormData = function objectToFormData(obj, form, namespace) {
  var fd = form || new FormData();
  var formKey = void 0;

  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if (_typeof(obj[property]) === 'object' && !(obj[property] instanceof File)) {
        objectToFormData(obj[property], fd, property);
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
};