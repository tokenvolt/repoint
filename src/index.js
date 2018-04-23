import fetch from 'isomorphic-fetch'
import R from './ramda/ramda.repoint'
import param from 'jquery-param'
import pluralize from 'pluralize'
import {
  capitalize,
  missingParams,
  urlParamsTransformer,
  identity,
  objectToFormData
} from './helpers'
import { IS_COLLECTION } from './helpers/constants'

const prepareHeaders = (type, headers) => {
  if (type === 'json') {
    return R.merge({ 'Content-Type': 'application/json' }, headers)
  }

  return R.merge({}, headers)
}

const defaultFetchOpts = {}

const jsonResponseHandler = (response) => response.json()


// :: (String) -> (k: v) -> String -> [String] -> (k: v) -> (a -> b)
const modifyWith = (methodName) => R.curry((config, url, idAttributes, params, headers = {}, type = 'json') => {
  const idAttributeObject = R.pick(idAttributes, params)
  const missingIdAttibutes = missingParams(idAttributeObject, idAttributes)
  const lastIdAttribute = idAttributes[0]
  let bodyParams
  let buildedUrl
  let data

  if (missingIdAttibutes.length !== 0) {
    throw new Error(`You must provide "${missingIdAttibutes}" in params`)
  }

  if (idAttributes.length === 1 && lastIdAttribute === IS_COLLECTION) {
    bodyParams = params
    buildedUrl = url
  }

  if (idAttributes.length > 1 || lastIdAttribute !== IS_COLLECTION) {
    bodyParams = R.omit(idAttributes, params)
    buildedUrl = urlParamsTransformer(url, idAttributeObject)
  }

  if (type === 'form') {
    data = objectToFormData(config.paramsTransform(bodyParams))
  } else {
    data = JSON.stringify(config.paramsTransform(bodyParams))
  }

  return fetch(`${config.host}${buildedUrl}`, {
    ...config.fetchOpts,
    method:  methodName,
    body:    data,
    headers: R.merge(prepareHeaders(type, config.headers), headers)
  })
    .then(config.beforeError)
    .then(config.responseHandler)
    .then(json => json)
    .then(config.beforeSuccess)
})

const commonMethods = {
  // :: (k: v) -> String -> [String] -> (k: v) -> (k: v) -> (a -> b)
  get: R.curry((config, url, idAttributes, params, headers = {}, type = 'json') => {
    const idAttributeObject = R.pick(idAttributes, params)
    const missingIdAttibutes = missingParams(idAttributeObject, idAttributes)
    const lastIdAttribute = idAttributes[0]
    let queryParams
    let buildedUrl

    if (missingIdAttibutes.length !== 0) {
      throw new Error(`You must provide "${missingIdAttibutes}" in params`)
    }

    if (idAttributes.length === 1 && lastIdAttribute === IS_COLLECTION) {
      buildedUrl = url
      queryParams = params
    }

    if (idAttributes.length > 1 || lastIdAttribute !== IS_COLLECTION) {
      buildedUrl = urlParamsTransformer(url, idAttributeObject)
      queryParams = R.omit(idAttributes, params)
    }

    const fullUrl = R.isEmpty(queryParams) ? `${config.host}${buildedUrl}` : `${config.host}${buildedUrl}?${param(config.paramsTransform(queryParams))}`

    return fetch(fullUrl, {
      ...config.fetchOpts,
      headers: R.merge(prepareHeaders(type, config.headers), headers)
    })
      .then(config.beforeError)
      .then(config.responseHandler)
      .then(json => json)
      .then(response => config.beforeSuccess(response))
  }),

  // :: (k: v) -> String -> [String] -> (k: v) -> (a -> b)
  post: R.curry((config, url, idAttributes, params, headers = {}, type = 'json') => {
    const idAttributeObject = R.pick(idAttributes, params)
    const missingIdAttibutes = missingParams(idAttributeObject, idAttributes)
    const lastIdAttribute = idAttributes[0]
    let bodyParams
    let buildedUrl
    let data

    if (missingIdAttibutes.length !== 0) {
      throw new Error(`You must provide "${missingIdAttibutes}" in params`)
    }

    if (idAttributes.length === 1 && lastIdAttribute === IS_COLLECTION) {
      bodyParams = params
      buildedUrl = url
    }

    if (idAttributes.length > 1 || lastIdAttribute !== IS_COLLECTION) {
      bodyParams = R.omit(idAttributes, params)
      buildedUrl = urlParamsTransformer(url, idAttributeObject)
    }

    if (type === 'form') {
      data = objectToFormData(config.paramsTransform(bodyParams))
    } else {
      data = JSON.stringify(config.paramsTransform(bodyParams))
    }

    return fetch(`${config.host}${buildedUrl}`, {
      ...config.fetchOpts,
      method:  'POST',
      body:    data,
      headers: R.merge(prepareHeaders(type, config.headers), headers)
    })
      .then(config.beforeError)
      .then(config.responseHandler)
      .then(json => json)
      .then(response => config.beforeSuccess(response))
  }),

  put: modifyWith('PUT'),
  patch: modifyWith('PATCH'),

  // :: (k: v) -> String -> [String] -> (k: v) -> (a -> b)
  delete: R.curry((config, url, idAttributes, params, headers = {}, type = 'json') => {
    console.log(idAttributes)
    const idAttributeObject = R.pick(idAttributes, params)
    const missingIdAttibutes = missingParams(idAttributeObject, idAttributes)
    const lastIdAttribute = idAttributes[0]
    let bodyParams
    let buildedUrl


    if (missingIdAttibutes.length !== 0) {
      throw new Error(`You must provide "${missingIdAttibutes}" in params`)
    }

    if (idAttributes.length === 1 && lastIdAttribute === IS_COLLECTION) {
      bodyParams = params
      buildedUrl = url
    }

    if (idAttributes.length > 1 || lastIdAttribute !== IS_COLLECTION) {
      bodyParams = R.omit(idAttributes, params)
      buildedUrl = urlParamsTransformer(url, idAttributeObject)
    }

    const data = JSON.stringify(config.paramsTransform(bodyParams))

    return fetch(`${config.host}${buildedUrl}`, {
      ...config.fetchOpts,
      method:  'DELETE',
      body: data,
      headers: R.merge(prepareHeaders(type, config.headers), headers)
    })
      .then(config.beforeError)
      .then(config.responseHandler)
      .then(json => json)
      .then(response => config.beforeSuccess(response))
  })
}

class Repoint {
  constructor(options = {}) {
    this.config = {
      host: options.host || '',
      headers: options.headers || {},
      paramsTransform: options.paramsTransform || identity,
      beforeSuccess: options.beforeSuccess || identity,
      beforeError: options.beforeError || identity,
      fetchOpts: options.fetchOpts || defaultFetchOpts,
      responseHandler: options.responseHandler || jsonResponseHandler
    }
  }

  generate(name, options = {}, nonRestfulRoutes = []) {
    const nestedEndpoint = options.nestUnder
    const namespace      = options.namespace
    const singular       = options.singular || false
    const namespacedName = namespace !== undefined ? `${namespace}/${name}` : `${name}`
    const nestedIdAttributes     = nestedEndpoint ? nestedEndpoint.idAttributes : []
    const nestedNamespacedIdAttributes = nestedEndpoint ? nestedEndpoint.namespacedIdAttributes : []
    let urls
    let collectionUrl
    let memberUrl

    if (!singular) {
      const idAttribute = options.idAttribute || 'id'

      if (nestedEndpoint !== undefined && nestedEndpoint !== null) {
        const reversedNestedNamespacedIdAttributes = [...nestedNamespacedIdAttributes].reverse()

        urls = {
          collection: `${nestedEndpoint.collectionUrl}/:${reversedNestedNamespacedIdAttributes[0]}/${namespacedName}`,
          member:     `${nestedEndpoint.collectionUrl}/:${reversedNestedNamespacedIdAttributes[0]}/${namespacedName}/:${idAttribute}`
        }
      } else {
        urls = {
          collection: `/${namespacedName}`,
          member:     `/${namespacedName}/:${idAttribute}`
        }
      }

      collectionUrl = urls.collection
      memberUrl = urls.member
      const namespacedIdAttribute = `${pluralize(name, 1)}${capitalize(idAttribute)}`

      const nonRestful = nonRestfulRoutes.reduce((result, routeConfig) => {
        const url = `${urls[routeConfig.on]}/${routeConfig.name}`
        console.log([...nestedNamespacedIdAttributes, (routeConfig.on === 'collection' ? IS_COLLECTION : idAttribute)].reduce((a, b) => a.concat(b), []))
        result[routeConfig.name] = commonMethods[routeConfig.method](this.config)(url)(
          [...nestedNamespacedIdAttributes, (routeConfig.on === 'collection' ? IS_COLLECTION : idAttribute)].reduce((a, b) => a.concat(b), [])
        )
        return result
      }, {})

      return R.merge({
        name,
        collectionUrl,
        memberUrl,
        idAttributes:           R.append(idAttribute, nestedIdAttributes),
        namespacedIdAttributes: R.append(namespacedIdAttribute, nestedNamespacedIdAttributes),
        getCollection:          commonMethods.get(this.config)(collectionUrl)(
                                  [...nestedNamespacedIdAttributes, IS_COLLECTION]
                                ),
        get:    commonMethods.get(this.config)(memberUrl)([...nestedNamespacedIdAttributes, idAttribute]),
        post:   commonMethods.post(this.config)(collectionUrl)(
                  [...nestedNamespacedIdAttributes, IS_COLLECTION]
                ),
        create: commonMethods.post(this.config)(collectionUrl)(
                  [...nestedNamespacedIdAttributes, IS_COLLECTION]
                ),
        put:     commonMethods.put(this.config)(memberUrl)([...nestedNamespacedIdAttributes, idAttribute]),
        patch:   commonMethods.patch(this.config)(memberUrl)([...nestedNamespacedIdAttributes, idAttribute]),
        update:  commonMethods.patch(this.config)(memberUrl)([...nestedNamespacedIdAttributes, idAttribute]),
        delete:  commonMethods.delete(this.config)(memberUrl)([...nestedNamespacedIdAttributes, idAttribute]),
        destroy: commonMethods.delete(this.config)(memberUrl)([...nestedNamespacedIdAttributes, idAttribute])
      })(nonRestful)
    }

    if (nestedEndpoint !== undefined && nestedEndpoint !== null) {
      const reversedNestedNamespacedIdAttributes = [...nestedNamespacedIdAttributes].reverse()

      urls = {
        collection: null,
        member:     `${nestedEndpoint.collectionUrl}/:${reversedNestedNamespacedIdAttributes[0]}/${namespacedName}`
      }
    } else {
      urls = {
        collection: null,
        member:     `/${namespacedName}`
      }
    }

    collectionUrl = urls.collection
    memberUrl = urls.member

    return R.merge({
      name,
      collectionUrl,
      memberUrl,
      idAttributes:           [...nestedIdAttributes],
      namespacedIdAttributes: [...nestedNamespacedIdAttributes],
      get:     commonMethods.get(this.config)(memberUrl)([...nestedNamespacedIdAttributes]),
      post:    commonMethods.post(this.config)(memberUrl)([...nestedNamespacedIdAttributes]),
      create:  commonMethods.post(this.config)(memberUrl)([...nestedNamespacedIdAttributes]),
      put:     commonMethods.put(this.config)(memberUrl)([...nestedNamespacedIdAttributes]),
      patch:   commonMethods.patch(this.config)(memberUrl)([...nestedNamespacedIdAttributes]),
      update:  commonMethods.patch(this.config)(memberUrl)([...nestedNamespacedIdAttributes]),
      delete:  commonMethods.delete(this.config)(memberUrl)([...nestedNamespacedIdAttributes]),
      destroy: commonMethods.delete(this.config)(memberUrl)([...nestedNamespacedIdAttributes])
    })({})
  }
}

export default Repoint
