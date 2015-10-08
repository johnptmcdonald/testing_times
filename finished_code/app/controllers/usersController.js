var User = require("../models/user")

function create(req, res) {
			
	var user = new User();		// create a new instance of the User model
	user.name = req.body.name;  // set the users name (comes from the request)
	user.username = req.body.username;  // set the users username (comes from the request)
	user.password = req.body.password;  // set the users password (comes from the request)

	user.save(function(err) {
		if (err) {
			// duplicate entry
			if (err.code == 11000) 
				return res.json({ success: false, message: 'A user with that username already exists. '});
			else 
				return res.send(err);
		}

		// return a message
		res.json({ message: 'User created!' });
	});
}


function index(req, res) {

	User.find({}, function(err, users) {
		if (err) res.send(err);

		// return the users
		res.json(users);
	});
}


function show(req, res) {
	User.findById(req.params.user_id, function(err, user) {
		if (err) res.send(err);

		// return that user
		res.json(user);
	});
}


function update(req, res) {
	User.findById(req.params.user_id, function(err, user) {

		if (err) res.send(err);

		// set the new user information if it exists in the request
		if (req.body.name) user.name = req.body.name;
		if (req.body.username) user.username = req.body.username;
		if (req.body.password) user.password = req.body.password;

		// save the user
		user.save(function(err) {
			if (err) res.send(err);

			// return a message
			res.json({ message: 'User updated!' });
		});

	});
}


function destroy(req, res) {
	User.remove({
		_id: req.params.user_id
	}, function(err, user) {
		if (err) res.send(err);

		res.json({ message: 'Successfully deleted' });
	});
}


module.exports = {
	create: create,
	index: index,
	update: update,
	show: show,
	destroy: destroy
}
