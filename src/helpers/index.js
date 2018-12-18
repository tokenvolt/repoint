import { IS_COLLECTION } from './constants'
import param from 'jquery-param'
import R from '../ramda/ramda.repoint'

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const missingParams = (obj, attrs) => attrs.filter((el) => el !== IS_COLLECTION).filter((el) => !R.contains(el, R.keys(obj)))

const removeFirstChar = (val) => val.slice(1, val.length)

const urlParamPattern = /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/

export const urlParamsTransformer = (url, params) => {
  return url.split('/')
            .map((token) => urlParamPattern.test(token) ? token.replace(urlParamPattern, params[removeFirstChar(token)]) : token)
            .join('/')
}

const extractUrlParams = (url) => {
  return url.split('/')
            .filter(token => urlParamPattern.test(token))
            .map(token => removeFirstChar(token))
}

// TODO: use this function for commonMethods in future versions
export const buildUrl = (url, params = {}) => {
  const urlParams = extractUrlParams(url)
  const missingIdAttibutes = missingParams(params, urlParams)

  if (missingIdAttibutes.length !== 0) {
    throw new Error(`You must provide "${missingIdAttibutes}" in params`)
  }

  const buildedUrl = urlParamsTransformer(url, params)
  const queryParams = R.omit(extractUrlParams(url), params)

  return R.isEmpty(queryParams) ? `${buildedUrl}` : `${buildedUrl}?${param(queryParams)}`
}

export const identity = (val) => val

export const objectToFormData = (obj, form, namespace) => {
  const fd = form || new FormData()
  let formKey

  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = `${namespace}[${property}]`
      } else {
        formKey = property
      }

      // if the property is an object, but not a File,
      // use recursivity.
      if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        const newNamespaceName = namespace ? `${namespace}[${property}]` : property

        objectToFormData(obj[property], fd, newNamespaceName)
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property])
      }
    }
  }

  return fd
}
