var User = require("../models/user")

function create(req, res) {
	console.log("generating fake user")

	// look for the user named chris
	User.findOne({ 'username': 'chris' }, function(err, user) {

		// if there is no chris user, create one
		if (!user) {
			var sampleUser = new User();

			sampleUser.name = 'Chris';  
			sampleUser.username = 'chris'; 
			sampleUser.password = 'supersecret';

			sampleUser.save();
		} else {
			console.log(user);

			// if there is a chris, update his password
			user.password = 'supersecret';
			user.save();
		}
		res.send(200)
	});

}

module.exports = {
	create: create
}

