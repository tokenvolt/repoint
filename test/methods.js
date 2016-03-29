import nock from 'nock'
import test from 'tape'
import R from '../src/ramda/ramda.repoint.js'
import Repoint from '../src'

const repoint = new Repoint({ host: 'http://api.example.com/v1' })

test('getCollection request', t => {
  const users = repoint.generate('users')
  const mockedResponse = { users: [{ id: 1, first_name: 'Alex' }, { id: 2, first_name: 'Bob' }] }

  const interceptor = nock('http://api.example.com/v1')
    .get('/users')
    .reply(200, mockedResponse)

  const actualResponse = { users: [ { first_name: 'Alex', id: 1 }, { id: 2, first_name: 'Bob' } ] }

  users.getCollection({})
       .then((data) => {
          t.deepEqual(data, actualResponse)
          nock.removeInterceptor(interceptor)
          t.end()
        })
})

test('getCollection request with query params', t => {
  const users = repoint.generate('users')
  const mockedResponse = { users: [{ id: 1, first_name: 'Alex' }, { id: 2, first_name: 'Bob' }] }

  const interceptor = nock('http://api.example.com/v1')
    .get('/users?page=1')
    .reply(200, mockedResponse)

  const actualResponse = { users: [ { first_name: 'Alex', id: 1 }, { id: 2, first_name: 'Bob' } ] }

  users.getCollection({ page: 1 })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          nock.removeInterceptor(interceptor)
          t.end()
        })
})

test('getCollection request with complex query params', t => {
  const users = repoint.generate('users')
  const mockedResponse = { users: [{ id: 1, first_name: 'Alex' }, { id: 2, first_name: 'Bob' }] }

  const interceptor = nock('http://api.example.com/v1')
    .get('/users?firstName=Bob&last_name=Lang&skills%5B%5D=Drumming&skills%5B%5D=Double+Bass')
    .reply(200, mockedResponse)

  const actualResponse = { users: [ { first_name: 'Alex', id: 1 }, { id: 2, first_name: 'Bob' } ] }

  users.getCollection({ firstName: 'Bob', last_name: 'Lang', skills: ['Drumming', 'Double Bass'] })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          nock.removeInterceptor(interceptor)
          t.end()
        })
})

test('nested getCollection request', t => {
  const users = repoint.generate('users', { nestUnder: repoint.generate('rooms') })
  const mockedResponse = { users: [{ id: 1, first_name: 'Alex' }, { id: 2, first_name: 'Bob' }] }

  const interceptor = nock('http://api.example.com/v1')
    .get('/rooms/1/users')
    .reply(200, mockedResponse)

  const actualResponse = { users: [ { first_name: 'Alex', id: 1 }, { id: 2, first_name: 'Bob' } ] }

  users.getCollection({ roomId: 1 })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          nock.removeInterceptor(interceptor)
          t.end()
        })
})

test('POST', t => {
  const users = repoint.generate('users')
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .post('/users', {
                          email: 'example@gmail.com'
                        })
                        .reply(201, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.post({ email: 'example@gmail.com' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('POST create', t => {
  const users = repoint.generate('users')
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .post('/users', {
                          email: 'example@gmail.com'
                        })
                        .reply(201, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.create({ email: 'example@gmail.com' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('nested create request', t => {
  const users = repoint.generate('users', { nestUnder: repoint.generate('rooms') })
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .post('/rooms/1/users', {
                          user: { email: 'example@gmail.com' }
                        })
                        .reply(201, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.create({ roomId: 1, user: { email: 'example@gmail.com' } })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test.skip('create error', t => {})

test('get', t => {
  const users = repoint.generate('users')
  const mockedResponse = { users: [{ id: 1, first_name: 'Alex' }, { id: 2, first_name: 'Bob' }] }

  const interceptor = nock('http://api.example.com/v1')
                        .get('/users/1')
                        .reply(200, mockedResponse)

  const actualResponse = { users: [ { first_name: 'Alex', id: 1 }, { id: 2, first_name: 'Bob' } ] }

  users.get({ id: 1 })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('get without id throws error', t => {
  const users = repoint.generate('users')
  const mockedResponse = { users: [{ id: 1, first_name: 'Alex' }, { id: 2, first_name: 'Bob' }] }

  const interceptor = nock('http://api.example.com/v1')
                        .get('/users/1')
                        .reply(200, mockedResponse)

  const actualResponse = { users: [ { first_name: 'Alex', id: 1 }, { id: 2, first_name: 'Bob' } ] }

  t.throws(users.get.bind(null, {}), /You must provide "id" in params/, 'missedParams')
  t.end()
})

test('get with idAttribute', t => {
  const users = repoint.generate('users', { idAttribute: 'slug' })
  const mockedResponse = { users: [{ id: 1, first_name: 'Alex' }, { id: 2, first_name: 'Bob' }] }

  const interceptor = nock('http://api.example.com/v1')
                        .get('/users/bob')
                        .reply(200, mockedResponse)

  const actualResponse = { users: [ { first_name: 'Alex', id: 1 }, { id: 2, first_name: 'Bob' } ] }

  users.get({ slug: 'bob' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test.skip('get error', t => {})

test('PUT update', t => {
  const users = repoint.generate('users')
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .put('/users/1', {
                          email: 'example@gmail.com'
                        })
                        .reply(200, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.put({ id: 1, email: 'example@gmail.com' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('PATCH update', t => {
  const users = repoint.generate('users')
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .patch('/users/1', {
                          email: 'example@gmail.com'
                        })
                        .reply(200, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.patch({ id: 1, email: 'example@gmail.com' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('update', t => {
  const users = repoint.generate('users')
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .patch('/users/1', {
                          email: 'example@gmail.com'
                        })
                        .reply(200, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.update({ id: 1, email: 'example@gmail.com' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('nested update request', t => {
  const users = repoint.generate('users', { nestUnder: repoint.generate('rooms') })
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .patch('/rooms/1/users/1', {
                          user: { email: 'example@gmail.com' }
                        })
                        .reply(200, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.update({ roomId: 1, id: 1, user: { email: 'example@gmail.com' } })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test.skip('update error', t => {})

test('DELETE', t => {
  const users = repoint.generate('users')
  const mockedResponse = { id: 1 }

  const interceptor = nock('http://api.example.com/v1')
                        .delete('/users/1')
                        .reply(200, mockedResponse)

  const actualResponse = { id: 1 }

  users.delete({ id: 1 })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('destroy', t => {
  const users = repoint.generate('users')
  const mockedResponse = { id: 1 }

  const interceptor = nock('http://api.example.com/v1')
                        .delete('/users/1')
                        .reply(200, mockedResponse)

  const actualResponse = { id: 1 }

  users.destroy({ id: 1 })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('nested destroy request', t => {
  const users = repoint.generate('users', { nestUnder: repoint.generate('rooms') })
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .delete('/rooms/1/users/1')
                        .reply(200, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.destroy({ roomId: 1, id: 1 })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test.skip('destroy error', t => {})

test('nonRestful login', t => {
  const users = repoint.generate('users', {}, [{ method: 'post', name: 'login', on: 'collection' }])
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .post('/users/login', { email: 'example@gmail.com', password: '123' })
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  users.login({ email: 'example@gmail.com', password: '123' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('nonRestful PUT cancel', t => {
  const users = repoint.generate('users', {}, [{ method: 'patch', name: 'cancel', on: 'collection' }])
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .patch('/users/cancel', { email: 'example@gmail.com', password: '123' })
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  users.cancel({ email: 'example@gmail.com', password: '123' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          t.end()
        })
})

test('singular get request', t => {
  const user = repoint.generate('user', { singular: true })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .get('/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.get({})
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('namespaced singular get request', t => {
  const user = repoint.generate('user', { singular: true, namespace: 'admin' })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .get('/admin/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.get({})
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('singular POST request', t => {
  const user = repoint.generate('user', { singular: true })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .post('/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.post({})
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('singular create request', t => {
  const user = repoint.generate('user', { singular: true })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .post('/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.create({})
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('singular PUT request', t => {
  const user = repoint.generate('user', { singular: true })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .put('/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.put({})
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('singular PATCH request', t => {
  const user = repoint.generate('user', { singular: true })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .patch('/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.patch({})
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('singular update request', t => {
  const user = repoint.generate('user', { singular: true })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .patch('/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.update({})
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('singular DELETE request', t => {
  const user = repoint.generate('user', { singular: true })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .delete('/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.delete({})
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('singular destroy request', t => {
  const user = repoint.generate('user', { singular: true })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .delete('/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.destroy({})
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('nested singular get request', t => {
  const user = repoint.generate('user', { singular: true, nestUnder: repoint.generate('comments') })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .get('/comments/1/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.get({ commentId: 1 })
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})


test('namespaced nested singular get request', t => {
  const user = repoint.generate('user', { singular: true, namespace: 'admin', nestUnder: repoint.generate('comments') })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .get('/comments/1/admin/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.get({ commentId: 1 })
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('nested singular create request', t => {
  const user = repoint.generate('user', { singular: true, nestUnder: repoint.generate('comments') })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .post('/comments/1/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.create({ commentId: 1 })
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('nested singular update request', t => {
  const user = repoint.generate('user', { singular: true, nestUnder: repoint.generate('comments') })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .patch('/comments/1/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.update({ commentId: 1 })
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('nested singular destroy request', t => {
  const user = repoint.generate('user', { singular: true, nestUnder: repoint.generate('comments') })
  const mockedResponse = { token: '321' }

  const interceptor = nock('http://api.example.com/v1')
                        .delete('/comments/1/user')
                        .reply(200, mockedResponse)

  const actualResponse = { token: '321' }

  user.destroy({ commentId: 1 })
      .then((data) => {
         t.deepEqual(data, actualResponse)
         t.end()
       })
})

test('paramsTransform GET', t => {
  const repoint = new Repoint({
    host: 'http://api.example.com/v1',
    paramsTransform: (data) => R.merge(data, { decorated: true })
  })

  const users = repoint.generate('users')
  const mockedResponse = { users: [{ id: 1, first_name: 'Alex' }, { id: 2, first_name: 'Bob' }] }

  const interceptor = nock('http://api.example.com/v1')
    .get('/users?firstName=Bob&lastName=Lang&decorated=true')
    .reply(200, mockedResponse)

  const actualResponse = { users: [ { first_name: 'Alex', id: 1 }, { id: 2, first_name: 'Bob' } ] }

  users.getCollection({ firstName: 'Bob', lastName: 'Lang' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          nock.removeInterceptor(interceptor)
          t.end()
        })
})

test('paramsTransform POST', t => {
  const repoint = new Repoint({
    host: 'http://api.example.com/v1',
    paramsTransform: (data) => R.merge(data, { decorated: true })
  })

  const users = repoint.generate('users')
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .post('/users', {
                          email: 'example@gmail.com',
                          decorated: true
                        })
                        .reply(201, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.create({ email: 'example@gmail.com' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          nock.removeInterceptor(interceptor)
          t.end()
        })
})

test('paramsTransform PATCH', t => {
  const repoint = new Repoint({
    host: 'http://api.example.com/v1',
    paramsTransform: (data) => R.merge(data, { decorated: true })
  })

  const users = repoint.generate('users')
  const mockedResponse = { id: 1, first_name: 'Alex' }

  const interceptor = nock('http://api.example.com/v1')
                        .patch('/users/1', {
                          email: 'example@gmail.com',
                          decorated: true
                        })
                        .reply(200, mockedResponse)

  const actualResponse = { id: 1, first_name: 'Alex' }

  users.update({ id: 1, email: 'example@gmail.com' })
       .then((data) => {
          t.deepEqual(data, actualResponse)
          nock.removeInterceptor(interceptor)
          t.end()
        })
})

test('beforeSuccess', t => {
  const repoint = new Repoint({
    host: 'http://api.example.com/v1',
    beforeSuccess: (data) => R.merge(data, { decorated: true })
  })

  const users = repoint.generate('users')
  const mockedResponse = { users: [{ id: 1, first_name: 'Alex' }, { id: 2, first_name: 'Bob' }] }

  const interceptor = nock('http://api.example.com/v1')
    .get('/users')
    .reply(200, mockedResponse)

  const actualResponse = { users: [ { first_name: 'Alex', id: 1 }, { id: 2, first_name: 'Bob' } ], decorated: true }

  users.getCollection({})
       .then((data) => {
          t.deepEqual(data, actualResponse)
          nock.removeInterceptor(interceptor)
          t.end()
        })
})

// test('beforeError', t => {
//   const repoint = new Repoint({
//     host: 'http://api.example.com/v1',
//     beforeError: (data) => data
//   })

//   const users = repoint.generate('users')

//   const interceptor = nock('http://api.example.com/v1')
//     .get('/users')
//     .replyWithError('Not Authorized')

//   const actualResponse = { error: 'Not Authorized', decorated: true }

//   t.throws(users.getCollection.bind(null, {}), /Not Authorized/, 'throws error')
//   t.end()
// })
