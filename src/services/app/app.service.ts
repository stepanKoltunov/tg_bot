import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { getInfoText, getTextForAdmin } from '../../utils';
import * as process from 'node:process';

@Injectable()
export class AppService {

  async getMessageJoinGroup(ctx: Context) {
    await ctx.reply(`Вы можете следить за новостями в нашем телеграм канале: ${process.env.CHAT_ID}`)
  }

  async getMessageInfo(ctx: Context) {
    const message: string = getInfoText()
    await ctx.replyWithHTML(message)
  }

  async sendPhoneToAdmin(ctx: Context) {
    try {
      const adminId = process.env.ADMIN_TELEGRAM_ID as string;
      await ctx.telegram.sendMessage(adminId, getTextForAdmin(ctx));
      await ctx.reply("Ваш профиль телеграм отправлен эксперту");
    } catch (error) {
      await ctx.reply("⚠️ Произошла техническая ошибка при отправки сообщения");
    }
  }
}