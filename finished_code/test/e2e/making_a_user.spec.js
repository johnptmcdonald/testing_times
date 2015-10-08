var User = require('../../app/models/user')
var expect  = require('chai').expect

describe('making a post', function(){
	it('logs in and creates a new user', function(){
		// go to homepage
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

		// click 'create sample user'
		// fill out and submit login form 
		// submit a new user on the user page

		// you should now see that new user on the page!
	})

	afterEach(function(){
		User.remove({}, function(){
			console.log("all users in test database deleted")
		})
	})
})






