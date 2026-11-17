import { useState } from 'react';
import { Lock, Sparkles, X, LogIn, ArrowRight } from 'lucide-react';
import { PromptItem } from '../../data/promptsData';

interface PromptPreviewModalProps {
  prompt: PromptItem | null;
  categoryName: string;
  onClose: () => void;
}

export function PromptPreviewModal({ prompt, categoryName, onClose }: PromptPreviewModalProps) {
  if (!prompt) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[16px] bg-white p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <div className="flex items-center gap-2 font-en text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full w-fit mb-1 border border-amber-200">
              <Lock className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
              <span>Locked Prompt Template · Members Only</span>
            </div>
            <h2 id="prompt-modal-title" className="text-xl sm:text-2xl font-bold text-[var(--color-heading)]">
              {prompt.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-[12px] border border-amber-200 bg-amber-50 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-800 mb-3">
              <Lock className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-heading)]">
              এই প্রম্পট টেমপ্লেটটি লক করা আছে
            </h3>
            <p className="mt-2 text-sm text-[var(--color-body)] max-w-md mx-auto leading-relaxed">
              শিল্পভিত্তিক প্রম্পট লাইব্রেরি থেকে প্রম্পট কপি ও ব্যবহার করতে আপনার অ্যাকাউন্টে লগইন করুন অথবা کور্সে এনরোল করুন।
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/login"
                className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-6 py-2.5 font-en text-sm font-bold text-white hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span>Log In to Unlock Prompts</span>
              </a>
              <a
                href="/#courses"
                onClick={onClose}
                className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center gap-2 rounded-[8px] border border-[var(--color-border)] bg-white px-6 py-2.5 font-en text-sm font-bold text-[var(--color-heading)] hover:bg-slate-50 transition-colors"
              >
                <span>Browse Courses</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[var(--color-border)] pt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[40px] items-center rounded-[8px] bg-slate-200 px-5 py-2 font-en text-xs font-semibold text-slate-800 hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
