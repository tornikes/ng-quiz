import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { QuizService } from 'src/app/quiz.service';
import * as fromApp from '../../store/app.reducer';
import * as QuizActions from '../quiz/store/quiz.actions';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  question = null;
  allAnswers = [];
  answered: string[] = [];
  selectedAnswer: string = null;
  completed = false;
  score: number;
  totalQuestions: number;
  quizSub: Subscription;

  constructor(
    private quizService: QuizService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.quizSub = this.store.select(store => store.quizState.index).pipe(
      withLatestFrom(this.store.select(store => store.quizState)),
      tap(([index, quizState]) => {
        if(index < quizState.questions.length) {
          this.question = quizState.questions[index];
          this.allAnswers = this.shuffle([...this.question.incorrect_answers, this.question.correct_answer]);
        } else {
          this.store.dispatch(new QuizActions.QuizCompleted());
        }
      })
    ).subscribe();

    this.store.select(store => store.quizState)
      .subscribe(quizState => {
        this.completed = quizState.completed;

        if(this.completed) {
          let count = 0;
          for(let i = 0; i < quizState.questions.length; i++) {
            if(quizState.questions[i].correct_answer === quizState.answered[i]) {
              count++;
            }
          }
          this.score = count;
          this.totalQuestions = quizState.questions.length;
        }
      });
  }

  private shuffle(array) {
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  get answers() {
    return this.allAnswers.slice();
  }

  get corrects() {
    return this.score;
  }

  get total() {
    return this.totalQuestions;
  }

  onAnswer() {
    this.store.dispatch(new QuizActions.AnswerAdded(this.selectedAnswer));
    this.selectedAnswer = null;
  }

  onRestart() {
    this.completed = false;
    this.store.dispatch(new QuizActions.RestartQuiz());
    this.question = [];
    this.selectedAnswer = null;
  }

  onSelectAnswer(answer: string) {
    this.selectedAnswer = answer;
  }

  ngOnDestroy() {
    this.quizSub.unsubscribe();
  }

}
