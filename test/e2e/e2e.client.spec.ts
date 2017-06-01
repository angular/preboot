import { browser, element, by } from 'protractor';
import { startServer, stopServer } from './e2e.server';

declare var bootstrapPrebootClient: any;

function loadServerView() {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:4201/');
}

function loadClientView() {
  return loadClientScript()
    .then(() => browser.executeScript('bootstrapPrebootClient()'));
}

function loadClientScript() {
  return new Promise((resolve) => {
    browser.executeScript(function () {
      console.log('executeScript()');
      const scriptTag = document.createElement('script');
      scriptTag.type = 'text/javascript';
      scriptTag.src = '/e2e.client.js';
      document.getElementsByTagName('head')[0].appendChild(scriptTag);
    });

    waitUntilExists(resolve);
  });
}

function waitUntilExists(done: Function) {
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

describe('e2e test preboot', function () {

  beforeAll(startServer);
  afterAll(stopServer);

  it('should validate server view', function () {
    loadServerView();

    element(by.css('h1')).getText()
      .then(text => expect(text).toEqual('server view'));
  });

  it('should validate basic client view', function () {
    loadServerView();

    loadClientView()
      .then(() => element(by.css('h1')).getText())
      .then(text => expect(text).toEqual('client view'));
  });

  it('should validate typing input to a text box', function () {
    const input = 'foo man choo';

    loadServerView();

    element(by.css('#myTextBox')).click()
      .then(() => browser.actions().sendKeys('foo man choo').perform())
      .then(() => loadClientView())
      // .then(() => element(by.css('body')).getAttribute('outerHTML'))
      // .then((html: string) => {
      //   console.log('html is ' + html);
      // });
      .then(() => element(by.css('#myTextBox')).click())
      .then(() => browser.actions().sendKeys('more').perform())
      .then(() => element(by.css('#myTextBox')).getAttribute('value'))
      .then(actual => expect(actual).toEqual(input));
  });
});
