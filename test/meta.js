import test from 'tape'
import Repoint from '../src'

const repoint = new Repoint({ host: 'http://api.example.com/v1' })

test('Repoint constructor', t => {
  t.equal(repoint.config.host, 'http://api.example.com/v1', 'API host')
  t.end()
})

test('endpoint("users")', t => {
  const users = repoint.generate('users')

  t.equal(users.name, 'users', 'name property == "users"')
  t.equal(users.collectionUrl, '/users', 'collectionUrl property == "/users"')
  t.equal(users.memberUrl, '/users/:id', 'memberUrl == "/users/:id"')
  t.deepEqual(users.idAttributes, ['id'], 'idAttributes property == [id]')
  t.deepEqual(users.namespacedIdAttributes, ['userId'], 'namespacedIdAttributes property == [userId]')

  t.equal(typeof users.getCollection, 'function', 'getCollection function exists')
  t.equal(typeof users.get, 'function', 'get function exists')
  t.equal(typeof users.post, 'function', 'post function exists')
  t.equal(typeof users.create, 'function', 'create function exists')
  t.equal(typeof users.put, 'function', 'put function exists')
  t.equal(typeof users.patch, 'function', 'patch function exists')
  t.equal(typeof users.update, 'function', 'update function exists')
  t.equal(typeof users.delete, 'function', 'delete function exists')
  t.equal(typeof users.destroy, 'function', 'destroy function exists')

  t.end()
})

test('endpoint("users") and idAttribute', t => {
  const users = repoint.generate('users', { idAttribute: 'slug' })

  t.equal(users.memberUrl, '/users/:slug', 'memberUrl == "/users/:slug"')
  t.deepEqual(users.idAttributes, ['slug'], 'idAttributes property == [slug]')
  t.deepEqual(users.namespacedIdAttributes, ['userSlug'], 'namespacedIdAttributes property == [userSlug]')

  t.end()
})

test('endpoint("users") and namespace', t => {
  const users = repoint.generate('users', { namespace: 'admin' })

  t.equal(users.collectionUrl, '/admin/users', 'collectionUrl property == "/admin/users"')
  t.equal(users.memberUrl, '/admin/users/:id', 'memberUrl == "/admin/users/:id"')

  t.end()
})

test('nested endpoints', t => {
  const posts = repoint.generate('posts', { nestUnder: repoint.generate('users') })

  t.equal(posts.name, 'posts', 'name property == "posts"')
  t.equal(posts.collectionUrl, '/users/:userId/posts', 'collectionUrl property == "/users/:userId/posts"')
  t.equal(posts.memberUrl, '/users/:userId/posts/:id', 'memberUrl == "/users/:userId/posts/:id"')
  t.deepEqual(posts.idAttributes, ['id', 'id'], 'idAttributes property == [id, id]')
  t.deepEqual(posts.namespacedIdAttributes, ['userId', 'postId'], 'namespacedIdAttributes property == [userId, postId]')

  t.end()
})

test('Nested endpoint "posts" within "users"', t => {
  const posts = repoint.generate('posts', { nestUnder: repoint.generate('users') })

  t.equal(posts.name, 'posts', 'name property == "posts"')
  t.equal(posts.collectionUrl, '/users/:userId/posts', 'collectionUrl property == "/users/:userId/posts"')
  t.equal(posts.memberUrl, '/users/:userId/posts/:id', 'memberUrl == "/users/:userId/posts/:id"')
  t.deepEqual(posts.idAttributes, ['id', 'id'], 'idAttributes property == [id, id]')
  t.deepEqual(posts.namespacedIdAttributes, ['userId', 'postId'], 'namespacedIdAttributes property == [userId, postId]')

  t.end()
})

test('nested endpoints with idAttribute and namespace', t => {
  const posts = repoint.generate('posts', { idAttribute: 'title', nestUnder: repoint.generate('users', { namespace: 'admin', idAttribute: 'slug' }) })

  t.equal(posts.name, 'posts', 'name property == "posts"')
  t.equal(posts.collectionUrl, '/admin/users/:userSlug/posts', 'collectionUrl property == "/admin/users/:userSlug/posts"')
  t.equal(posts.memberUrl, '/admin/users/:userSlug/posts/:title', 'memberUrl == "/admin/users/:userSlug/posts/:title"')
  t.deepEqual(posts.idAttributes, ['slug', 'title'], 'idAttributes property == [slug, title]')
  t.deepEqual(posts.namespacedIdAttributes, ['userSlug', 'postTitle'], 'namespacedIdAttributes property == [userSlug, postTitle]')

  t.end()
})

test('nonRestful methods', t => {
  const users = repoint.generate('users', {}, [{method: 'post', name: 'login', on: 'collection'}])

  t.equal(typeof users.login, 'function', 'login function exists')
  t.end()
})

test('singular endpoint("user")', t => {
  const users = repoint.generate('user', { singular: true })

  t.equal(users.name, 'user', 'name property == "user"')
  t.equal(users.collectionUrl, null, 'no collectionUrl')
  t.equal(users.memberUrl, '/user', 'memberUrl == "/user"')
  t.deepEqual(users.idAttributes, [], 'no idAttributes')
  t.deepEqual(users.namespacedIdAttributes, [], 'no namespacedIdAttributes')

  t.equal(typeof users.getCollection, 'undefined', 'no getCollection function')
  t.equal(typeof users.get, 'function', 'get function exists')
  t.equal(typeof users.post, 'function', 'post function exists')
  t.equal(typeof users.create, 'function', 'create function exists')
  t.equal(typeof users.put, 'function', 'put function exists')
  t.equal(typeof users.patch, 'function', 'patch function exists')
  t.equal(typeof users.update, 'function', 'update function exists')
  t.equal(typeof users.delete, 'function', 'delete function exists')
  t.equal(typeof users.destroy, 'function', 'destroy function exists')

  t.end()
})
