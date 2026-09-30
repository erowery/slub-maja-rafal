'use client';

import { menuCategories } from '@/lib/menu-data';

function LeafDivider() {
  return (
    <div className="flex items-center justify-center gap-2 my-5 text-neutral-400">
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none" aria-hidden>
        <path
          d="M2 6c4-4 8-4 12 0s8 4 12 0 8-4 12 0"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      </svg>
      <span className="text-lg leading-none">🌿</span>
      <svg width="40" height="12" viewBox="0 0 40 12" fill="none" aria-hidden>
        <path
          d="M2 6c4-4 8-4 12 0s8 4 12 0 8-4 12 0"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function MenuView() {
  return (
    <div className="px-6 pt-8 pb-4">
      <div className="mb-2 text-center">
        <h1 className="font-heading text-[28px] text-neutral-900 leading-tight">
          Wesele Mai i Rafała
        </h1>
        <h2 className="font-heading text-2xl text-neutral-800 mt-5 italic">
          Menu
        </h2>
      </div>

      <LeafDivider />

      <div className="space-y-8 max-w-sm mx-auto">
        {menuCategories.map((cat) => (
          <section key={cat.id} className="text-center">
            <h3 className="font-heading text-lg text-neutral-900 mb-3 tracking-wide">
              {cat.title}
            </h3>
            {cat.sections.map((section) => (
              <div key={section.label} className="mb-4">
                {section.label && cat.sections.length > 1 && (
                  <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-body mb-2">
                    {section.label}
                  </p>
                )}
                <ul className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="font-body text-[15px] text-neutral-700 leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>

      <LeafDivider />

      <p className="text-center text-sm text-neutral-400 font-body italic">
        Smacznego!
      </p>
    </div>
  );
}
