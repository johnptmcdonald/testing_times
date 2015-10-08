var User = require("../models/user")
var jwt = require('jsonwebtoken');
var config = require('../../config');
var bodyParser = require('body-parser'); 
var superSecret = config.secret;

function create(req, res) {

  // find the user
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user) {

    if (err) throw err;

    // no user with that username was found
    if (!user) {
      res.json({ 
      	success: false, 
      	message: 'Authentication failed. User not found.' 
    	});
    } else if (user) {

      // check if password matches
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        res.json({ 
        	success: false, 
        	message: 'Authentication failed. Wrong password.' 
      	});
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign({
        	name: user.name,
        	username: user.username
        }, superSecret, {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
}

module.exports = {
	create: create
}