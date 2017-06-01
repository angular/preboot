import { Component, InjectionToken, Inject } from '@angular/core';

export const CURRENT_PLATFORM = new InjectionToken<string>('CurrentPlatform');

@Component({
  selector: 'app-root',
  template: `
    <h1>{{platform}}</h1>
    <p>Here is something</p>
    <input id="myTextBox">
    <select id="mySelect">
      <option></option>
      <option id="myVal">foo</option>
      <option>moo</option>
    </select>
  `,
})
export class AppComponent {
  constructor( @Inject(CURRENT_PLATFORM) public platform: string) {}
}
