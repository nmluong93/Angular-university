import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {CourseEntityService} from './course-entity.service';
import {filter, first, tap} from 'rxjs/operators';

@Injectable()
export class CourseResolver implements Resolve<boolean> {

  constructor(private coursesEntityService: CourseEntityService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.coursesEntityService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.coursesEntityService.getAll();
          }
        }),
        filter(loaded => !!loaded),
        first()
      );
  }

}
