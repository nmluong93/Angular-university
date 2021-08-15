import {createAction, props} from '@ngrx/store';
import {Course} from './model/course';
import {Update} from '@ngrx/entity';

export const UPDATE_COURSE = '[Course] Update course';
export const LOAD_ALL_COURSES = '[Course] Load all course';
export const ALL_COURSES_LOADED = '[Course] All courses loaded';


export const loadAllCourses = createAction(
  LOAD_ALL_COURSES
);

export const allCoursesLoaded = createAction(
  ALL_COURSES_LOADED,
  props<{ courses: Course[] }>()
);

export const updateCourse = createAction(
  UPDATE_COURSE,
  props<{ update: Update<Course> }>()
);

