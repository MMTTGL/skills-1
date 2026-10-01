// Generates the 4 artboards for the "Sentetik verinin faydaları nelerdir?" carousel.
import { writeFileSync } from 'node:fs';
import {
  BG, TEAL, TEAL_DOT, TEAL_DIM, GREY_DOT, GUIDE, HDR, WHITE, BODY,
  mulberry32, greyGroup, tealFigure, flowLines, chrome, kicker, captionRow, captionOne, page,
} from '../_kit/slide-kit.mjs';

// ---------- icons (drawn, standing in for 🔒 📊 ⚙️ ➡️) ----------
function gearPath(cx, cy, rOut, rIn, teeth) {
  const pts = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const w = step * 0.18;
    pts.push([rIn, a - step / 2 + w], [rOut, a - w], [rOut, a + w], [rIn, a + step / 2 - w]);
  }
  return 'M ' + pts.map(([r, a]) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`).join(' L ') + ' Z';
}
const ICONS = {
  kilit: '<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/><path d="M12 14.4v2.6"/>',
  grafik: '<path d="M3.5 20.5h17"/><rect x="5.5" y="12.5" width="3" height="5.5" rx="0.8"/><rect x="10.5" y="8" width="3" height="10" rx="0.8"/><rect x="15.5" y="4.5" width="3" height="13.5" rx="0.8"/>',
  disli: `<path d="${gearPath(12, 12, 9.6, 7.2, 8)}"/><circle cx="12" cy="12" r="3"/>`,
};
const iconG = (name, cx, cy, size, color, sw = 1.8) => {
  const s = size / 24;
  return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s})" fill="none" stroke="${color}" stroke-width="${(sw / s).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</g>`;
};
const sideIcon = (name, top = 212) =>
  `<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="${TEAL_DIM}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 80px; top: ${top}px;">${ICONS[name]}</svg>`;
const arrow = (w, color) =>
  `<svg width="${w}" height="${(w * 0.54).toFixed(0)}" viewBox="0 0 26 14" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="flex: none;"><path d="M1 7h21M17.5 2.5 22 7l-4.5 4.5"/></svg>`;

const fullSvg = (body) =>
  `<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position: absolute; left: 0; top: 0;" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

// benefit slide copy flows as one column, so line counts never collide:
// headline, the problem (muted), then how synthetic data helps (bright)
const benefitText = (title, problem, help) => `
  <div style="position: absolute; left: 283px; top: 150px; width: 700px; display: flex; flex-direction: column;">
    <div style="font-size: 42px; line-height: 1.45; color: ${WHITE};">${title}</div>
    <div style="margin-top: 26px; width: 680px; font-size: 28px; line-height: 1.55; color: ${BODY};">${problem}</div>
    <div style="margin-top: 18px; width: 690px; font-size: 28px; line-height: 1.55; color: ${WHITE};">${help}</div>
  </div>`;

// ---------- slide 1: cover ----------
{
  const figTop = 770, figCx = 540;
  const nodes = [
    { name: 'kilit', x: 330 },
    { name: 'grafik', x: 540 },
    { name: 'disli', x: 750 },
  ];
  const nodeY = 630;
  let art = '';
  for (const n of nodes) {
    art += `<path d="M ${n.x} ${nodeY + 34} C ${n.x} ${nodeY + 90}, ${figCx} ${figTop - 70}, ${figCx} ${figTop - 14}" fill="none" stroke="${GUIDE}" stroke-width="1.2" opacity="0.6"/>`;
  }
  for (const n of nodes) {
    art += `<circle cx="${n.x}" cy="${nodeY}" r="34" fill="${BG}" stroke="${TEAL_DIM}" stroke-width="1.4" stroke-dasharray="5 6" opacity="0.95"/>`;
    art += iconG(n.name, n.x, nodeY, 32, TEAL_DIM, 1.7);
  }
  const inner = `${chrome()}
  ${kicker('SORU', 150)}
  <div style="position: absolute; left: 283px; top: 108px; width: 717px; font-size: 96px; font-weight: 700; line-height: 1.16; color: ${WHITE};">Sentetik verinin faydaları nelerdir<span style="color: ${TEAL};">?</span></div>
  ${fullSvg(art + tealFigure(51, figCx, figTop, 0.5))}
  ${captionOne('temel faydalar', 540)}`;
  writeFileSync('Main.dc.html', page('Slayt 1 — Kapak', inner));
}

// ---------- slide 2: less use and sharing of real data ----------
{
  const top = 625;
  let art = '';
  art += flowLines(21, 460, top + 120, top + 320, 710, top + 140, top + 300, 5, TEAL_DIM, 0.35);
  art += `<rect x="120" y="${top + 14}" width="330" height="360" rx="28" fill="none" stroke="#5b7f9c" stroke-width="1.5" stroke-dasharray="7 8" opacity="0.85"/>`;
  // lock badge cut into the frame's top edge
  art += `<circle cx="285" cy="${top + 14}" r="26" fill="${BG}" stroke="#5b7f9c" stroke-width="1.5" opacity="0.95"/>`;
  art += iconG('kilit', 285, top + 14, 26, HDR, 1.7);
  art += greyGroup(22, 285, top + 64, 0.64);
  art += tealFigure(23, 820, top + 70, 0.64);
  const inner = `${chrome()}
  ${kicker('FAYDA 01', 165)}
  ${sideIcon('kilit')}
  ${benefitText(
    `Gerçek verilerin kullanımını ve paylaşımını <span style="color: ${TEAL};">azaltabilir</span>.`,
    'Gerçek verilerin kullanılması veya paylaşılması, özellikle kişisel veriler söz konusu olduğunda, çeşitli mahremiyet ve hukuki riskler doğurabilir.',
    'Sentetik veri, gerçek verilerin doğrudan kullanılması ve paylaşılması ihtiyacını azaltarak bu risklerin azaltılmasına katkı sağlayabilir.',
  )}
  ${fullSvg(art)}
  ${captionRow('korunur', 'paylaşılır', 285, 820)}`;
  writeFileSync('Fayda1.dc.html', page('Slayt 2 — Fayda 1', inner));
}

// ---------- slide 3: data scarcity ----------
{
  // dot histograms: real counts in grey, synthetic additions stacked on top in teal
  const pitch = 44, rowPitch = 17;
  function histogram(seed, cx, baseY, real, extra) {
    const rand = mulberry32(seed);
    const x0 = cx - ((real.length - 1) * pitch) / 2;
    let out = `<line x1="${x0 - 22}" y1="${baseY + 14}" x2="${x0 + (real.length - 1) * pitch + 22}" y2="${baseY + 14}" stroke="${GUIDE}" stroke-width="1.2" opacity="0.7"/>`;
    real.forEach((n, i) => {
      const x = x0 + i * pitch;
      const total = n + (extra ? extra[i] : 0);
      for (let k = 0; k < total; k++) {
        const synthetic = k >= n;
        out += `<circle cx="${(x + (rand() - 0.5) * 2).toFixed(1)}" cy="${(baseY - k * rowPitch).toFixed(1)}" r="6" fill="${synthetic ? TEAL_DOT : GREY_DOT}" opacity="${(0.55 + rand() * 0.45).toFixed(2)}"/>`;
      }
    });
    return out;
  }
  const real = [5, 8, 11, 9, 6, 2, 1];
  const extra = [1, 1, 1, 2, 3, 5, 5];
  const baseY = 958;
  let art = histogram(31, 295, baseY, real, null) + histogram(32, 785, baseY, real, extra);
  // bracket the rare cases the synthetic data fills in
  const tailX0 = 785 + (5 - 3) * pitch - 16, tailX1 = 785 + (6 - 3) * pitch + 16;
  art += `<rect x="${tailX0}" y="${baseY - 6 * rowPitch - 20}" width="${tailX1 - tailX0}" height="${6 * rowPitch + 40}" rx="14" fill="none" stroke="${TEAL_DIM}" stroke-width="1.4" stroke-dasharray="5 6" opacity="0.9"/>`;
  const inner = `${chrome()}
  ${kicker('FAYDA 02', 165)}
  ${sideIcon('grafik')}
  ${benefitText(
    `Veri kıtlığını <span style="color: ${TEAL};">gidermeye yardımcı</span> olabilir.`,
    'Gerçek veri her zaman yeterli miktarda veya çeşitlilikte bulunmayabilir.',
    'Sentetik veri, mevcut veri setlerini genişletmek ve az rastlanan veya yeterince temsil edilmeyen durumlara ilişkin yeni veriler üretmek için kullanılabilir.',
  )}
  ${fullSvg(art)}
  ${captionRow('mevcut veri', 'genişletilmiş veri', 295, 785)}`;
  writeFileSync('Fayda2.dc.html', page('Slayt 3 — Fayda 2', inner));
}

// ---------- slide 4: easier data production, caveat, next post ----------
{
  const rand = mulberry32(41);
  let art = '';
  // collection: scattered grey points gathered along a long dashed path
  const pts = [[150, 708], [196, 624], [270, 660], [226, 742], [306, 730], [344, 628], [420, 668], [388, 748]];
  // smooth winding route (Catmull-Rom through the points) rather than a chart-like zigzag
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  art += `<path d="${d}" fill="none" stroke="${GUIDE}" stroke-width="1.3" stroke-dasharray="4 7" opacity="0.8"/>`;
  for (const [x, y] of pts) art += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${GREY_DOT}" opacity="${(0.6 + rand() * 0.4).toFixed(2)}"/>`;
  // generation: a gear emitting tidy teal rows
  art += iconG('disli', 700, 675, 84, TEAL_DIM, 1.5);
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 9; c++) {
      art += `<circle cx="${780 + c * 21}" cy="${619 + r * 28}" r="5" fill="${TEAL_DOT}" opacity="${(0.55 + rand() * 0.45).toFixed(2)}"/>`;
    }
  }
  const inner = `${chrome()}
  ${kicker('FAYDA 03', 165)}
  ${sideIcon('disli')}
  ${benefitText(
    `Veri üretimini <span style="color: ${TEAL};">kolaylaştırabilir</span>.`,
    'Gerçek dünyadan veri toplamak zaman alıcı, maliyetli veya pratik olarak güç olabilir.',
    'Sentetik veri, ihtiyaç duyulan verilerin yapay olarak üretilmesine olanak sağlayarak veri toplama sürecindeki bazı maliyet ve güçlükleri azaltabilir.',
  )}
  ${fullSvg(art)}
  ${captionRow('toplama', 'üretim', 285, 800, 800)}
  <div style="position: absolute; left: 283px; top: 896px; width: 700px; font-size: 30px; line-height: 1.5; color: ${WHITE};">Ancak bu imkânların bazı <span style="color: ${TEAL};">sınırlılıkları</span> ve beraberinde getirdiği <span style="color: ${TEAL};">riskler</span> de vardır.</div>
  <div style="position: absolute; left: 283px; top: 1030px; width: 717px; box-sizing: border-box; border: 1.5px dashed ${TEAL_DIM}; border-radius: 22px; padding: 22px 28px; display: flex; flex-direction: column; gap: 10px;">
    <div class="mono" style="font-size: 17px; font-weight: 700; letter-spacing: 0.3em; color: ${HDR};">BİR SONRAKİ PAYLAŞIM</div>
    <div style="display: flex; align-items: center; gap: 16px;">${arrow(30, TEAL)}<span style="font-size: 31px; line-height: 1.35; color: ${WHITE};">Sentetik verinin riskleri ve sınırlılıkları nelerdir?</span></div>
  </div>`;
  writeFileSync('Fayda3.dc.html', page('Slayt 4 — Fayda 3', inner));
}

// ---------- canvas.json ----------
const board = (file, title, i) => ({ file, title, x: i * 1180, y: 0, w: 1080, h: 1350 });
writeFileSync('canvas.json', JSON.stringify({
  artboards: [
    board('Main.dc.html', 'Slayt 1 — Kapak', 0),
    board('Fayda1.dc.html', 'Slayt 2 — Fayda 1', 1),
    board('Fayda2.dc.html', 'Slayt 3 — Fayda 2', 2),
    board('Fayda3.dc.html', 'Slayt 4 — Fayda 3', 3),
  ],
  launch: { view: 'canvas' },
}, null, 2));
console.log('generated 4 artboards + canvas.json');
