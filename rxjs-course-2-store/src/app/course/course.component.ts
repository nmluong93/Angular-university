import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { debounceTime, distinctUntilChanged, first, map, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { concat, forkJoin, fromEvent, Observable } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { StoreService } from '../common/store.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: number;

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;


  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute, private store: StoreService) {}

  ngOnInit() {
    console.log('ngOnInit')
    this.courseId = this.route.snapshot.params['id'];
    // this.course$ = this.store.selectCourseById(this.courseId)
    //  .pipe(
    //    take(1) // make sure that after the first emitted value of this course$ => the observable is complete => take(1) =
    // first() );  forkJoin(this.course$, this.loadLessons()).subscribe(val => console.log(`Forkjoin ${val}`));
    this.course$ = this.store.selectCourseById(this.courseId);

    this.loadLessons()
      .pipe(
        withLatestFrom(this.course$)
      ).subscribe(([lessons, course]) => {
        console.log(`Lesson : ${lessons}, Course: ${course}`);
    });
  }

  ngAfterViewInit() {

    const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.loadLessons(search))
      );

    const initialLessons$ = this.loadLessons();

    this.lessons$ = concat(initialLessons$, searchLessons$);

  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res['payload'])
      );
  }


}











