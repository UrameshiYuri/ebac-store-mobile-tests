import BasePage from './base.page.js'

class CartPage extends BasePage {
    cartTab = ['~tab-Cart', '~Cart', '-ios predicate string:name CONTAINS[c] "Cart"']
    checkoutButton = [
        '~Checkout',
        '~btnCheckout',
        '-ios predicate string:(name CONTAINS[c] "checkout" OR label CONTAINS[c] "checkout")'
    ]

    async open() {
        await this.clickFirst(this.cartTab)
    }

    async goToCheckout() {
        await this.clickFirst(this.checkoutButton)
    }
}

export default new CartPage()
