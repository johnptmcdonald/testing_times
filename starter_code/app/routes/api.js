var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var usersController = require("../controllers/usersController")
var sessionsController = require("../controllers/sessionsController")
var sampleUsersController = require("../controllers/sampleUsersController")
var auth = require("../auth/authService")

module.exports = function(app, express) {

	var apiRouter = express.Router();

	apiRouter.get('/test', function(req, res){
		res.json({message: "apiRouter works"})
	})
	// route to generate sample user
	apiRouter.post('/sample', sampleUsersController.create);

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', sessionsController.create);

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(auth.isAuthenticated, usersController.create)

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(auth.isAuthenticated,usersController.index);

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(auth.isAuthenticated, usersController.show)

		// update the user with this id
		.put(auth.isAuthenticated, usersController.update)

		// delete the user with this id
		.delete(auth.isAuthenticated, usersController.destroy);

	// part of auth service to get current user
	apiRouter.get('/me', auth.isAuthenticated, auth.me);


	return apiRouter;
};