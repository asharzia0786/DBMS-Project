import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const siteUrl = (process.env.VITE_APP_URL || 'http://localhost:5173').replace(/\/+$/, '');

const routes = [
  ['/', 'weekly', '1.0'],
  ['/collection', 'daily', '0.9'],
  ['/custom-order', 'weekly', '0.8'],
  ['/about', 'monthly', '0.7'],
  ['/gallery', 'weekly', '0.8'],
  ['/services', 'monthly', '0.7'],
  ['/faqs', 'monthly', '0.6'],
  ['/contact', 'monthly', '0.7'],
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ([path, changefreq, priority]) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve('public', 'sitemap.xml'), xml, 'utf8');
