import { useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Building,
  Calculator,
  CheckSquare,
  Code,
  FileText,
  Globe,
  GraduationCap,
  Headphones,
  Megaphone,
  Search,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { INDUSTRY_PROMPT_CATEGORIES, IndustryPromptCategory, PromptItem } from '../../data/promptsData';
import { PromptCard } from './PromptCard';
import { PromptPreviewModal } from './PromptPreviewModal';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Briefcase,
  Megaphone,
  Users,
  GraduationCap,
  BookOpen,
  Calculator,
  CheckSquare,
  Code,
  FileText,
  Shield,
  Activity,
  Globe,
  Building,
  Headphones,
  Award,
};

export function PromptLibrary() {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePreview, setActivePreview] = useState<{ prompt: PromptItem; categoryName: string } | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter categories and prompts
  const filteredCategories = INDUSTRY_PROMPT_CATEGORIES.filter((category) => {
    if (selectedCategorySlug !== 'all' && category.id !== selectedCategorySlug) return false;
    return true;
  });

  // If there's a search query, flatten all prompts across all categories that match
  const allMatchingPrompts: { prompt: PromptItem; categoryName: string }[] = [];
  INDUSTRY_PROMPT_CATEGORIES.forEach((cat) => {
    if (selectedCategorySlug !== 'all' && cat.id !== selectedCategorySlug) return;
    cat.prompts.forEach((p) => {
      const haystack = `${p.title} ${p.description} ${p.promptText} ${cat.name}`.toLowerCase();
      if (!normalizedQuery || haystack.includes(normalizedQuery)) {
        allMatchingPrompts.push({ prompt: p, categoryName: cat.name });
      }
    });
  });

  return (
    <div className="space-y-8">
      {/* Section Header & Search */}
      <div className="rounded-[16px] bg-gradient-to-r from-[#0B1F4B] to-[#0056D2] p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 font-en text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <span>Professional Toolkit</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold font-en">
            Industry-Wise AI Prompt Library
          </h2>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-blue-100">
            ১৫+ পেশাদার খাতের জন্য বিশেষভাবে তৈরি প্রম্পট টেমপ্লেট। কপি করে তাৎক্ষণিকভাবে আপনার কাজে ব্যবহার করুন।
          </p>

          <div className="mt-6 relative max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="প্রম্পট খুঁজুন (যেমন: Business idea, Lesson plan, Resume)..."
              aria-label="প্রম্পট খুঁজুন"
              className="min-h-[48px] w-full rounded-[10px] bg-white py-3 pl-12 pr-4 text-sm text-[var(--color-heading)] shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div
        role="tablist"
        aria-label="Industry prompt categories"
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategorySlug === 'all'}
          onClick={() => setSelectedCategorySlug('all')}
          className={`min-h-[42px] shrink-0 rounded-full px-4 py-2 font-en text-xs font-semibold transition-colors cursor-pointer ${
            selectedCategorySlug === 'all'
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'border border-[var(--color-border)] bg-white text-[var(--color-heading)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
          }`}
        >
          All Categories ({INDUSTRY_PROMPT_CATEGORIES.reduce((acc, c) => acc + c.prompts.length, 0)})
        </button>
        {INDUSTRY_PROMPT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategorySlug === cat.id;
          const IconComp = ICON_MAP[cat.iconName] || Briefcase;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategorySlug(cat.id)}
              className={`inline-flex min-h-[42px] shrink-0 items-center gap-2 rounded-full px-4 py-2 font-en text-xs font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'border border-[var(--color-border)] bg-white text-[var(--color-heading)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              <IconComp className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{cat.name}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {cat.prompts.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Prompts Grid */}
      {allMatchingPrompts.length === 0 ? (
        <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-10 text-center">
          <p className="text-base font-semibold text-[var(--color-heading)]">
            আপনার অনুসন্ধান বা filter অনুযায়ী কোনো প্রম্পট পাওয়া যায়নি।
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategorySlug('all');
              setSearchQuery('');
            }}
            className="mt-4 inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-5 py-2 font-en text-xs font-semibold text-white hover:bg-[var(--color-primary-hover)] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allMatchingPrompts.map(({ prompt, categoryName }) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              categoryName={categoryName}
              onPreview={(p, c) => setActivePreview({ prompt: p, categoryName: c })}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <PromptPreviewModal
        prompt={activePreview?.prompt || null}
        categoryName={activePreview?.categoryName || ''}
        onClose={() => setActivePreview(null)}
      />
    </div>
  );
}
