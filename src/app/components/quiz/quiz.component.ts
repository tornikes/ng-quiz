import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuizService } from 'src/app/quiz.service';

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
  quizSub: Subscription;

  constructor(
    private quizService: QuizService
  ) { }

  ngOnInit(): void {
    this.question = this.quizService.getCurrentQuestion();
    this.allAnswers = this.shuffle([...this.question.incorrect_answers, this.question.correct_answer]);
    this.quizSub = this.quizService.nextQuestion.subscribe(question => {
      if (!question) {
        this.completed = true;
        this.question = null;
      } else {
        this.question = question;
        this.allAnswers = this.shuffle([...this.question.incorrect_answers, this.question.correct_answer]);
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
    return this.quizService.computeResult(this.answered);
  }

  get total() {
    return this.quizService.questionCount();
  }

  onAnswer() {
    this.answered.push(this.selectedAnswer);
    this.selectedAnswer = null;
    this.quizService.getNextQuestion();
  }

  onRestart() {
    this.quizService.quizStatus.next(false);
    this.answered = [];
    this.question = [];
    this.selectedAnswer = null;
    this.allAnswers = [];
    this.completed = false;
  }

  onSelectAnswer(answer: string) {
    this.selectedAnswer = answer;
  }

  ngOnDestroy() {
    this.quizSub.unsubscribe();
  }

}
