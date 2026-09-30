export type MenuCategory = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  sections: MenuSection[];
};

export type MenuSection = {
  label: string;
  items: string[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: 'obiad',
    title: 'Obiad Weselny',
    subtitle: 'Pierwsze danie weselne',
    emoji: '🍽️',
    sections: [
      {
        label: 'Przystawka',
        items: ['Bruschetta z pomidorami i bazylią'],
      },
      {
        label: 'Zupa',
        items: ['Złocisty rosół z domowym makaronem'],
      },
      {
        label: 'Dania główne',
        items: [
          'Pieczeń wieprzowa w sosie własnym',
          'Kaczka pieczona z jabłkami',
        ],
      },
    ],
  },
  {
    id: 'gorace',
    title: 'Dania Gorące',
    subtitle: 'Bufet wieczorny',
    emoji: '🔥',
    sections: [
      {
        label: 'Bufet wieczorny',
        items: [
          'Bogracz wołowy',
          'Barszcz czerwony z krokietem',
          'Ziemniaki z koperkiem i ryż',
        ],
      },
    ],
  },
  {
    id: 'zimna',
    title: 'Zimna Płyta & Przekąski',
    subtitle: 'Suto zastawiony stół',
    emoji: '🧀',
    sections: [
      {
        label: 'Przekąski',
        items: [
          'Deska wędlin tradycyjnych',
          'Śledź w oleju i w śmietanie',
          'Sałatka gyros i grecka',
        ],
      },
    ],
  },
  {
    id: 'slodki',
    title: 'Słodki Stół & Owoce',
    subtitle: 'Słodkie zakończenie',
    emoji: '🍰',
    sections: [
      {
        label: 'Słodkie menu',
        items: [
          'Tort weselny',
          'Sernik, szarlotka, babeczki owocowe',
          'Półmiski świeżych owoców',
        ],
      },
    ],
  },
];
