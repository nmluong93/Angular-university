import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {delay, map, tap, withLatestFrom} from 'rxjs/operators';
import {CourseEntityService} from '../services/course-entity.service';
import {LessonEntityService} from '../services/lesson-entity.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  course$: Observable<Course>;

  lessons$: Observable<Lesson[]>;

  loading$: Observable<boolean>;

  displayedColumns = ['seqNo', 'description', 'duration'];

  nextPage = 0;

  constructor(
    private coursesService: CourseEntityService,
    private lessonEntityService: LessonEntityService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get('courseUrl');

    this.course$ = this.coursesService.entities$.pipe(
      map(courses => courses.find(c => c.url === courseUrl))
    );

    this.lessons$ = this.lessonEntityService.entities$.pipe(
      withLatestFrom(this.course$),
      tap(([lessons, course]) => {
          if (this.nextPage === 0) {
            this.loadLessonsPage(course);
          }
        }
      ),

      map(([lessons, course]) => lessons.filter(e => e.courseId === course.id))
    );
    this.loading$ = this.lessonEntityService.loaded$.pipe(delay(0));
  }


  loadLessonsPage(course: Course) {
    this.lessonEntityService.getWithQuery({
      courseId: course.id.toString(),
      pageNumber: this.nextPage.toString(),
      pageSize: '3'
    });
    this.nextPage++;
  }

}
