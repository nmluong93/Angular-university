import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthState} from './reducers';


export const selectAuthState = createFeatureSelector<AuthState>('auth');


/**
 * Using selector will optimize the calculation of state changes (memorize function)
 * here only when state['auth'] changes then the calculator will be trigger.
 */
// export const isLoggedIn = createSelector(
//   state => state['auth'],
//   auth => !!auth.user
// );
export const isLoggedIn = createSelector(
  // using type-safe by feature selector
  selectAuthState,
  auth => !!auth.user
);

export const isLoggedOut = createSelector(
  isLoggedIn,
  loggedIn => !loggedIn
);
