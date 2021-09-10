import { Component, OnInit } from '@angular/core';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {

    const subject = new ReplaySubject();
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log(`Subscription ${val}`));

    subject.next(1);
    subject.next(2);
    subject.next(3);
    setTimeout(() => {
      series$.subscribe(val => console.log(`Second subscription ${val}`));
      subject.next(4);
    }, 3000);
  }


}






