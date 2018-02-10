module.exports = function(config) {
	config.set({
		basePath: '../',

		frameworks: [
			'mocha',
			'browserify',
		],

		files: [
			'test/browser/*.js',
			'lib/*.js',
		],

		preprocessors: {
			'test/browser/*.js': ['browserify'],
			'lib/*.js': ['browserify'],
		},

		browserify: {
			debug: true,
			transform: [
				['babelify', {
					'presets': ['env', 'power-assert'],
					'plugins': ['istanbul'],
				}],
			],
		},

		reporters: ['mocha', 'coverage'],
		coverageReporter: {type: 'lcov'},

		autoWatch: false,
		singleRun: true,

		browsers: ['ChromeHeadless', 'FirefoxHeadless'],

		customLaunchers: {
			Chrome_travis: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox'],
			},
		},
	});
}
