import { Markup } from 'telegraf';

export function getQuizButtons(): Markup.Markup<any> {
  return Markup.keyboard(
    [
      Markup.button.callback('🍋 Стресс', 'quizStress'),
      Markup.button.callback('🥦 Образ жизни', 'quizImt'),
    ],
    { columns: 2 },
  ).resize();
}
