import {RendererFactory2, RendererType2, ViewEncapsulation} from '@angular/core';
import {PlatformState} from '@angular/platform-server';
import {PrebootRecordOptions} from '../common/preboot.interfaces';
import {NonceOp} from './server-preboot.module';
import {getInlinePrebootCode} from './inline.preboot.code';

function addInlineCodeToDocument(inlineCode: string, doc: Document, rendererFactory: RendererFactory2, nonce: string) {
  const renderType: RendererType2 = { id: '-1', encapsulation: ViewEncapsulation.None, styles: [], data: {} };
  const renderer = rendererFactory.createRenderer(doc, renderType);
  const script = renderer.createElement('script');
  if (nonce) {
    renderer.setProperty(script, 'nonce', nonce);
  }
  renderer.setValue(script, inlineCode);
  renderer.insertBefore(doc.head, script, doc.head.firstChild);
}

export function loadPrebootFactory(state: PlatformState, rendererFactory: RendererFactory2, opts: PrebootRecordOptions, nonceOp: NonceOp) {
  return function() {
    const doc = state.getDocument();
    const inlinePrebootCode = getInlinePrebootCode(opts);
    addInlineCodeToDocument(inlinePrebootCode, doc, rendererFactory, nonceOp.nonce);
  };
}
