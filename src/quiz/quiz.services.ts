import { Injectable } from '@nestjs/common';
import { Context, Markup } from 'telegraf';
import { QUIZ_QUESTIONS } from './quiz.data';
import { getActionButtons } from '../app.buttons';

@Injectable()
export class QuizService {
  // Вопросы квиза
  private readonly questions = QUIZ_QUESTIONS.map(data=> data.text)

  // Варианты ответов для вопросов 1-5
  private readonly options = QUIZ_QUESTIONS.map(data=> data.options)

  // Запуск квиза
  async startQuiz(ctx: Context) {
    ctx.session.quiz = {
      step: 1,
      answers: new Array(6).fill(null)
    };
    await this.sendQuestion(ctx, 1);
    setTimeout(() => {
      if (ctx.session.quiz?.step) {
        delete ctx.session.quiz;
        ctx.reply('⌛ Время на прохождение квиза истекло', getActionButtons());
      }
    }, 10 * 60 * 1000); // 10 минут
  }

  // Отправка вопроса пользователю
  async sendQuestion(ctx: Context, step: number) {
    const questionIndex = step - 1;

    if (step <= 7) {
      // Вопросы с вариантами ответов
      await ctx.reply(
        this.questions[questionIndex],
        Markup.keyboard(this.options[questionIndex] as string[]).resize().oneTime()
      );
    } else {
      // Последний вопрос - текстовый
      await ctx.reply(
        this.questions[questionIndex],
        Markup.removeKeyboard()
      );
    }
  }

  // Обработка ответа
  async handleAnswer(ctx: Context, answer: string) {
    const quiz = ctx.session.quiz;
    if (!quiz) return false;

    const currentStep = quiz.step;
    const stepIndex = currentStep - 1;

    // Для последнего вопроса проверяем длину ответа
    if (currentStep === 8 || currentStep === 9) {
      if (answer.length < 1) {
        await ctx.reply("❌ Это поле обязательное и не может быть пустым.");
        return false;
      }
    }

    // Сохраняем ответ
    quiz.answers[stepIndex] = answer;
    quiz.step++;

    return true;
  }

  // Завершение квиза
  async finishQuiz(ctx: Context) {
    const quiz = ctx.session.quiz;
    if (!quiz) return;

    // Формируем отчет
    let report = "📊 Ваши ответы:\n\n";
    quiz.answers.forEach((answer, index) => {
      report += `${index + 1}. ${answer || 'Нет ответа'}\n`;
    });

    await ctx.reply(report);

    // Здесь можно добавить логику оценки ответов
    let correctAnswers = 0
    quiz.answers.forEach((answer, index) => {
      if (QUIZ_QUESTIONS[index].currentAnswer?.includes(answer)) {
        correctAnswers++
      }
    });
    await ctx.reply(`✅ Правильных ответов: ${correctAnswers}/5`);

    // Сбрасываем состояние
    delete ctx.session.quiz;
  }
}