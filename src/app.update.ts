import {
  Ctx,
  Hears,
  Help,
  InjectBot,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { getActionButtons } from './app.buttons';
import { QuizService } from './services/quiz/quiz.services';
import { AppService } from './services/app/app.service';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly quizService: QuizService,
    private readonly appService: AppService,
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
    await this.appService.getMessageInfo(ctx);
    await this.appService.getMessageJoinGroup(ctx)
  }

  @Hears('☎ Оставить номер для обратной связи')
  async sendPhone(ctx: Context) {
    await ctx.reply('номер отправлен Юлии');
    await this.appService.getMessageJoinGroup(ctx)
  }

  //------КВИЗ

  @Hears('📋 Пройти тест')
  async startQuiz(ctx: Context) {
    await this.quizService.startQuiz(ctx);
  }

  // Команда для отмены квиза
  @Hears('/cancel')
  async cancelQuiz(@Ctx() ctx: Context) {
    if (ctx.session.quiz) {
      delete ctx.session.quiz;
      await ctx.reply('❌ Тест отменен');
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
      await this.appService.getMessageJoinGroup(ctx)
    }
  }
}
