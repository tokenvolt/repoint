import test from 'tape'
import { capitalize, missingParams } from '../src/helpers'

test('capitalize', t => {
  t.equal(capitalize('something'), 'Something',
    'upper-cases first letter of the string')

  t.equal(capitalize('Already capitalized'), 'Already capitalized',
    'is idempotent')
  t.end()
})

test('missingParams', t => {
  t.deepEqual(missingParams({ id: 1, name: 'Bob' }, ['id', 'name', 'email']), ['email'],
    'returns missing attributes')
  t.deepEqual(missingParams({ id: 1, name: 'Bob' }, ['id', 'name']), [],
    'returns empty array is no missing attributes')
  t.end()
})
