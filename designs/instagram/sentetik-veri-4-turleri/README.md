# Sentetik Veri — 4. Gönderi: "Sentetik verinin türleri nelerdir?"

Instagram kaydırmalı (carousel) gönderi, 4 slayt, 1080×1350 (4:5).
Tasarım sistemi `../_kit/slide-kit.mjs` üzerinden seriyle ortaktır.

Bu gönderinin görsel dili "kayıt tablosu": her hücre nokta kümesidir,
kesikli turkuaz çerçeve sentetikleştirilen sütunları gösterir. Tamamen
sentetik veride çerçeve tüm sütunları, kısmen sentetik veride yalnızca
bir bölümünü kapsar. Alan etiketleri (SENTETİK / GERÇEK) eşit genişlikte
rozetlerdir; içerikteki ➡️ yerine seri diliyle çizilmiş ok kullanılır.

## Dosyalar

- `slayt-1-kapak.png` … `slayt-4-ornek-kismen.png` — paylaşıma hazır görseller
- `Main / Turler / OrnekTamamen / OrnekKismen .dc.html` — slayt kaynakları
- `gen.mjs` — slaytları üreten betik (`node gen.mjs`)
- `shoot.mjs` — 1080×1350 PNG çıktısı alır (`npm i playwright-core` gerektirir)
- `canvas.json` — tasarım kanvası yerleşimi
