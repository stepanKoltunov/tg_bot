import { Scenes } from 'telegraf';

const TEXT_INPUT_QUIZ_SCENE = 'TEXT_INPUT_QUIZ_SCENE';

// Создаем сцену
export const textInputQuizScene = new Scenes.WizardScene<Scenes.WizardContext>(
  TEXT_INPUT_QUIZ_SCENE,

  // Шаг 0: Инициализация
  async (ctx) => {
    // Инициализируем состояние
    // ctx.session.quiz = {
    //   answers: [],
    //   currentQuestionIndex: 0,
    //   startTime: new Date()
    // };

    await ctx.reply('Начинаем квиз! Ответьте на несколько вопросов');
    return ctx.wizard.next();
  },

  )