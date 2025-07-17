import { Injectable } from '@nestjs/common';
import { Context, Markup } from 'telegraf';
import { QuizIdToData } from './quiz.data';
import { getActionButtons } from '../../app.buttons';
import { generateImtText, generateStressText, isValidNumber } from './utils';
import * as process from 'node:process';
import { getTextForAdmin } from '../../utils';
import { getQuizButtons } from './quiz.buttons';
import { QuizIdsEnum } from './quiz.interface';

@Injectable()
export class QuizService {

  // Вопросы квиза
  private questions: any;

  // Варианты ответов для вопросов 1-5
  private options: any;

  // Выбор квиза
  async selectQuiz(ctx: Context) {
    await ctx.reply('Выберите тест', getQuizButtons());
  }

  // Запуск квиза
  async startQuiz(ctx: Context, quizId: QuizIdsEnum) {
    await ctx.reply('Тест запущен', Markup.removeKeyboard());

    ctx.session.quizId = quizId;
    ctx.session.quiz = {
      index: 0,
      answers: [],
    };
    this.options = QuizIdToData[quizId].map((data) => data.options);
    this.questions = QuizIdToData[quizId].map((data) => data.text);

    await this.sendQuestion(ctx, 0, quizId);

    setTimeout(
      () => {
        if (ctx.session.quiz?.index) {
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
  async sendQuestion(ctx: Context, questionIndex: number, quizId: QuizIdsEnum) {
    // Вопросы с вариантами ответов
    if (QuizIdToData[quizId][questionIndex].type === 'choice') {
      await ctx.reply(
        this.questions[questionIndex],
        Markup.keyboard(this.options[questionIndex] as string[]).resize(),
      );
      // Вопросы текстовые
    } else if (QuizIdToData[quizId][questionIndex].type === 'text') {
      await ctx.reply(this.questions[questionIndex], Markup.removeKeyboard());
    }
  }

  // Обработка ответа
  async handleAnswer(ctx: Context, answer: string, quizId: QuizIdsEnum) {
    const quiz = ctx.session.quiz;

    if (!quiz) return false;

    const questionIndex = quiz.index;

    // Для вопросов проверяем длину ответа
    if (QuizIdToData[quizId][questionIndex].type === 'text') {
      if (answer.length < 1) {
        await ctx.reply('❌ Это поле обязательное и не может быть пустым');
        return false;
      }
      if (!isValidNumber(answer)) {
        await ctx.reply('❌ Вводите числа формата: 1.3 или 13');
        return false;
      }
    }

    // Сохраняем ответ
    quiz.answers[questionIndex] = answer.trim();
    quiz.index++;

    return true;
  }

  // Завершение квиза
  async finishQuiz(ctx: Context, quizId: QuizIdsEnum) {
    const quiz = ctx.session.quiz;

    if (!quiz) return;

    await this.sendFinishText(ctx, quiz.answers, quizId)

    // Сбрасываем состояние
    delete ctx.session.quiz;
    delete ctx.session.quizId;
  }

  async sendFinishText(ctx: Context, answers: string[], quizId: QuizIdsEnum) {

    // Формируем отчет
    let report = '📊 Ваши ответы:\n\n';
    answers.forEach((answer, index) => {
      report += `${index + 1}. ${answer || 'Нет ответа'}\n`;
    });
    report += '\nВаш результат отправлен эксперту ✅\n';
    await ctx.reply(report, getActionButtons());

    // генерируем разбор по ответам
    if (quizId === QuizIdsEnum.QUIZ_QUESTIONS_IMT) {
      const imtText = generateImtText(answers);
      await ctx.reply(imtText);
    }

    if (quizId === QuizIdsEnum.QUIZ_QUESTIONS_STRESS) {
      const stressText = generateStressText(answers);
      await ctx.reply(stressText);
    }

    //отправляем результат
    await this.sendResultToAdmin(ctx, report);
  }

  async sendResultToAdmin(ctx: Context, message: string) {
    try {
      const adminId = process.env.ADMIN_TELEGRAM_ID as string;
      await ctx.telegram.sendMessage(adminId, getTextForAdmin(ctx, message));
    } catch (error) {
      await ctx.reply('⚠️ Произошла техническая ошибка при отправки сообщения');
    }
  }
}
