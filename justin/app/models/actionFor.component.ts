import { Component, Input } from '@angular/core';
import { OnChanges } from '@angular/core';

import { RouteService } from './routeService';

@Component({
  selector: 'nextApp',
  template: `
  <span *ngIf="thing">
    <button outline (click)="open(thing)">{{ step }}</button>
  </span>`,
  //providers: [RouteService]
})
export class nextAppComponent implements OnChanges {
  model = { msg: ''}
  step = "";
  @Input() thing: any;
  constructor(private routeService: RouteService) {
    console.log('je suis un constructeur');
  }
  open(thing) {
    let steps = thing.nextSteps();
    console.log('possibles steps for', thing, steps)
    this.routeService.goTo(steps.pop());
  }
  ngOnChanges(a) { //C'est notre $watch
    console.log('dans le on Change', a);
    let thing = a.thing.currentValue
    if (thing)
      this.step = thing.nextSteps();
    console.log(this.step, thing);
  }
}