# Sentetik Veri — 5. Gönderi: "Sentetik verinin faydaları nelerdir?"

Instagram kaydırmalı (carousel) gönderi, 4 slayt, 1080×1350 (4:5).
Tasarım sistemi `../_kit/slide-kit.mjs` üzerinden seriyle ortaktır.

- **Kapak:** Üç fayda simgesi (kilit, grafik, dişli) turkuaz figüre bağlanır.
- **Fayda 01:** Kilitli "mahremiyet" çerçevesinde gerçek veri korunur,
  sentetik veri paylaşılır.
- **Fayda 02:** Noktalı histogram; sentetik noktalar (turkuaz) özellikle az
  rastlanan uç durumları doldurur.
- **Fayda 03:** Dağınık noktalar arasında kıvrımlı bir yol (toplama)
  karşısında düzenli üretim; ardından sınırlılık notu ve bir sonraki
  paylaşımın duyurusu.

Fayda slaytlarında başlık, sorun (soluk) ve sentetik verinin katkısı
(beyaz) tek bir akışkan sütunda yer alır; satır sayısı değişse de
aralıklar korunur. İçerikteki emojiler (🔒 📊 ⚙️ ➡️) seri diliyle
çizilmiş simgelerle karşılanmıştır.

## Dosyalar

- `slayt-1-kapak.png` … `slayt-4-fayda-3.png` — paylaşıma hazır görseller
- `Main / Fayda1 / Fayda2 / Fayda3 .dc.html` — slayt kaynakları
- `gen.mjs` — slaytları üreten betik (`node gen.mjs`)
- `shoot.mjs` — 1080×1350 PNG çıktısı alır (`npm i playwright-core` gerektirir)
- `canvas.json` — tasarım kanvası yerleşimi
