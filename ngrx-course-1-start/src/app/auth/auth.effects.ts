import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AuthActions} from './actions.type';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions, private router: Router) {

    // this.actions$.subscribe(action => {
    //   if (action.type === AuthActions.LOGIN) {
    //     localStorage.setItem('user', JSON.stringify(action['user']));
    //   }
    // });

    // this.actions$
    //   .pipe(
    //     ofType(AuthActions.login),
    //     tap(action => {
    //       localStorage.setItem('user', JSON.stringify(action.user));
    //     })
    //   ).subscribe( );

  }

  login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap(action =>
          localStorage.setItem('user', JSON.stringify(action.user))
        )
      ),
    {dispatch: false});

  logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(action => {
          localStorage.removeItem('user');
          this.router.navigateByUrl('/auth');
        })
      )
    ,
    {dispatch: false});

}
