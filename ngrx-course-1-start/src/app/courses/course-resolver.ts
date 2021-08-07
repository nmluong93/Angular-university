import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../reducers';
import {filter, finalize, first, tap} from 'rxjs/operators';
import {CourseAction} from './acitons-type';
import {areAllCoursesLoaded} from './courses.selectors';

@Injectable()
export class CourseResolver implements Resolve<any> {

  loading = false;

  constructor(private store: Store<AppState>) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    return this.store.pipe(
      select(areAllCoursesLoaded),
      tap(coursesLoaded => {
        if (!this.loading && !coursesLoaded) {
          this.loading = true;
          this.store.dispatch(CourseAction.loadAllCourses());
        }
      }),
      filter(coursesLoaded => !!coursesLoaded),
      first(),
      finalize(() => this.loading = false)
    );
  }

}
