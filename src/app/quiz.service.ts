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
  categoriesFetched = new Subject<CategoryItem[]>();

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

  getCategories() {
    return this.categories.slice();
  }
}