import {createAction, props} from '@ngrx/store';
import {User} from './model/user.model';

export const LOGIN = '[Auth]Login Action';
export const LOGOUT = '[Auth]Logout Action';

export const login = createAction(
  LOGIN,
  props<{user: User}>()
);

export const logout = createAction(
  LOGOUT
);
