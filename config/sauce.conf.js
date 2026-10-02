import { generalConf } from './general.conf.js'
export let sauceConf = {
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    hostname: 'ondemand.us-west-1.saucelabs.com',
    port: 443,
    baseUrl: 'wd/hub',
    capabilities: process.env.PLATFORM === "android" ? [
        {
            platformName: 'Android',
            'appium:app': 'storage:filename=ebacshop (1).aab',
            'appium:deviceName': 'Samsung.*',
            'appium:platformVersion': '10',
            'appium:automationName': 'UiAutomator2',
            'appium:disableIdLocatorAutocompletion': true,
            'sauce:options': {
                build: 'appium-build-teste-ebacshop-android',
                name: 'Ebac Shop Teste',
                deviceOrientation: 'PORTRAIT',
                appiumVersion: '2.0.0'
            },
        }
    ] : [
        {
            platformName: 'iOS',
            'appium:app': process.env.SAUCE_IOS_APP || 'storage:filename=LojaEBAC.ipa',
            'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone.*',
            'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || '17',
            'appium:automationName': 'XCUITest',
            'sauce:options': {
                build: process.env.SAUCE_BUILD || 'appium-build-ebacshop-ios',
                name: 'EBAC Store iOS Checkout',
                deviceOrientation: 'PORTRAIT',
                appiumVersion: '2.0.0'
            },
        }
    ],
    ...generalConf
}
