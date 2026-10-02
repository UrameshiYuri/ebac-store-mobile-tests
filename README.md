# EBAC Store Mobile Tests

Automação mobile com WebdriverIO + Appium.

## Exercício iOS — fluxo de checkout

A branch `ios-checkout-tests` cobre o fluxo solicitado:

1. Login
2. Acesso à área Browse
3. Busca e seleção de produto
4. Adição ao carrinho
5. Inclusão/seleção de endereço
6. Acesso ao pagamento
7. Finalização do checkout
8. Validação da confirmação do pedido

### Aplicativos

- Simulador iOS: `app/LojaEBAC-sim.app`
- Device real / Sauce Labs: `app/LojaEBAC.ipa`

Os artefatos vieram da branch `ios` do repositório de referência da EBAC.

### Pré-requisitos locais

- macOS
- Xcode com um simulador compatível
- Node.js
- Appium 2
- Driver XCUITest

Instale as dependências:

```bash
npm ci
appium driver install xcuitest
```

Crie um arquivo `.env` local (não versione credenciais pessoais):

```env
ENVIRONMENT=local
PLATFORM=ios
TEST_EMAIL=cliente@ebac.art.br
TEST_PASSWORD=<senha>
TEST_PRODUCT=In
TEST_PRODUCT_NAME=Ingrid Running Jacket
```

Em um terminal:

```bash
appium
```

Em outro:

```bash
npm run test:checkout
```

### Sauce Labs

Faça upload de `app/LojaEBAC.ipa` para o App Storage da Sauce Labs e configure:

```env
ENVIRONMENT=saucelabs
PLATFORM=ios
SAUCE_USERNAME=<usuario>
SAUCE_ACCESS_KEY=<chave>
TEST_EMAIL=cliente@ebac.art.br
TEST_PASSWORD=<senha>
```

Depois execute:

```bash
npm run test:checkout
```

### Observação sobre seletores

Os Page Objects priorizam accessibility ids e usam predicates iOS como fallback. Caso a versão do app exponha nomes de acessibilidade diferentes, ajuste somente os arrays de seletores em `test/pageobjects/checkout.page.js`, `cart.page.js` e `product.page.js`. O fluxo de teste permanece inalterado.
