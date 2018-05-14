import {getMockWindow} from './preboot.mocks';
import {EventReplayer} from './event.replayer';
import {PrebootAppData} from 'preboot/common';

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
