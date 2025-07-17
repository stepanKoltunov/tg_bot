import { QuizIdsEnum } from '../services/quiz/quiz.interface';

export interface QuizState {
  index: number; // Текущий шаг квиза (0-...)
  answers: string[]; // Ответы пользователя
}

export interface SessionData {
  quiz?: QuizState; // Состояние квиза
  quizId?: QuizIdsEnum,
}

// Расширяем стандартный контекст Telegraf
declare module 'telegraf' {
  interface Context {
    session: SessionData;
  }
}
