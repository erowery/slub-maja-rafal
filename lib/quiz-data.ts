export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Gdzie Maja i Rafał poznali się?',
    options: ['Na studiach', 'W pracy', 'Na wakacjach'],
    correctIndex: 0,
  },
  {
    id: 2,
    question: 'Kto pierwszy powiedział „Kocham cię"?',
    options: ['Rafał', 'Maja', 'Oboje jednocześnie'],
    correctIndex: 1,
  },
  {
    id: 3,
    question: 'Jakie jest ulubione wspólne danie Pary Młodej?',
    options: ['Pizza', 'Burger', 'Sushi'],
    correctIndex: 2,
  },
  {
    id: 4,
    question: 'Kto jest większym śpiochem?',
    options: ['Maja', 'Rafał', 'Trudno powiedzieć, oboje'],
    correctIndex: 0,
  },
  {
    id: 5,
    question: 'Gdzie odbyli swoją pierwszą wspólną podróż?',
    options: ['Do Rzymu', 'Nad polskie morze', 'W góry'],
    correctIndex: 2,
  },
];
