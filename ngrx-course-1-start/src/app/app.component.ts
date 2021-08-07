import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {AppState} from './reducers';
import {User} from './auth/model/user.model';
import {Observable} from 'rxjs';
import {AuthActions} from './auth/actions.type';
import {isLoggedIn, isLoggedOut} from './auth/auth.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLogin$: Observable<boolean>;
  isLogout$: Observable<boolean>;
  loading = true;

  constructor(private router: Router,
              private store: Store<AppState>) {

  }

  ngOnInit() {

    const userProfile = localStorage.getItem('user');
    if (userProfile) {
      this.store.dispatch(AuthActions.login({user: JSON.parse(userProfile)}));
    }

    this.isLogin$ = this.store
      .pipe(
        select(isLoggedIn)
      );

    this.isLogout$ = this.store
      .pipe(
        select(isLoggedOut)
      );

    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

}
