import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map, shareReplay, tap} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {Course} from '../model/course';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {
  }

  ngOnInit() {
    const http$ = createHttpObservable('/api/courses');

    const courses$: Observable<Course[]> = http$.pipe(
      tap(() => console.log('HTTP request executed')),
      map(res => Object.values(res['payload'])),
      // using this will share the subscription for below two observable which prevent two http requests for multiple subscribers
      shareReplay()
    );

    this.beginnerCourses$ = courses$
      .pipe(
        map(courses => courses.filter(c => c.category === 'BEGINNER'))
      );

    this.advancedCourses$ = courses$
      .pipe(
        map(courses => courses.filter(c => c.category === 'ADVANCED'))
      );
  }

}
