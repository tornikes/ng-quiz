import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuizService } from './quiz.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  started = false;
  statusSub: Subscription;

  constructor(
    private quizService: QuizService
  ) { }

  ngOnInit() {
    this.quizService.quizStatus
      .subscribe(status => this.started = status);
  }

  ngOnDestroy() {
    this.statusSub.unsubscribe();
  }
}
