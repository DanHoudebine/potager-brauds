const fs = require('fs');
const path = require('path');

const WEB_FILES = [
  'index.html',
  'app.js',
  'style.css',
  'sw.js',
  'manifest.json',
  'firebase-config.js',
  'icon-192.png',
  'icon-512.png'
];

const WWW = path.join(__dirname, 'www');
if (!fs.existsSync(WWW)) fs.mkdirSync(WWW);

// Copy icons folder if it exists
const iconsDir = path.join(__dirname, 'icons');
if (fs.existsSync(iconsDir)) {
  const iconsDest = path.join(WWW, 'icons');
  if (!fs.existsSync(iconsDest)) fs.mkdirSync(iconsDest);
  fs.readdirSync(iconsDir).forEach(f => {
    fs.copyFileSync(path.join(iconsDir, f), path.join(iconsDest, f));
  });
}

WEB_FILES.forEach(f => {
  const src = path.join(__dirname, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(WWW, f));
    console.log(`  ✓ ${f}`);
  }
});

console.log('Build → www/ done');
