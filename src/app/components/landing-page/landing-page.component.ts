import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CategoryItem, Question, QuizService } from 'src/app/quiz.service';
import * as fromApp from '../../store/app.reducer';
import * as QuizActions from '../quiz/store/quiz.actions';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  categories: CategoryItem[] = [];
  categorySub: Subscription;
  error = false;

  constructor(
    private quizService: QuizService,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.categories = this.quizService.getCategories();
    this.quizService.fetchCategories();
    this.categorySub = this.quizService.categoriesFetched.subscribe(cats => { this.categories = cats; });
  }

  onSubmit(form: NgForm) {
    this.store.dispatch(new QuizActions.QuestionFetchStarted(form.value));
    this.store.select(store => store.quizState.error)
      .subscribe(err => {
        this.error = err;
        if(err) setTimeout(() => {
          this.store.dispatch(new QuizActions.ClearError());
        }, 3000);
      });
  }

  ngOnDestroy() {
    this.categorySub.unsubscribe();
  }
}
