import {
  Ctx,
  Hears,
  Help,
  InjectBot,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Markup, Telegraf } from 'telegraf';
import { getActionButtons } from './app.buttons';
import { QuizService } from './quiz/quiz.services';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly quizService: QuizService,
  ) {}

  @Start()
  async startBotCommand(ctx: Context) {
    await ctx.reply('Привет! Что ты хочешь сделать?', getActionButtons());
  }

  @Help()
  async getHelp(ctx: Context) {
    await ctx.reply('Попробуйте: /start', getActionButtons());
  }

  @Hears('💡 Информация')
  async getInfo(ctx: Context) {
    await ctx.reply('Доп Информация + ссылка на тг группу');
  }

  @Hears('☎ Оставить номер для обратной связи')
  async sendPhone(ctx: Context) {
    await ctx.reply('номер отправлен Юлии');
  }

  //------КВИЗ

  @Hears('📋 Пройти тест')
  async startQuiz(ctx: Context) {
    await ctx.reply('Квиз запущен', Markup.removeKeyboard());
    await this.quizService.startQuiz(ctx);
  }

  // Команда для отмены квиза
  @Hears('/cancel')
  async cancelQuiz(@Ctx() ctx: Context) {
    if (ctx.session.quiz) {
      delete ctx.session.quiz;
      await ctx.reply('❌ Квиз отменен');
      await ctx.reply('Что вы хотите сделать?', getActionButtons());
    }
  }

  // Обработчик текстовых сообщений для квиза
  @On('text')
  async handleText(@Ctx() ctx: Context<any>) {
    const quizState = ctx.session.quiz;

    // Если пользователь не в процессе квиза, игнорируем
    if (!quizState) return;

    const answer = ctx.message?.text;
    const currentStep = quizState.step;

    // Обработка ответа
    const isValid = await this.quizService.handleAnswer(ctx, answer);

    if (!isValid) return;

    if (currentStep < 8) {
      // Отправляем следующий вопрос
      await this.quizService.sendQuestion(ctx, currentStep + 1);
    } else {
      // Завершаем квиз
      await this.quizService.finishQuiz(ctx);
      await ctx.reply('Что вы хотите сделать дальше?', getActionButtons());
    }
  }
}
