// An example configuration file.
exports.config = {
    allScriptsTimeout: 99999,

    // Do not start a Selenium Standalone sever - only run this using chrome.
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:4300/',

    //Prepare For Testing
    onPrepare: function() {
        var folderName = (new Date()).toString().split(' ').splice(1, 4).join(' ');
        var mkdirp = require('mkdirp');
        var newFolder = "./reports/" + folderName;
        require('jasmine-reporters');

        mkdirp(newFolder, function(err) {
            if (err) {
                console.error(err);
            } else {
                jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter(newFolder, true, true));
            }
        });

        browser.driver.manage().window().setSize(1600, 1000);
    },

//    // This can be changed via the command line as:
//    // --params.login.user 'ngrocks'
//    params: {
//        login: {
//            user: 'drhanh',
//            password: '1234'
//        }
//    },


      // Spec patterns are relative to the current working directly when
      // protractor is called.
    specs: ['e2e/**/*_spec.js'],

      // Options to be passed to Jasmine-node.
      jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 90000,
        isVerbose: true,
        includeStackTrace: true

      },

    suites: {
        loginpage: 'e2e/login/*_spec.js'
    }
};
