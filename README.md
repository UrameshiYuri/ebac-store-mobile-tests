# 📱 Instalar o app EBACShop no emulador Android

## 1. Baixar o pacote de APKs
Baixe o arquivo `.apks.zip` neste link:  
👉 [Download ebacshop.apks.zip](https://github.com/EBAC-QE/ebac-store-mobile-tests/raw/apks/app/ebacshop.apks.zip)

Após o download, extraia o arquivo para obter o **`ebacshop.apks`**.

---

## 2. Abrir o emulador Android
Abra o **Android Emulator** no Android Studio (ou outro emulador configurado).  
Deixe o emulador rodando, pois o **bundletool** vai instalar o app diretamente nele.

---

## 3. Instalar com o bundletool
No terminal, vá até a pasta onde está o arquivo **`ebacshop.apks`** e execute:

```bash
bundletool install-apks --apks=./ebacshop.apks
````
## 4. Confirmar a instalação

Após a execução, o app EBACShop estará disponível no emulador, pronto para ser aberto e testado 🚀

## CI: GitHub Actions + Sauce Labs

A branch `ci` executa o teste de login Android em um dispositivo real do Sauce Labs.
A escolha reaproveita a configuração Appium/WebdriverIO existente e permite enviar
`app/ebacshop.aab` diretamente, sem converter o aplicativo manualmente.

### Configurar uma vez

Em **Settings → Secrets and variables → Actions**, adicione os repository secrets:

| Secret | Valor |
| --- | --- |
| `SAUCE_USERNAME` | Nome de usuário do Sauce Labs |
| `SAUCE_ACCESS_KEY` | Access Key da conta Sauce Labs |

A conta precisa ter acesso ao **Real Device Cloud com automação Appium**
no data center escolhido. Não coloque a Access Key no código ou no chat.

Variables opcionais no mesmo menu:

| Variable | Padrão |
| --- | --- |
| `SAUCE_REGION` | `us-west-1`; também aceita `us-east-4` e `eu-central-1` |
| `SAUCE_DEVICE` | `Samsung.*Galaxy.*` (alocação dinâmica) |
| `SAUCE_PLATFORM_VERSION` | Sem restrição; selecione uma versão disponível na conta se necessário |
| `SAUCE_APPIUM_VERSION` | `stable` |

### Executar e entregar o vídeo

1. Faça um push na branch `ci`. O workflow **Mobile tests - Sauce Labs** inicia automaticamente.
2. Abra **Actions**, selecione a execução e acompanhe o job `android`.
3. Se faltavam secrets, cadastre-os e use **Re-run all jobs** na execução que falhou.
4. Ao terminar, baixe o artifact `sauce-evidence-<run_id>-<attempt>`.
5. Extraia `videos/<session-id>.mp4` e envie esse vídeo junto com o link da execução
   e o link da branch `ci`. A estrutura do ZIP também contém `sessions/` e, quando
   produzidos pelo teste, os resultados Allure.

O workflow tem `workflow_dispatch`, mas o botão **Run workflow** só aparece quando
esse workflow também existe na branch padrão. Na branch `ci`, use push ou reexecução.

O vídeo é produzido pelo Sauce Labs durante a sessão real. O script aguarda sua
codificação e falha caso não consiga baixá-lo; nenhuma gravação é simulada.
Os artifacts são mantidos por 14 dias no GitHub, então faça o download para entregar.
Se a criação da sessão falhar, não existe vídeo. Se o teste falhar após iniciar a
sessão, a coleta de evidências ainda será tentada e o workflow permanece com falha.

### Execução local contra a nuvem

Com Node.js 22 e as variáveis `SAUCE_USERNAME`, `SAUCE_ACCESS_KEY` e `SAUCE_APP`
definidas no ambiente (`SAUCE_APP=storage:<id-do-upload>`):

```bash
npm ci
npm test
python3 scripts/download-sauce-videos.py
```

O pipeline utiliza o ID retornado pelo upload para testar exatamente o AAB daquele
commit. A asserção de login aguarda a exibição de **EBAC Cliente**, e o status final
é enviado ao Sauce Labs. O teste depende de o backend EBAC e a conta de demonstração
já usada no projeto estarem disponíveis.

Referências:
- https://docs.saucelabs.com/mobile-apps/automated-testing/appium/real-devices/
- https://docs.saucelabs.com/dev/api/storage/
- https://docs.saucelabs.com/dev/api/rdc/
