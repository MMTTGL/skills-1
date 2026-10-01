# Webinar afişi — "Sentetik Veri: Kavramsal Çerçeve, Teknik Hususlar ve Hukuki Sorunlar"

12 Ekim 2026, 18:00 · Çevrim içi (Zoom) · Konuşmacı: Av. Beste Orhan

1080×1350 (4:5), Instagram paylaşımına hazır. Tasarım sistemi
`../../instagram/_kit/slide-kit.mjs` üzerinden sentetik veri serisiyle
ortaktır: lacivert zemin, noktalı figürler, Source Serif 4 başlık,
harf aralıklı JetBrains Mono etiketler.

Düzen sola hizalıdır: bütün bloklar seri başlığının sol kenarından (80 px)
başlar ve 80–1000 px bandını kaplar; format etiketi (WEBİNAR) sağ üsttedir.
Tarih / saat / katılım bilgisi üç eşit sütundan oluşur.

Görsel: dört "görüşme karesi" — kesikli turkuaz çerçeveli konuşmacı
ve gri katılımcılar.

## Dosyalar

- `webinar-afis.png` — paylaşıma hazır afiş
- `Afis.dc.html` — afiş kaynağı
- `gen.mjs` — afişi üreten betik (`node gen.mjs`)
- `shoot.mjs` — PNG çıktısı alır (`npm i playwright-core` gerektirir)
- `canvas.json` — tasarım kanvası yerleşimi

## Not

Saat afişte çift yazılıdır: `18:00 CEST` (Zoom davetindeki Amsterdam/Berlin
saati) ve `19:00 TSİ` (Türkiye saati). 12 Ekim 2026'da Orta Avrupa yaz
saati yürürlüktedir, bu nedenle iki saat arasında bir saat fark vardır.
