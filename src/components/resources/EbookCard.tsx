import { useState } from 'react';
import { BookOpen, Eye, Lock } from 'lucide-react';
import { EbookItem } from '../../data/ebooksData';

interface EbookCardProps {
  ebook: EbookItem;
  onPreview: (ebook: EbookItem) => void;
}

export function EbookCard({ ebook, onPreview }: EbookCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="relative flex flex-col justify-between rounded-[12px] border border-[var(--color-border)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div>
        {/* Cover Thumbnail / Mockup Container */}
        <div className="relative mb-5 aspect-[3/4] w-full overflow-hidden rounded-[8px] bg-slate-100 border border-slate-200">
          {ebook.imageUrl && !imageError ? (
            <img
              src={ebook.imageUrl}
              alt={ebook.title}
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0B1F4B] to-[#0056D2] p-6 text-center text-white">
              <BookOpen className="h-12 w-12 opacity-80" aria-hidden="true" />
              <span className="mt-3 font-en text-xs font-bold uppercase tracking-wider opacity-90">
                {ebook.category}
              </span>
              <h4 className="mt-2 text-sm font-bold leading-tight">{ebook.title}</h4>
            </div>
          )}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-black/70 px-2.5 py-1 font-en text-xs font-semibold text-white backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            <span>Locked</span>
          </div>
        </div>

        {/* Category & Metadata */}
        <div className="flex flex-wrap items-center gap-1.5 font-en text-xs text-[var(--color-body)]">
          <span className="font-semibold text-[var(--color-primary)]">{ebook.category}</span>
          <span aria-hidden="true">·</span>
          <span>{ebook.language}</span>
          <span aria-hidden="true">·</span>
          <span>Level: {ebook.readingLevel}</span>
        </div>

        <h3 className="mt-2 text-lg font-bold text-[var(--color-heading)] leading-snug">
          {ebook.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[var(--color-body)] line-clamp-3">
          {ebook.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="inline-flex items-center gap-1 font-en text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded">
          <Lock className="h-3 w-3" aria-hidden="true" />
          <span>Member Access</span>
        </span>
        <button
          type="button"
          onClick={() => onPreview(ebook)}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)] cursor-pointer"
        >
          <Lock className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
          <span>Unlock Preview</span>
        </button>
      </div>
    </article>
  );
}
