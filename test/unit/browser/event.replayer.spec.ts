import 'reflect-metadata';
import 'jasmine';
import { getMockWindow } from '../../utils';
import { EventReplayer, PrebootAppData } from '../../../src';

describe('UNIT TEST event.replayer', function () {
  describe('switchBuffer()', function () {
    it('will do nothing if nothing passed in', function () {
      const eventReplayer = new EventReplayer(getMockWindow());
      const appData = <PrebootAppData>{};
      eventReplayer.switchBuffer(appData);
    });
  });
});
