import { Markup } from 'telegraf';

export function getActionButtons(): Markup.Markup<any> {
  return Markup.keyboard(
    [
      Markup.button.callback('📋 Пройти тест', 'quiz'),
      Markup.button.callback('💡 Информация', 'info'),
      Markup.button.callback('☎ Отправить данные для обратной связи', 'phone'),
    ],
    { columns: 2 },
  ).resize();
}
