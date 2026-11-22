# Ücretsiz yapay zekâ ile harici form tanıma

**Önce bilmeniz gereken:** yapay zekâ bu sistemde **zorunlu değildir**. Formun düzeltilmesi, baloncukların ve blokların bulunması görüntü işlemeyle (tarayıcınızda, ücretsiz) yapılır; **kesin konumu her zaman görüntü işleme verir**. Yapay zekâ isteğe bağlı **"tam tanıma"** ile formun tamamını önerir: bölümlerin yeri, satır/sütun sayıları, ad-soyad ızgaraları, bloğun ne olduğu (soru / öğrenci no / kurum kodu / kitapçık / ad / soyad), ders adları, şık harfleri, soru sırası; uygulama bu yaklaşık konumları gerçek baloncuklara oturtur. Sonuç elle düzenlenebilir bloklardır, elle yaptıklarınız ezilmez. İsterseniz hepsini elle de yaparsınız (bkz. OTOMATIK-FORM-TANIMA.md ▸ "Tanınan bölümlere elle müdahale").

Üç yol var; ücretten hiç söz etmeyen en kolay yoldan başlayın.

## Yol 1 — Hiçbir anahtar/API olmadan (sohbet uygulamasıyla)
Gemini, ChatGPT, Claude, Copilot, Le Chat gibi **ücretsiz** bir sohbet uygulaması görüntü yüklemeyi destekliyorsa:
1. Formu **Formlar ▸ Otomatik tanıt** ekranında yükleyin.
2. Sağdaki **"API'siz yapay zekâ (sohbet uygulamasıyla)"** düğmesine basın. **"Tam tanıma"** seçili gelir (yalnızca ders adı/harf yeterliyse ikinci seçeneği işaretleyin).
3. **Görüntüyü indirin/kopyalayın**: görüntü cetvelli ve blok numaralıdır (b1, b2…; istemezseniz pencereden kapatın) ve sohbet uygulamasına yükleyin.
4. **İstemi kopyalayıp** sohbete yapıştırıp gönderin (istem İngilizcedir, blok koordinatlarını içerir).
5. Uygulamanın verdiği `{ … }` biçimli yanıtı kopyalayıp **"Yanıtı uygula"** kutusuna yapıştırın **ya da yanıt dosya olarak verildiyse (.json / .txt) "Yanıt dosyası yükle"** deyin (yükleyince hemen uygulanır). Kod çiti ya da açıklama olması sorun değildir; her şey **"Önerileri geri al"** ile geri alınır.
6. Tuvalde yapay zekânın mor kesikli kutularını ve otomatik tanımanın renkli çerçevelerini yan yana görürsünüz. Yapay zekânın farklı sayı ya da konum önerdiği bloklarda "Yapay zekâ önerisini uygula" düğmesi çıkar; elle düzeltmeler her zaman mümkündür. Kontrol edin ve kaydedin.

Gönderilen: yalnızca **boş** form görüntüsü ve blok listesi (öğrenci bilgisi hiç yok). Ücretsiz sohbet planlarında günlük yükleme/mesaj sınırı vardır; bu iş bir form için bir kez yapılır.

## Yol 2 — Ücretsiz API anahtarı (uygulama kendi sorar, tek tıkla)
Yönetici **Yönetim ▸ Yapay zekâ** sekmesine bir anahtar ekler; sonra herkes **"Yapay zekâ ile tam tanıma"** (ya da hızlı "Yalnızca ders adı ve harfleri öner") düğmesini kullanır. *(Tam tanıma için Code.gs'in bu sürümü Apps Script'e yapıştırılıp yeni sürüm dağıtılmalıdır.)* Ücretsiz katmanı olan seçenekler (bu belge hazırlanırken, 16 Kasım 2026'da okunan durum; **sınırlar ve model adları sık değişir, anahtar aldığınız sitedeki güncel koşullara bakın**):

| Hizmet | Nereden | Uygulamada | Not |
|---|---|---|---|
| **Google Gemini** (önerilen) | aistudio.google.com ▸ "Get API key" | Gemini kartı, anahtarı yapıştırın; **Hızlı** seviye | Ücretsiz katmanda Flash-Lite sınıfı modellerin günlük hakkı en yüksektir (yüzlerce istek/gün), Flash'ınki düşüktür, Pro sınıfı ücretsiz değildir. Ücretsiz katmanda gönderilen veri Google ürünlerini geliştirmek için kullanılabilir (AEA/İngiltere/İsviçre dışında). |
| **Groq** | console.groq.com | "OpenAI uyumlu" kartında **Groq** düğmesi adres/model doldurur; anahtarı yapıştırın | Hızlı; ücretsiz katmanda dakika/gün sınırı var. Görüntü destekleyen güncel model adını sitede doğrulayın. |
| **OpenRouter** | openrouter.ai ▸ Keys | Uyumlu kartında **OpenRouter** düğmesi (`openrouter/free`) | Ücretsiz modeller; günlük istek sayısı çok düşük (≈ 50) ve istemler kaydedilebilir. |
| **Mistral** | console.mistral.ai | Uyumlu kartında **Mistral** düğmesi | "Experiment" katmanı ücretsiz; veri eğitimi için kullanım onayı ister. |
| GitHub Models | github.com/marketplace/models | Uyumlu kart, adres `https://models.inference.ai.azure.com` + kişisel erişim jetonu | Çok kısıtlı; yalnızca deneme için. |

Anahtarı ekledikten sonra **Dene** düğmesi çalışıp çalışmadığını gösterir. Ücretsiz katmanın sınırı dolarsa uygulama sıradaki modele/sağlayıcıya geçer, hiçbiri yanıt vermezse tanıma yapay zekâsız devam eder.

**Bir kez gerekli izin:** *"…UrlFetchApp.fetch … script.external_request"* hatası Apps Script'in dış bağlantı izninin verilmediğini gösterir. `izinleriVer` işlevini bir kez çalıştırıp izin verin ve yeni sürüm dağıtın (adımlar OTOMATIK-FORM-TANIMA.md ▸ "Dış bağlantı izni").

## Yol 3 — Yapay zekâ olmadan
Otomatik tanıma çoğu formda ders adlarını "Bölüm 1, 2…" diye bırakır; rol tahmini görüntü işlemeyle yapılır. Ders adlarını ve şık harflerini listeye elle yazın, eksik/yanlış bloğu **Bölüm ekle** ve düzenleyiciyle düzeltin. Hiçbir hesap, anahtar ya da bağlantı gerekmez.

## Gizlilik ve maliyet özeti
- Hiçbir yolda öğrenci adı/numarası/cevabı yapay zekâya gitmez; yalnızca boş form görüntüsü ve blok listesi gider.
- Ücretsiz API katmanlarında istemler sağlayıcı tarafından kaydedilebilir/kullanılabilir (yukarıdaki tablo). Okul formu zaten kamuya açık boş bir formdur; yine de kurumunuz kurallarına bakın.
- Ücretsiz sınırlar herhangi bir zamanda değişebilir. Sınır dolduğunda ya da hizmet kapandığında Yol 1 ve Yol 3 her zaman çalışır.
