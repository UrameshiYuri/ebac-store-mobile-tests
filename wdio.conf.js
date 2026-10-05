import { mkdirSync, writeFileSync } from 'node:fs'

const region = process.env.SAUCE_REGION || 'us-west-1'
if (!['us-west-1', 'us-east-4', 'eu-central-1'].includes(region)) {
    throw new Error('SAUCE_REGION inválida')
}
for (const name of ['SAUCE_USERNAME', 'SAUCE_ACCESS_KEY', 'SAUCE_APP']) {
    if (!process.env[name]) throw new Error(`Defina ${name} antes de executar os testes`)
}

export const config = {
    runner: 'local',
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    hostname: `ondemand.${region}.saucelabs.com`,
    protocol: 'https',
    port: 443,
    path: '/wd/hub',
    specs: ['./test/specs/**/*.js'],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:app': process.env.SAUCE_APP,
        'appium:deviceName': process.env.SAUCE_DEVICE || 'Samsung.*Galaxy.*',
        ...(process.env.SAUCE_PLATFORM_VERSION
            ? { 'appium:platformVersion': process.env.SAUCE_PLATFORM_VERSION } : {}),
        'appium:automationName': 'UiAutomator2',
        'appium:orientation': 'PORTRAIT',
        'appium:appWaitActivity': '.MainActivity',
        'appium:disableIdLocatorAutocompletion': true,
        'sauce:options': {
            build: process.env.SAUCE_BUILD || `ebac-local-${Date.now()}`,
            name: 'EBAC Shop - login Android',
            appiumVersion: process.env.SAUCE_APPIUM_VERSION || 'stable',
            recordVideo: true
        }
    }],
    logLevel: 'warn',
    waitforTimeout: 20000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 1,
    framework: 'mocha',
    reporters: ['spec', ['allure', {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false
    }]],
    mochaOpts: { ui: 'bdd', timeout: 120000 },
    before: function (capabilities, specs, browser) {
        mkdirSync('artifacts/sessions', { recursive: true })
        writeFileSync(`artifacts/sessions/${browser.sessionId}.json`, JSON.stringify({
            id: browser.sessionId, region, specs
        }, null, 2))
    },
    afterTest: async function () {
        await driver.takeScreenshot()
    },
    after: async function (result) {
        await driver.execute(`sauce:job-result=${result === 0 ? 'passed' : 'failed'}`)
    }
}
