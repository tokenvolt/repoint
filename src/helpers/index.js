import { IS_COLLECTION } from 'helpers/constants'
import R from 'ramda/ramda.repoint'

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const missingParams = (obj, attrs) => R.reject(R.flip(R.contains)(R.keys(obj)), R.reject(R.equals(IS_COLLECTION), attrs))
