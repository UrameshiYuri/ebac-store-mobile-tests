import { $ } from '@wdio/globals'

class HomePage {
    async openMenu(menu) {
        const selector = menu === 'profile'
            ? 'android=new UiSelector().text("Profile")'
            : `id:tab-${menu}`
        const tab = await $(selector)
        await tab.waitForDisplayed({ timeout: 60000 })
        await tab.click()
    }
}

export default new HomePage();
