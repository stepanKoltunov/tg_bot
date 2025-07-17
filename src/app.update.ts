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
import { QuizIdsEnum } from './services/quiz/quiz.interface';
import { QuizIdToData } from './services/quiz/quiz.data';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly quizService: QuizService,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startBotCommand(ctx: Context) {
    await ctx.reply(
      'Привет! Тест за 2 минуты, поможет узнать важное о себе и начать шаги к изменениям.',
      getActionButtons(),
    );
  }

  @Help()
  async getHelp(ctx: Context) {
    await ctx.reply('Попробуйте: /start', getActionButtons());
  }

  @Hears('💡 Информация')
  async getInfo(ctx: Context) {
    await this.appService.getMessageInfo(ctx);
    await this.appService.getMessageJoinGroup(ctx);
  }

  @Hears('☎ Отправить данные для обратной связи')
  async sendPhone(ctx: Context) {
    await this.appService.sendPhoneToAdmin(ctx);
    await this.appService.getMessageJoinGroup(ctx);
  }

  //------КВИЗ

  @Hears('📋 Пройти тест')
  async startQuiz(ctx: Context) {
    await this.quizService.selectQuiz(ctx);
  }

  @Hears('🍋 Стресс')
  async startStressQuiz(ctx: Context) {
    await this.quizService.startQuiz(ctx, QuizIdsEnum.QUIZ_QUESTIONS_STRESS);
  }

  @Hears('🥦 Образ жизни')
  async startImtQuiz(ctx: Context) {
    await this.quizService.startQuiz(ctx, QuizIdsEnum.QUIZ_QUESTIONS_IMT);
  }

  // Команда для отмены квиза
  @Hears('/cancel')
  async cancelQuiz(@Ctx() ctx: Context) {
    if (ctx.session.quiz) {
      delete ctx.session.quiz;
      await ctx.reply('❌ Тест отменен', getActionButtons());
    }
  }

  // Обработчик текстовых сообщений для квиза
  @On('text')
  async handleText(@Ctx() ctx: Context<any>) {
    const quizState = ctx.session.quiz;
    const quizId = ctx.session.quizId;

    // Если пользователь не в процессе квиза, игнорируем
    if (!quizState || quizId === undefined) return;

    const answer = ctx.message?.text;
    const currentIndex = quizState.index;

    // Обработка ответа
    const isValid = await this.quizService.handleAnswer(ctx, answer, quizId);

    if (!isValid) return;

    if (currentIndex < QuizIdToData[quizId].length - 1) {
      // Отправляем следующий вопрос
      await this.quizService.sendQuestion(ctx, currentIndex + 1, quizId);
    } else {
      // Завершаем квиз
      await this.quizService.finishQuiz(ctx, quizId);
      await this.appService.getMessageJoinGroup(ctx);
    }
  }
}
