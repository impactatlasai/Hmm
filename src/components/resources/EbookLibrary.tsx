import { useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { EBOOK_CATEGORIES, EBOOKS, EbookItem } from '../../data/ebooksData';
import { EbookCard } from './EbookCard';
import { EbookPreviewModal } from './EbookPreviewModal';

export function EbookLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewEbook, setPreviewEbook] = useState<EbookItem | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredEbooks = EBOOKS.filter((ebook) => {
    if (selectedCategory !== 'All' && ebook.category !== selectedCategory) return false;
    if (!normalizedQuery) return true;
    const haystack = `${ebook.title} ${ebook.description} ${ebook.category} ${ebook.language}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-en text-xs font-semibold tracking-wider uppercase text-[var(--color-primary)]">
            Digital Reading Room
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--color-heading)]">
            eBook Library
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-[var(--color-body)] max-w-2xl leading-relaxed">
            Professional AI learning guides and conceptual handbooks designed for students, educators, and working professionals.
          </p>
        </div>

        {/* Search & Category Filter for eBooks */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            aria-label="Filter eBooks by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="min-h-[42px] rounded-[8px] border border-[var(--color-border)] bg-white px-3.5 py-2 font-en text-xs font-semibold text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
          >
            {EBOOK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-60">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="eBook খুঁজুন..."
              aria-label="eBook খুঁজুন"
              className="min-h-[42px] w-full rounded-[8px] border border-[var(--color-border)] bg-white py-2 pl-10 pr-4 text-xs text-[var(--color-heading)] focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredEbooks.length === 0 ? (
        <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" aria-hidden="true" />
          <h3 className="mt-3 text-base font-bold text-[var(--color-heading)]">কোনো eBook পাওয়া যায়নি</h3>
          <p className="mt-1 text-xs text-[var(--color-body)]">আপনার সার্চ বা ক্যাটাগরি ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white cursor-pointer"
          >
            সব ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEbooks.map((ebook) => (
            <EbookCard
              key={ebook.id}
              ebook={ebook}
              onPreview={(item) => setPreviewEbook(item)}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <EbookPreviewModal
        ebook={previewEbook}
        onClose={() => setPreviewEbook(null)}
      />
    </div>
  );
}
