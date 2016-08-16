'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _ramda = require('./ramda/ramda.repoint');

var _ramda2 = _interopRequireDefault(_ramda);

var _jqueryParam = require('jquery-param');

var _jqueryParam2 = _interopRequireDefault(_jqueryParam);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _helpers = require('./helpers');

var _constants = require('./helpers/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// :: (String) -> (k: v) -> String -> [String] -> (k: v) -> (a -> b)
var modifyWith = function modifyWith(methodName) {
  return _ramda2.default.curry(function (config, url, idAttributes, params) {
    var headers = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
    var type = arguments.length <= 5 || arguments[5] === undefined ? 'json' : arguments[5];

    var idAttributeObject = _ramda2.default.pick(idAttributes, params);
    var missingIdAttibutes = (0, _helpers.missingParams)(idAttributeObject, idAttributes);
    var lastIdAttribute = idAttributes[0];
    var bodyParams = void 0;
    var buildedUrl = void 0;
    var data = void 0;

    if (missingIdAttibutes.length !== 0) {
      throw new Error('You must provide "' + missingIdAttibutes + '" in params');
    }

    if (idAttributes.length === 1 && lastIdAttribute === _constants.IS_COLLECTION) {
      bodyParams = params;
      buildedUrl = url;
    }

    if (idAttributes.length > 1 || lastIdAttribute !== _constants.IS_COLLECTION) {
      bodyParams = _ramda2.default.omit(idAttributes, params);
      buildedUrl = (0, _helpers.urlParamsTransformer)(url, idAttributeObject);
    }

    if (type === 'form') {
      data = (0, _helpers.objectToFormData)(config.paramsTransform(bodyParams));
    } else {
      data = JSON.stringify(config.paramsTransform(bodyParams));
    }

    return (0, _isomorphicFetch2.default)('' + config.host + buildedUrl, {
      method: methodName,
      body: data,
      headers: _ramda2.default.merge({
        'Content-Type': 'application/json'
      }, headers)
    }).then(config.beforeError).then(function (response) {
      return response.json();
    }).then(function (json) {
      return json;
    }).then(function (response) {
      return config.beforeSuccess(response);
    });
  });
};

var commonMethods = {
  // :: (k: v) -> String -> [String] -> (k: v) -> (k: v) -> (a -> b)
  get: _ramda2.default.curry(function (config, url, idAttributes, params) {
    var headers = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
    var type = arguments.length <= 5 || arguments[5] === undefined ? 'json' : arguments[5];

    var idAttributeObject = _ramda2.default.pick(idAttributes, params);
    var missingIdAttibutes = (0, _helpers.missingParams)(idAttributeObject, idAttributes);
    var lastIdAttribute = idAttributes[0];
    var queryParams = void 0;
    var buildedUrl = void 0;

    if (missingIdAttibutes.length !== 0) {
      throw new Error('You must provide "' + missingIdAttibutes + '" in params');
    }

    if (idAttributes.length === 1 && lastIdAttribute === _constants.IS_COLLECTION) {
      buildedUrl = url;
      queryParams = params;
    }

    if (idAttributes.length > 1 || lastIdAttribute !== _constants.IS_COLLECTION) {
      buildedUrl = (0, _helpers.urlParamsTransformer)(url, idAttributeObject);
      queryParams = _ramda2.default.omit(idAttributes, params);
    }

    var fullUrl = _ramda2.default.isEmpty(queryParams) ? '' + config.host + buildedUrl : '' + config.host + buildedUrl + '?' + (0, _jqueryParam2.default)(config.paramsTransform(queryParams));

    return (0, _isomorphicFetch2.default)(fullUrl, {
      headers: _ramda2.default.merge({
        'Content-Type': 'application/json'
      }, headers)
    }).then(config.beforeError).then(function (response) {
      return response.json();
    }).then(function (json) {
      return json;
    }).then(function (response) {
      return config.beforeSuccess(response);
    });
  }),

  // :: (k: v) -> String -> [String] -> (k: v) -> (a -> b)
  post: _ramda2.default.curry(function (config, url, idAttributes, params) {
    var headers = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
    var type = arguments.length <= 5 || arguments[5] === undefined ? 'json' : arguments[5];

    var idAttributeObject = _ramda2.default.pick(idAttributes, params);
    var missingIdAttibutes = (0, _helpers.missingParams)(idAttributeObject, idAttributes);
    var lastIdAttribute = idAttributes[0];
    var bodyParams = void 0;
    var buildedUrl = void 0;
    var data = void 0;

    if (missingIdAttibutes.length !== 0) {
      throw new Error('You must provide "' + missingIdAttibutes + '" in params');
    }

    if (idAttributes.length === 1 && lastIdAttribute === _constants.IS_COLLECTION) {
      bodyParams = params;
      buildedUrl = url;
    }

    if (idAttributes.length > 1 || lastIdAttribute !== _constants.IS_COLLECTION) {
      bodyParams = _ramda2.default.omit(idAttributes, params);
      buildedUrl = (0, _helpers.urlParamsTransformer)(url, idAttributeObject);
    }

    if (type === 'form') {
      data = (0, _helpers.objectToFormData)(config.paramsTransform(bodyParams));
    } else {
      data = JSON.stringify(config.paramsTransform(bodyParams));
    }

    return (0, _isomorphicFetch2.default)('' + config.host + buildedUrl, {
      method: 'POST',
      body: data,
      headers: _ramda2.default.merge({
        'Content-Type': 'application/json'
      }, headers)
    }).then(config.beforeError).then(function (response) {
      return response.json();
    }).then(function (json) {
      return json;
    }).then(function (response) {
      return config.beforeSuccess(response);
    });
  }),

  put: modifyWith('PUT'),
  patch: modifyWith('PATCH'),

  // :: (k: v) -> String -> [String] -> (k: v) -> (a -> b)
  delete: _ramda2.default.curry(function (config, url, idAttributes, params) {
    var headers = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
    var type = arguments.length <= 5 || arguments[5] === undefined ? 'json' : arguments[5];

    var idAttributeObject = _ramda2.default.pick(idAttributes, params);
    var missingIdAttibutes = (0, _helpers.missingParams)(idAttributeObject, idAttributes);
    var lastIdAttribute = idAttributes[0];
    var buildedUrl = void 0;

    if (missingIdAttibutes.length !== 0) {
      throw new Error('You must provide "' + missingIdAttibutes + '" in params');
    }

    if (idAttributes.length === 1 && lastIdAttribute === _constants.IS_COLLECTION) {
      buildedUrl = url;
    }

    if (idAttributes.length > 1 || lastIdAttribute !== _constants.IS_COLLECTION) {
      buildedUrl = (0, _helpers.urlParamsTransformer)(url, idAttributeObject);
    }

    return (0, _isomorphicFetch2.default)('' + config.host + buildedUrl, {
      method: 'DELETE',
      headers: _ramda2.default.merge({
        'Content-Type': 'application/json'
      }, headers)
    }).then(config.beforeError).then(function (response) {
      return response.json();
    }).then(function (json) {
      return json;
    }).then(function (response) {
      return config.beforeSuccess(response);
    });
  })
};

var Repoint = function () {
  function Repoint() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Repoint);

    this.config = {
      host: options.host || '',
      paramsTransform: options.paramsTransform || _helpers.identity,
      beforeSuccess: options.beforeSuccess || _helpers.identity,
      beforeError: options.beforeError || _helpers.identity
    };
  }

  _createClass(Repoint, [{
    key: 'generate',
    value: function generate(name) {
      var _this = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var nonRestfulRoutes = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

      var nestedEndpoint = options.nestUnder;
      var namespace = options.namespace;
      var singular = options.singular || false;
      var namespacedName = namespace !== undefined ? namespace + '/' + name : '' + name;
      var nestedIdAttributes = nestedEndpoint ? nestedEndpoint.idAttributes : [];
      var nestedNamespacedIdAttributes = nestedEndpoint ? nestedEndpoint.namespacedIdAttributes : [];
      var urls = void 0;
      var collectionUrl = void 0;
      var memberUrl = void 0;

      if (!singular) {
        var _ret = function () {
          var idAttribute = options.idAttribute || 'id';

          if (nestedEndpoint !== undefined && nestedEndpoint !== null) {
            urls = {
              collection: nestedEndpoint.collectionUrl + '/:' + nestedNamespacedIdAttributes[0] + '/' + namespacedName,
              member: nestedEndpoint.collectionUrl + '/:' + nestedNamespacedIdAttributes[0] + '/' + namespacedName + '/:' + idAttribute
            };
          } else {
            urls = {
              collection: '/' + namespacedName,
              member: '/' + namespacedName + '/:' + idAttribute
            };
          }

          collectionUrl = urls.collection;
          memberUrl = urls.member;
          var namespacedIdAttribute = '' + (0, _pluralize2.default)(name, 1) + (0, _helpers.capitalize)(idAttribute);

          var nonRestful = nonRestfulRoutes.reduce(function (result, routeConfig) {
            var url = urls[routeConfig.on] + '/' + routeConfig.name;
            result[routeConfig.name] = commonMethods[routeConfig.method](_this.config)(url)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [routeConfig.on === 'collection' ? _constants.IS_COLLECTION : idAttribute]).reduce(function (a, b) {
              return a.concat(b);
            }, []));
            return result;
          }, {});

          return {
            v: _ramda2.default.merge({
              name: name,
              collectionUrl: collectionUrl,
              memberUrl: memberUrl,
              idAttributes: _ramda2.default.append(idAttribute, nestedIdAttributes),
              namespacedIdAttributes: _ramda2.default.append(namespacedIdAttribute, nestedNamespacedIdAttributes),
              getCollection: commonMethods.get(_this.config)(collectionUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [_constants.IS_COLLECTION])),
              get: commonMethods.get(_this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [idAttribute])),
              post: commonMethods.post(_this.config)(collectionUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [_constants.IS_COLLECTION])),
              create: commonMethods.post(_this.config)(collectionUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [_constants.IS_COLLECTION])),
              put: commonMethods.put(_this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [idAttribute])),
              patch: commonMethods.patch(_this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [idAttribute])),
              update: commonMethods.patch(_this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [idAttribute])),
              delete: commonMethods.delete(_this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [idAttribute])),
              destroy: commonMethods.delete(_this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes), [idAttribute]))
            })(nonRestful)
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

      if (nestedEndpoint !== undefined && nestedEndpoint !== null) {
        urls = {
          collection: null,
          member: nestedEndpoint.collectionUrl + '/:' + nestedNamespacedIdAttributes[0] + '/' + namespacedName
        };
      } else {
        urls = {
          collection: null,
          member: '/' + namespacedName
        };
      }

      collectionUrl = urls.collection;
      memberUrl = urls.member;

      return _ramda2.default.merge({
        name: name,
        collectionUrl: collectionUrl,
        memberUrl: memberUrl,
        idAttributes: [].concat(_toConsumableArray(nestedIdAttributes)),
        namespacedIdAttributes: [].concat(_toConsumableArray(nestedNamespacedIdAttributes)),
        get: commonMethods.get(this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes))),
        post: commonMethods.post(this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes))),
        create: commonMethods.post(this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes))),
        put: commonMethods.put(this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes))),
        patch: commonMethods.patch(this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes))),
        update: commonMethods.patch(this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes))),
        delete: commonMethods.delete(this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes))),
        destroy: commonMethods.delete(this.config)(memberUrl)([].concat(_toConsumableArray(nestedNamespacedIdAttributes)))
      })({});
    }
  }]);

  return Repoint;
}();

exports.default = Repoint;