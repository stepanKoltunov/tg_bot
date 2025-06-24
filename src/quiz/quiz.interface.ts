// Структура вопроса
export interface QuizQuestion {
  text: string;
  type: 'choice' | 'text'; // Тип вопроса
  currentAnswer?: string[];
  options?: string[]; // Только для типа 'choice'
}