import { browser } from 'protractor';

declare var bootstrapPrebootClient: any;

const port = 9393;

export async function loadServerView() {
    await browser.waitForAngularEnabled(false);
    await browser.get(`http://localhost:${port}/`);
    await browser.refresh();
}

export async function loadClientView() {
  await loadClientScript();
  await browser.executeScript('bootstrapPrebootClient()');
}

export async function loadClientScript() {
  await browser.executeScript(function () {
    console.log('executeScript()');
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = 'postrender.js';
    document.getElementsByTagName('html')[0].appendChild(scriptTag);
  });
  return new Promise((resolve) => {
    waitUntilExists(resolve);
  });
}

export async function waitUntilExists(done: Function) {
  const keyExists = await browser.executeScript<boolean>(() => typeof bootstrapPrebootClient !== 'undefined');
  if (keyExists) {
    done();
  } else {
    setTimeout(() => waitUntilExists(done), 10);
  }
}
