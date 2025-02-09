import { ModalCtrl, ThemeCtrl, ConfigCtrl, OptionsCtrl } from '@walletconnect/modal-core';

class WalletConnectModal {
  constructor(config) {
    this.openModal = ModalCtrl.open;
    this.closeModal = ModalCtrl.close;
    this.subscribeModal = ModalCtrl.subscribe;
    this.setTheme = ThemeCtrl.setThemeConfig;
    ThemeCtrl.setThemeConfig(config);
    ConfigCtrl.setConfig(config);
    this.initUi();
  }
  async initUi() {
    if (typeof window !== "undefined") {
      await import('@walletconnect/modal-ui');
      const modal = document.createElement("wcm-modal");
      document.body.insertAdjacentElement("beforeend", modal);
      OptionsCtrl.setIsUiLoaded(true);
    }
  }
}

export { WalletConnectModal };
//# sourceMappingURL=index.js.map
