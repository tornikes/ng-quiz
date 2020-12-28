import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CategoryItem, Question, QuizService } from 'src/app/quiz.service';

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
    private quizService: QuizService
  ) { }

  ngOnInit(): void {
    this.categories = this.quizService.getCategories();
    this.quizService.fetchCategories();
    this.categorySub = this.quizService.categoriesFetched.subscribe(cats => { this.categories = cats; });
  }

  onSubmit(form: NgForm) {
    this.quizService.fetchQuestions(form.value).subscribe((response: { response_code: number; results: Question[] }) => {
      if(response.response_code === 0) {
        this.quizService.setQuestions(response.results);
        this.quizService.startQuiz();
      } else {
        this.error = true;
        setTimeout(() => this.error = false, 3000);
      }
    });
  }

  ngOnDestroy() {
    this.categorySub.unsubscribe();
  }
}
