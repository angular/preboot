import { browser, element, by } from 'protractor';
import { startServer, stopServer } from './e2e.server';
import { loadServerView, loadClientView } from './e2e.utils';

describe('e2e test preboot', function () {

  beforeAll(startServer);
  afterAll(stopServer);

  it('should validate server view', function () {
    loadServerView()
      .then(() => element(by.css('h1')).getText())
      .then(text => expect(text).toEqual('server view'));
  });

  it('should validate basic client view', function () {
    loadServerView()
      .then(() => loadClientView())
      .then(() => element(by.css('h1')).getText())
      .then(text => expect(text).toEqual('client view'));
  });

  it('should validate typing input to a text box', function () {
    const input = 'foo man choo';

    loadServerView()
      .then(() => element(by.css('#myTextBox')).click())
      .then(() => browser.actions().sendKeys(input).perform())
      .then(() => loadClientView())
      .then(() => element(by.css('#myTextBox')).getAttribute('value'))
      .then(actual => expect(actual).toEqual(input));
  });

  it('should validate choosing from a select', function () {
    const expected = 'foo';

    loadServerView()
      .then(() => element(by.css('#mySelect')).click())
      .then(() => element(by.css('#myVal')).click())
      .then(() => loadClientView())
      .then(() => element(by.css('#mySelect')).element(by.css('option:checked')).getText())
      .then(actual => expect(actual).toEqual(expected));
  });
});
