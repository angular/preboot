import 'reflect-metadata';
import 'jasmine';
import { getMockWindow } from '../../utils';
import { EventReplayer, PrebootAppData } from '../../../src';

describe('UNIT TEST event.replayer', function () {
  describe('switchBuffer()', function () {
    it('will do nothing if nothing passed in', function () {
      const eventReplayer = new EventReplayer();
      const appData = <PrebootAppData>{};

      eventReplayer.setWindow(getMockWindow());
      eventReplayer.switchBuffer(appData);
    });
  });
});
