import {Course} from './model/course';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {CourseAction} from './acitons-type';

/*export interface CoursesState {
  // map of key = course.id and value = course
  entities: { [key: number]: Course };
  // keep natural order
  ids: number[];
}*/

// => the above code is so verbose => so using EntityState of NgRx model is better
export interface CoursesState extends EntityState<Course> {

}

export const adapter = createEntityAdapter<Course>();

export const initialCourseState = adapter.getInitialState();

export const coursesReducer = createReducer(
  initialCourseState,
  on(CourseAction.allCoursesLoaded, (state, action) => adapter.addAll(action.courses, state))
);
