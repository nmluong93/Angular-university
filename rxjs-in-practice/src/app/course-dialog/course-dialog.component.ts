import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from 'moment';
import {concatMap, exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

  form: FormGroup;
  course: Course;

  @ViewChild('saveButton', {static: true}) saveButton: ElementRef;

  @ViewChild('searchInput', {static: true}) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngOnInit() {
    // this.form.valueChanges
    //   .pipe(
    //     filter(() => this.form.valid)
    //   )
    //   .subscribe(changes => {
    //     const savedCourse$ = this.saveCourse(changes);
    //     savedCourse$.subscribe();
    //   });
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        // each http request triggered by saveCourse will be done before the next one.=> sequentially
        concatMap(changes => this.saveCourse(changes))

        // Use merge map will execute all the saveCourse in parallel way
        // mergeMap(changes => this.saveCourse(changes))
      )
      .subscribe();
  }

  saveCourse(changes) {
    return fromPromise(
      fetch(`/api/courses/${this.course.id}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
          'content-type': 'application/json'
        }
      }));
  }

  ngAfterViewInit() {

    fromEvent(this.saveButton.nativeElement, 'click')
      .pipe(
        // too many click happens => only a HTTP requested triggered, if after the first one is completed then
        // the subsequent click event will be triggered (HTTP request is triggered)
        exhaustMap(() => this.saveCourse(this.form.value))
      )
      .subscribe()
    ;
  }


  close() {
    this.dialogRef.close();
  }

}
