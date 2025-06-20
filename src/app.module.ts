import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TelegrafModule} from "nestjs-telegraf";
import * as LocalSession from 'telegraf-session-local'

const sessions = new LocalSession({database: 'session_db.json'})

@Module({
  imports: [
      TelegrafModule.forRoot({
        middlewares: [sessions.middleware()],
        token: process.env.TELEGRAM_BOT_TOKEN as string,
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
