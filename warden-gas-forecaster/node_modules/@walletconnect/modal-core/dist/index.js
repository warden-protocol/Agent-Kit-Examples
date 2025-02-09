import { proxy, subscribe, snapshot } from 'valtio/vanilla';

const state$7 = proxy({
  history: ["ConnectWallet"],
  view: "ConnectWallet",
  data: void 0
});
const RouterCtrl = {
  state: state$7,
  subscribe(callback) {
    return subscribe(state$7, () => callback(state$7));
  },
  push(view, data) {
    if (view !== state$7.view) {
      state$7.view = view;
      if (data) {
        state$7.data = data;
      }
      state$7.history.push(view);
    }
  },
  reset(view) {
    state$7.view = view;
    state$7.history = [view];
  },
  replace(view) {
    if (state$7.history.length > 1) {
      state$7.history[state$7.history.length - 1] = view;
      state$7.view = view;
    }
  },
  goBack() {
    if (state$7.history.length > 1) {
      state$7.history.pop();
      const [last] = state$7.history.slice(-1);
      state$7.view = last;
    }
  },
  setData(data) {
    state$7.data = data;
  }
};

const CoreUtil = {
  WALLETCONNECT_DEEPLINK_CHOICE: "WALLETCONNECT_DEEPLINK_CHOICE",
  WCM_VERSION: "WCM_VERSION",
  RECOMMENDED_WALLET_AMOUNT: 9,
  isMobile() {
    if (typeof window !== "undefined") {
      return Boolean(
        window.matchMedia("(pointer:coarse)").matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)
      );
    }
    return false;
  },
  isAndroid() {
    return CoreUtil.isMobile() && navigator.userAgent.toLowerCase().includes("android");
  },
  isIos() {
    const ua = navigator.userAgent.toLowerCase();
    return CoreUtil.isMobile() && (ua.includes("iphone") || ua.includes("ipad"));
  },
  isHttpUrl(url) {
    return url.startsWith("http://") || url.startsWith("https://");
  },
  isArray(data) {
    return Array.isArray(data) && data.length > 0;
  },
  isTelegram() {
    return typeof window !== "undefined" && // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Boolean(window.TelegramWebviewProxy) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Boolean(window.Telegram) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Boolean(window.TelegramWebviewProxyProto));
  },
  formatNativeUrl(appUrl, wcUri, name) {
    if (CoreUtil.isHttpUrl(appUrl)) {
      return this.formatUniversalUrl(appUrl, wcUri, name);
    }
    let safeAppUrl = appUrl;
    if (!safeAppUrl.includes("://")) {
      safeAppUrl = appUrl.replaceAll("/", "").replaceAll(":", "");
      safeAppUrl = `${safeAppUrl}://`;
    }
    if (!safeAppUrl.endsWith("/")) {
      safeAppUrl = `${safeAppUrl}/`;
    }
    this.setWalletConnectDeepLink(safeAppUrl, name);
    const encodedWcUrl = encodeURIComponent(wcUri);
    return `${safeAppUrl}wc?uri=${encodedWcUrl}`;
  },
  formatUniversalUrl(appUrl, wcUri, name) {
    if (!CoreUtil.isHttpUrl(appUrl)) {
      return this.formatNativeUrl(appUrl, wcUri, name);
    }
    let safeAppUrl = appUrl;
    if (safeAppUrl.startsWith("https://t.me")) {
      const formattedUri = Buffer.from(wcUri).toString("base64").replace(/[=]/g, "");
      if (safeAppUrl.endsWith("/")) {
        safeAppUrl = safeAppUrl.slice(0, -1);
      }
      this.setWalletConnectDeepLink(safeAppUrl, name);
      const url = new URL(safeAppUrl);
      url.searchParams.set("startapp", formattedUri);
      const link = url.toString();
      return link;
    }
    if (!safeAppUrl.endsWith("/")) {
      safeAppUrl = `${safeAppUrl}/`;
    }
    this.setWalletConnectDeepLink(safeAppUrl, name);
    const encodedWcUrl = encodeURIComponent(wcUri);
    return `${safeAppUrl}wc?uri=${encodedWcUrl}`;
  },
  async wait(miliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, miliseconds);
    });
  },
  openHref(href, target) {
    const adjustedTarget = this.isTelegram() ? "_blank" : target;
    window.open(href, adjustedTarget, "noreferrer noopener");
  },
  setWalletConnectDeepLink(href, name) {
    try {
      localStorage.setItem(CoreUtil.WALLETCONNECT_DEEPLINK_CHOICE, JSON.stringify({ href, name }));
    } catch (e) {
      console.info("Unable to set WalletConnect deep link");
    }
  },
  setWalletConnectAndroidDeepLink(wcUri) {
    try {
      const [href] = wcUri.split("?");
      localStorage.setItem(
        CoreUtil.WALLETCONNECT_DEEPLINK_CHOICE,
        JSON.stringify({ href, name: "Android" })
      );
    } catch (e) {
      console.info("Unable to set WalletConnect android deep link");
    }
  },
  removeWalletConnectDeepLink() {
    try {
      localStorage.removeItem(CoreUtil.WALLETCONNECT_DEEPLINK_CHOICE);
    } catch (e) {
      console.info("Unable to remove WalletConnect deep link");
    }
  },
  setModalVersionInStorage() {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(CoreUtil.WCM_VERSION, "2.7.0");
      }
    } catch (e) {
      console.info("Unable to set Web3Modal version in storage");
    }
  },
  getWalletRouterData() {
    var _a;
    const routerData = (_a = RouterCtrl.state.data) == null ? void 0 : _a.Wallet;
    if (!routerData) {
      throw new Error('Missing "Wallet" view data');
    }
    return routerData;
  }
};

const isEnabled = typeof location !== "undefined" && (location.hostname.includes("localhost") || location.protocol.includes("https"));
const state$6 = proxy({
  enabled: isEnabled,
  userSessionId: "",
  events: [],
  connectedWalletId: void 0
});
const EventsCtrl = {
  state: state$6,
  subscribe(callback) {
    return subscribe(state$6.events, () => callback(snapshot(state$6.events[state$6.events.length - 1])));
  },
  initialize() {
    if (state$6.enabled && typeof (crypto == null ? void 0 : crypto.randomUUID) !== "undefined") {
      state$6.userSessionId = crypto.randomUUID();
    }
  },
  setConnectedWalletId(connectedWalletId) {
    state$6.connectedWalletId = connectedWalletId;
  },
  click(data) {
    if (state$6.enabled) {
      const event = {
        type: "CLICK",
        name: data.name,
        userSessionId: state$6.userSessionId,
        timestamp: Date.now(),
        data
      };
      state$6.events.push(event);
    }
  },
  track(data) {
    if (state$6.enabled) {
      const event = {
        type: "TRACK",
        name: data.name,
        userSessionId: state$6.userSessionId,
        timestamp: Date.now(),
        data
      };
      state$6.events.push(event);
    }
  },
  view(data) {
    if (state$6.enabled) {
      const event = {
        type: "VIEW",
        name: data.name,
        userSessionId: state$6.userSessionId,
        timestamp: Date.now(),
        data
      };
      state$6.events.push(event);
    }
  }
};

const state$5 = proxy({
  chains: void 0,
  walletConnectUri: void 0,
  isAuth: false,
  isCustomDesktop: false,
  isCustomMobile: false,
  isDataLoaded: false,
  isUiLoaded: false
});
const OptionsCtrl = {
  state: state$5,
  subscribe(callback) {
    return subscribe(state$5, () => callback(state$5));
  },
  setChains(chains) {
    state$5.chains = chains;
  },
  setWalletConnectUri(walletConnectUri) {
    state$5.walletConnectUri = walletConnectUri;
  },
  setIsCustomDesktop(isCustomDesktop) {
    state$5.isCustomDesktop = isCustomDesktop;
  },
  setIsCustomMobile(isCustomMobile) {
    state$5.isCustomMobile = isCustomMobile;
  },
  setIsDataLoaded(isDataLoaded) {
    state$5.isDataLoaded = isDataLoaded;
  },
  setIsUiLoaded(isUiLoaded) {
    state$5.isUiLoaded = isUiLoaded;
  },
  setIsAuth(isAuth) {
    state$5.isAuth = isAuth;
  }
};

const state$4 = proxy({
  projectId: "",
  mobileWallets: void 0,
  desktopWallets: void 0,
  walletImages: void 0,
  chains: void 0,
  enableAuthMode: false,
  enableExplorer: true,
  explorerExcludedWalletIds: void 0,
  explorerRecommendedWalletIds: void 0,
  termsOfServiceUrl: void 0,
  privacyPolicyUrl: void 0
});
const ConfigCtrl = {
  state: state$4,
  subscribe(callback) {
    return subscribe(state$4, () => callback(state$4));
  },
  setConfig(config) {
    var _a, _b;
    EventsCtrl.initialize();
    OptionsCtrl.setChains(config.chains);
    OptionsCtrl.setIsAuth(Boolean(config.enableAuthMode));
    OptionsCtrl.setIsCustomMobile(Boolean((_a = config.mobileWallets) == null ? void 0 : _a.length));
    OptionsCtrl.setIsCustomDesktop(Boolean((_b = config.desktopWallets) == null ? void 0 : _b.length));
    CoreUtil.setModalVersionInStorage();
    Object.assign(state$4, config);
  }
};

var __defProp$2 = Object.defineProperty;
var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$2.call(b, prop))
      __defNormalProp$2(a, prop, b[prop]);
  if (__getOwnPropSymbols$2)
    for (var prop of __getOwnPropSymbols$2(b)) {
      if (__propIsEnum$2.call(b, prop))
        __defNormalProp$2(a, prop, b[prop]);
    }
  return a;
};
const W3M_API = "https://explorer-api.walletconnect.com";
const SDK_TYPE = "wcm";
const SDK_VERSION = `js-${"2.7.0"}`;
async function fetchListings(endpoint, params) {
  const allParams = __spreadValues$2({ sdkType: SDK_TYPE, sdkVersion: SDK_VERSION }, params);
  const url = new URL(endpoint, W3M_API);
  url.searchParams.append("projectId", ConfigCtrl.state.projectId);
  Object.entries(allParams).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value));
    }
  });
  const request = await fetch(url);
  return request.json();
}
const ExplorerUtil = {
  async getDesktopListings(params) {
    return fetchListings("/w3m/v1/getDesktopListings", params);
  },
  async getMobileListings(params) {
    return fetchListings("/w3m/v1/getMobileListings", params);
  },
  async getInjectedListings(params) {
    return fetchListings("/w3m/v1/getInjectedListings", params);
  },
  async getAllListings(params) {
    return fetchListings("/w3m/v1/getAllListings", params);
  },
  getWalletImageUrl(imageId) {
    return `${W3M_API}/w3m/v1/getWalletImage/${imageId}?projectId=${ConfigCtrl.state.projectId}&sdkType=${SDK_TYPE}&sdkVersion=${SDK_VERSION}`;
  },
  getAssetImageUrl(imageId) {
    return `${W3M_API}/w3m/v1/getAssetImage/${imageId}?projectId=${ConfigCtrl.state.projectId}&sdkType=${SDK_TYPE}&sdkVersion=${SDK_VERSION}`;
  }
};

var __defProp$1 = Object.defineProperty;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
const isMobile = CoreUtil.isMobile();
const state$3 = proxy({
  wallets: { listings: [], total: 0, page: 1 },
  search: { listings: [], total: 0, page: 1 },
  recomendedWallets: []
});
const ExplorerCtrl = {
  state: state$3,
  async getRecomendedWallets() {
    const { explorerRecommendedWalletIds, explorerExcludedWalletIds } = ConfigCtrl.state;
    if (explorerRecommendedWalletIds === "NONE" || explorerExcludedWalletIds === "ALL" && !explorerRecommendedWalletIds) {
      return state$3.recomendedWallets;
    }
    if (CoreUtil.isArray(explorerRecommendedWalletIds)) {
      const recommendedIds = explorerRecommendedWalletIds.join(",");
      const params = { recommendedIds };
      const { listings } = await ExplorerUtil.getAllListings(params);
      const listingsArr = Object.values(listings);
      listingsArr.sort((a, b) => {
        const aIndex = explorerRecommendedWalletIds.indexOf(a.id);
        const bIndex = explorerRecommendedWalletIds.indexOf(b.id);
        return aIndex - bIndex;
      });
      state$3.recomendedWallets = listingsArr;
    } else {
      const { chains, isAuth } = OptionsCtrl.state;
      const chainsFilter = chains == null ? void 0 : chains.join(",");
      const isExcluded = CoreUtil.isArray(explorerExcludedWalletIds);
      const params = {
        page: 1,
        sdks: isAuth ? "auth_v1" : void 0,
        entries: CoreUtil.RECOMMENDED_WALLET_AMOUNT,
        chains: chainsFilter,
        version: 2,
        excludedIds: isExcluded ? explorerExcludedWalletIds.join(",") : void 0
      };
      const { listings } = isMobile ? await ExplorerUtil.getMobileListings(params) : await ExplorerUtil.getDesktopListings(params);
      state$3.recomendedWallets = Object.values(listings);
    }
    return state$3.recomendedWallets;
  },
  async getWallets(params) {
    const extendedParams = __spreadValues$1({}, params);
    const { explorerRecommendedWalletIds, explorerExcludedWalletIds } = ConfigCtrl.state;
    const { recomendedWallets } = state$3;
    if (explorerExcludedWalletIds === "ALL") {
      return state$3.wallets;
    }
    if (recomendedWallets.length) {
      extendedParams.excludedIds = recomendedWallets.map((wallet) => wallet.id).join(",");
    } else if (CoreUtil.isArray(explorerRecommendedWalletIds)) {
      extendedParams.excludedIds = explorerRecommendedWalletIds.join(",");
    }
    if (CoreUtil.isArray(explorerExcludedWalletIds)) {
      extendedParams.excludedIds = [extendedParams.excludedIds, explorerExcludedWalletIds].filter(Boolean).join(",");
    }
    if (OptionsCtrl.state.isAuth) {
      extendedParams.sdks = "auth_v1";
    }
    const { page, search } = params;
    const { listings: listingsObj, total } = isMobile ? await ExplorerUtil.getMobileListings(extendedParams) : await ExplorerUtil.getDesktopListings(extendedParams);
    const listings = Object.values(listingsObj);
    const type = search ? "search" : "wallets";
    state$3[type] = {
      listings: [...state$3[type].listings, ...listings],
      total,
      page: page != null ? page : 1
    };
    return { listings, total };
  },
  getWalletImageUrl(imageId) {
    return ExplorerUtil.getWalletImageUrl(imageId);
  },
  getAssetImageUrl(imageId) {
    return ExplorerUtil.getAssetImageUrl(imageId);
  },
  resetSearch() {
    state$3.search = { listings: [], total: 0, page: 1 };
  }
};

const state$2 = proxy({
  open: false
});
const ModalCtrl = {
  state: state$2,
  subscribe(callback) {
    return subscribe(state$2, () => callback(state$2));
  },
  async open(options) {
    return new Promise((resolve) => {
      const { isUiLoaded, isDataLoaded } = OptionsCtrl.state;
      CoreUtil.removeWalletConnectDeepLink();
      OptionsCtrl.setWalletConnectUri(options == null ? void 0 : options.uri);
      OptionsCtrl.setChains(options == null ? void 0 : options.chains);
      RouterCtrl.reset("ConnectWallet");
      if (isUiLoaded && isDataLoaded) {
        state$2.open = true;
        resolve();
      } else {
        const interval = setInterval(() => {
          const opts = OptionsCtrl.state;
          if (opts.isUiLoaded && opts.isDataLoaded) {
            clearInterval(interval);
            state$2.open = true;
            resolve();
          }
        }, 200);
      }
    });
  },
  close() {
    state$2.open = false;
  }
};

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
function isDarkMode() {
  return typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches;
}
const state$1 = proxy({
  themeMode: isDarkMode() ? "dark" : "light"
});
const ThemeCtrl = {
  state: state$1,
  subscribe(callback) {
    return subscribe(state$1, () => callback(state$1));
  },
  setThemeConfig(theme) {
    const { themeMode, themeVariables } = theme;
    if (themeMode) {
      state$1.themeMode = themeMode;
    }
    if (themeVariables) {
      state$1.themeVariables = __spreadValues({}, themeVariables);
    }
  }
};

const state = proxy({
  open: false,
  message: "",
  variant: "success"
});
const ToastCtrl = {
  state,
  subscribe(callback) {
    return subscribe(state, () => callback(state));
  },
  openToast(message, variant) {
    state.open = true;
    state.message = message;
    state.variant = variant;
  },
  closeToast() {
    state.open = false;
  }
};

export { ConfigCtrl, CoreUtil, EventsCtrl, ExplorerCtrl, ModalCtrl, OptionsCtrl, RouterCtrl, ThemeCtrl, ToastCtrl };
//# sourceMappingURL=index.js.map
