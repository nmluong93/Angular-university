import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {forkJoin, fromEvent, Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap, tap} from 'rxjs/operators';
import {debug, RxJsLoggingLevel} from '../common/debug';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;


  @ViewChild('searchInput', {static: true}) input: ElementRef;
  private courseId: number;

  constructor(private route: ActivatedRoute) {


  }

  ngOnInit() {

    this.courseId = this.route.snapshot.params['id'];

    this.course$ = createHttpObservable(`/api/courses/${(this.courseId)}`);

    const cou = createHttpObservable(`/api/courses/${(this.courseId)}`);
    const less = this.loadLessons();

    forkJoin(cou, less)
      .pipe(
        tap(([c, l]) => {
          console.log('ForkJoin')
            console.log('Course ', c);
            console.log('Lesson ', l);
          })
      )
      .subscribe();
  }

  ngAfterViewInit() {

    /*  const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event.target.value),
          debounceTime(400),
          distinctUntilChanged(),
          // if any request of search is pending but new search term is emitted (input) then the pending request will be cancelled
          switchMap(search => this.loadLessons(search))
        );

      const initialLessons$ = this.loadLessons();
      this.lessons$ = concat(initialLessons$, searchLessons$);*/

    this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        startWith(''),
        debug(RxJsLoggingLevel.INFO, 'Search '),
        debounceTime(400),
        distinctUntilChanged(),
        // if any request of search is pending but new search term is emitted (input) then the pending request will be cancelled
        switchMap(search => this.loadLessons(search))
      );


    // fromEvent<any>(this.input.nativeElement, 'keyup')
    //   .pipe(
    //     map(event => event.target.value),
    //     startWith(''),
    //     // debounceTime(400),
    //     throttle(() => interval(500)) // or throttleTime(500)
    //   ).subscribe(console.log);

  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => Object.values(res['payload']))
      );
  }


}
