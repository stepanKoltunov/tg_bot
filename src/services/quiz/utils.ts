import { QUIZ_QUESTIONS_IMT, QuizIdToData } from './quiz.data';
import {
  messageResponseStress1,
  messageResponseStress2,
  messageResponseStress3,
} from './consts';
import { QuizIdsEnum } from './quiz.interface';

export const generateImtText = (answers: string[]): string => {
  const weight = +answers[answers.length - 1];
  const height = +answers[answers.length - 2];
  const imt = +(weight / (height * height)).toFixed(2);
  let message: string = `Ваш индекс массы тела ${imt}, `;

  // положительный результат
  if (imt >= 18.5 && imt <= 24.9) {
    const currentAnswerList = answers
      .map((answer, index) => {
        if (isAnswerCorrect(answer, index, QuizIdsEnum.QUIZ_QUESTIONS_IMT)) {
          return QUIZ_QUESTIONS_IMT[index].responseIfGood;
        }
      })
      .filter((data) => data !== undefined);

    const currentText =
      currentAnswerList.length > 0
        ? 'По Вашим ответам видно, что Вы следите за своим здоровьем,' +
          currentAnswerList.join(', ')
        : 'Забота о здоровье — это не просто профилактика, а инвестиция в вашу энергию и качество жизни';

    message +=
      'это соответствует норме при Вашем росте.\n' +
      `${currentText}.\n` +
      'Для баланса здоровья безусловно важно всё- питание, сон, физическая активность, состояние нервной системы, ваши мысли и настроение.\n' +
      'Для улучшения самочувствия и сохранения сил, красоты  и долголетия есть еще возможности, чтобы добиться лучших результатов.\n' +
      'Предлагаю разобрать Ваш рацион питания, режим работы и отдыха, учесть особенности Вашего организма и сформировать персональные рекомендации.\n' +
      'На первой бесплатной консультации 20-25 минут мы вместе сможем выявить первые необходимые изменения и варианты их воплощения.' +
      'Запишитесь прямо сейчас на консультацию на удобное время по телефону +7-911-240-50-08.';
  }
  //негативный результат
  if (imt < 18.5 || imt > 24.9) {
    const currentAnswerList = answers
      .map((answer, index) => {
        if (!isAnswerCorrect(answer, index, QuizIdsEnum.QUIZ_QUESTIONS_IMT)) {
          return QUIZ_QUESTIONS_IMT[index].responseIfBad;
        }
      })
      .filter((data) => data !== undefined);

    const currentText =
      currentAnswerList.length > 0
        ? 'Например, ' + currentAnswerList.join(', ')
        : 'Ведь забота о здоровье — это не просто профилактика, а инвестиция в вашу энергию и качество жизни';

    message +=
      'это не соответствует норме при Вашем росте.\n' +
      'Отклонения по массе тела напрямую зависят от количества и состава рациона питания, а также режима питания и отдыха.\n' +
      'В ваших ответах есть моменты, которые требуют корректировки и изменений.\n' +
      `${currentText}.\n` +
      'Предлагаю персонально рассмотреть Ваше питание, режим работы и отдыха, варианты подходящей физической нагрузки, начиная с простых прогулок на свежем воздухе перед сном.' +
      'Рассчитаем калорийность рациона, учтем особенности Вашего здоровья и текущую ситуацию, составим подробные рекомендации для улучшения здоровья и качества жизни.\n' +
      'Прямо сейчас Вы можете записаться на первую бесплатную консультацию 20-25 минут в удобное время по телефону +7-911-240-50-08.';
  }
  return message;
};



export const generateStressText = (answers: string[]): string => {
  const sleepTime = +answers[answers.length - 2];
  const badSleepTime = sleepTime <= 6;
  const goodSleepTime = sleepTime >= 7;
  const numOfGoodAnswers = answers.reduce((acc, curr, index) => {
    if (isAnswerCorrect(curr, index, QuizIdsEnum.QUIZ_QUESTIONS_STRESS)) {
      return acc + 1
    }
    return acc;
  }, 0);

  //чрезмерно высокая нагрузка
  if (answers.includes('чрезмерно высокая')) {
    if (badSleepTime) {
      return messageResponseStress1;
    }
    if (goodSleepTime) {
      return messageResponseStress2;
    }
  }
  //Средняя или низкая нагрузка
  if (badSleepTime) {
    return messageResponseStress2;
  }
  if (goodSleepTime) {
    //Если красных вариантов от 2 до 5 (более чем 1) – ответ 2
    // Если красных вариантов 0 или 1 – ответ 3
    if (numOfGoodAnswers <= 1) {
      return messageResponseStress3;
    }
    return messageResponseStress2;
  }
  return 'Ошибка в тесте, пройдите тест повторно'
};

export const isValidNumber = (input: string): boolean => {
  // Регулярное выражение для целых и дробных чисел:
  // - Целая часть: одна или больше цифр
  // - Необязательная дробная часть: точка + одна или больше цифр
  const numberRegex = /^\d+(\.\d+)?$/;
  return numberRegex.test(input) && input.trim() !== '';
};

export const isAnswerCorrect = (
  answer: string,
  index: number,
  quizId: QuizIdsEnum,
): boolean => {
  return !!QuizIdToData[quizId][index].currentAnswer?.includes(answer);
};