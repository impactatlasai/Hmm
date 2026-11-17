import { useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { PromptItem } from '../../data/promptsData';

interface PromptCardProps {
  prompt: PromptItem;
  categoryName: string;
  onPreview: (prompt: PromptItem, categoryName: string) => void;
}

export function PromptCard({ prompt, categoryName, onPreview }: PromptCardProps) {
  return (
    <article
      onClick={() => onPreview(prompt, categoryName)}
      className="group relative flex flex-col justify-between rounded-[12px] border border-[var(--color-border)] bg-white p-6 shadow-sm transition-all hover:border-[var(--color-primary)] hover:shadow-md cursor-pointer"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-tint)] px-3 py-1 font-en text-xs font-semibold text-[var(--color-primary)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{categoryName}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 font-en text-[11px] font-semibold text-amber-800 border border-amber-200">
            <Lock className="h-3 w-3 text-amber-700" aria-hidden="true" />
            <span>Locked</span>
          </span>
        </div>

        <h3 className="mt-3 text-lg font-bold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
          {prompt.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)] line-clamp-2">
          {prompt.description}
        </p>

        <div className="mt-4 rounded-[8px] bg-slate-50 p-3 border border-slate-200 blur-[2px] select-none">
          <p className="font-en text-xs text-slate-500 italic">
            "{prompt.promptText}"
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-en text-xs font-semibold text-amber-800">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Members Only</span>
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white group-hover:bg-[var(--color-primary-hover)] transition-colors">
          <span>Unlock Prompt</span>
        </span>
      </div>
    </article>
  );
}
