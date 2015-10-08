
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jsonwebtoken')
var config = require('../../../config')
var User = require('../../../app/models/user')
var superSecret = config.secret

function createUser(name, username, password, cb) {
			
	var user = new User();		// create a new instance of the User model
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







