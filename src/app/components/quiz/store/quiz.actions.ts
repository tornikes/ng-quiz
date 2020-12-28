import { Action } from "@ngrx/store";
import { Question } from "src/app/quiz.service";

export const QUESTION_FETCH_STARTED = '[Quiz] Questions Fetching Started';
export const QUESTIONS_FETCHED = '[Quiz] Questions Fetched';
export const FETCHING_FAILED = '[Quiz] Fetching Failed';
export const ANSWER_ADDED = '[Quiz] Answer Added';
export const QUIZ_COMPLETED = '[Quiz] Quiz Completed';
export const RESTART_QUIZ = '[Quiz] Restart Quiz';
export const CLEAR_ERROR = '[Quiz] Clear Error';

export class QuestionsFetched implements Action {
  readonly type = QUESTIONS_FETCHED;

  constructor(public payload: Question[]) {}
}

export class AnswerAdded implements Action {
  readonly type = ANSWER_ADDED;

  constructor(public payload: string) {}
}

export class QuestionFetchStarted implements Action {
  readonly type = QUESTION_FETCH_STARTED;

  constructor(public payload: { category: string; difficulty: string }) {}
}

export class FetchingFailed implements Action {
  readonly type = FETCHING_FAILED;
}

export class QuizCompleted implements Action {
  readonly type = QUIZ_COMPLETED;
}

export class RestartQuiz implements Action {
  readonly type = RESTART_QUIZ;
}

export class ClearError implements Action {
  readonly type = CLEAR_ERROR;
}

export type QuizActions =
  | AnswerAdded
  | QuestionFetchStarted
  | FetchingFailed
  | QuizCompleted
  | RestartQuiz
  | ClearError
  | QuestionsFetched;