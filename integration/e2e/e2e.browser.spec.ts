import {browser, $} from 'protractor';
import { loadServerView, loadClientView } from './e2e.utils';

describe('e2e test preboot', function () {

  it('should validate server view', function () {
    loadServerView()
      .then(() => $('h1').getText())
      .then(text => expect(text).toEqual('server view'));
  });

  it('should validate basic client view', function () {
    loadServerView()
      .then(() => loadClientView())
      .then(() => $('h1').getText())
      .then(text => expect(text).toEqual('client view'));
  });

  it('should validate typing input to a text box', function () {
    const input = 'foo man choo';

    loadServerView()
      .then(() => $('#myTextBox').click())
      .then(() => browser.actions().sendKeys(input).perform())
      .then(() => loadClientView())
      .then(() => $('#myTextBox').getAttribute('value'))
      .then(actual => expect(actual).toEqual(input));
  });

  it('should validate choosing from a select', function () {
    const expected = 'foo';

    loadServerView()
      .then(() => $('#mySelect').click())
      .then(() => $('#myVal').click())
      .then(() => loadClientView())
      .then(() => $('#mySelect').$('option:checked').getText())
      .then(actual => expect(actual).toEqual(expected));
  });
});
