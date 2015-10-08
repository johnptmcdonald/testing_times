module.exports = {
	'port': process.env.PORT || 8080,
	'database': {
		'production': 'mongodb://node:noder@novus.modulusmongo.net:27017/Iganiq8o',
		'development': 'mongodb://localhost/my-app-dev',
		'test': 'mongodb://localhost/my-app-test',
	},
	'secret': 'ilovescotchscotchyscotchscotch'
};