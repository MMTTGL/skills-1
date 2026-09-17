// Generates the 4 artboards for the "Sentetik verinin türleri nelerdir?" carousel.
import { writeFileSync } from 'node:fs';
import {
  TEAL, TEAL_DOT, TEAL_DIM, GREY_DOT, CAP_GREY, WHITE, BODY,
  mulberry32, chrome, kicker, captionRow, page,
} from '../_kit/slide-kit.mjs';

// ---------- a dataset drawn as dotted table cells ----------
// cols left of `tealCols` are synthetic (teal), the rest stay real (grey)
function dotTable(seed, cx, cy, cols, rows, tealCols, pitch = 36, rowPitch = 34) {
  const rand = mulberry32(seed);
  const x0 = cx - ((cols - 1) * pitch) / 2;
  const y0 = cy - ((rows - 1) * rowPitch) / 2;
  let out = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = c < tealCols ? TEAL_DOT : GREY_DOT;
      for (let d = 0; d < 3; d++) {
        const x = x0 + c * pitch - 9.5 + d * 9.5 + (rand() - 0.5) * 2.4;
        const y = y0 + r * rowPitch + (rand() - 0.5) * 2.4;
        out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.1" fill="${color}" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`;
      }
    }
  }
  // dashed frame over the synthetic columns: all of them, or only part of the set
  const pad = 11;
  const left = x0 - 9.5 - 4.1 - pad;
  const right = x0 + (tealCols - 1) * pitch + 9.5 + 4.1 + pad;
  const top = y0 - 4.1 - pad;
  const bottom = y0 + (rows - 1) * rowPitch + 4.1 + pad;
  out += `<rect x="${left.toFixed(1)}" y="${top.toFixed(1)}" width="${(right - left).toFixed(1)}" height="${(bottom - top).toFixed(1)}" rx="16" fill="none" stroke="${TEAL_DIM}" stroke-width="1.4" stroke-dasharray="6 7" opacity="0.9"/>`;
  return out;
}
const tableSvg = (seed, cx, cy, tealCols, rows = 6, cols = 5, pitch = 32) =>
  `<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position: absolute; left: 0; top: 0; pointer-events: none;" xmlns="http://www.w3.org/2000/svg">${dotTable(seed, cx, cy, cols, rows, tealCols, pitch)}</svg>`;

// drawn arrow, standing in for the ➡️ of the source copy
const arrow = (w, color) =>
  `<svg width="${w}" height="${(w * 0.54).toFixed(0)}" viewBox="0 0 26 14" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="flex: none;"><path d="M1 7h21M17.5 2.5 22 7l-4.5 4.5"/></svg>`;

const chip = (label, synthetic) =>
  `<span class="mono" style="flex: none; font-size: 18px; letter-spacing: 0.22em; min-width: 150px; text-align: center; padding: 9px 20px 9px 22px; border-radius: 999px; white-space: nowrap; ${
    synthetic
      ? `color: ${TEAL}; border: 1.5px dashed ${TEAL_DIM};`
      : `color: ${CAP_GREY}; border: 1.5px solid rgba(197, 216, 233, 0.32);`
  }">${label}</span>`;

const fieldRow = (name, synthetic) =>
  `<div style="display: flex; align-items: center; gap: 22px;">
    <span style="flex: 1 1 auto; font-size: 31px; color: ${WHITE};">${name}</span>
    ${arrow(26, TEAL_DIM)}
    ${chip(synthetic ? 'SENTETİK' : 'GERÇEK', synthetic)}
  </div>`;

const fieldList = (top, rows, gap = 30) =>
  `<div style="position: absolute; left: 283px; top: ${top}px; width: 700px; display: flex; flex-direction: column; gap: ${gap}px;">${rows.map(([n, s]) => fieldRow(n, s)).join('')}</div>`;

const takeaway = (top, text) =>
  `<div style="position: absolute; left: 283px; top: ${top}px; width: 700px; display: flex; align-items: flex-start; gap: 18px;">
    <span style="padding-top: 9px;">${arrow(30, TEAL)}</span>
    <span style="font-size: 28px; line-height: 1.5; color: ${WHITE};">${text}</span>
  </div>`;

const typeLabel = (text, top) =>
  `<div class="mono" style="position: absolute; left: 283px; top: ${top}px; font-size: 21px; font-weight: 700; letter-spacing: 0.26em; color: ${TEAL};">${text}</div>`;

// ---------- slide 1: cover ----------
{
  const svg = `<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position: absolute; left: 0; top: 0;" xmlns="http://www.w3.org/2000/svg">${dotTable(11, 285, 750, 5, 7, 5, 42, 38)}${dotTable(12, 820, 750, 5, 7, 3, 42, 38)}</svg>`;
  const inner = `${chrome()}
  ${kicker('SORU', 150)}
  <div style="position: absolute; left: 283px; top: 108px; width: 717px; font-size: 96px; font-weight: 700; line-height: 1.16; color: ${WHITE};">Sentetik verinin türleri nelerdir<span style="color: ${TEAL};">?</span></div>
  ${svg}
  ${captionRow('tamamen sentetik', 'kısmen sentetik', 285, 820)}`;
  writeFileSync('Main.dc.html', page('Slayt 1 — Kapak', inner));
}

// ---------- slide 2: the two types ----------
{
  const inner = `${chrome()}
  ${kicker('TÜRLER', 165)}
  ${tableSvg(21, 170, 310, 5)}
  ${typeLabel('TAMAMEN SENTETİK VERİ', 150)}
  <div style="position: absolute; left: 283px; top: 200px; width: 700px; font-size: 32px; line-height: 1.5; color: ${WHITE};">Orijinal veri setindeki gerçek değerlerin yerine, bu verilerin özelliklerini ve aralarındaki ilişkileri yansıtan <span style="color: ${TEAL};">yeni ve yapay veriler</span> oluşturulur.</div>
  <div style="position: absolute; left: 283px; top: 430px; width: 660px; font-size: 27px; line-height: 1.5; color: ${BODY};">Ortaya çıkan veri seti tamamen sentetik verilerden oluşur.</div>
  <div style="position: absolute; left: 283px; right: 80px; top: 570px; height: 1px; background: rgba(197, 216, 233, 0.22);"></div>
  ${tableSvg(22, 170, 800, 3)}
  ${typeLabel('KISMEN SENTETİK VERİ', 640)}
  <div style="position: absolute; left: 283px; top: 690px; width: 700px; font-size: 32px; line-height: 1.5; color: ${WHITE};">Orijinal veri setindeki <span style="color: ${TEAL};">yalnızca bazı gerçek değerler</span>, bunların yerine oluşturulan sentetik değerlerle değiştirilir.</div>
  <div style="position: absolute; left: 283px; top: 920px; width: 660px; font-size: 27px; line-height: 1.5; color: ${BODY};">Diğer gerçek değerler ise orijinal haliyle korunur.</div>`;
  writeFileSync('Turler.dc.html', page('Slayt 2 — Türler', inner));
}

// ---------- slide 3: fully synthetic example ----------
{
  const inner = `${chrome()}
  ${kicker('ÖRNEK', 165)}
  ${tableSvg(31, 170, 635, 5, 7)}
  ${typeLabel('TAMAMEN SENTETİK VERİ', 150)}
  <div style="position: absolute; left: 283px; top: 200px; width: 700px; font-size: 31px; line-height: 1.5; color: ${WHITE};">Yeni bir hasta kayıt sistemini test etmek isteyen bir hastane, gerçek hastaların bilgilerini kullanmak yerine, gerçekte var olmayan hastalara ait <span style="color: ${TEAL};">tamamen yapay kayıtlar</span> oluşturabilir:</div>
  ${fieldList(510, [['Yaş', true], ['Teşhis', true], ['Kullanılan ilaç', true], ['Tedavi', true]])}
  ${takeaway(880, 'Böylece sistem gerçek hasta kayıtları kullanılmadan test edilebilir.')}`;
  writeFileSync('OrnekTamamen.dc.html', page('Slayt 3 — Örnek: tamamen sentetik', inner));
}

// ---------- slide 4: partially synthetic example ----------
{
  const inner = `${chrome()}
  ${kicker('ÖRNEK', 165)}
  ${tableSvg(41, 170, 728, 3, 8)}
  ${typeLabel('KISMEN SENTETİK VERİ', 150)}
  <div style="position: absolute; left: 283px; top: 200px; width: 700px; font-size: 30px; line-height: 1.5; color: ${WHITE};">Kanser hastalarıyla yürütülen bir araştırmada, verilerin başka araştırmacılarla daha güvenli paylaşılabilmesi için hastaların <span style="color: ${TEAL};">kimliklerinin belirlenmesi riskini artırabilecek bilgiler</span> sentetik verilerle değiştirilebilir.</div>
  <div style="position: absolute; left: 283px; top: 430px; width: 680px; font-size: 27px; line-height: 1.5; color: ${BODY};">Buna karşılık, araştırma açısından önemli klinik verilerin bir kısmı gerçek haliyle korunur.</div>
  ${fieldList(580, [['Yaş', true], ['Eğitim düzeyi', true], ['Medeni durum', true], ['Kanser evresi', false], ['Kanser histolojisi', false]], 24)}
  ${takeaway(1010, 'Böylece gerçek ve sentetik verilerin birlikte bulunduğu kısmen sentetik bir veri seti oluşturulmuş olur.')}`;
  writeFileSync('OrnekKismen.dc.html', page('Slayt 4 — Örnek: kısmen sentetik', inner));
}

// ---------- canvas.json ----------
const board = (file, title, i) => ({ file, title, x: i * 1180, y: 0, w: 1080, h: 1350 });
writeFileSync('canvas.json', JSON.stringify({
  artboards: [
    board('Main.dc.html', 'Slayt 1 — Kapak', 0),
    board('Turler.dc.html', 'Slayt 2 — Türler', 1),
    board('OrnekTamamen.dc.html', 'Slayt 3 — Tamamen sentetik', 2),
    board('OrnekKismen.dc.html', 'Slayt 4 — Kısmen sentetik', 3),
  ],
  launch: { view: 'canvas' },
}, null, 2));
console.log('generated 4 artboards + canvas.json');
