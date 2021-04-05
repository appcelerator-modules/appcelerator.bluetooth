'use strict';

const path = require('path');
const fs = require('fs-extra');

function projectManagerHook(projectManager) {
	projectManager.once('prepared', function () {
		const tiapp = path.join(this.karmaRunnerProjectPath, 'tiapp.xml');
		var contents = fs.readFileSync(tiapp, 'utf8');
		contents = contents.replace('</android>', `<manifest>
                                                   			<uses-permission android:name="android.permission.BLUETOOTH" />
                                                   			<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
                                                   		</manifest>
		</android>`);
		fs.writeFileSync(tiapp, contents, 'utf8');
	});
}
projectManagerHook.$inject = [ 'projectManager' ];

module.exports = config => {
	config.set({
		basePath: '../..',
		frameworks: [ 'jasmine', 'projectManagerHook' ],
		files: [
			'test/unit/specs/bluetoothinit.spec.js',
			'test/unit/specs/**/*spec.js'
		],
		reporters: [ 'mocha', 'junit' ],
		plugins: [
			'karma-*',
			{
				'framework:projectManagerHook': [ 'factory', projectManagerHook ]
			}
		],
		titanium: {
			sdkVersion: config.sdkVersion || '9.3.1.GA'
		},
		customLaunchers: {
			android: {
				base: 'Titanium',
				browserName: 'Android AVD',
				displayName: 'android',
				platform: 'android'
			}
		},
		browsers: [ 'android' ],
		client: {
			jasmine: {
				random: false
			}
		},
		singleRun: true,
		retryLimit: 0,
		concurrency: 1,
		browserNoActivityTimeout: 120000,
		captureTimeout: 300000,
		logLevel: config.LOG_DEBUG
	});
};
