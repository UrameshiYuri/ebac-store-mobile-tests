import BasePage from './base.page.js'

class CheckoutPage extends BasePage {
    addressCards = [
        '~addressCard',
        '-ios predicate string:name CONTAINS[c] "addressCard"',
        '-ios predicate string:label CONTAINS[c] "address" AND type == "XCUIElementTypeOther"'
    ]

    addAddressButton = [
        '~Add Address',
        '~addAddress',
        '~btnAddAddress',
        '-ios predicate string:(name CONTAINS[c] "add address" OR label CONTAINS[c] "add address")'
    ]

    continueButton = [
        '~Continue',
        '~Next',
        '~btnContinue',
        '-ios predicate string:(name ==[c] "Continue" OR label ==[c] "Continue" OR name ==[c] "Next" OR label ==[c] "Next")'
    ]

    paymentButton = [
        '~Payment',
        '~Go to payment',
        '~btnPayment',
        '-ios predicate string:(name CONTAINS[c] "payment" OR label CONTAINS[c] "payment")'
    ]

    placeOrderButton = [
        '~Place Order',
        '~Complete Order',
        '~Finish',
        '~btnPlaceOrder',
        '-ios predicate string:(name CONTAINS[c] "place order" OR label CONTAINS[c] "place order" OR name CONTAINS[c] "complete order" OR label CONTAINS[c] "complete order")'
    ]

    successMessage = [
        '~Order Success',
        '~Order placed successfully',
        '-ios predicate string:(name CONTAINS[c] "success" OR label CONTAINS[c] "success" OR name CONTAINS[c] "thank" OR label CONTAINS[c] "thank")'
    ]

    fields = {
        fullName: ['~fullName', '~name', '-ios predicate string:name CONTAINS[c] "name" AND type == "XCUIElementTypeTextField"'],
        phone: ['~phone', '-ios predicate string:name CONTAINS[c] "phone" AND type == "XCUIElementTypeTextField"'],
        zipCode: ['~zipCode', '~postalCode', '-ios predicate string:(name CONTAINS[c] "zip" OR name CONTAINS[c] "postal") AND type == "XCUIElementTypeTextField"'],
        street: ['~street', '~address', '-ios predicate string:(name CONTAINS[c] "street" OR name CONTAINS[c] "address") AND type == "XCUIElementTypeTextField"'],
        number: ['~number', '-ios predicate string:name CONTAINS[c] "number" AND type == "XCUIElementTypeTextField"'],
        city: ['~city', '-ios predicate string:name CONTAINS[c] "city" AND type == "XCUIElementTypeTextField"'],
        state: ['~state', '-ios predicate string:name CONTAINS[c] "state" AND type == "XCUIElementTypeTextField"']
    }

    async ensureAddress(address) {
        if (await this.isAnyDisplayed(this.addressCards)) {
            await this.clickFirst(this.addressCards)
            return
        }

        await this.clickFirst(this.addAddressButton)
        await this.setFirst(this.fields.fullName, address.fullName)
        await this.setFirst(this.fields.phone, address.phone)
        await this.setFirst(this.fields.zipCode, address.zipCode)
        await this.setFirst(this.fields.street, address.street)

        // Optional fields vary between app builds.
        for (const [field, value] of [['number', address.number], ['city', address.city], ['state', address.state]]) {
            try {
                await this.setFirst(this.fields[field], value, 2500)
            } catch (_) {
                // Keep the flow compatible with builds that auto-complete these fields.
            }
        }

        await this.clickFirst([
            '~Save',
            '~Save Address',
            '~btnSaveAddress',
            '-ios predicate string:(name CONTAINS[c] "save" OR label CONTAINS[c] "save")'
        ])
    }

    async goToPayment() {
        if (await this.isAnyDisplayed(this.paymentButton)) {
            await this.clickFirst(this.paymentButton)
            return
        }
        await this.clickFirst(this.continueButton)
    }

    async completePayment() {
        const paymentOptions = [
            '~Cash on Delivery',
            '~Credit Card',
            '~Pix',
            '-ios predicate string:(name CONTAINS[c] "cash" OR label CONTAINS[c] "cash" OR name CONTAINS[c] "credit" OR label CONTAINS[c] "credit" OR name CONTAINS[c] "pix" OR label CONTAINS[c] "pix")'
        ]

        try {
            await this.clickFirst(paymentOptions, 4000)
        } catch (_) {
            // Some builds preselect the only available payment method.
        }

        if (await this.isAnyDisplayed(this.continueButton)) {
            await this.clickFirst(this.continueButton)
        }

        await this.clickFirst(this.placeOrderButton)
    }

    async waitForSuccess() {
        const message = await this.findFirst(this.successMessage, 15000)
        await message.waitForDisplayed({ timeout: 15000 })
        return message
    }
}

export default new CheckoutPage()
