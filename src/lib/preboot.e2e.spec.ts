import {browser, $} from 'protractor';
import {loadServerView, loadClientView} from './testing/e2e.utils';

describe('e2e test preboot', () => {
  it('should validate server view', async () => {
    await loadServerView();
    const text = await $('h1').getText();
    expect(text).toEqual('server view');
  });

  it('should validate basic client view', async () => {
    await loadServerView();
    await loadClientView();
    const text = await $('h1').getText();
    expect(text).toEqual('client view');
  });

  it('should validate typing input to a text box', async () => {
    const input = 'foo man choo';
    await loadServerView();
    await $('#myTextBox').click();
    await browser.actions().sendKeys(input).perform();
    await loadClientView();
    const actual = await $('#myTextBox').getAttribute('value');
    expect(actual).toEqual(input);
  });

  it('should validate choosing from a select', async () => {
    const expected = 'foo';
    await loadServerView();
    await $('#mySelect').click();
    await $('#myVal').click();
    await loadClientView();
    const actual = await $('#mySelect').$('option:checked').getText();
    expect(actual).toEqual(expected);
  });
});
