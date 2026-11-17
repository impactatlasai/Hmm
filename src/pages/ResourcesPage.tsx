import { useState } from 'react';
import { BookOpen, Sparkles, FileText, Bookmark, ExternalLink, ArrowRight, Info, Search } from 'lucide-react';
import { Layout } from '../components/Layout';
import { PageBanner } from '../components/PageBanner';
import { EbookLibrary } from '../components/resources/EbookLibrary';
import { PromptLibrary } from '../components/resources/PromptLibrary';
import { useAuth } from '../context/AuthContext';
import { RESOURCES, ResourceType } from '../data/resourcesData';
import { CategorySlug, COURSE_CATEGORIES } from '../data/coursesData';

type MainTab = 'ebooks' | 'prompts' | 'guides';
type TypeFilter = 'All' | ResourceType;
type CategoryFilter = 'all' | CategorySlug | 'general';

export function ResourcesPage() {
  const [mainTab, setMainTab] = useState<MainTab>('ebooks');

  // For legacy guides tab
  const { savedResources, toggleResourceBookmark } = useAuth();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredResources = RESOURCES.filter((item) => {
    if (typeFilter !== 'All' && item.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (!normalizedQuery) return true;
    const haystack = `${item.title} ${item.description} ${item.type}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  const isExternalUrl = (url: string) => /^https?:\/\//i.test(url);

  return (
    <Layout>
      <PageBanner
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources & Prompt Library' }]}
        title="AI Learning Resource & Prompt Library"
        subtitle="Atlas AI Education-এর বিশেষ ই-বুক লাইব্রেরি, ইন্ডাস্ট্রি-ওয়াইজ প্রম্পট টেমপ্লেট এবং শিক্ষামূলক গাইড।"
      />

      {/* Main Tab Navigation */}
      <section className="border-b border-[var(--color-border)] bg-white sticky top-0 z-30 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            role="tablist"
            aria-label="Resources sections"
            className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-4 scrollbar-thin"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mainTab === 'ebooks'}
              onClick={() => setMainTab('ebooks')}
              className={`inline-flex min-h-[46px] items-center gap-2.5 rounded-[10px] px-5 py-2.5 font-en text-sm font-bold transition-all cursor-pointer ${
                mainTab === 'ebooks'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-[var(--color-soft-bg)] text-[var(--color-heading)] hover:bg-blue-50 hover:text-[var(--color-primary)]'
              }`}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>eBook Library (10)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mainTab === 'prompts'}
              onClick={() => setMainTab('prompts')}
              className={`inline-flex min-h-[46px] items-center gap-2.5 rounded-[10px] px-5 py-2.5 font-en text-sm font-bold transition-all cursor-pointer ${
                mainTab === 'prompts'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-[var(--color-soft-bg)] text-[var(--color-heading)] hover:bg-blue-50 hover:text-[var(--color-primary)]'
              }`}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Industry AI Prompt Library (15+ Sectors)</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mainTab === 'guides'}
              onClick={() => setMainTab('guides')}
              className={`inline-flex min-h-[46px] items-center gap-2.5 rounded-[10px] px-5 py-2.5 font-en text-sm font-bold transition-all cursor-pointer ${
                mainTab === 'guides'
                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                  : 'bg-[var(--color-soft-bg)] text-[var(--color-heading)] hover:bg-blue-50 hover:text-[var(--color-primary)]'
              }`}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>Curated Guides & References</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-[var(--color-soft-bg)] min-h-[600px] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {mainTab === 'ebooks' && <EbookLibrary />}
          {mainTab === 'prompts' && <PromptLibrary />}
          {mainTab === 'guides' && (
            <div className="space-y-6">
              {/* Filter bar for guides */}
              <div className="flex flex-col gap-4 rounded-[12px] border border-[var(--color-border)] bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                  {(['All', 'Guide', 'PDF', 'Link'] as TypeFilter[]).map((type) => {
                    const selected = typeFilter === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTypeFilter(type)}
                        className={`min-h-[40px] shrink-0 rounded-full px-4 py-1.5 font-en text-xs font-semibold cursor-pointer transition-colors ${
                          selected
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'border border-[var(--color-border)] bg-slate-50 text-[var(--color-heading)] hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <select
                    aria-label="Category filter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                    className="min-h-[40px] rounded-[8px] border border-[var(--color-border)] bg-slate-50 px-3 py-1.5 font-en text-xs text-[var(--color-heading)] focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {COURSE_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.title}
                      </option>
                    ))}
                    <option value="general">General</option>
                  </select>

                  <div className="relative w-full sm:w-60">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Guide খুঁজুন..."
                      aria-label="Guide খুঁজুন"
                      className="min-h-[40px] w-full rounded-[8px] border border-[var(--color-border)] bg-slate-50 py-1.5 pl-10 pr-4 text-xs text-[var(--color-heading)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {filteredResources.length === 0 ? (
                <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-10 text-center">
                  <p className="text-sm font-semibold text-[var(--color-heading)]">কোনো গাইড বা রেফারেন্স পাওয়া যায়নি।</p>
                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter('All');
                      setCategoryFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-4 inline-flex min-h-[40px] items-center rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.map((item) => {
                    const isSaved = savedResources.includes(item.id);
                    const external = isExternalUrl(item.url);

                    return (
                      <article
                        key={item.id}
                        className="flex flex-col justify-between rounded-[12px] border border-[var(--color-border)] bg-white p-6 shadow-xs"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-tint)] px-3 py-1 font-en text-xs font-semibold text-[var(--color-primary)]">
                              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>{item.type}</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => toggleResourceBookmark(item.id)}
                              aria-label={isSaved ? 'Remove bookmark' : 'Bookmark resource'}
                              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                                isSaved
                                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                  : 'border-[var(--color-border)] bg-white text-[var(--color-navy)] hover:bg-[var(--color-tint)]'
                              }`}
                            >
                              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
                            </button>
                          </div>

                          <h3 className="mt-3 font-en text-lg font-bold text-[var(--color-heading)] leading-snug">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm text-[var(--color-body)] line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="mt-5 border-t border-[var(--color-border)] pt-4">
                          <a
                            href={item.url}
                            target={external || item.type === 'PDF' ? '_blank' : undefined}
                            rel={external || item.type === 'PDF' ? 'noopener noreferrer' : undefined}
                            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-[8px] bg-[var(--color-primary)] px-4 py-2 font-en text-xs font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                          >
                            <span>Open Resource</span>
                            {external ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
