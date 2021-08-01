import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {noop} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../reducers';
import {AuthActions} from '../actions.type';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
      private fb: FormBuilder,
      private auth: AuthService,
      private router: Router,
      private store: Store<AppState>) {

      this.form = fb.group({
          email: ['test@angular-university.io', [Validators.required]],
          password: ['test', [Validators.required]]
      });

  }

  ngOnInit() {

  }

  login() {
    const formValue = this.form.value;
    this.auth.login(formValue.email, formValue.password)
      .pipe(
        tap(user => {
          console.log(user);
          this.store.dispatch(AuthActions.login({user}));
          this.router.navigateByUrl('/courses');
        })
      )
      .subscribe(rs => {
      noop(),
        // tslint:disable-next-line:no-unused-expression
        err => alert('Login failed');
    });
  }

}

