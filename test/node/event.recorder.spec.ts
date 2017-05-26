import 'reflect-metadata';
import 'jasmine';


describe('UNIT TEST event.recorder', function() {
  describe('stringifyWithFunctions()', function() {

    // todo: write these tests

  });
});


// import 'jasmine';

// import {prebootClient} from '../../src/browser/preboot_browser';
// import {prebootstrap} from '../../src/inline/preboot_inline';
// import {Element, EventSelector, NodeContext, PrebootAppData, PrebootData,
// ServerClientRoot,} from '../../src/preboot_interfaces'; import {addParent,
// getMockElement} from '../preboot_test_utils';


// describe('node unit test for preboot_inline', function () {
//   let preboot = prebootstrap();
//   let client = prebootClient();

//   describe('createBuffer()', function () {
//     it('should return server node if rootSelector is the body', function () {
//       let root = <ServerClientRoot> {
//         serverSelector: 'body',
//         serverNode: {}
//       };

//       let actual = preboot.createBuffer(root);
//       expect(actual).toBe(root.serverNode);
//     });

//     it('should clone the node and insert before', function () {
//       let root = <ServerClientRoot> {
//         serverSelector: 'div',
//         serverNode: getMockElement()
//       };
//       let clientNode = { style: { display: 'block' } };
//       root.serverNode.cloneNode = function () {
//         return clientNode;
//       };

//       let actual = preboot.createBuffer(root);
//       expect(actual).toBe(clientNode);
//     });
//   });

//   describe('getSelection()', function () {
//     it('should return default if no value', function () {
//       let node = <Element> {};
//       let expected = {
//         start: 0,
//         end: 0,
//         direction: 'forward'
//       };

//       let actual = preboot.getSelection(node);
//       expect(actual).toEqual(expected);
//     });

//     it('should return selection for older browsers', function () {
//       let node = <Element> { value: 'foo' };
//       let expected = {
//         start: 3,
//         end: 3,
//         direction: 'forward'
//       };

//       let actual = preboot.getSelection(node);
//       expect(actual).toEqual(expected);
//     });

//     it('should return selection for modern browsers', function () {
//       let node = <Element> {
//         value: 'foo',
//         selectionStart: 1,
//         selectionEnd: 2,
//         selectionDirection: 'reverse'
//       };
//       let expected = {
//         start: 1,
//         end: 2,
//         direction: 'reverse'
//       };

//       let actual = preboot.getSelection(node);
//       expect(actual).toEqual(expected);
//     });
//   });

//   describe('getNodeKey()', function () {

//   });

//   describe('createListenHandler()', function () {
//       it('should do nothing if not listening', function () {
//         let prebootData: PrebootData = <PrebootData> {
//           listening: false
//         };
//         let eventSelector: EventSelector = {
//           selector: '',
//           events: <[string]> [],
//           preventDefault: true
//         };
//         let appData: PrebootAppData = {
//           root: {
//             serverSelector: '',
//             serverNode: {}
//           },
//           events: []
//         };
//         let event = {
//           preventDefault: function () {}
//         };
//         let node = <Element>{};

//         spyOn(event, 'preventDefault');

//         let handler = preboot.createListenHandler(prebootData, eventSelector,
//         appData, node); handler(event);

//         expect(event.preventDefault).not.toHaveBeenCalled();
//       });
//   });

// });
