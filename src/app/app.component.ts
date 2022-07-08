import { Component, OnInit, VERSION } from '@angular/core';
import { from, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  data: any = of([]);
  ngOnInit() {
    this.data = this.aj('https://jsonplaceholder.typicode.com/todos/1');
  }
  aj(url) {
    let x = fetch(url).then((response) => response.json());
    return from(x).pipe(
      catchError((d) => {
        throw new Error('Oooo');
      })
    );
  }
  callChange() {
    const url =
      Math.floor(Math.random() * 100) % 2 === 0
        ? 'https://httpstat.us/200?sleep=5000'
        : 'https://jsonplaceholder.typicode.com/todos/1';

    this.data = this.aj(url).pipe(
      mergeMap((d) => this.aj('https://jsonplaceholder.typicode.com/todos/2')),
      mergeMap((d) => this.aj('https://jsonplaceholder.typicode.com/todos/3')),
      mergeMap((d) => this.aj('https://jsonplaceholder.typicode.com/todos/4')),
      catchError((d) => {
        return this.aj('https://jsonplaceholder.typicode.com/todos/1');
      })
    );
  }

  name = 'Angular ' + VERSION.major;
}
