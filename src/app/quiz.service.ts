import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface CategoryItem {
  id: String;
  name: String;
}

export interface Question {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  categories: CategoryItem[] = [{ id: '-1', name: 'Any Difficulty' }];
  questions: Question[] = [];
  questionIndex = -1;
  categoriesFetched = new Subject<CategoryItem[]>();
  quizStatus = new Subject<boolean>();
  nextQuestion = new Subject<Question>();

  constructor(
    private http: HttpClient
  ) { }

  fetchCategories() {
    this.http.get('https://opentdb.com/api_category.php')
      .subscribe((response: { trivia_categories: CategoryItem[] }) => {
        this.categories = response.trivia_categories;
        this.categoriesFetched.next(this.categories);
      })
  }

  fetchQuestions(config: { category: string; difficulty: string }) {
    let url = 'https://opentdb.com/api.php?amount=10&type=multiple&';
    const options = [];
    if (config.category) options.push(`category=${config.category}`);
    if (config.difficulty) options.push(`difficulty=${config.difficulty}`);
    url += options.join('&');
    return this.http.get(url);
  }

  setQuestions(questions: Question[]) {
    this.questions = questions;
  }

  startQuiz() {
    this.quizStatus.next(true);
    this.questionIndex = 0;
  }

  getCurrentQuestion() {
    return this.questions[this.questionIndex];
  }

  getNextQuestion() {
    this.questionIndex++;
    if (this.questionIndex >= this.questions.length) {
      this.nextQuestion.next(null);
    } else {
      this.nextQuestion.next(this.questions[this.questionIndex]);
    }
  }
  
  computeResult(answered: string[]) {
    let count = 0;
    for(let i = 0; i < answered.length; i++) {
      if(answered[i] === this.questions[i].correct_answer) {
        count++;
      }
    }
    return count;
  }

  questionCount() {
    return this.questions.length;
  }

  getCategories() {
    return this.categories.slice();
  }
}