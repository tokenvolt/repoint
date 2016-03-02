import fetch from 'isomorphic-fetch'
import { camelizeKeys } from 'humps'
import R from 'ramda/ramda.repoint'
import Path from 'path-parser'
import param from 'jquery-param'
import pluralize from 'pluralize'
import { capitalize, missingParams } from 'helpers'
import { IS_COLLECTION } from 'helpers/constants'

// 1) Standardizing response (pagination, normalization) and Error handling

const namespaces = {
  production: 'https://api-staging.moveshanghai.com/api/v1/',
  development: 'https://api-staging.moveshanghai.com/api/v1/'
}

const API = {
  namespace: namespaces[process.env.NODE_ENV]
}

const commonMethods = {
  // :: String -> [String] -> (k: v) -> (k: v) -> (a -> b)
  get: R.curry((url, idAttributes, params, headers = {}) => {
    const idAttributeObject = R.pick(idAttributes, params)
    const missingIdAttibutes = missingParams(idAttributeObject, idAttributes)
    const lastIdAttribute = idAttributes[0]
    let queryParams
    let buildedUrl

    if (!R.isEmpty(missingIdAttibutes)) {
      throw new Error(`You must provide "${missingIdAttibutes}" in params`)
    }

    if (idAttributes.length === 1 && lastIdAttribute === IS_COLLECTION) {
      buildedUrl = url
      queryParams = params
    }

    if (idAttributes.length > 1 || lastIdAttribute !== IS_COLLECTION) {
      buildedUrl = new Path(url).build(idAttributeObject)
      queryParams = R.omit(idAttributes, params)
    }

    return fetch(`${API.namespace}${buildedUrl}?${param(queryParams)}`, {
      headers: R.merge({
        'Content-Type': 'application/json'
      }, headers)
    })
      .then(response => response.json())
      .then(json => camelizeKeys(json))
      .then(
        response => response,
        error => ({ error: error.message || 'Something bad happened' })
      )
  }),

  // :: String -> [String] -> (k: v) -> (a -> b)
  post: R.curry((url, idAttributes, params, headers = {}) => {
    const idAttributeObject = R.pick(idAttributes, params)
    const missingIdAttibutes = missingParams(idAttributeObject, idAttributes)
    const lastIdAttribute = idAttributes[0]
    let bodyParams
    let buildedUrl

    if (!R.isEmpty(missingIdAttibutes)) {
      throw new Error(`You must provide "${missingIdAttibutes}" in params`)
    }

    if (idAttributes.length === 1 && lastIdAttribute === IS_COLLECTION) {
      bodyParams = params
      buildedUrl = url
    }

    if (idAttributes.length > 1 || lastIdAttribute !== IS_COLLECTION) {
      bodyParams = R.omit(idAttributes, params)
      buildedUrl = new Path(url).build(idAttributeObject)
    }

    return fetch(`${API.namespace}${buildedUrl}`, {
      method:  'POST',
      body:    JSON.stringify(bodyParams),
      headers: R.merge({
        'Content-Type': 'application/json'
      }, headers)
    })
      .then(response => response.json())
      .then(json => camelizeKeys(json))
      .then(
        response => response,
        error => ({ error: error.message || 'Something bad happened' })
      )
  }),

  // :: String -> [String] -> (k: v) -> (a -> b)
  patch: R.curry((url, idAttributes, params, headers = {}) => {
    const idAttributeObject = R.pick(idAttributes, params)
    const missingIdAttibutes = missingParams(idAttributeObject, idAttributes)
    const lastIdAttribute = idAttributes[0]
    let bodyParams
    let buildedUrl

    if (!R.isEmpty(missingIdAttibutes)) {
      throw new Error(`You must provide "${missingIdAttibutes}" in params`)
    }

    if (idAttributes.length === 1 && lastIdAttribute === IS_COLLECTION) {
      bodyParams = params
      buildedUrl = url
    }

    if (idAttributes.length > 1 || lastIdAttribute !== IS_COLLECTION) {
      bodyParams = R.omit(idAttributes, params)
      buildedUrl = new Path(url).build(idAttributeObject)
    }

    return fetch(`${API.namespace}${buildedUrl}`, {
      method:  'PATCH',
      body:    JSON.stringify(bodyParams),
      headers: R.merge({
        'Content-Type': 'application/json'
      }, headers)
    })
      .then(response => response.json())
      .then(json => camelizeKeys(json))
      .then(
        response => response,
        error => ({ error: error.message || 'Something bad happened' })
      )
  }),

  // :: String -> [String] -> (k: v) -> (a -> b)
  delete: R.curry((url, idAttributes, params, headers = {}) => {
    const idAttributeObject = R.pick(idAttributes, params)
    const missingIdAttibutes = missingParams(idAttributeObject, idAttributes)
    const lastIdAttribute = idAttributes[0]
    let buildedUrl

    if (!R.isEmpty(missingIdAttibutes)) {
      throw new Error(`You must provide "${missingIdAttibutes}" in params`)
    }

    if (idAttributes.length === 1 && lastIdAttribute === IS_COLLECTION) {
      buildedUrl = url
    }

    if (idAttributes.length > 1 || lastIdAttribute !== IS_COLLECTION) {
      buildedUrl = new Path(url).build(idAttributeObject)
    }

    return fetch(`${API.namespace}${buildedUrl}`, {
      method:  'DELETE',
      headers: R.merge({
        'Content-Type': 'application/json'
      }, headers)
    })
      .then(response => response.json())
      .then(json => camelizeKeys(json))
      .then(
        response => response,
        error => ({ error: error.message || 'Something bad happened' })
      )
  })
}
// endpoint :: String -> (k: v) -> [(k: v)] -> (k: v)
export function endpoint(name, options = {}, nonRestfulRoutes = []) {
  const idAttribute            = options.idAttribute || 'id'
  const nestedEndpoint         = options.nestUnder
  const namespace              = options.namespace
  const nestedIdAttributes     = nestedEndpoint ? nestedEndpoint.idAttributes : []
  const nestedNamespacedIdAttributes = nestedEndpoint ? nestedEndpoint.namespacedIdAttributes : []
  const namespacedName = namespace !== undefined ? `${namespace}/${name}` : `${name}`
  let urls

  if (nestedEndpoint !== undefined && nestedEndpoint !== null) {
    urls = {
      collection: `${nestedEndpoint.collectionUrl}/:${nestedNamespacedIdAttributes[0]}/${namespacedName}`,
      member:     `${nestedEndpoint.collectionUrl}/:${nestedNamespacedIdAttributes[0]}/${namespacedName}/:${idAttribute}`
    }
  } else {
    urls = {
      collection: `/${namespacedName}`,
      member:     `/${namespacedName}/:${idAttribute}`
    }
  }

  const collectionUrl = urls.collection
  const memberUrl     = urls.member
  const namespacedIdAttribute = R.concat(pluralize(name, 1))(capitalize(idAttribute))

  const nonRestful = nonRestfulRoutes.reduce((result, routeConfig) => {
    const url = R.concat(urls[routeConfig.on])(`/${routeConfig.name}`)
    result[routeConfig.name] = commonMethods[routeConfig.method](url)(R.flatten(
      [...nestedNamespacedIdAttributes, (routeConfig.on === 'collection' ? IS_COLLECTION : idAttribute)])
    )
    return result
  }, {})

  return R.merge({
    name,
    collectionUrl,
    memberUrl,
    idAttributes:           R.append(idAttribute, nestedIdAttributes),
    namespacedIdAttributes: R.append(namespacedIdAttribute, nestedNamespacedIdAttributes),
    getCollection:          commonMethods.get(collectionUrl)(
                              [...nestedNamespacedIdAttributes, IS_COLLECTION]
                            ),
    get:    commonMethods.get(memberUrl)([...nestedNamespacedIdAttributes, idAttribute]),
    create: commonMethods.post(collectionUrl)(
              [...nestedNamespacedIdAttributes, IS_COLLECTION]
            ),
    update:  commonMethods.patch(memberUrl)([...nestedNamespacedIdAttributes, idAttribute]),
    destroy: commonMethods.delete(memberUrl)([...nestedNamespacedIdAttributes, idAttribute])
  })(nonRestful)
}


// const repoint = new Repoint({
//   namespace: 'http://localhost:3000'
// })

// repoint.generate('users')


// class Repoint {
//   constructor(options = {}) {
//     this.namespace = options.namespace || ''
//   }

//   generate(name, options = {}, nonRestfulRoutes = []) {
//     // old endpoint function
//   }
// }
