// Структура вопроса
export interface QuizQuestion {
  text: string;
  type: 'choice' | 'text'; // Тип вопроса
  currentAnswer?: string[];
  options?: string[]; // Только для типа 'choice'
  responseIfGood?: string;
  responseIfBad?: string;
}

export enum QuizIdsEnum {
  QUIZ_QUESTIONS_IMT,
  QUIZ_QUESTIONS_STRESS,
}
