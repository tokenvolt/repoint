import { IS_COLLECTION } from './constants'
import R from '../ramda/ramda.repoint'

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const missingParams = (obj, attrs) => attrs.filter((el) => el !== IS_COLLECTION).filter((el) => !R.contains(el, R.keys(obj)))
