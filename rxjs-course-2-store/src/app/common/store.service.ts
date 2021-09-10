import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { Course } from '../model/course';
import { createHttpObservable } from './util';
import { delayWhen, filter, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  // use BehaviorSubject to let any subscription always get the latest emitted value from the subject
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();


  init() {
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map(res => Object.values(res['payload'])),
      ).subscribe(response => this.subject.next(response));
  }


  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  filterByCategory(cat: string) {
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === cat))
      );
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  saveCourse(id: number, changes): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(e => e.id === id);

    const newCourses = courses.slice(0);

    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };

    this.subject.next(newCourses);

    return fromPromise(fetch(`/api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }

  selectCourseById(courseId: number) {
    return this.courses$.pipe(
      map(c => c.find(e => e.id === courseId)),
      filter(course => !!course) // in case the course$ emitted value is empty
    );
  }
}
