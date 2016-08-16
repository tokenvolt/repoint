import { IS_COLLECTION } from './constants'
import R from '../ramda/ramda.repoint'

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const missingParams = (obj, attrs) => attrs.filter((el) => el !== IS_COLLECTION).filter((el) => !R.contains(el, R.keys(obj)))

const removeFirstChar = (val) => val.slice(1, val.length)

export const urlParamsTransformer = (url, params) => {
  const pattern = /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/
  return url.split('/')
            .map((token) => pattern.test(token) ? token.replace(pattern, params[removeFirstChar(token)]) : token)
            .join('/')
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
        objectToFormData(obj[property], fd, property)
      } else {
        // if it's a string or a File object
        fd.append(formKey, obj[property])
      }
    }
  }

  return fd
}
