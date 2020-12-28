import { Question } from '../../../quiz.service';
import * as QuizActions from './quiz.actions';

export interface QuizState {
  started: boolean;
  questions: Question[];
  answered: string[];
  error: boolean;
  index: number;
  completed: boolean;
}

const initialState: QuizState = {
  questions: [],
  answered: [],
  error: false,
  started: false,
  index: 0,
  completed: false
}

export function quizReducer(state: QuizState = initialState, action: QuizActions.QuizActions) {
  switch(action.type) {
    case QuizActions.QUESTIONS_FETCHED: {
      return {
        ...state,
        questions: action.payload,
        started: true
      };
    };
    case QuizActions.ANSWER_ADDED: {
      return {
        ...state,
        answered: [...state.answered, action.payload],
        index: state.index + 1
      };
    };
    case QuizActions.QUESTION_FETCH_STARTED: {
      return {
        ...state,
        completed: false
      }
    }
    case QuizActions.FETCHING_FAILED: {
      console.log('Fetching failed');
      return {
        ...state,
        error: true
      }
    };
    case QuizActions.QUIZ_COMPLETED: {
      return {
        ...state,
        completed: true
      }
    }
    case QuizActions.CLEAR_ERROR: {
      return {
        ...state,
        error: false
      }
    };
    case QuizActions.RESTART_QUIZ: {
      return initialState;
    };
    default: return state;
  }
}