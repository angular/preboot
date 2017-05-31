import { browser, element, by } from 'protractor';
import { startServer, stopServer } from './e2e.server';

function loadServerView() {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:4201/');
}

function loadClientView() {
  return browser.executeScript('bootstrapPrebootClient()');
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

  it('should validate typing in text box works', function () {
    loadServerView();

    const input = 'foo man choo';

    // type into client view
    element(by.css('#myTextBox')).click()
      .then(() => browser.actions().sendKeys('foo man choo').perform())
      .then(() => loadClientView())
      .then(() => element(by.css('#myTextBox')).getAttribute('value'))
      .then(actual => expect(actual).toEqual(input));
  });
});
