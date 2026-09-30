export type BingoTask = {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  emoji: string;
};

export const bingoTasks: BingoTask[] = [
  {
    id: 1,
    title: 'Z Parą Młodą',
    description: 'Klasyczna, pamiątkowa fotka z Mają i Rafałem.',
    difficulty: 'easy',
    emoji: '👰',
  },
  {
    id: 2,
    title: 'Moment Toastu',
    description: 'Zdjęcie z wzniesionym kieliszkiem w momencie oficjalnego toastu.',
    difficulty: 'easy',
    emoji: '🥂',
  },
  {
    id: 3,
    title: 'Słodki Stół',
    description: 'Piękne ujęcie weselnego tortu lub deseru.',
    difficulty: 'easy',
    emoji: '🍰',
  },
  {
    id: 4,
    title: 'Najszerszy Uśmiech',
    description: 'Fotka osoby (lub grupy) z największym uśmiechem na parkiecie.',
    difficulty: 'easy',
    emoji: '😄',
  },
  {
    id: 5,
    title: 'Taniec z Młodą',
    description: 'Zdjęcie w trakcie tańca z Mają lub Rafałem.',
    difficulty: 'medium',
    emoji: '💃',
  },
  {
    id: 6,
    title: 'Najlepsze Grupowe',
    description: 'Kreatywna fotka z grupą przyjaciół lub rodziny.',
    difficulty: 'medium',
    emoji: '👥',
  },
  {
    id: 7,
    title: 'Detal Weselny',
    description: 'Ujęcie dekoracji — bukietu, zaproszenia, winietki w stylu szałwii.',
    difficulty: 'medium',
    emoji: '🌸',
  },
  {
    id: 8,
    title: 'Szalona Fotka',
    description: 'Dynamiczne ujęcie szalonych tańców w kulminacyjnym momencie nocy.',
    difficulty: 'hard',
    emoji: '🎉',
  },
  {
    id: 9,
    title: 'Z Ukrycia',
    description: 'Zabawne, naturalne ujęcie Pary Młodej, gdy nie patrzą w obiektyw.',
    difficulty: 'hard',
    emoji: '📸',
  },
];
