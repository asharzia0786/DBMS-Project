import { useEffect } from 'react';
import { getCanonicalUrl, type SeoMetadata } from '../lib/seo';

type SeoHeadProps = {
  metadata: SeoMetadata;
};

function upsertMetaByName(name: string, content: string) {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string) {
  let element = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export default function SeoHead({ metadata }: SeoHeadProps) {
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(metadata.path);
    const robots = metadata.robots || 'index,follow';
    const imageUrl = metadata.imageUrl || `${window.location.origin}/vite.svg`;
    const type = metadata.type || 'website';

    document.title = metadata.title;
    upsertMetaByName('description', metadata.description);
    upsertMetaByName('robots', robots);
    if (metadata.keywords) {
      upsertMetaByName('keywords', metadata.keywords);
    }

    upsertMetaByProperty('og:title', metadata.title);
    upsertMetaByProperty('og:description', metadata.description);
    upsertMetaByProperty('og:type', type);
    upsertMetaByProperty('og:url', canonicalUrl);
    upsertMetaByProperty('og:image', imageUrl);

    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', metadata.title);
    upsertMetaByName('twitter:description', metadata.description);
    upsertMetaByName('twitter:image', imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    const existingJsonLd = document.head.querySelectorAll('script[data-seo-jsonld="true"]');
    for (const script of existingJsonLd) {
      script.remove();
    }

    if (metadata.jsonLd && metadata.jsonLd.length > 0) {
      for (const schemaItem of metadata.jsonLd) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-jsonld', 'true');
        script.text = JSON.stringify(schemaItem);
        document.head.appendChild(script);
      }
    }
  }, [metadata]);

  return null;
}
