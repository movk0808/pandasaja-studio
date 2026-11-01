// 실제 사이트 빌드: index.html(아티팩트용 본문 조각)에 문서 머리말을 씌워 _site/ 로 출력한다.
// GitHub Actions(.github/workflows/deploy.yml)가 push 때마다 실행한다. 로컬: node build.js
const { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync, statSync, unlinkSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const SITE_URL = (process.env.SITE_URL || 'https://movk0808.github.io/pandasaja-studio/').replace(/\/?$/, '/');
const OUT = '_site';

// fs.cpSync/rmSync는 Windows의 한글 경로에서 Node 24가 멈추는 문제가 있어 직접 구현한다
function copy(src, dst) {
  if (statSync(src).isDirectory()) {
    mkdirSync(dst, { recursive: true });
    for (const f of readdirSync(src)) copy(join(src, f), join(dst, f));
  } else copyFileSync(src, dst);
}
function remove(p) {
  if (!existsSync(p)) return;
  if (statSync(p).isDirectory()) { for (const f of readdirSync(p)) remove(join(p, f)); rmdirSync(p); }
  else unlinkSync(p);
}

remove(OUT);
mkdirSync(OUT);

// 본문 조각을 머리 부분(<header> 앞: title·meta·link·style)과 본문으로 나눈다
const frag = readFileSync('index.html', 'utf8');
const cut = frag.indexOf('<header');
const head = frag.slice(0, cut).replace(/<meta name="claude:[^>]*>\s*/g, '');
const body = frag.slice(cut);

const title = 'Panda & Saja — Brand websites and product pages';
const desc = 'Brand websites and product pages for small brands, written natively in English, Korean and Japanese.';
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0C0D0D">
<link rel="canonical" href="${SITE_URL}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Panda &amp; Saja Studio">
<meta property="og:title" content="${title.replace('&', '&amp;')}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE_URL}">
<meta property="og:image" content="${SITE_URL}assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}</style>
${head.trim()}
</head>
<body>
${body.trim()}
</body>
</html>
`;
writeFileSync(`${OUT}/index.html`, page);

for (const p of ['i18n.js', 'admin.html', 'favicon.svg', 'assets', 'data']) {
  if (existsSync(p)) copy(p, join(OUT, p));
}

writeFileSync(`${OUT}/404.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · Panda &amp; Saja</title><link rel="icon" href="${SITE_URL}favicon.svg"><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0C0D0D;color:#F0F1EC;font:16px/1.6 system-ui,sans-serif;text-align:center;padding:24px}a{color:#F4A52A}</style></head><body><div><p style="font-size:48px;margin:0">404</p><p>This page doesn't exist. · 페이지를 찾을 수 없어요. · ページが見つかりません。</p><p><a href="${SITE_URL}">Panda &amp; Saja →</a></p></div></body></html>\n`);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nDisallow: /admin.html\nSitemap: ${SITE_URL}sitemap.xml\n`);
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url></urlset>\n`);
writeFileSync(`${OUT}/.nojekyll`, '');
if (process.env.CUSTOM_DOMAIN) writeFileSync(`${OUT}/CNAME`, process.env.CUSTOM_DOMAIN + '\n');

console.log(`built ${OUT}/ for ${SITE_URL}`);
