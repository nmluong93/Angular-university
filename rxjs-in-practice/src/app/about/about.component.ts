import {Component, OnInit} from '@angular/core';
import {interval, merge} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

    const interval$ = interval(1000);
    const interval2 = interval$.pipe(map(val => 10 * val));

    const result = merge(interval$, interval2);
    result.subscribe(console.log);
  }
}
