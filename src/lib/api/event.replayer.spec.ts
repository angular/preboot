import {getMockWindow} from '../common/preboot.mocks';
import {EventReplayer} from './event.replayer';
import {PrebootAppData} from '../common/preboot.interfaces';

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
