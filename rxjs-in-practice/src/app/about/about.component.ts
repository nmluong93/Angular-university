import {Component, OnInit} from '@angular/core';
import {createHttpObservable} from '../common/util';
import {map} from 'rxjs/operators';
import {noop} from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

  }
}
