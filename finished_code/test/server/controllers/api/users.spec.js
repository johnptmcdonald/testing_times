var expect = require('chai').expect
var usersController = require('../../../../app/controllers/usersController')
var request = require('supertest');
var User = require('../../../../app/models/user')

process.env.PORT = 3000
process.env.NODE_ENV = 'test'
require('../../../../server')

var createUser = require('../../support/user')

describe('controllers.users', function () {
  it('exists', function () {
    expect(usersController).to.exist
  })
})

describe('controllers.users unauthenticated route', function(){
    it('responds with a test message', function(done){

        request('http://localhost:3000')
        .get('/api/test')
        .set('Content-Type', 'application/json')
        .end(function(err, response){
        	expect(response.body.message).to.include("apiRouter works")
        	done()
        })

    })
})

describe('controller.users index ', function(){
    it('returns a 200', function(done){

        request('http://localhost:3000')
        .get('/api/users')
        .set('x-access-token', token)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end(done)
            
    })
})


beforeEach(function(done){
	createUser("john", "john", "secret", function(err, user){
		token = user.token
		console.log(token)
		done(err)
	})	
})

afterEach(function(){
	User.remove({}, function(){
		console.log("all users in test database deleted")
	})
})






