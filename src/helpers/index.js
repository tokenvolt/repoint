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
