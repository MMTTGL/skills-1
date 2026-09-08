# Sentetik Veri — 3. Gönderi: "Sentetik veri nerelerde kullanılıyor?"

Instagram kaydırmalı (carousel) gönderi, 5 slayt, 1080×1350 (4:5).
Tasarım sistemi `../_kit/slide-kit.mjs` üzerinden 1. ve 2. gönderiyle ortaktır:

- Zemin `#0e3151`, turkuaz vurgu `#31c7c8` / noktalar `#0fd0c4`, gri noktalar `#b2c4d2`
- Source Serif 4 (başlık/metin), JetBrains Mono (etiket ve altyazılar)
- Altyazılar tanımladıkları görselin merkezine ortalanır

Alan simgeleri (sağlık, finans, otomotiv, robotik, eğitim) emoji değil,
seri diliyle çizilmiş inline SVG ikonlardır.

## Dosyalar

- `slayt-1-kapak.png` … `slayt-5-otonom.png` — paylaşıma hazır görseller
- `Main / Alanlar / Saglik / Finans / Otonom .dc.html` — slayt kaynakları
- `gen.mjs` — slaytları ve illüstrasyonları üreten betik (`node gen.mjs`)
- `shoot.mjs` — 1080×1350 PNG çıktısı alır (`npm i playwright-core` gerektirir)
- `canvas.json` — tasarım kanvası yerleşimi
