// Webinar poster, 1080x1350, on the "Sentetik veri" series design system.
import { writeFileSync } from 'node:fs';
import {
  TEAL, TEAL_DOT, TEAL_DIM, GREY_DOT, HDR, WHITE, BODY,
  mulberry32, figureDots, dots, chrome, kicker, page,
} from '../../instagram/_kit/slide-kit.mjs';

// one dotted figure inside a tile, the way the series draws people
const figure = (seed, cx, topY, scale, color) =>
  dots(figureDots(mulberry32(seed), 1), cx, topY, scale, color, 4.1, mulberry32(seed + 5), 0.5);

// a row of call tiles: the speaker first, then the audience
function callTiles(x0, y0, w, h, gap) {
  const tiles = [
    { teal: true, seed: 71 },
    { teal: false, seed: 72 },
    { teal: false, seed: 73 },
    { teal: false, seed: 74 },
  ];
  let out = '';
  tiles.forEach((t, i) => {
    const x = x0 + i * (w + gap);
    const cx = x + w / 2;
    const s = (h - 58) / 430;
    out += t.teal
      ? `<rect x="${x}" y="${y0}" width="${w}" height="${h}" rx="18" fill="none" stroke="${TEAL_DIM}" stroke-width="1.6" stroke-dasharray="7 8" opacity="0.95"/>`
      : `<rect x="${x}" y="${y0}" width="${w}" height="${h}" rx="18" fill="none" stroke="#3f6382" stroke-width="1.3" opacity="0.75"/>`;
    out += figure(t.seed, cx, y0 + 30, s, t.teal ? TEAL_DOT : GREY_DOT);
    if (t.teal) {
      out += `<circle cx="${x + 20}" cy="${y0 + 20}" r="5" fill="${TEAL_DOT}"/>`;
    }
  });
  return out;
}

const metaCell = (label, value) => `
    <div>
      <div class="mono" style="font-size: 17px; font-weight: 700; letter-spacing: 0.3em; color: ${TEAL};">${label}</div>
      <div style="margin-top: 14px; font-size: 34px; color: ${WHITE}; white-space: nowrap;">${value}</div>
    </div>`;

// one row, evenly distributed between the margins
const metaRow = (top, cells) => `
  <div style="position: absolute; left: 283px; width: 717px; top: ${top}px; display: flex; justify-content: space-between; align-items: flex-start; gap: 40px;">${cells.map(([l, v]) => metaCell(l, v)).join('')}</div>`;

const svg = `<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position: absolute; left: 0; top: 0;" xmlns="http://www.w3.org/2000/svg">${callTiles(283, 470, 165, 215, 20)}</svg>`;

const inner = `${chrome()}
  ${kicker('WEBİNAR', 150)}
  <div style="position: absolute; left: 283px; top: 130px; width: 717px; font-size: 86px; font-weight: 700; line-height: 1.1; color: ${WHITE};">Sentetik Veri<span style="color: ${TEAL};">:</span></div>
  <div style="position: absolute; left: 283px; top: 262px; width: 717px; font-size: 46px; line-height: 1.34; color: ${WHITE};">Kavramsal Çerçeve, Teknik Hususlar ve <span style="color: ${TEAL};">Hukuki Sorunlar</span></div>

  ${svg}

  <div style="position: absolute; left: 283px; top: 740px;">
    <div class="mono" style="font-size: 17px; font-weight: 700; letter-spacing: 0.3em; color: ${TEAL};">KONUŞMACI</div>
    <div style="margin-top: 16px; font-size: 52px; color: ${WHITE};">Av. Beste Orhan</div>
  </div>

  <div style="position: absolute; left: 283px; right: 80px; top: 888px; height: 1px; background: rgba(197, 216, 233, 0.22);"></div>
  ${metaRow(915, [['TARİH', '12 Ekim 2026'], ['SAAT', '18:00'], ['KATILIM', 'Çevrim içi · Zoom']])}

  <div style="position: absolute; left: 283px; top: 1040px; width: 717px; border: 1.5px dashed ${TEAL_DIM}; border-radius: 22px; padding: 26px 32px; display: flex; flex-direction: column; gap: 14px;">
    <div class="mono" style="font-size: 17px; font-weight: 700; letter-spacing: 0.3em; color: ${HDR};">ZOOM İLE KATILIM</div>
    <div class="mono" style="font-size: 25px; letter-spacing: 0.06em; color: ${WHITE};">zoom.us/j/5817402617</div>
    <div class="mono" style="font-size: 22px; letter-spacing: 0.06em; color: ${BODY};">Toplantı Kimliği: 581 740 2617 &nbsp;·&nbsp; Parola: 103038</div>
  </div>`;

writeFileSync('Afis.dc.html', page('Webinar Afişi', inner));
writeFileSync('canvas.json', JSON.stringify({
  artboards: [{ file: 'Afis.dc.html', title: 'Webinar afişi', x: 0, y: 0, w: 1080, h: 1350 }],
  launch: { view: 'focused', file: 'Afis.dc.html' },
}, null, 2));
console.log('generated poster');
