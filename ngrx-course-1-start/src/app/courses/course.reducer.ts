import {compareCourses, Course} from './model/course';
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

export const adapter = createEntityAdapter<Course>({
  sortComparer: compareCourses,
  selectId: course => course.seqNo
});

export const initialCourseState = adapter.getInitialState();

export const coursesReducer = createReducer(
  initialCourseState,
  on(CourseAction.allCoursesLoaded, (state, action) => adapter.addAll(action.courses, state))
);

/*
This syntax is a little bit strange
adapter.getSelectors will return an EntitySelectors

export interface EntitySelectors<T, V> {
    selectIds: (state: V) => string[] | number[];
    selectEntities: (state: V) => Dictionary<T>;
    selectAll: (state: V) => T[]; => we only get the selectAll => export it
    selectTotal: (state: V) => number;
}
 */
export const
  {
    selectAll
  }
    = adapter.getSelectors();
