import { AppService } from './app.service';
import { Action, Ctx, Hears, Help, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { getActionButtons } from './app.buttons';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService
  ) {}

  @Start()
  async startBotCommand(ctx: Context) {
    await ctx.reply('Привет! Что ты хочешь сделать?', getActionButtons())
  }

  @Help()
  async getHelp(ctx: Context) {
    await ctx.reply('Попробуйте: /start')
  }

  @Hears('📋 Пройти тест')
  async startQuiz(ctx: Context) {
    await ctx.reply('Квиз запущен')
  }

  @Hears('💡 Информация')
  async getInfo(ctx: Context) {
    await ctx.reply('Доп Информация + ссылка на тг группу')
  }

  @Hears('☎ Оставить номер для обратной связи')
  async sendPhone(ctx: Context) {
    await ctx.reply('номер отправлен Юлии')
  }
}
