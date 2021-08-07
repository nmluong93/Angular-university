import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {CourseAction} from './acitons-type';
import {concatMap, map} from 'rxjs/operators';
import {CoursesHttpService} from './services/courses-http.service';

@Injectable()
export class CourseEffects {

  loadCourses$ = createEffect(
    () => this.actions$.pipe(
      ofType(CourseAction.loadAllCourses),
      // one server request
      concatMap(action => this.coursesHttpService.findAllCourses()),
      map(courses => CourseAction.allCoursesLoaded({courses}))
    )
  );

  constructor(private actions$: Actions, private coursesHttpService: CoursesHttpService) {
  }

}
