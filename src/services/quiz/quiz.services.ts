import { Injectable } from '@nestjs/common';
import { Context, Markup } from 'telegraf';
import { QUIZ_QUESTIONS } from './quiz.data';
import { getActionButtons } from '../../app.buttons';
import { generateImtText, isValidNumber } from './utils';
import * as process from 'node:process';
import { getTextForAdmin } from '../../utils';

@Injectable()
export class QuizService {
  // Вопросы квиза
  private readonly questions = QUIZ_QUESTIONS.map((data) => data.text);

  // Варианты ответов для вопросов 1-5
  private readonly options = QUIZ_QUESTIONS.map((data) => data.options);

  // Запуск квиза
  async startQuiz(ctx: Context) {
    await ctx.reply('Тест запущен', Markup.removeKeyboard());
    ctx.session.quiz = {
      step: 1,
      answers: new Array(6).fill(null),
    };
    await this.sendQuestion(ctx, 1);
    setTimeout(
      () => {
        if (ctx.session.quiz?.step) {
          delete ctx.session.quiz;
          ctx.reply(
            '⌛ Время на прохождение теста истекло',
            getActionButtons(),
          );
        }
      },
      10 * 60 * 1000,
    ); // 10 минут
  }

  // Отправка вопроса пользователю
  async sendQuestion(ctx: Context, step: number) {
    const questionIndex = step - 1;

    if (QUIZ_QUESTIONS[questionIndex].type === 'choice') {
      // Вопросы с вариантами ответов
      await ctx.reply(
        this.questions[questionIndex],
        Markup.keyboard(this.options[questionIndex] as string[])
          .resize(),
      );
    } else if (QUIZ_QUESTIONS[questionIndex].type === 'text') {
      // Последний вопрос - текстовый
      await ctx.reply(this.questions[questionIndex], Markup.removeKeyboard());
    }
  }

  // Обработка ответа
  async handleAnswer(ctx: Context, answer: string) {
    const quiz = ctx.session.quiz;
    if (!quiz) return false;

    const currentStep = quiz.step;
    const questionIndex = currentStep - 1;

    // Для последних вопроса проверяем длину ответа
    if (QUIZ_QUESTIONS[questionIndex].type === 'text') {
      if (answer.length < 1) {
        await ctx.reply('❌ Это поле обязательное и не может быть пустым.');
        return false;
      }
      if (!isValidNumber(answer)) {
        await ctx.reply('❌ Вводите числа формата: 1.3 или 13');
        return false;
      }
    }

    // Сохраняем ответ
    quiz.answers[questionIndex] = answer.trim();
    quiz.step++;

    return true;
  }

  // Завершение квиза
  async finishQuiz(ctx: Context) {
    const quiz = ctx.session.quiz;
    if (!quiz) return;

    // Формируем отчет
    let report = '📊 Ваши ответы:\n\n';
    quiz.answers.forEach((answer, index) => {
        report += `${index + 1}. ${answer || 'Нет ответа'}\n`;
    });
    await ctx.reply(report);
    await ctx.reply(`Ваш результат отправлен эксперту ✅`, getActionButtons());
    const imtText = generateImtText(quiz.answers)
    await ctx.reply(imtText);

    //отправляем результат
    await this.sendResultToAdmin(ctx, report)

    // Сбрасываем состояние
    delete ctx.session.quiz;
  }

  async sendResultToAdmin(ctx: Context, message: string) {
    try {
      const adminId = process.env.ADMIN_TELEGRAM_ID as string;
      await ctx.telegram.sendMessage(adminId, getTextForAdmin(ctx, message));
    } catch (error) {
      await ctx.reply("⚠️ Произошла техническая ошибка при отправки сообщения");
    }
  }
}
