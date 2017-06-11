import test from 'tape'
import { capitalize, missingParams, urlParamsTransformer } from '../src/helpers'

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

test('urlParamsTransformer', t => {
  t.equal(urlParamsTransformer('/user', {}), '/user', 'matches url params according to pattern')
  t.equal(urlParamsTransformer('/users/:id', { id: 1 }), '/users/1', 'matches url params according to pattern')
  t.equal(urlParamsTransformer('users/:id/posts/:title', { id: 1, title: 'book' }), 'users/1/posts/book', 'matches url params according to pattern')
  t.equal(urlParamsTransformer('/admin/users/:id/posts/:title', { id: 1, title: 'book' }), '/admin/users/1/posts/book', 'matches url params according to pattern')
  t.equal(urlParamsTransformer('/users/:userId/posts/:postId/something', { userId: 1, postId: 10 }), '/users/1/posts/10/something', 'matches url params according to pattern')
  t.end()
})
