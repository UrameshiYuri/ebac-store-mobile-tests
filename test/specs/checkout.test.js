import { expect } from '@wdio/globals'
import homePage from '../pageobjects/home.page.js'
import loginPage from '../pageobjects/login.page.js'
import browsePage from '../pageobjects/browse.page.js'
import productPage from '../pageobjects/product.page.js'
import cartPage from '../pageobjects/cart.page.js'
import checkoutPage from '../pageobjects/checkout.page.js'

describe('iOS checkout flow', () => {
    it('should login, browse, add a product and complete checkout', async () => {
        const email = process.env.TEST_EMAIL
        const password = process.env.TEST_PASSWORD
        const productSearch = process.env.TEST_PRODUCT || 'In'
        const expectedProduct = process.env.TEST_PRODUCT_NAME || 'Ingrid Running Jacket'

        if (!email || !password) {
            throw new Error('Set TEST_EMAIL and TEST_PASSWORD in the environment before running checkout tests.')
        }

        await homePage.openMenu('Account')
        await loginPage.login(email, password)

        await homePage.openMenu('Browse')
        await homePage.search()
        await browsePage.searchInput.setValue(productSearch)

        const products = await browsePage.products
        expect(products.length).toBeGreaterThan(0)

        await products.at(0).click()
        await expect(await productPage.getProductTitle(expectedProduct)).toBeDisplayed()

        await productPage.addToCart()
        await cartPage.open()
        await cartPage.goToCheckout()

        await checkoutPage.ensureAddress({
            fullName: process.env.TEST_ADDRESS_NAME || 'EBAC Cliente',
            phone: process.env.TEST_ADDRESS_PHONE || '11999999999',
            zipCode: process.env.TEST_ADDRESS_ZIP || '01310100',
            street: process.env.TEST_ADDRESS_STREET || 'Avenida Paulista',
            number: process.env.TEST_ADDRESS_NUMBER || '1000',
            city: process.env.TEST_ADDRESS_CITY || 'Sao Paulo',
            state: process.env.TEST_ADDRESS_STATE || 'SP'
        })

        await checkoutPage.goToPayment()
        await checkoutPage.completePayment()
        await expect(await checkoutPage.waitForSuccess()).toBeDisplayed()
    })
})
