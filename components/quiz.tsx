'use client';

import { useState } from 'react';
import { quizQuestions } from '@/lib/quiz-data';

export function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const question = quizQuestions[current];
  const total = quizQuestions.length;

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  };

  if (finished) {
    return (
      <div className="px-4 pt-8 pb-4 text-center">
        <h1 className="font-heading text-[28px] text-neutral-900 leading-tight mb-6">
          Wesele Mai i Rafała
        </h1>
        <div className="max-w-sm mx-auto py-10">
          <p className="font-heading text-2xl text-neutral-900 mb-2">Twój wynik</p>
          <p className="text-4xl font-heading text-neutral-900 mb-4">
            {score} / {total}
          </p>
          <p className="text-sm text-neutral-500 font-body mb-8">
            {score === total
              ? 'Perfekcyjnie! Znasz Parę Młodą na wylot 💚'
              : score >= total / 2
                ? 'Nieźle! Jeszcze trochę i będziesz ekspertem.'
                : 'Czas na dłuższe rozmowy z Parą Młodą 😊'}
          </p>
          <button
            type="button"
            onClick={handleRestart}
            className="bg-neutral-900 text-white rounded-full px-8 py-3 text-sm font-body font-medium"
          >
            Zagraj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-8 pb-4">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-[28px] text-neutral-900 leading-tight">
          Wesele Mai i Rafała
        </h1>
        <h2 className="font-heading text-xl text-neutral-800 mt-4 mb-1">Quiz</h2>
        <p className="text-[13px] text-neutral-500 font-body">
          Pytanie {current + 1} z {total}
        </p>
      </div>

      <div className="max-w-sm mx-auto">
        <div className="h-1 bg-neutral-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-neutral-900 transition-all duration-300"
            style={{ width: `${((current + (answered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>

        <p className="font-heading text-lg text-neutral-900 text-center mb-6 leading-snug">
          {question.question}
        </p>

        <div className="space-y-2.5">
          {question.options.map((opt, i) => {
            let style =
              'w-full border border-neutral-200 rounded-xl py-3.5 px-4 text-left text-[15px] font-body text-neutral-800 transition-colors';
            if (answered) {
              if (i === question.correctIndex) {
                style =
                  'w-full border border-green-500 bg-green-50 rounded-xl py-3.5 px-4 text-left text-[15px] font-body text-green-900';
              } else if (i === selected) {
                style =
                  'w-full border border-red-300 bg-red-50 rounded-xl py-3.5 px-4 text-left text-[15px] font-body text-red-800';
              }
            } else {
              style += ' hover:border-neutral-400 hover:bg-neutral-50';
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={style}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <button
            type="button"
            onClick={handleNext}
            className="mt-6 w-full bg-neutral-900 text-white rounded-full py-3 text-sm font-body font-medium"
          >
            {current + 1 >= total ? 'Zobacz wynik' : 'Następne pytanie'}
          </button>
        )}
      </div>
    </div>
  );
}
