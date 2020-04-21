exports.config = {
    baseUrl: 'http://127.0.0.1/maarch_courrier_develop/cs_recette',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        'index-resource-spec.js',
        //'login-spec.js',
        //'about-us-spec.js'
    ],
    multiCapabilities: [
        {
            'browserName': 'chrome',
            'chromeOptions': {
                'args': ["--no-sandbox", "--headless", "--disable-gpu",  "--window-size=1920,1080"]
            },
        },
        {
            'browserName': 'firefox',
            'moz:firefoxOptions': {
                'args': ["--headless", "--width=1920", "--height=1080"]
            }
        }
    ],
    chromeDriver: '/usr/bin/chromedriver',

    onPrepare: () => {
        browser.driver.getCapabilities().then(function(caps){
            browser.browserName = caps.get('browserName');
        });
    }
};