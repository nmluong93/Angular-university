import {Component, OnInit} from '@angular/core';
import {Observable, throwError, timer} from 'rxjs';
import {catchError, delayWhen, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
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
      catchError(err => {
        console.log('Error occurs', err);
        return throwError(err);
      }),
      finalize(() => {
        // invoked when an observable is completed or having an error
        console.log('Finalize executed');
      }),
      tap(() => console.log('HTTP request executed')),
      map(res => Object.values(res['payload'])),
      // using this will share the subscription for below two observable which prevent two http requests for multiple subscribers
      shareReplay(),

      // After 2 seconds of error case, retry
      retryWhen(errors => errors
        .pipe(
          delayWhen(() => timer(2_000))
        ))
      // Recovery error handling
      // catchError(err => of([{
      //   id: 0,
      //   description: 'RxJs In Practice Course',
      //   iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
      //   courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
      //   longDescription: 'Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples',
      //   category: 'BEGINNER',
      //   lessonsCount: 10
      // }]))

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
