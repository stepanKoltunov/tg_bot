import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local'
import * as process from "node:process";
import { ConfigModule } from '@nestjs/config';


const sessions = new LocalSession({database: 'session_db.json'})

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`
    }),
      TelegrafModule.forRoot({
        middlewares: [sessions.middleware()],
        token: process.env.TELEGRAM_BOT_TOKEN as string,
      })
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
