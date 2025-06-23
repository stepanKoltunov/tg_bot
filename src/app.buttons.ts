import { Markup } from 'telegraf';

export function getActionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('📋 Пройти тест', 'quiz'),
      Markup.button.callback('💡 Информация', 'info'),
      Markup.button.callback('☎ Оставить номер для обратной связи', 'phone')
    ],
    { columns: 2 }
  ).resize()
}