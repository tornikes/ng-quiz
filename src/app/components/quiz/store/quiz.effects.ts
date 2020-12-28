import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from "@ngrx/effects";
import * as QuizActions from './quiz.actions';
import * as fromApp from '../../../store/app.reducer';
import { of } from "rxjs";
import { Question } from "src/app/quiz.service";
@Injectable({ providedIn: 'root' })
export class QuizEffects {
  @Effect()
  fetchQuestions = this.actions$.pipe(
    ofType(QuizActions.QUESTION_FETCH_STARTED),
    switchMap((questionsData: QuizActions.QuestionFetchStarted) => {
      let url = 'https://opentdb.com/api.php?amount=10&type=multiple&';
      const options = [];
      if (questionsData.payload.category) options.push(`category=${questionsData.payload.category}`);
      if (questionsData.payload.difficulty) options.push(`difficulty=${questionsData.payload.difficulty}`);
      url += options.join('&');
      return this.http.get(url).pipe(        
        map((response: { response_code: number; results: Question[] }) => {
          if(response.response_code === 0) {
            return new QuizActions.QuestionsFetched(response.results);
          } else {
            return new QuizActions.FetchingFailed();
          }
        }),
        catchError(() => {
          console.log("Failed to fetch posts");
          return of("Error happened");
        }),
      );
    })
  );

  constructor(
    private http: HttpClient,
    private actions$: Actions
  ) { }
}