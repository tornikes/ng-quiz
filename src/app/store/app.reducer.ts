import * as fromQuiz from '../components/quiz/store/quiz.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  quizState: fromQuiz.QuizState
}

export const AppReducer: ActionReducerMap<AppState> = {
  quizState: fromQuiz.quizReducer
};