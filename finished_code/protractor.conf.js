exports.config = {
  framework: 'mocha',
  // what does directConnect mean?
  directConnect: true,
  // tells it where to find the specs
  specs: [
    'test/e2e/**/*.spec.js'
  ],
  // this bit is to stop errors with some version, don't know why
  mochaOpts: {
  	enableTimeouts: false
  },
  // this starts a server so you don't need to run yours on your own
  onPrepare: function(){
  	console.log("starting up server")
  	process.env.PORT = 3000
  	require('./server')
  }
}