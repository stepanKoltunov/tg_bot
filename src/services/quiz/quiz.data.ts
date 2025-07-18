import { QuizIdsEnum, QuizQuestion } from './quiz.interface';

export const QUIZ_QUESTIONS_IMT: QuizQuestion[] = [
  {
    text: '1. Что ежедневно включено в Ваш рацион питания?',
    type: 'choice',
    options: [
      'орехи и семечки',
      'мясо, рыба, морепродукты',
      'фрукты, овощи, зелень',
      'сладости, конфеты',
    ],
    currentAnswer: [
      'орехи и семечки',
      'мясо, рыба, морепродукты',
      'фрукты, овощи, зелень',
    ],
    responseIfGood: 'за полноценным рационом питания',
    responseIfBad: 'баланс жиров и углеводов в питании',
  },
  {
    text: '2. Контролируете ли Вы свой вес, объем талии?',
    type: 'choice',
    options: [
      'Да, ежедневно',
      'да, раз в неделю',
      'редко, примерно раз в полгода',
      'не контролирую',
    ],
    currentAnswer: ['Да, ежедневно', 'да, раз в неделю'],
    responseIfGood: 'стараетесь ограничивать употреление "вредных" продуктов',
    responseIfBad: 'усиление контроля массы тела',
  },
  {
    text: '3. Как часто в Вашем рационе бывает фаст-фуд и покупные полуфабрикаты?',
    type: 'choice',
    options: ['ежедневно', '1-2 раза в неделю', 'редко', 'не употребляю'],
    currentAnswer: ['редко', 'не употребляю'],
    responseIfGood: 'контролируете свои параметры веса и объемов',
    responseIfBad: 'изменение режима питания',
  },
  {
    text: '4. Как у Вас организованы завтраки?',
    type: 'choice',
    options: [
      'ежедневно, обычно дома с 7 до 9 часов утра',
      'на работе с 9 до 10 часов',
      'утром пью только кофе',
      'не завтракаю, утром нет аппетита',
    ],
    currentAnswer: ['ежедневно, обычно дома с 7 до 9 часов утра'],
    responseIfGood: 'правильно организовываете режим питания',
    responseIfBad: 'количество часов сна',
  },
  {
    text: '5. Что из перечисленного относится к Вам?',
    type: 'choice',
    options: [
      'занимаюсь спортом (не меньше 3 часов в неделю)',
      'люблю до поздна смотреть сериалы или играть в компьютор',
      'каждые выходные употребляю спиртные напитки на отдыхе',
      'вечером долго засыпаю и ночью часто просыпаюсь',
    ],
    currentAnswer: ['занимаюсь спортом (не меньше 3 часов в неделю)'],
    responseIfGood: 'стараетесь заниматься спортом',
    responseIfBad: 'организация отдыха',
  },
  {
    text: '6. Выберите Ваш пол для оценки массы тела',
    type: 'choice',
    options: ['М', 'Ж'],
  },
  {
    text: '7. Напишите Ваш рост в метрах. Например: 1.83',
    type: 'text',
  },
  {
    text: '8. Напишите Ваш вес(кг). Например: 70.5',
    type: 'text',
  },
];




export const QUIZ_QUESTIONS_STRESS: QuizQuestion[] = [
  {
    text: '1. Как часто вы бываете на свежем воздухе, на прогулках?',
    type: 'choice',
    options: [
      'часто гуляю вечером перед сном (с детьми, собакой, друзьями)',
      'катаюсь на роликах, велосипеде, лыжах, скейтборде и другое',
      'каждый рабочий день езжу на метро и наземном транспорте',
      'работаю дома, редко выхожу на улицу'
    ],
    currentAnswer: [
      'часто гуляю вечером перед сном (с детьми, собакой, друзьями)',
      'катаюсь на роликах, велосипеде, лыжах, скейтборде и другое',
      'каждый рабочий день езжу на метро и наземном транспорте',
    ],
  },
  {
    text: '2. О чем Вы думаете обычно перед сном?',
    type: 'choice',
    options: [
      'о предстоящих выходных и хобби',
      'о том, что интересное произошло за день, что удалось сделать',
      'какие важные дела и хлопоты ожидают завтра',
      'итоги дня- что не получилось и пошло не так'
    ],
    currentAnswer: [
      'о предстоящих выходных и хобби',
      'о том, что интересное произошло за день, что удалось сделать',
    ],
  },
  {
    text: '3. Что из перечисленного ниже относится к Вам?',
    type: 'choice',
    options: [
      'память и внимание всегда в норме',
      'хороший аппетит и соблюдаю режим питания',
      'Бывает, что с утра сразу мало сил и нет настроения',
      'трудно заснуть, часто просыпаюсь ночью, снятся тревожные сны'
    ],
    currentAnswer: [
      'память и внимание всегда в норме',
      'хороший аппетит и соблюдаю режим питания',
    ],
  },
  {
    text: '4. Как работает Ваша пищеварительная система?',
    type: 'choice',
    options: [
      'стул в норме каждый день',
      'часто бывает диарея',
      'стул как правило 1 раз в 2-3 дня',
      'часто боли и тяжесть в животе при переедании, особенно вечером'
    ],
    currentAnswer: [
      'стул в норме каждый день',
    ],
  },
  {
    text: '5. Когда возникают сложности, неожиданности, проблемы, какая у вас обычно реакция?',
    type: 'choice',
    options: [
      'начинаете активный поиск вариантов решений',
      'тревожность, раздражительность, злость',
      'апатия, безразличие, бездействие',
      'сначала снять стресс с помощью алкоголя'
    ],
    currentAnswer: [
      'начинаете активный поиск вариантов решений',
    ],
  },
  {
    text: '6. Укажите ваш пол?',
    type: 'choice',
    options: ['М', 'Ж']
  },
  {
    text: '7. Сколько в среднем часов составляет Ваш ежедневный сон?',
    type: 'text'
  },
  {
    text: '8. Оцените степень сложности и ответственности вашей работы?',
    type: 'choice',
    options: [
      'чрезмерно высокая',
      'средняя',
      'низкая'
    ],
    currentAnswer: [
      'средняя',
      'низкая',
    ],
  }
];

export const QuizIdToData = {
  [QuizIdsEnum.QUIZ_QUESTIONS_IMT]: QUIZ_QUESTIONS_IMT,
  [QuizIdsEnum.QUIZ_QUESTIONS_STRESS]: QUIZ_QUESTIONS_STRESS,
}