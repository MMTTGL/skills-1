// Shared design system for the "Sentetik veri" Instagram series.
// Lifted from post 1: navy ground, dotted human figures, Source Serif 4
// headlines and letter-spaced JetBrains Mono labels on a 1080x1350 frame.

export const BG = '#0e3151';
export const TEAL = '#31c7c8';
export const TEAL_DOT = '#0fd0c4';
export const TEAL_DIM = '#3fa3ae';
export const GREY_DOT = '#b2c4d2';
export const GREY_BACK = '#8ba0b4';
export const CAP_GREY = '#8fa9c4';
export const HDR = '#8fa3bf';
export const WHITE = '#f2f6fa';
export const BODY = '#a7bccf';
export const GUIDE = '#4a6f8d';

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- geometry helpers ----------
function distSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
export function inCapsule(x, y, ax, ay, bx, by, r) { return distSeg(x, y, ax, ay, bx, by) < r; }
export function inCircle(x, y, cx, cy, r) { return Math.hypot(x - cx, y - cy) < r; }
export function inPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// ---------- dotted human figure ----------
// local coords: origin at top-centre of the head, y grows down, height 430
export const FIGURE_H = 430;
export function insideFigure(x, y) {
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

// dot-fill any shape test over a bounding box
export function dotFill(rand, test, box, step, scale) {
  const pts = [];
  for (let gy = box[1]; gy < box[3]; gy += step) {
    for (let gx = box[0]; gx <= box[2]; gx += step) {
      const x = gx + (rand() - 0.5) * step * 0.5;
      const y = gy + (rand() - 0.5) * step * 0.5;
      if (test(x, y)) pts.push([x * scale, y * scale]);
    }
  }
  return pts;
}

export function figureDots(rand, scale, step = 10.5) {
  return dotFill(rand, insideFigure, [-150, -6, 150, FIGURE_H + 6], step, scale);
}

export function dots(pts, cx, topY, scale, color, r, rand, minOp = 0.55) {
  let out = '';
  for (const [lx, ly] of pts) {
    out += `<circle cx="${(cx + lx * scale).toFixed(1)}" cy="${(topY + ly * scale).toFixed(1)}" r="${(r * scale).toFixed(1)}" fill="${color}" opacity="${(minOp + rand() * (1 - minOp)).toFixed(2)}"/>`;
  }
  return out;
}

// group of three overlapping grey figures; cx/topY position the front one
export function greyGroup(seed, cx, topY, scale) {
  const rand = mulberry32(seed);
  const layout = [
    { dx: -118, dy: -20, s: 0.92, back: true },
    { dx: 118, dy: -20, s: 0.92, back: true },
    { dx: 0, dy: 26, s: 1.0, back: false },
  ];
  const front = layout[2];
  let out = '';
  for (const f of layout) {
    for (const [lx, ly] of figureDots(mulberry32(seed + (f.back ? (f.dx < 0 ? 11 : 22) : 33)), f.s)) {
      if (f.back && insideFigure((f.dx + lx - front.dx) / front.s, (f.dy + ly - front.dy) / front.s)) continue;
      const X = cx + (f.dx + lx) * scale, Y = topY + (f.dy + ly) * scale;
      const o = f.back ? 0.32 + rand() * 0.22 : 0.55 + rand() * 0.45;
      out += `<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="${(4.1 * scale * f.s).toFixed(1)}" fill="${f.back ? GREY_BACK : GREY_DOT}" opacity="${o.toFixed(2)}"/>`;
    }
  }
  return out;
}

export function tealFigure(seed, cx, topY, scale) {
  const rand = mulberry32(seed);
  return dots(figureDots(mulberry32(seed + 7), 1), cx, topY, scale, TEAL_DOT, 4.1, rand);
}

// thin curved connectors between two vertical spans
export function flowLines(seed, x1, y0, y1v, x2, y2a, y2b, n, color, op) {
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

export function chrome(eyebrow = 'SENTETİK VERİ') {
  return `
  <div class="mono" style="position: absolute; left: 80px; top: 70px; font-size: 21px; font-weight: 500; letter-spacing: 0.42em; color: ${HDR};">${eyebrow}</div>
  <div style="position: absolute; left: 80px; right: 80px; top: 106px; height: 1px; background: rgba(197, 216, 233, 0.22);"></div>
  <div style="position: absolute; left: 80px; right: 80px; top: 1265px; height: 1px; background: rgba(197, 216, 233, 0.3);"></div>`;
}

// `width` lets a long kicker wrap inside the left column instead of running
// into the headline
export function kicker(text, top, width) {
  const w = width ? ` width: ${width}px; line-height: 1.6;` : '';
  return `<div class="mono" style="position: absolute; left: 80px; top: ${top}px;${w} font-size: 19px; font-weight: 700; letter-spacing: 0.3em; color: ${TEAL};">${text}</div>`;
}

// captions are centred on the figure they label; the +0.16em nudge cancels the
// trailing letter-spacing so the ink, not the box, sits on the centre line.
function caption(text, cx, color) {
  return `<div class="mono" style="position: absolute; left: ${cx}px; top: 1040px; transform: translateX(calc(-50% + 0.16em)); font-size: 22px; letter-spacing: 0.32em; white-space: nowrap; color: ${color};">${text}</div>`;
}
const captionRule = `<div style="position: absolute; left: 110px; right: 110px; top: 1012px; height: 1px; background: rgba(197, 216, 233, 0.22);"></div>`;

export function captionRow(left, right, leftCx, rightCx) {
  return `${captionRule}${caption(left, leftCx, CAP_GREY)}${caption(right, rightCx, TEAL_DIM)}`;
}

export function captionOne(text, cx, color = CAP_GREY) {
  return `${captionRule}${caption(text, cx, color)}`;
}

export function page(title, inner) {
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
