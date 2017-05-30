import { browser, element, by } from 'protractor';
import { startServer, stopServer } from './e2e.server';

describe('e2e test preboot', function () {

  beforeAll(startServer);
  afterAll(stopServer);

  it('should validate server view', function () {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:4201/');

    element(by.css('h1')).getText()
      .then(text => expect(text).toEqual('server view'));
  });

  it('should validate basic client view', function () {
    browser.waitForAngularEnabled(false);
    browser.get('http://localhost:4201/');
    browser.executeScript('bootstrapPrebootClient()')
      .then(() => element(by.css('h1')).getText())
      .then(text => expect(text).toEqual('client view'));
  });
});

