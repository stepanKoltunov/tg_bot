import { QUIZ_QUESTIONS } from './quiz/quiz.data';

export const generateImtText = (answers: string[], correctAnswers: number) => {
  const weight = +answers[answers.length - 1];
  const height = +answers[answers.length - 2];
  const imt = weight/(height*height);

  // положительный результат
  if (imt > 18.5 && imt < 24.9) {

  }
  //негативный результат
  if (imt < 18.5 || imt > 24.9) {

  }
}

export const isValidNumber = (input: string): boolean  => {
  // Регулярное выражение для целых и дробных чисел:
  // - Целая часть: одна или больше цифр
  // - Необязательная дробная часть: точка + одна или больше цифр
  const numberRegex = /^\d+(\.\d+)?$/;
  return numberRegex.test(input) && input.trim() !== '';
}

export const isAnswerCorrect = (answer: string, index: number): boolean => {
  return !!QUIZ_QUESTIONS[index].currentAnswer?.includes(answer)
}