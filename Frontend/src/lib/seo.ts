export type SeoMetadata = {
  title: string;
  description: string;
  path: string;
  robots?: string;
  type?: 'website' | 'product';
  keywords?: string;
  imageUrl?: string;
  jsonLd?: Array<Record<string, unknown>>;
};

const BRAND_NAME = 'Habib and Sons';
const DEFAULT_DESCRIPTION =
  'Premium CNC handcrafted furniture from Pakistan. Luxury beds, sofas, décor, and bespoke custom pieces built for timeless interiors.';
const DEFAULT_KEYWORDS =
  'luxury furniture pakistan, handcrafted furniture faisalabad, cnc furniture, custom furniture pakistan, habib and sons';
const DEFAULT_IMAGE_URL =
  'https://images.pexels.com/photos/5825527/pexels-photo-5825527.jpeg?auto=compress&cs=tinysrgb&w=1400';

function getSiteUrl(): string {
  const configured = import.meta.env.VITE_APP_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return 'http://localhost:5173';
}

function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/';
  }
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean.replace(/\/+$/, '') || '/';
}

function prettifySlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function getCanonicalUrl(path: string): string {
  return `${getSiteUrl()}${normalizePath(path)}`;
}

export function buildProductSeo({
  slug,
  name,
  description,
  imageUrl,
  category,
}: {
  slug: string;
  name?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
}): SeoMetadata {
  const productName = name || prettifySlug(slug) || 'Product';
  const productCategory = category ? `${category} · ` : '';
  const productDescription =
    description?.trim() ||
    `${productCategory}Handcrafted luxury furniture by ${BRAND_NAME}. Designed with precision CNC work and premium finishes.`;

  return {
    title: `${productName} | ${BRAND_NAME}`,
    description: productDescription,
    path: `/products/${slug}`,
    type: 'product',
    keywords: `${productName.toLowerCase()}, ${DEFAULT_KEYWORDS}`,
    imageUrl: imageUrl || DEFAULT_IMAGE_URL,
  };
}

export function getSeoForPath(path: string): SeoMetadata {
  const normalizedPath = normalizePath(path);

  if (normalizedPath === '/login' || normalizedPath.startsWith('/login/')) {
    return {
      title: `Login | ${BRAND_NAME}`,
      description: 'Secure customer account login.',
      path: '/login',
      robots: 'noindex,nofollow',
    };
  }

  if (normalizedPath === '/signup' || normalizedPath.startsWith('/signup/')) {
    return {
      title: `Create Account | ${BRAND_NAME}`,
        description: 'Create your Habib and Sons customer account.',
      path: '/signup',
      robots: 'noindex,nofollow',
    };
  }

  if (normalizedPath.startsWith('/products/')) {
    const slug = normalizedPath.slice('/products/'.length).split('/')[0];
    if (slug) {
      return buildProductSeo({ slug });
    }
  }

  const pageMap: Record<string, SeoMetadata> = {
    '/': {
      title: `${BRAND_NAME} — Handcrafted Luxury Furniture`,
      description: DEFAULT_DESCRIPTION,
      path: '/',
      keywords: DEFAULT_KEYWORDS,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: BRAND_NAME,
          url: getSiteUrl(),
          email: 'business.habibandsons@gmail.com',
          telephone: '+92 306 6162376',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Dijkot main bus stop near Bank of Punjab',
            addressLocality: 'Faisalabad Sadar Tehsil, Faisalabad',
            addressCountry: 'PK',
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: BRAND_NAME,
          url: getSiteUrl(),
          potentialAction: {
            '@type': 'SearchAction',
            target: `${getSiteUrl()}/collection`,
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    },
    '/collection': {
      title: `Furniture Collection | ${BRAND_NAME}`,
      description:
        'Browse the complete Habib and Sons catalog of handcrafted luxury furniture, premium materials, and custom finishes.',
      path: '/collection',
      keywords: `furniture collection pakistan, luxury bed sets, custom finishes, ${DEFAULT_KEYWORDS}`,
    },
    '/custom-order': {
      title: `Custom Furniture Orders | ${BRAND_NAME}`,
      description:
        'Request bespoke CNC furniture tailored to your space. Share your idea and get a handcrafted custom quote from Habib and Sons.',
      path: '/custom-order',
      keywords: `custom furniture order pakistan, bespoke cnc furniture, ${DEFAULT_KEYWORDS}`,
    },
    '/about': {
      title: `About Our Craftsmanship | ${BRAND_NAME}`,
      description:
        'Learn about three generations of Habib and Sons master craftsmen creating heirloom furniture in Faisalabad since 1985.',
      path: '/about',
    },
    '/gallery': {
      title: `Furniture Gallery | ${BRAND_NAME}`,
      description:
        'View premium furniture installations, handcrafted details, and interior-ready luxury pieces from Habib and Sons.',
      path: '/gallery',
    },
    '/services': {
      title: `Luxury Furniture Services | ${BRAND_NAME}`,
      description:
        'Discover Habib and Sons services including furniture design, CNC detailing, custom builds, and finishing solutions.',
      path: '/services',
    },
    '/faqs': {
      title: `FAQs | ${BRAND_NAME}`,
      description:
        'Find answers about custom orders, materials, production timelines, delivery, and furniture care at Habib and Sons.',
      path: '/faqs',
    },
    '/contact': {
      title: `Contact | ${BRAND_NAME}`,
      description:
        'Contact Habib and Sons for consultations, showroom visits, and custom furniture inquiries across Pakistan.',
      path: '/contact',
    },
    '/privacy': {
      title: `Privacy Policy | ${BRAND_NAME}`,
      description: 'Read the Habib and Sons privacy policy for details on data collection, usage, and your rights.',
      path: '/privacy',
      robots: 'noindex,follow',
    },
    '/terms': {
      title: `Terms of Service | ${BRAND_NAME}`,
      description: 'Read the Habib and Sons terms of service for purchases, custom orders, and website usage.',
      path: '/terms',
      robots: 'noindex,follow',
    },
    '/cart': {
      title: `Shopping Cart | ${BRAND_NAME}`,
      description: 'Review selected products and continue checkout.',
      path: '/cart',
      robots: 'noindex,nofollow',
    },
    '/checkout': {
      title: `Checkout | ${BRAND_NAME}`,
      description: 'Complete your order securely.',
      path: '/checkout',
      robots: 'noindex,nofollow',
    },
    '/orders': {
      title: `Order History | ${BRAND_NAME}`,
      description: 'View your account order history.',
      path: '/orders',
      robots: 'noindex,nofollow',
    },
    '/profile': {
      title: `Profile | ${BRAND_NAME}`,
      description: 'Manage your customer profile.',
      path: '/profile',
      robots: 'noindex,nofollow',
    },
    '/verify-email': {
      title: `Verify Email | ${BRAND_NAME}`,
      description: 'Verify your account email address.',
      path: '/verify-email',
      robots: 'noindex,nofollow',
    },
  };

  if (normalizedPath.startsWith('/admin')) {
    return {
      title: `Admin Panel | ${BRAND_NAME}`,
      description: 'Administrative dashboard.',
      path: normalizedPath,
      robots: 'noindex,nofollow',
    };
  }

  return pageMap[normalizedPath] || {
    title: `${BRAND_NAME} — Handcrafted Luxury Furniture`,
    description: DEFAULT_DESCRIPTION,
    path: normalizedPath,
    keywords: DEFAULT_KEYWORDS,
  };
}
