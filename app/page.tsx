'use client';

import { useState } from 'react';
import { Gallery } from '@/components/gallery';
import { MenuView } from '@/components/menu-view';
import { Bingo } from '@/components/bingo';
import { Quiz } from '@/components/quiz';
import { Camera, UtensilsCrossed, Grid3x3, HelpCircle } from 'lucide-react';

type Tab = 'gallery' | 'menu' | 'bingo' | 'quiz';

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'gallery', label: 'Galeria', icon: Camera },
  { id: 'menu', label: 'Karta dań', icon: UtensilsCrossed },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  { id: 'bingo', label: 'Bingo', icon: Grid3x3 },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('gallery');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 max-w-lg mx-auto w-full pb-24">
        {activeTab === 'gallery' && <Gallery />}
        {activeTab === 'menu' && <MenuView />}
        {activeTab === 'bingo' && <Bingo />}
        {activeTab === 'quiz' && <Quiz />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200">
        <div className="max-w-lg mx-auto flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                  isActive
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                <span className="text-[10px] font-body font-medium tracking-wide">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
