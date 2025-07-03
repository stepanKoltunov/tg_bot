import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import * as process from 'node:process';
import { ConfigModule } from '@nestjs/config';
import { QuizService } from './services/quiz/quiz.services';
import { Context } from 'telegraf';
import { AppService } from './services/app/app.service';

const sessions = new LocalSession({
  database: 'session_db.json',
  storage: LocalSession.storageFileAsync,
  getSessionKey: (ctx: Context) => {
    if (ctx.from && ctx.chat) {
      return `${ctx.from.id}:${ctx.chat.id}`;
    }
    return '';
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: process.env.TELEGRAM_BOT_TOKEN as string,
    }),
  ],
  providers: [AppUpdate, QuizService, AppService],
})
export class AppModule {}
