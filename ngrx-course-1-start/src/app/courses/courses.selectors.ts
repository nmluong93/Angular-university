import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromCourses from './course.reducer';
import {CoursesState} from './course.reducer';

export const selectCourseState = createFeatureSelector<CoursesState>('courses');

export const selectAllCourses = createSelector(
  selectCourseState,
  fromCourses.selectAll
);

export const selectBeginnerCourses = createSelector(
  selectAllCourses,
  courses => courses.filter(e => e.category === 'BEGINNER')
);

export const selectAdvancedCourses = createSelector(
  selectAllCourses,
  courses => courses.filter(e => e.category === 'ADVANCED')
);

export const selectPromoTotal = createSelector(
  selectAllCourses,
  courses => courses.filter(e => e.promo).length
);

export const areAllCoursesLoaded = createSelector(
  selectCourseState,
  state => state.allCourseLoaded
);
