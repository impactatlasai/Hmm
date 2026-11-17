import { useEffect } from 'react';
import { resolveRouteSeo } from '../shared/seoMeta';

interface SeoHeadProps {
  pathname: string;
  customTitle?: string;
  customDescription?: string;
  customJsonLd?: Record<string, unknown>;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function SeoHead({ pathname, customTitle, customDescription, customJsonLd }: SeoHeadProps) {
  useEffect(() => {
    const { entry } = resolveRouteSeo(pathname);
    const origin = window.location.origin;
    const title = entry.authoritativeHead ? entry.title : customTitle || entry.title;
    const description = entry.authoritativeHead
      ? entry.description
      : customDescription || entry.description;
    const ogTitle = entry.ogTitle || title;
    const ogDescription = entry.ogDescription || description;
    const targetPath = entry.canonicalPath || entry.path;
    const canonicalUrl = `${origin}${targetPath === '/' ? '/' : targetPath}`;
    const ogImagePath = entry.ogImage || '/src/assets/images/hero_atlas_institute_1794867545953.jpg';
    const ogImageUrl = ogImagePath.startsWith('http') ? ogImagePath : `${origin}${ogImagePath}`;
    const ogImageAlt = entry.ogImageAlt || 'Atlas AI Education – Atlas AI Institute';

    document.title = title;
    upsertMeta('name', 'description', description);
    if (entry.keywords && entry.keywords.length > 0) {
      upsertMeta('name', 'keywords', entry.keywords.join(', '));
    }
    upsertMeta(
      'name',
      'robots',
      entry.noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );

    upsertMeta('property', 'og:type', entry.ogType || 'website');
    upsertMeta('property', 'og:site_name', 'Atlas AI Education');
    upsertMeta('property', 'og:locale', 'bn_BD');
    upsertMeta('property', 'og:locale:alternate', 'en_US');
    upsertMeta('property', 'og:title', ogTitle);
    upsertMeta('property', 'og:description', ogDescription);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', ogImageUrl);
    upsertMeta('property', 'og:image:alt', ogImageAlt);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', ogTitle);
    upsertMeta('name', 'twitter:description', ogDescription);
    upsertMeta('name', 'twitter:image', ogImageUrl);
    upsertMeta('name', 'twitter:image:alt', ogImageAlt);

    let canonicalEl = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    const ldData =
      customJsonLd || (entry.jsonLdBuilder ? entry.jsonLdBuilder(origin) : entry.jsonLd);
    const existingLd = document.head.querySelector('script[data-atlas-jsonld="true"]');
    if (ldData) {
      const script = existingLd || document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-atlas-jsonld', 'true');
      script.textContent = JSON.stringify(ldData);
      if (!existingLd) {
        document.head.appendChild(script);
      }
    } else if (existingLd) {
      existingLd.remove();
    }
  }, [pathname, customTitle, customDescription, customJsonLd]);

  return null;
}
