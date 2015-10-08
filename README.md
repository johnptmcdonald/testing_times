### Overview

We've built an awesome MEAN app! Great!

But if we haven't been testing it continually, it's not an awesome MEAN app :(

There are two types of testing you will be doing:


##1) end-to-end testing (e2e)
End to end tests, a.k.a. integration tests, a.k.a. feature tests

These are used to test the functionality of your application as if a user is running it. They test all the components of the application from the UI down to the database. These tests are slow but are good at catching unexpected errors. 

##2) Unit tests 
Unit tests involve testing a single component by itself. These are the tests that are used in TDD (test driven development). If you are about to build an API endpoint for GET /api/articles (which should return all the articles, if the API is nice and RESTful), then you might first write a test that that makes an HTTP request to this endpoint. This is a single feature that can be easily tested. 

A well written application uses both end-to-end tests and unit tests. 

#Part 1: end-to-end tests

## Protractor

Protractor is a tool developed by the guys behind Angular for running e2e tests. That means, you KNOW it's good. It's not limited to just Angular apps, but it is designed specifically for them. Protractor uses Selenium-WebDriver (software that actually launches a browser and interacts with a page to test what happens) 


```
npm install protractor --save-dev
```

<i>We use the dev flag because Protractor is pretty big. We don't want to put all that stuff on our production servers</i>

Protractor comes with a utility for setting up WebDriver with Selenium. Let's do that now:

```
$ ./node_modules/.bon/webdriver-manager update
```

Take a look at the starter code (modified from a Scotch.io app), as we're going to writing a few tests for this simple app. 

Take a look around the code. The server stuff is kept in the app directory, while the client stuff is kept in the public directory. 

In the root of the directory we've got a config file with a DB for each environment, we've got a secret in order to sign our JWTs (JSON Web Tokens), and we're setting our port to be 8080 unless it's already been set somewhere else. 


###Testing frameworks
Protractor is just a test runner. We need a testing framework in which to write the tests before protractor can actually be used. Javascript has 3 main testing frameworks:

* QUnit - Old and inflexible. You won't see this around

* Jasmine - developed by Pivotal Labs, so you know it's good. It was written to be RSpec like, and has pretty much become the standard testing tool for angular.

* Mocha - This testing framework is very popular for node apps. It can be used for angular as well though. 


###Make our test directories!

Make a directory called "test" in the root of the app. The test directory should contain three new directories: e2e, ng, and server. These are the folders where we will write our tests (we're actually only going to write e2e tests in this app today, but maybe we can come back and write client and server unit tests another day)

### making_a_user.spec.js
The e2e tests are very broad, and represent a major flow of a user. In our case, we're going to write a test to simulate a user going to our app, creating the test user, logging in, then creating their own user and viewing that user on the page. Think of it as testing a complete user story. 

We're going to be using protractor in order to be able to interact with our app on a browser as a user would, and we will be using the Chai assertion library in order to be able to "expect" things. 

This is the pseudo-code of what we want to do:

```
// require the user model (as we know we are going to be creating a user)
var User = require('../../app/models/user')

// require Chai's assertion library to help us test the final outcome of the user flow
var expect  = require('chai').expect


describe('making a post', function(){
    it('logs in and creates a new user', function(){

        // go to homepage
        // click login
        // click create test user
        // write in the username and password of this test user
        // click login
        // click on the new user button
        // write in a new user's name and password
        // submit this new user
        // browse to the users index page

        // see if the person we just created is listed on the page

        // after we've done this we should probably scrub our database - we 

    })

})
```



##Configuring Protractor
In order to get protractor to run properly, we need a configuration file. create a new file called "protractor.conf.js" at the root of the app, and copy/paste this in:

```
exports.config = {
  framework: 'mocha',
  directConnect: true,
  // tells it where to find the specs
  specs: [
    'test/e2e/**/*.spec.js'
  ],
  // this bit is to stop it timing out too easily
  mochaOpts: {
    enableTimeouts: false
  },
  // this starts a server so you don't need to run separately run one
  onPrepare: function(){
    console.log("starting up server")
    process.env.PORT = 3000
    require('./server')
  }
}
```

We said we were going to use mocha, so we should probably install it as a dependency:

```
$ npm install --save-dev mocha
```

Great, now we can finally run protractor with:

```
$ ./node_modules/.bin/protractor
```

[I ended up added this to my PATH environment variable, so I just have to type 'protractor' to get the test to run. If you want to do this you can add this to your bash profile: <i>export PATH="./node_modules/.bin:$PATH"</i>]


-------------------------------------------


```
var User = require('../../app/models/user')
var expect  = require('chai').expect

describe('making a post', function(){
    it('logs in and creates a new user', function(){

        console.log("about to get /")
        browser.get("http://localhost:3000")
        element(by.css('.login')).click()
        element(by.css('.create-sample-user')).click()
        element(by.model('login.loginData.username')).sendKeys('chris')
        element(by.model('login.loginData.password')).sendKeys('supersecret')
        element(by.css('.btn-block')).click()

        element(by.css('.new-user')).click()
        element(by.model('user.userData.name')).sendKeys('test name')
        element(by.model('user.userData.username')).sendKeys('test username')
        element(by.model('user.userData.password')).sendKeys('secret')
        element(by.css('.create-user')).click()

        browser.get("http://localhost:3000/users")

        element.all(by.css('td')).get(5).getText().then(function(text){
            expect(text).to.contain("test name")
        })

    })

    afterEach(function(){
        User.remove({}, function(){
            console.log("all users in test database deleted")
        })
    })
})

```

## A couple of words about our three environments

You can see that I have a different DB for production, dev, and testing, as my config.js is set up as follows:

```
module.exports = {
    'port': process.env.PORT || 8080,
    'database': {
        'production': 'mongodb://node:noder@novus.modulusmongo.net:27017/Iganiq8o',
        'development': 'mongodb://localhost/my-app-dev',
        'test': 'mongodb://localhost/my-app-test',
    },
    'secret': 'ilovescotchscotchyscotchscotch'
};

```
Here you can see that the default port is 8080. But I want my tests to run no matter whether I have a dev server running, so in my protractor setup, I'm going to set the PORT to 3000, then run the server.js file with that port. 



# Part 2: Unit tests

## Testing the server - Mocha/Chai

Inside our server folder we'll make a new folder called controllers, and inside that we'll make a new directory called api, then inside that we'll make our users.spec.js file

Just like with protractor, I want to set up a PORT that's different from my development server, and I want the node environment to be 'test' so it runs the test database. 

```
process.env.PORT = 3000
process.env.NODE_ENV = 'test'
```


I'm using supertest to make http requests:

```
var expect = require('chai').expect
var usersController = require('../../../../app/controllers/usersController')
var request = require('supertest');
var User = require('../../../../app/models/user')

process.env.PORT = 3000
process.env.NODE_ENV = 'test'
require('../../../../server')

var createUser = require('../../support/user')
```

This is an easy one to check that something exists:

```
describe('controllers.users', function () {
  it('exists', function () {
    expect(usersController).to.exist
  })
})
```

But we have to do better. Remember we need to be testing our api endpoints, so it is api/users, not just /users.

These endpoints are all secured. So we need to create a user and get a JWT before we hit the endpoint.

So we need to make a support file in server/support/user.js

this is where we will make a user and authenticate him/her, and in so doing, create a JWT.

```

var bcrypt = require('bcrypt-nodejs')
var jwt = require('jsonwebtoken')
var config = require('../../../config')
var User = require('../../../app/models/user')
var superSecret = config.secret

function createUser(name, username, password, cb) {

    var user = new User();      // create a new instance of the User model
    user.name = name;  // set the users name (comes from the request)
    user.username = username;  // set the users username (comes from the request)
    user.password = password;  // set the users password (comes from the request)

    user.save(function(err) {
        if (err) {
            cb(err, null)
        }

        var token = jwt.sign({
            name: user.name,
            username: user.username
        }, superSecret, {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        user.token = token      
        cb(null, user)
    });
}


module.exports = createUser


```

we now have to make this user in the actual spec file, grab his JWT, then put in in the supertest http request:

```
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

describe('info at root directory', function(){
    it('does something', function(done){

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

```




# testing_times
