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

  saveCourse$ = createEffect(
    () => this.actions$.pipe(
      ofType(CourseAction.updateCourse),
      concatMap(action => this.coursesHttpService.saveCourse(action.update.id, action.update.changes))
    ),
    {dispatch: false}
  );

  constructor(private actions$: Actions, private coursesHttpService: CoursesHttpService) {
  }

}
