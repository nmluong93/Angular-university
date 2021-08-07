import {createAction, props} from '@ngrx/store';
import {Course} from './model/course';

export  const CREATE_COURSE = '[Course] Create course';
export const LOAD_ALL_COURSES = '[Course] Load all course';
export const ALL_COURSES_LOADED = '[Course] All courses loaded';


export const loadAllCourses = createAction(
  LOAD_ALL_COURSES
);

export const allCoursesLoaded = createAction(
  ALL_COURSES_LOADED,
  props<{courses: Course[]}>()
);

