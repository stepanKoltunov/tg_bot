export interface QuizState {
  step: number; // Текущий шаг квиза (1-6)
  answers: string[]; // Ответы пользователя
}

export interface SessionData {
  quiz?: QuizState; // Состояние квиза
}

// Расширяем стандартный контекст Telegraf
declare module 'telegraf' {
  interface Context {
    session: SessionData;
  }
}
