# Sentetik Veri — 2. Gönderi: "Sentetik veri nasıl üretilir?"

Instagram kaydırmalı (carousel) gönderi, 4 slayt, 1080×1350 (4:5).
Tasarım sistemi 1. gönderiden ("Sentetik veri nedir?") birebir alınmıştır:

- Zemin: `#0e3151`
- Turkuaz vurgu: `#31c7c8` (metin) / `#0fd0c4` (noktalar)
- Gri noktalar: `#b2c4d2`
- Yazı tipleri: Source Serif 4 (başlık/metin), JetBrains Mono (etiketler)

## Dosyalar

- `slayt-1-kapak.png` … `slayt-4-ornek.png` — paylaşıma hazır görseller
- `Main.dc.html`, `Uretim.dc.html`, `Yontemler.dc.html`, `Ornek.dc.html` — slayt kaynakları
- `gen.mjs` — slaytları ve noktalı figür illüstrasyonlarını üreten betik (`node gen.mjs`)
- `shoot.mjs` — 1080×1350 PNG çıktısı alan betik (`npm i playwright-core` gerektirir)
- `canvas.json` — tasarım kanvası yerleşimi
