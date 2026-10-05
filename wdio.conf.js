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
            appiumVersion: process.env.SAUCE_APPIUM_VERSION || 'appium2-2025-09',
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
        // RDC job IDs differ from Appium session IDs.
        const reportUrl = browser.capabilities.testobject_test_report_url
        const jobId = browser.capabilities.testobject_test_id
            || (reportUrl && new URL(reportUrl).pathname.split('/').filter(Boolean).at(-1))
        if (!jobId) throw new Error('Sauce Labs não retornou o ID do job RDC')
        mkdirSync('artifacts/sessions', { recursive: true })
        writeFileSync(`artifacts/sessions/${browser.sessionId}.json`, JSON.stringify({
            id: String(jobId), sessionId: browser.sessionId, region, specs, reportUrl
        }, null, 2))
    },
    afterTest: async function () {
        await driver.takeScreenshot()
    },
    after: async function (result) {
        if (!globalThis.driver?.sessionId || typeof driver.execute !== 'function') return
        await driver.execute(`sauce:job-result=${result === 0 ? 'passed' : 'failed'}`)
    }
}
