// Generates the 5 artboards for the "Sentetik veri nerelerde kullanılıyor?" carousel.
import { writeFileSync } from 'node:fs';
import {
  TEAL, TEAL_DOT, TEAL_DIM, GREY_DOT, GUIDE, WHITE, BODY, HDR,
  mulberry32, inCircle, inPoly, dotFill, dots, greyGroup, tealFigure, flowLines,
  chrome, kicker, captionRow, captionOne, page,
} from '../_kit/slide-kit.mjs';

// ---------- domain icons (drawn, never emoji) ----------
const ICONS = {
  saglik: '<rect x="3.5" y="6.5" width="17" height="12.5" rx="2.5"/><path d="M9.4 6.5V4.6h5.2v1.9"/><path d="M12 9.9v5.6M9.2 12.7h5.6"/>',
  finans: '<rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10.2h19"/><path d="M6 14.6h5.5"/>',
  otomotiv: '<path d="M3 15.4v-2.1l2.3-4.4h13.4L21 13.3v2.1"/><path d="M3 15.4h18"/><circle cx="7.6" cy="16.1" r="1.9"/><circle cx="16.4" cy="16.1" r="1.9"/>',
  robotik: '<rect x="4.6" y="8" width="14.8" height="11" rx="3.5"/><path d="M12 4.4v3.6"/><circle cx="12" cy="3.3" r="1.2"/><path d="M9.6 12.4v1.7M14.4 12.4v1.7"/><path d="M9.8 16.4h4.4"/>',
  egitim: '<path d="M2.6 9.6 12 5.2l9.4 4.4L12 14 2.6 9.6z"/><path d="M6.6 11.6v3.8c0 1.7 2.4 3 5.4 3s5.4-1.3 5.4-3v-3.8"/>',
};
// inside an outer <svg>: keeps the stroke weight constant through the scale
function iconG(name, cx, cy, size, color, sw = 1.8) {
  const s = size / 24;
  return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s})" fill="none" stroke="${color}" stroke-width="${(sw / s).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</g>`;
}
// standalone icon for HTML flow
function iconSvg(name, size, color, sw = 1.8) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="flex: none;">${ICONS[name]}</svg>`;
}

const DOMAINS = [
  ['saglik', 'Sağlık'],
  ['finans', 'Finans'],
  ['otomotiv', 'Otomotiv ve otonom sürüş'],
  ['robotik', 'Robotik'],
  ['egitim', 'Eğitim'],
];

// ---------- slide 1: cover, one method feeding many fields ----------
{
  const hubX = 540, hubY = 900, R = 290;
  const spokes = [200, 235, 270, 305, 340].map((deg, i) => {
    const a = (deg * Math.PI) / 180;
    return { x: hubX + Math.cos(a) * R, y: hubY + Math.sin(a) * R, a, name: DOMAINS[i][0] };
  });
  let art = '';
  for (const s of spokes) {
    const x1 = hubX + Math.cos(s.a) * 78, y1 = hubY + Math.sin(s.a) * 78;
    const x2 = hubX + Math.cos(s.a) * (R - 34), y2 = hubY + Math.sin(s.a) * (R - 34);
    art += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${GUIDE}" stroke-width="1.2" opacity="0.55"/>`;
  }
  for (const s of spokes) {
    art += `<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="31" fill="none" stroke="${TEAL_DIM}" stroke-width="1.4" stroke-dasharray="5 6" opacity="0.9"/>`;
    art += iconG(s.name, s.x, s.y, 30, TEAL_DIM, 1.7);
  }
  const svg = `<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position: absolute; left: 0; top: 0;" xmlns="http://www.w3.org/2000/svg">${art}${tealFigure(11, 540, 782, 0.48)}</svg>`;
  const inner = `${chrome()}
  ${kicker('SORU', 150)}
  <div style="position: absolute; left: 283px; top: 108px; width: 720px; font-size: 104px; font-weight: 700; line-height: 1.16; color: ${WHITE};">Sentetik veri nerelerde kullanılıyor<span style="color: ${TEAL};">?</span></div>
  ${svg}
  ${captionOne('uygulama alanları', 540)}`;
  writeFileSync('Main.dc.html', page('Slayt 1 — Kapak', inner));
}

// ---------- slide 2: the five fields ----------
{
  const rows = DOMAINS.map(([icon, label]) =>
    `<div style="display: flex; align-items: center; gap: 34px;">${iconSvg(icon, 52, TEAL_DIM, 1.7)}<span style="font-size: 42px; color: ${WHITE};">${label}</span></div>`).join('');
  const inner = `${chrome()}
  ${kicker('ALANLAR', 165)}
  <div style="position: absolute; left: 283px; top: 150px; width: 700px; font-size: 43px; font-weight: 400; line-height: 1.58; color: ${WHITE};">Sentetik veriler bugün <span style="color: ${TEAL};">pek çok farklı alanda</span> kullanılıyor.</div>
  <div style="position: absolute; left: 283px; top: 400px; font-size: 29px; color: ${BODY};">Örneğin:</div>
  <div style="position: absolute; left: 283px; top: 476px; display: flex; flex-direction: column; gap: 54px;">${rows}</div>`;
  writeFileSync('Alanlar.dc.html', page('Slayt 2 — Alanlar', inner));
}

// ---------- slide 3: health ----------
{
  const svg =
    `<svg width="1080" height="420" viewBox="0 0 1080 420" style="position: absolute; left: 0; top: 580px;" xmlns="http://www.w3.org/2000/svg">` +
    flowLines(31, 480, 110, 350, 690, 140, 320, 6, TEAL_DIM, 0.35) +
    `<rect x="108" y="18" width="354" height="384" rx="30" fill="none" stroke="#5b7f9c" stroke-width="1.5" stroke-dasharray="7 8" opacity="0.85"/>` +
    `<text x="285" y="56" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="17" letter-spacing="5" fill="${HDR}">MAHREMİYET</text>` +
    greyGroup(32, 285, 78, 0.70) +
    tealFigure(33, 820, 84, 0.70) +
    `</svg>`;
  const inner = `${chrome()}
  ${kicker('SAĞLIK', 165)}
  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="${TEAL_DIM}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 80px; top: 212px;">${ICONS.saglik}</svg>
  <div style="position: absolute; left: 283px; top: 150px; width: 700px; font-size: 40px; line-height: 1.55; color: ${WHITE};">Gerçek hastaların kayıtlarını birebir kullanmadan benzer özelliklere sahip <span style="color: ${TEAL};">sentetik hasta verileri</span> oluşturulabilir.</div>
  <div style="position: absolute; left: 283px; top: 440px; width: 660px; font-size: 29px; line-height: 1.55; color: ${BODY};">Böylelikle hasta mahremiyeti korunurken yapay zekâ sistemleri geliştirilebilir ve eğitilebilir.</div>
  ${svg}
  ${captionRow('gerçek hastalar', 'sentetik hasta', 285, 820)}`;
  writeFileSync('Saglik.dc.html', page('Slayt 3 — Sağlık', inner));
}

// ---------- slide 4: finance ----------
{
  // a ledger row drawn in the series' dot vocabulary
  function ledger(seed, xLeft, y0, widths, color, flagged) {
    const rand = mulberry32(seed);
    let out = '';
    widths.forEach((w, i) => {
      const y = y0 + i * 56;
      for (const [dx, dy] of dotFill(rand, () => true, [0, 0, w, 17], 8.5, 1)) {
        out += `<circle cx="${(xLeft + dx).toFixed(1)}" cy="${(y + dy).toFixed(1)}" r="3.9" fill="${color}" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`;
      }
      if (flagged.includes(i)) {
        out += `<circle cx="${xLeft - 26}" cy="${y + 8}" r="12" fill="none" stroke="${TEAL_DIM}" stroke-width="1.4" stroke-dasharray="4 5"/>`;
        out += `<circle cx="${xLeft - 26}" cy="${y + 8}" r="4" fill="${TEAL_DOT}"/>`;
      }
    });
    return out;
  }
  const svg =
    `<svg width="1080" height="420" viewBox="0 0 1080 420" style="position: absolute; left: 0; top: 600px;" xmlns="http://www.w3.org/2000/svg">` +
    flowLines(41, 430, 40, 330, 660, 150, 230, 4, TEAL_DIM, 0.3) +
    ledger(42, 175, 40, [220, 186, 210, 168, 200, 176], GREY_DOT, [1]) +
    ledger(43, 710, 40, [214, 196, 220, 174, 190, 206], TEAL_DOT, [0, 3, 5]) +
    `</svg>`;
  const inner = `${chrome()}
  ${kicker('FİNANS', 165)}
  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="${TEAL_DIM}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 80px; top: 212px;">${ICONS.finans}</svg>
  <div style="position: absolute; left: 283px; top: 150px; width: 700px; font-size: 40px; line-height: 1.55; color: ${WHITE};">Gerçek dolandırıcılık işlemlerine benzer <span style="color: ${TEAL};">sentetik işlemler</span> oluşturulabilir.</div>
  <div style="position: absolute; left: 283px; top: 400px; width: 660px; font-size: 29px; line-height: 1.55; color: ${BODY};">Böylelikle dolandırıcılığı tespit eden sistemler daha fazla ve çeşitli örnek üzerinde geliştirilebilir ve test edilebilir.</div>
  ${svg}
  ${captionRow('gerçek işlemler', 'sentetik işlem', 285, 820)}`;
  writeFileSync('Finans.dc.html', page('Slayt 4 — Finans', inner));
}

// ---------- slide 5: autonomous driving ----------
{
  const insideCar = (x, y) =>
    (x > -100 && x < 100 && y > -20 && y < 22) ||
    inPoly(x, y, [[-52, -20], [26, -20], [14, -56], [-34, -56]]) ||
    inCircle(x, y, -58, 30, 20) || inCircle(x, y, 58, 30, 20);

  function scene(seed, cx, baseY, color, rain) {
    const rand = mulberry32(seed);
    let out = '';
    out += `<path d="M ${cx - 178} ${baseY} L ${cx - 44} ${baseY - 168}" stroke="${GUIDE}" stroke-width="1.3" opacity="0.6"/>`;
    out += `<path d="M ${cx + 178} ${baseY} L ${cx + 44} ${baseY - 168}" stroke="${GUIDE}" stroke-width="1.3" opacity="0.6"/>`;
    out += `<path d="M ${cx} ${baseY} L ${cx} ${baseY - 168}" stroke="${color}" stroke-width="2.4" stroke-dasharray="16 22" opacity="0.5"/>`;
    out += `<path d="M ${cx - 92} ${baseY - 168} H ${cx + 92}" stroke="${GUIDE}" stroke-width="1.2" opacity="0.55"/>`;
    out += dots(dotFill(rand, insideCar, [-110, -62, 110, 54], 8.5, 1), cx, baseY - 78, 0.70, color, 4.1, rand);
    if (rain) {
      for (let i = 0; i < 26; i++) {
        const x = cx - 158 + rand() * 316, y = baseY - 176 + rand() * 140;
        out += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x - 9).toFixed(1)}" y2="${(y + 22).toFixed(1)}" stroke="${TEAL_DIM}" stroke-width="1.2" opacity="${(0.25 + rand() * 0.3).toFixed(2)}"/>`;
      }
      out += `<rect x="${cx - 176}" y="${baseY - 226}" width="352" height="256" rx="26" fill="none" stroke="${TEAL_DIM}" stroke-width="1.5" stroke-dasharray="7 8" opacity="0.85"/>`;
      out += `<text x="${cx}" y="${baseY - 190}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="17" letter-spacing="5" fill="${HDR}">ZOR KOŞULLAR</text>`;
    }
    return out;
  }
  const svg =
    `<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position: absolute; left: 0; top: 0;" xmlns="http://www.w3.org/2000/svg">` +
    scene(52, 285, 950, GREY_DOT, false) +
    scene(53, 820, 950, TEAL_DOT, true) +
    `</svg>`;
  const inner = `${chrome()}
  ${kicker('OTONOM SÜRÜŞ', 165, 175)}
  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="${TEAL_DIM}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 80px; top: 246px;">${ICONS.otomotiv}</svg>
  <div style="position: absolute; left: 283px; top: 150px; width: 700px; font-size: 40px; line-height: 1.55; color: ${WHITE};">Farklı hava koşulları veya gerçek hayatta kaydedilmesi zor şehir ortamları <span style="color: ${TEAL};">sentetik olarak</span> oluşturulabilir.</div>
  <div style="position: absolute; left: 283px; top: 440px; width: 660px; font-size: 29px; line-height: 1.55; color: ${BODY};">Böylelikle otonom araçlar, gerçek dünyada karşılaşılması zor koşullara ilişkin verilerle geliştirilebilir.</div>
  ${svg}
  ${captionRow('gerçek kayıtlar', 'sentetik sahne', 285, 820)}`;
  writeFileSync('Otonom.dc.html', page('Slayt 5 — Otonom sürüş', inner));
}

// ---------- canvas.json ----------
const board = (file, title, i) => ({ file, title, x: i * 1180, y: 0, w: 1080, h: 1350 });
writeFileSync('canvas.json', JSON.stringify({
  artboards: [
    board('Main.dc.html', 'Slayt 1 — Kapak', 0),
    board('Alanlar.dc.html', 'Slayt 2 — Alanlar', 1),
    board('Saglik.dc.html', 'Slayt 3 — Sağlık', 2),
    board('Finans.dc.html', 'Slayt 4 — Finans', 3),
    board('Otonom.dc.html', 'Slayt 5 — Otonom sürüş', 4),
  ],
  launch: { view: 'canvas' },
}, null, 2));
console.log('generated 5 artboards + canvas.json');
