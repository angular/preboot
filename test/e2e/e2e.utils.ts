import { browser, promise } from 'protractor';

declare var bootstrapPrebootClient: any;

export function loadServerView(): promise.Promise<any> {
    browser.waitForAngularEnabled(false);
    return browser.get('http://localhost:4201/')
      .then(() => browser.refresh());
}

export function loadClientView() {
  return loadClientScript()
    .then(() => browser.executeScript('bootstrapPrebootClient()'));
}

export function loadClientScript() {
  return new Promise((resolve) => {
    browser.executeScript(function () {
      console.log('executeScript()');
      const scriptTag = document.createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.src = '/e2e.browser.js';
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    });

    waitUntilExists(resolve);
  });
}

export function waitUntilExists(done: Function) {
  browser.executeScript(function () {
    return (typeof bootstrapPrebootClient !== 'undefined');
  })
    .then((keyExists: boolean) => {
      if (keyExists) {
        done();
      } else {
        setTimeout(() => waitUntilExists(done), 10);
      }
    });
}
