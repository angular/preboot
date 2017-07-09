# preboot

The purpose of this library is to help manage the transition of state (i.e. events, focus, data) from a server-generated web view to a client-generated web view. This library works with any front end JavaScript framework (i.e. React, Vue, Ember, etc.), but does have a few extra convenience modules for Angular apps.

The key features of preboot include:

1. Record and play back events
1. Respond immediately to certain events in the server view
1. Maintain focus even page is re-rendered
1. Buffer client-side re-rendering for smoother transition
1. Freeze page until bootstrap complete for certain events (ex. form submission)

In essence, this library is all about managing the user experience from the time from when 
a server view is visible until the client view takes over control of the page.

## Installation

Preboot is currently in beta, so to install you must cd into your app root and run the following command:

```
npm i preboot@5.0.0-rc.13 --save
```

There are two parts of preboot (server configuration and browser configuration). For each part of preboot, there is a slightly different API for Angular and non-Angular apps. The following sections covers these 4 different configurations:

- Angular Server Configuration
- Angular Browser Configuration
- Non-Angular Server Configuration
- Non-Angular Browser Configuration

#### Angular Server Configuration

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { ServerPrebootModule } from 'preboot/server';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'foo' }),
    ServerModule,
    ServerPrebootModule.recordEvents({ appRoot: 'app-root' })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The key part here for preboot is to include `ServerPrebootModule.recordEvents({ appRoot: 'app-root' })` where the `appRoot`
is the selector to find the root of your application. The options you can pass into `recordEvents()` are in the (PrebootRecordOptions)[#PrebootRecordOptions] section below. In most cases, however, you will only need to specify the `appRoot`.

#### Angular Browser Configuration

```
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserPrebootModule } from 'preboot/browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserPrebootModule.replayEvents()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

The key part here for preboot is to include `BrowserPrebootModule.replayEvents()`. You can optionally pass an object into `replayEvents()` that is detailed in the (PrebootReplayOptions)[#PrebootReplayOptions] section further below. In most cases, however, you can just rely on the preset defaults.

#### Non-Angular Server Configuration

```
import { getInlinePrebootCode } from 'preboot/record';

const prebootOptions = {};  // see PrebootRecordOptions section below
const inlineCode = getInlinePrebootCode(prebootOptions);

// now simply insert the inlineCode into the HEAD section of your server view

```

#### Non-Angular Browser Configuration

```
import { EventReplayer } from 'preboot/replay';

const replayer = new EventReplayer();

// once you are ready to replay events (usually after client app fully loaded)
replayer.replayAll();
```

#### PrebootRecordOptions
 
* `appRoot` (**required**) - One or more selectors for apps in the page (i.e. so one string or an array of strings).
* `buffer` (default true) - If true, preboot will attempt to buffer client rendering to an extra hidden div. In most
cases you will want to leave the default (i.e. true) but may turn off if you are debugging an issue.
* `minify` (default true) - If true, the inline code for recording will be minified in the server view. We recommend
only setting this to false if you are debugging an issue.
* `eventSelectors` (defaults below) - This is an array of objects which specify what events preboot should be listening for 
on the server view and how preboot should replay those events to the client view. 
See Event Selector section below for more details but note that in most cases, you can just rely on the defaults
and you don't need to explicitly set anything here.

**Event Selectors**

This part of the options drives a lot of the core behavior of preboot. 
Each event selector has the following properties:

* `selector` - The selector to find nodes under the server root (ex. `input, .blah, #foo`)
* `events` - An array of event names to listen for (ex. `['focusin', 'keyup', 'click']`)
* `keyCodes` - Only do something IF event includes a key pressed that matches the given key codes.
Useful for doing something when user hits return in a input box or something similar.
* `preventDefault` - If true, `event.preventDefault()` will be called to prevent any further event propagation.
* `freeze` - If true, the UI will freeze which means displaying a translucent overlay which prevents
any further user action until preboot is complete.
* `action` - This is a function callback for any custom code you want to run when this event occurs 
in the server view.
* `noReplay` - If true, the event won't be recorded or replayed. Useful when you utilize one of the other options above.

Here are some examples of event selectors from the defaults:

```es6
var eventSelectors = [

  // for recording changes in form elements
  { selector: 'input,textarea', events: ['keypress', 'keyup', 'keydown', 'input', 'change'] },
  { selector: 'select,option', events: ['change'] },

  // when user hits return button in an input box
  { selector: 'input', events: ['keyup'], preventDefault: true, keyCodes: [13], freeze: true },
  
  // when user submit form (press enter, click on button/input[type="submit"])
  { selector: 'form', events: ['submit'], preventDefault: true, freeze: true },

  // for tracking focus (no need to replay)
  { selector: 'input,textarea', events: ['focusin', 'focusout', 'mousedown', 'mouseup'], noReplay: true },

  // user clicks on a button
  { selector: 'button', events: ['click'], preventDefault: true, freeze: true }
];
```

#### PrebootReplayOptions

This is only used with the Angular browser configuration for preboot.

* `noReplay` (default false) - The only reason why you would want to set this to true is if you want to
manually trigger the replay yourself. 

This comes in handy for situations where you want to hold off
on the replay and buffer switch until AFTER some async events occur (i.e. route loading, http calls, etc.). By
default, replay occurs right after bootstrap is complete. In some apps, there are more events after bootstrap
however where the page continues to change in significant ways. Basically if you are making major changes to
the page after bootstrap then you will see some jank unless you set `noReplay` to `true` and then trigger replay
yourself once you know that all async events are complete.

To manually trigger replay, simply inject the EventReplayer like this:

```
import { Injectable } from '@angular/core';
import { EventReplayer } from 'preboot/browser';

@Injectable()
class Foo {
  constructor(private replayer: EventReplayer) {}

  // you decide when to call this based on what your app is doing
  manualReplay() {
    this.replayer.replayAll();
  }
}
```
