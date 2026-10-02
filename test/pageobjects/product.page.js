import { $ } from '@wdio/globals'
import BasePage from './base.page.js'

class ProductPage extends BasePage {
    async getProductTitle(name){
        return $(`~${name}`)
    }

    async addToCart() {
        await this.clickFirst([
            '~Add to Cart',
            '~Add To Cart',
            '~btnAddToCart',
            '-ios predicate string:(name CONTAINS[c] "add to cart" OR label CONTAINS[c] "add to cart")'
        ])
    }
}

export default new ProductPage()
