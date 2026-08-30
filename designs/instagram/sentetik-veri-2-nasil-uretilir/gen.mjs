// Generates the 4 artboards for the "Sentetik veri nasıl üretilir?" carousel.
// Design system lifted from post 1: bg #0e3151, teal #31c7c8 / dots #0dd7cb,
// grey dots #b2c4d2, Source Serif 4 + JetBrains Mono.
import { writeFileSync } from 'node:fs';

const BG = '#0e3151';
const TEAL = '#31c7c8';
const TEAL_DOT = '#0fd0c4';
const TEAL_DIM = '#3fa3ae';
const GREY_DOT = '#b2c4d2';
const GREY_BACK = '#8ba0b4';
const CAP_GREY = '#8fa9c4';
const HDR = '#8fa3bf';
const WHITE = '#f2f6fa';
const BODY = '#a7bccf';

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- silhouette ----------
const H = 430;
function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  const x = ax + t * dx, y = ay + t * dy;
  return Math.hypot(px - x, py - y);
}
function inCapsule(x, y, ax, ay, bx, by, r) { return distSeg(x, y, ax, ay, bx, by) < r; }
function inCircle(x, y, cx, cy, r) { return Math.hypot(x - cx, y - cy) < r; }
function inPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
// local coords: origin at top-center of head box, y grows down, figure height H
function insideFigure(x, y) {
  if (inCircle(x, y, 0, 38, 32)) return true;
  if (x > -16 && x < 16 && y > 60 && y < 102) return true;
  if (inPoly(x, y, [[-80, 118], [80, 118], [52, 258], [-52, 258]])) return true;
  if (inCircle(x, y, -56, 128, 26) || inCircle(x, y, 56, 128, 26)) return true;
  if (inCapsule(x, y, -76, 134, -98, 238, 14) || inCapsule(x, y, 76, 134, 98, 238, 14)) return true;
  if (inCapsule(x, y, -98, 238, -92, 316, 12) || inCapsule(x, y, 98, 238, 92, 316, 12)) return true;
  if (x > -54 && x < 54 && y > 252 && y < 292) return true;
  if (inCapsule(x, y, -30, 292, -38, 420, 20) || inCapsule(x, y, 30, 292, 38, 420, 20)) return true;
  return false;
}

function figureDots(rand, scale, step = 10.5) {
  const pts = [];
  for (let gy = -6; gy < H + 6; gy += step) {
    for (let gx = -150; gx <= 150; gx += step) {
      const x = gx + (rand() - 0.5) * 5;
      const y = gy + (rand() - 0.5) * 5;
      if (insideFigure(x / 1, y / 1)) pts.push([x * scale, y * scale]);
    }
  }
  return pts;
}

// grey group of three overlapping figures; cx/topY = position of front figure top-center
function greyGroup(seed, cx, topY, scale) {
  const rand = mulberry32(seed);
  const layout = [
    { dx: -118, dy: -20, s: 0.92, back: true },
    { dx: 118, dy: -20, s: 0.92, back: true },
    { dx: 0, dy: 26, s: 1.0, back: false },
  ];
  const front = layout[2];
  let out = '';
  for (const f of layout) {
    const pts = figureDots(mulberry32(seed + (f.back ? (f.dx < 0 ? 11 : 22) : 33)), f.s);
    for (const [lx, ly] of pts) {
      const X = cx + (f.dx + lx) * scale;
      const Y = topY + (f.dy + ly) * scale;
      if (f.back) {
        // hide back dots covered by the front figure
        const fx = (f.dx + lx - front.dx) / front.s;
        const fy = (f.dy + ly - front.dy) / front.s;
        if (insideFigure(fx, fy)) continue;
      }
      const o = f.back ? 0.32 + rand() * 0.22 : 0.55 + rand() * 0.45;
      const col = f.back ? GREY_BACK : GREY_DOT;
      out += `<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="${(4.1 * scale * f.s).toFixed(1)}" fill="${col}" opacity="${o.toFixed(2)}"/>`;
    }
  }
  return out;
}

// clean teal figure
function tealFigure(seed, cx, topY, scale) {
  const rand = mulberry32(seed);
  const pts = figureDots(mulberry32(seed + 7), 1);
  let out = '';
  for (const [lx, ly] of pts) {
    const X = cx + lx * scale, Y = topY + ly * scale;
    out += `<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="${(4.1 * scale).toFixed(1)}" fill="${TEAL_DOT}" opacity="${(0.55 + rand() * 0.45).toFixed(2)}"/>`;
  }
  return out;
}

// teal figure "under construction": scattered dots, spokes, dashed guides
function tealConstruct(seed, cx, topY, scale) {
  const rand = mulberry32(seed);
  const pts = figureDots(mulberry32(seed + 7), 1, 11.5);
  let lines = '', dots = '';
  for (const [lx, ly] of pts) {
    if (rand() < 0.3) continue;
    const ang = rand() * Math.PI * 2;
    const far = rand() < 0.08;
    const d = far ? 28 + rand() * 34 : 3 + rand() * 16;
    const X = cx + (lx + Math.cos(ang) * d) * scale;
    const Y = topY + (ly + Math.sin(ang) * d) * scale;
    const r = (2.7 + rand() * 2.4) * scale;
    dots += `<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="${r.toFixed(1)}" fill="${TEAL_DOT}" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`;
    if (rand() < 0.11) {
      const a2 = rand() * Math.PI * 2, d2 = 16 + rand() * 34;
      lines += `<line x1="${X.toFixed(1)}" y1="${Y.toFixed(1)}" x2="${(X + Math.cos(a2) * d2 * scale).toFixed(1)}" y2="${(Y + Math.sin(a2) * d2 * scale).toFixed(1)}" stroke="${TEAL_DIM}" stroke-width="1" opacity="0.25"/>`;
    }
  }
  const guides =
    `<g stroke="#3d647f" stroke-width="1.4" fill="none" stroke-dasharray="5 6" opacity="0.8" transform="translate(${cx} ${topY}) scale(${scale}) rotate(2)">` +
    `<circle cx="2" cy="38" r="40"/>` +
    `<rect x="-86" y="110" width="176" height="150" rx="4" transform="rotate(-2 0 185)"/>` +
    `<rect x="-60" y="252" width="120" height="42" rx="4"/>` +
    `<rect x="-54" y="292" width="42" height="130" rx="4" transform="rotate(2 -33 357)"/>` +
    `<rect x="12" y="292" width="42" height="130" rx="4" transform="rotate(-2 33 357)"/>` +
    `</g>`;
  return guides + lines + dots;
}

// thin curved connector lines
function flowLines(seed, x1, y0, y1v, x2, y2a, y2b, n, color, op) {
  const rand = mulberry32(seed);
  let out = '';
  for (let i = 0; i < n; i++) {
    const sy = y0 + ((y1v - y0) * i) / (n - 1) + (rand() - 0.5) * 14;
    const ey = y2a + ((y2b - y2a) * i) / (n - 1) + (rand() - 0.5) * 14;
    const mx = (x1 + x2) / 2;
    out += `<path d="M ${x1} ${sy} C ${mx} ${sy}, ${mx} ${ey}, ${x2} ${ey}" fill="none" stroke="${color}" stroke-width="1" opacity="${op}"/>`;
  }
  return out;
}

// ---------- page chrome ----------
const FONT_LINK = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&amp;family=JetBrains+Mono:wght@400;500;700&amp;display=swap">`;

const BASE_CSS = `
  body { margin: 0; background: ${BG}; }
  a { color: ${TEAL}; } a:hover { color: #5ad9d6; }
  .slide { position: relative; width: 1080px; height: 1350px; background: ${BG}; overflow: hidden; font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif; }
  .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }
`;

function chrome() {
  return `
  <div class="mono" style="position: absolute; left: 80px; top: 70px; font-size: 21px; font-weight: 500; letter-spacing: 0.42em; color: ${HDR};">SENTETİK VERİ</div>
  <div style="position: absolute; left: 80px; right: 80px; top: 106px; height: 1px; background: rgba(197, 216, 233, 0.22);"></div>
  <div style="position: absolute; left: 80px; right: 80px; top: 1265px; height: 1px; background: rgba(197, 216, 233, 0.3);"></div>`;
}

function kicker(text, top) {
  return `<div class="mono" style="position: absolute; left: 80px; top: ${top}px; font-size: 19px; font-weight: 700; letter-spacing: 0.3em; color: ${TEAL};">${text}</div>`;
}

function captionRow(left, right, leftX, rightX) {
  return `
  <div style="position: absolute; left: 110px; right: 120px; top: 1012px; height: 1px; background: rgba(197, 216, 233, 0.22);"></div>
  <div class="mono" style="position: absolute; left: ${leftX}px; top: 1040px; font-size: 22px; letter-spacing: 0.32em; white-space: nowrap; color: ${CAP_GREY};">${left}</div>
  <div class="mono" style="position: absolute; left: ${rightX}px; top: 1040px; font-size: 22px; letter-spacing: 0.32em; white-space: nowrap; color: ${TEAL_DIM};">${right}</div>`;
}

function page(title, inner) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  ${FONT_LINK}
  <style>${BASE_CSS}</style>
  <title>${title}</title>
</helmet>
<div class="slide">
${inner}
</div>
</x-dc>
</body>
</html>
`;
}

// ---------- slide 1: cover ----------
{
  const svg =
    `<svg width="1080" height="520" viewBox="0 0 1080 520" style="position: absolute; left: 0; top: 465px;" xmlns="http://www.w3.org/2000/svg">` +
    greyGroup(1, 305, 55, 1.0) +
    tealConstruct(2, 775, 55, 1.0) +
    `</svg>`;
  const inner = `${chrome()}
  ${kicker('SORU', 150)}
  <div style="position: absolute; left: 283px; top: 108px; width: 720px; font-size: 108px; font-weight: 700; line-height: 1.16; color: ${WHITE};">Sentetik veri nasıl üretilir<span style="color: ${TEAL};">?</span></div>
  ${svg}
  ${captionRow('gerçek veriler', 'sentetik veri', 225, 660)}`;
  writeFileSync('Main.dc.html', page('Slayt 1 — Kapak', inner));
}

// ---------- slide 2: üretim ----------
{
  const gs = 0.62, ts = 0.62;
  const svg =
    `<svg width="1080" height="360" viewBox="0 0 1080 360" style="position: absolute; left: 0; top: 620px;" xmlns="http://www.w3.org/2000/svg">` +
    flowLines(51, 320, 90, 300, 400, 100, 290, 6, '#4a6f8d', 0.4) +
    flowLines(52, 690, 100, 290, 762, 90, 300, 6, TEAL_DIM, 0.4) +
    greyGroup(3, 195, 55, gs) +
    // model box
    `<rect x="405" y="42" width="280" height="290" rx="34" fill="none" stroke="#4a6f8d" stroke-width="1.6" stroke-dasharray="6 8"/>` +
    `<text x="545" y="86" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="17" letter-spacing="5" fill="${HDR}">MODEL</text>` +
    (() => {
      const layers = [
        { x: 460, ys: [140, 200, 260], col: GREY_DOT },
        { x: 545, ys: [120, 173, 226, 280], col: '#6fc3c8' },
        { x: 630, ys: [140, 200, 260], col: TEAL_DOT },
      ];
      let edges = '', nodes = '';
      for (let li = 0; li < layers.length - 1; li++) {
        for (const y1 of layers[li].ys) for (const y2 of layers[li + 1].ys) {
          edges += `<line x1="${layers[li].x}" y1="${y1}" x2="${layers[li + 1].x}" y2="${y2}" stroke="${TEAL_DIM}" stroke-width="1" opacity="0.3"/>`;
        }
      }
      for (const l of layers) for (const y of l.ys) nodes += `<circle cx="${l.x}" cy="${y}" r="8" fill="${l.col}"/>`;
      return edges + nodes;
    })() +
    tealFigure(4, 880, 60, ts) +
    `</svg>`;
  const inner = `${chrome()}
  ${kicker('ÜRETİM', 165)}
  <div style="position: absolute; left: 283px; top: 150px; width: 700px; font-size: 43px; font-weight: 400; line-height: 1.58; color: ${WHITE};">Sentetik veriler; <span style="color: ${TEAL};">algoritmalar, simülasyonlar veya üretken modeller</span> kullanılarak, belirli bir kullanım amacı için yapay olarak üretilir.</div>
  <div style="position: absolute; left: 283px; top: 452px; width: 660px; font-size: 29px; font-weight: 400; line-height: 1.55; color: ${BODY};">Amaç, gerçek dünyadaki verilerin istatistiksel özelliklerini gerçeğe yeterince benzer biçimde yansıtan yeni veriler oluşturmaktır.</div>
  ${svg}
  ${captionRow('gerçek veriler', 'sentetik veri', 118, 762)}`;
  writeFileSync('Uretim.dc.html', page('Slayt 2 — Üretim', inner));
}

// ---------- slide 3: yöntemler ----------
{
  // bell curve of stacked grey dots
  const bell = (() => {
    const rand = mulberry32(9);
    let out = '';
    const cx = 300, baseY = 760;
    for (let col = -13; col <= 13; col++) {
      const x = cx + col * 13;
      const h = Math.exp(-(col * col) / (2 * 5.4 * 5.4)) * 250;
      for (let y = 0; y < h; y += 11.5) {
        out += `<circle cx="${(x + (rand() - 0.5) * 4).toFixed(1)}" cy="${(baseY - 8 - y + (rand() - 0.5) * 4).toFixed(1)}" r="4.3" fill="${GREY_DOT}" opacity="${(0.45 + rand() * 0.55).toFixed(2)}"/>`;
      }
    }
    // dashed teal envelope
    let d = '';
    for (let col = -13.5; col <= 13.5; col += 0.5) {
      const x = cx + col * 13;
      const y = baseY - 14 - Math.exp(-(col * col) / (2 * 5.4 * 5.4)) * 250;
      d += (d ? ' L ' : 'M ') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    out += `<path d="${d}" fill="none" stroke="${TEAL_DIM}" stroke-width="1.6" stroke-dasharray="5 6" opacity="0.9"/>`;
    out += `<line x1="120" y1="760" x2="480" y2="760" stroke="#4a6f8d" stroke-width="1.2" opacity="0.6"/>`;
    return out;
  })();
  // neural network
  const net = (() => {
    const layers = [
      { x: 640, n: 3, col: GREY_DOT },
      { x: 736, n: 5, col: '#6fc3c8' },
      { x: 832, n: 5, col: TEAL_DOT },
      { x: 928, n: 3, col: TEAL_DOT },
    ];
    const yFor = (n, i) => 605 + (i - (n - 1) / 2) * 64;
    let edges = '', nodes = '';
    for (let li = 0; li < layers.length - 1; li++) {
      const a = layers[li], b = layers[li + 1];
      for (let i = 0; i < a.n; i++) for (let j = 0; j < b.n; j++) {
        edges += `<line x1="${a.x}" y1="${yFor(a.n, i)}" x2="${b.x}" y2="${yFor(b.n, j)}" stroke="${TEAL_DIM}" stroke-width="1" opacity="0.28"/>`;
      }
    }
    for (const l of layers) for (let i = 0; i < l.n; i++) {
      nodes += `<circle cx="${l.x}" cy="${yFor(l.n, i)}" r="9" fill="${l.col}"/>`;
    }
    return edges + nodes;
  })();
  const svg = `<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position: absolute; left: 0; top: 0;" xmlns="http://www.w3.org/2000/svg">${bell}${net}</svg>`;
  const inner = `${chrome()}
  ${kicker('YÖNTEMLER', 165)}
  <div style="position: absolute; left: 283px; top: 150px; width: 700px; font-size: 46px; font-weight: 400; line-height: 1.5; color: ${WHITE};">Hangi <span style="color: ${TEAL};">yöntemler</span> kullanılır?</div>
  <div style="position: absolute; left: 283px; top: 250px; width: 680px; font-size: 29px; font-weight: 400; line-height: 1.55; color: ${BODY};">Sentetik veri üretiminde farklı yöntemlerden yararlanılabilir. En yaygın iki yaklaşım:</div>
  ${svg}
  <div style="position: absolute; left: 110px; width: 380px; top: 830px; font-size: 26px; line-height: 1.5; color: ${BODY};">Gerçek verilerdeki dağılımlar ve değişkenler arasındaki ilişkiler modellenerek yeni veri örnekleri oluşturulur.</div>
  <div style="position: absolute; left: 590px; width: 380px; top: 830px; font-size: 26px; line-height: 1.5; color: ${BODY};">Gerçek verilerdeki karmaşık örüntüleri öğrenen modeller aracılığıyla yeni veri örnekleri oluşturulur.</div>
  ${captionRow('istatistiksel yöntemler', 'derin öğrenme', 122, 660)}`;
  writeFileSync('Yontemler.dc.html', page('Slayt 3 — Yöntemler', inner));
}

// ---------- slide 4: örnek ----------
{
  const gs = 0.78, ts = 0.78;
  const cross = (cx, cy, col) =>
    `<circle cx="${cx}" cy="${cy}" r="46" fill="${BG}" stroke="${col}" stroke-width="1.6" stroke-dasharray="5 6" opacity="0.95"/>` +
    `<path d="M ${cx - 17} ${cy} H ${cx + 17} M ${cx} ${cy - 17} V ${cy + 17}" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`;
  const svg =
    `<svg width="1080" height="440" viewBox="0 0 1080 440" style="position: absolute; left: 0; top: 560px;" xmlns="http://www.w3.org/2000/svg">` +
    flowLines(61, 480, 110, 370, 690, 150, 330, 6, TEAL_DIM, 0.35) +
    greyGroup(5, 285, 50, gs) +
    tealFigure(6, 820, 50, ts) +
    cross(440, 92, CAP_GREY) +
    cross(950, 92, TEAL_DIM) +
    `</svg>`;
  const inner = `${chrome()}
  ${kicker('ÖRNEK', 165)}
  <div style="position: absolute; left: 283px; top: 150px; width: 700px; font-size: 40px; font-weight: 400; line-height: 1.55; color: ${WHITE};">Gerçek hastalara ait sağlık verilerinin özelliklerinden yararlanılarak, gerçekte var olmayan hastalara ait <span style="color: ${TEAL};">sentetik sağlık verileri</span> oluşturulabilir.</div>
  <div style="position: absolute; left: 283px; top: 435px; width: 660px; font-size: 29px; font-weight: 400; line-height: 1.55; color: ${BODY};">Bu veriler, gerçek hasta kayıtlarını birebir kullanmadan yapay zekâ sistemlerinin geliştirilmesi ve eğitilmesinde kullanılabilir.</div>
  ${svg}
  ${captionRow('gerçek hasta verileri', 'sentetik sağlık verisi', 140, 600)}`;
  writeFileSync('Ornek.dc.html', page('Slayt 4 — Örnek', inner));
}

// ---------- canvas.json ----------
writeFileSync(
  'canvas.json',
  JSON.stringify(
    {
      artboards: [
        { file: 'Main.dc.html', title: 'Slayt 1 — Kapak', x: 0, y: 0, w: 1080, h: 1350 },
        { file: 'Uretim.dc.html', title: 'Slayt 2 — Üretim', x: 1180, y: 0, w: 1080, h: 1350 },
        { file: 'Yontemler.dc.html', title: 'Slayt 3 — Yöntemler', x: 2360, y: 0, w: 1080, h: 1350 },
        { file: 'Ornek.dc.html', title: 'Slayt 4 — Örnek', x: 3540, y: 0, w: 1080, h: 1350 },
      ],
      launch: { view: 'canvas' },
    },
    null,
    2,
  ),
);
console.log('generated 4 artboards + canvas.json');
