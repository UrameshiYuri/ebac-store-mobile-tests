import { $ } from '@wdio/globals'

class BasePage {
    async findFirst(selectors, timeout = 10000) {
        for (const selector of selectors) {
            const element = await $(selector)
            try {
                if (await element.waitForExist({ timeout: Math.min(timeout, 1500) })) {
                    return element
                }
            } catch (_) {
                // Try the next selector.
            }
        }

        throw new Error(`None of the selectors matched: ${selectors.join(', ')}`)
    }

    async clickFirst(selectors, timeout = 10000) {
        const element = await this.findFirst(selectors, timeout)
        await element.waitForDisplayed({ timeout })
        await element.click()
        return element
    }

    async setFirst(selectors, value, timeout = 10000) {
        const element = await this.findFirst(selectors, timeout)
        await element.waitForDisplayed({ timeout })
        await element.setValue(value)
        return element
    }

    async isAnyDisplayed(selectors) {
        for (const selector of selectors) {
            const element = await $(selector)
            if (await element.isExisting() && await element.isDisplayed()) return true
        }
        return false
    }
}

export default BasePage
