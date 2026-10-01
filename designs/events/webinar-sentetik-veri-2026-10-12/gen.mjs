// Webinar poster, 1080x1350, on the "Sentetik veri" series design system.
// Left-aligned composition: every block starts on the series eyebrow's edge
// (80px) and spans the 80–1000 band; the format label sits at top right.
import { writeFileSync } from 'node:fs';
import {
  TEAL, TEAL_DOT, TEAL_DIM, GREY_DOT, HDR, WHITE, BODY,
  mulberry32, figureDots, dots, chrome, page,
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
    const s = (h - 52) / 430;
    out += t.teal
      ? `<rect x="${x}" y="${y0}" width="${w}" height="${h}" rx="18" fill="none" stroke="${TEAL_DIM}" stroke-width="1.6" stroke-dasharray="7 8" opacity="0.95"/>`
        + `<circle cx="${x + 20}" cy="${y0 + 20}" r="5" fill="${TEAL_DOT}"/>`
      : `<rect x="${x}" y="${y0}" width="${w}" height="${h}" rx="18" fill="none" stroke="#3f6382" stroke-width="1.3" opacity="0.75"/>`;
    out += figure(t.seed, x + w / 2, y0 + 26, s, t.teal ? TEAL_DOT : GREY_DOT);
  });
  return out;
}

const label = (text, color = TEAL) =>
  `<div class="mono" style="font-size: 17px; font-weight: 700; letter-spacing: 0.3em; color: ${color};">${text}</div>`;

// left-aligned cells so each column has one clean edge
const metaCell = (name, lines) => `
    <div style="text-align: left;">
      ${label(name)}
      <div style="margin-top: 14px; font-size: 30px; line-height: 1.32; color: ${WHITE}; white-space: nowrap;">${lines.join('<br>')}</div>
    </div>`;

const svg = `<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position: absolute; left: 0; top: 0;" xmlns="http://www.w3.org/2000/svg">${callTiles(80, 492, 215, 186, 20)}</svg>`;

const inner = `${chrome()}
  <div class="mono" style="position: absolute; right: 80px; top: 70px; font-size: 19px; font-weight: 700; letter-spacing: 0.3em; color: ${TEAL};">WEBİNAR</div>

  <div style="position: absolute; left: 80px; width: 920px; top: 180px; text-align: left; font-size: 86px; font-weight: 700; line-height: 1.1; color: ${WHITE};">Sentetik Veri<span style="color: ${TEAL};">:</span></div>
  <div style="position: absolute; left: 80px; width: 860px; top: 318px; text-align: left; font-size: 46px; line-height: 1.34; color: ${WHITE};">Kavramsal Çerçeve, Teknik Hususlar ve <span style="color: ${TEAL};">Hukuki Sorunlar</span></div>

  ${svg}

  <div style="position: absolute; left: 80px; width: 920px; top: 728px; text-align: left;">
    ${label('KONUŞMACI')}
    <div style="margin-top: 16px; font-size: 52px; color: ${WHITE};">Av. Beste Orhan</div>
  </div>

  <div style="position: absolute; left: 80px; width: 920px; top: 864px; height: 1px; background: rgba(197, 216, 233, 0.22);"></div>

  <div style="position: absolute; left: 80px; width: 920px; top: 892px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start;">
    ${metaCell('TARİH', ['12 Ekim 2026'])}
    ${metaCell('SAAT', ['18:00 CEST', '19:00 TSİ'])}
    ${metaCell('KATILIM', ['Çevrim içi · Zoom'])}
  </div>

  <div style="position: absolute; left: 80px; width: 920px; top: 1040px; box-sizing: border-box; border: 1.5px dashed ${TEAL_DIM}; border-radius: 22px; padding: 24px 32px; text-align: left; display: flex; flex-direction: column; gap: 12px;">
    ${label('ZOOM İLE KATILIM', HDR)}
    <div class="mono" style="font-size: 22px; line-height: 1.4; letter-spacing: 0.02em; color: ${WHITE};">https://zoom.us/j/5817402617<br>?pwd=M2VCVjBzRmU5bHEva3NDbVR3b1hDQT09&amp;omn=96791673807</div>
    <div class="mono" style="font-size: 19px; letter-spacing: 0.04em; white-space: nowrap; color: ${BODY};">Toplantı Kimliği: 581 740 2617 &nbsp;·&nbsp; Parola: 103038</div>
  </div>`;

writeFileSync('Afis.dc.html', page('Webinar Afişi', inner));
writeFileSync('canvas.json', JSON.stringify({
  artboards: [{ file: 'Afis.dc.html', title: 'Webinar afişi', x: 0, y: 0, w: 1080, h: 1350 }],
  launch: { view: 'focused', file: 'Afis.dc.html' },
}, null, 2));
console.log('generated poster');
