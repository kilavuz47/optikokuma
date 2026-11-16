# Harici optik formu otomatik tanıma — kurulum ve kullanım

## Ne yapar?
Piyasadaki herhangi bir optik formun (LGS/YKS denemesi, yayınevi ve okul denemeleri) **boş bir örneğini** yüklersiniz (bilgisayarda dosya/PDF, telefonda "Fotoğraf çek").
Sistem formu düzeltir, bütün baloncukları **milimetrik** bulur ve blokları tanır: sorular, öğrenci numarası, kurum kodu, kitapçık türü, **ad ve soyad harf ızgaraları**.
**Formlar → Harici formu otomatik tanıt** ekranında sonucu görür, gerekirse düzeltir ve **Onayla ve kaydet** dersiniz; form kayıtlı şablon olur.
Sınav oluştururken bu şablonu seçince dersler/soru sayısı şablondan gelir ("Dersleri bu formdan al"). Okutma (toplu dosya, PDF, telefon fotoğrafı) şablonla otomatik eşleşir; sayfa 90°/180° dönük de olsa yön kendiliğinden bulunur.

> Baloncukların **konumu görüntü işlemeyle** bulunur (deterministik, her seferinde aynı sonuç). Yapay zekâ yalnızca *anlam* önerir: ders adı, şık harfleri, bloğun rolü. Anahtarsız da her şey çalışır.

## Desteklenen form türleri (çerçeve)
Formun sayfada nerede durduğunu bulmak için kullanılan işaretlere **çerçeve** denir. Ekranda "Çerçeve türü" listesinden görürsünüz; çoğu zaman **Otomatik** doğru bulur.

| Tür | Formda ne var? | Not |
|---|---|---|
| Dört köşe karesi | Köşelerde dolu siyah kare | En kolay ve en dayanıklı tür. Canlı kamera yalnızca bu türde çalışır. |
| İki yan çizgi | Sol ve sağ kenarda sıralı kısa siyah çizgiler (zamanlama işaretleri), köşe karesi yok | Dosya ve fotoğrafla okunur. Üst-alt kenarda olan çizgiler de bulunur. |
| Tek yan çizgi | Yalnızca bir kenarda çizgi sırası | **En iyi sonuç tarayıcıda.** Fotoğrafta form düz ve dik açıyla çekilmeli; aksi hâlde satır kayması riski olduğu için form **reddedilir** (yanlış okumaktansa). |

Ek olarak:
- **Ad ve soyad harf ızgaraları** (her sütun bir harf konumu): "Ad" ve "Soyad" blokları olarak tanınır. Alfabe sırası formdakinden farklıysa blokta düzeltebilirsiniz (boşsa Türkçe alfabe, 26 harfliyse İngilizce alfabe varsayılır).
- **Pembe, mor, mavi vb. açık renkli baskı** (yayınevi formları): görüntü, mürekkep rengine göre otomatik gri tona çevrilir; elle ayar gerekmez. Çok silik baskı + ağır JPG sıkıştırması okunamayabilir; tarayıcıda renkli ya da gri tonlama, en az 200 dpi kullanın.

## Okutulunca ne aktarılır?
Şablonda varsa formdan şunlar okunur ve okutma ekranında gösterilir:
- **Kurum kodu → okul** (okutma ekranında "Formdaki kurum kodundan otomatik" seçeneği),
- **Öğrenci numarası**, **ad ve soyad**, kitapçık türü, cevaplar.

Öğrenci okul listesinde yoksa kartta *"Öğrenci listede yok (formdaki ad-soyad: …)"* yazar ve **"Formdaki öğrencileri listeye ekle"** düğmesi çıkar: okul, numara ve ad-soyad formdan alınarak öğrenci listesine yazılır (sınıf boş kalır; Yönetim → Öğrenciler'den doldurabilirsiniz). Bu düğme yalnızca okul yöneticisi ve üstü içindir; öğretmen hesabı öğrenci listesini değiştiremez.

**Güvenlik denetimleri** (hepsi "kontrol gerekli" olarak işaretlenir, kendiliğinden onaylanmaz):
- formdaki ad-soyad, listedeki öğrencinin adıyla uyuşmuyorsa → "numara yanlış işaretlenmiş olabilir";
- yan çizgili formda çizgi sayısı şablondakinden farklıysa ya da şablonla örtüşme düşükse (tek çizgide %90, iki çizgide %70 altı) → satır kayması uyarısı;
- tek yan çizgili formda satır işaretleri şablonla yeterince eşleşmezse form okunmaz, nedeni yazılır.

## Koşullar ve sınırlar
- Form tamamen görünmeli, düz ve gölgesiz olmalı. Tarama için en az 200 dpi.
- Şablon **boş** formdan çıkarılır; kayıttan sonra aynı formun işaretli kopyasıyla "İşaretli bir formla dene" yapıp cevapları kâğıtla karşılaştırın (özellikle yan çizgili ve renkli formlarda).
- Köşe karesi de yan çizgi de olmayan formlar için "Elle tanımla" sekmesi kullanılır.
- Bu özellikler yapay (sentetik) örnek formlarla ve çok sayıda deneme varyantıyla (dönük, perspektifli, gürültülü, JPG, pembe/mor/silik) sınandı. **Gerçek yayınevi formlarını** ilk kullanımda mutlaka işaretli bir örnekle deneyin; tutmayan bir form görürseniz örneğini gönderin.

## Yapay zekâ adımı (isteğe bağlı)
Anahtar yoksa yalnızca "Yapay zekâ ile ders adı ve harfleri öner" düğmesi görünmez. Desteklenen sağlayıcılar: **Anthropic (Claude), Google (Gemini), OpenAI** ve OpenAI uyumlu herhangi bir hizmet (örn. OpenRouter, Groq).

**Kurulum (yönetici):** uygulamada **Yönetim → Yapay zekâ** sekmesi. Anahtarı yapıştırıp Kaydet deyin; anahtar yalnızca sunucuda (Apps Script **Betik özellikleri**) saklanır, bir daha ekranda gösterilmez (sadece son 4 hane). **Dene** düğmesi anahtarı ve seçilen modeli sınar.
Aynı ayarlar elle de yazılabilir (Proje ayarları → Betik özellikleri): `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` (veya `GOOGLE_API_KEY`), `OPENAI_API_KEY`, uyumlu hizmet için `COMPAT_API_KEY` + `COMPAT_BASE_URL` + `COMPAT_MODEL` (+ `COMPAT_NAME`). Öncelik: `AI_PROVIDER` = `auto` | `anthropic` | `gemini` | `openai` | `compat`; seviye: `AI_TIER` = `auto` | `fast` | `balanced` | `best`.

**Modeller kendiliğinden güncel kalır:** model alanı boş bırakılırsa sunucu, sağlayıcının model listesini (6 saatlik önbellekle) çeker ve seçilen seviyenin **en yeni** sürümünü kullanır:
- **Hızlı** (en ucuz/en az bekleme) · **Dengeli** · **En yetenekli** (en yavaş).
- Belirli bir modele kilitlemek isterseniz model adını yazın (`*_MODEL`).
- Liste alınamazsa yerleşik varsayılanlara düşer. Bir model/sağlayıcı yanıt vermezse (en çok 4 deneme) sıradakine, sonra öteki sağlayıcıya geçilir; ekranda hangi modelin kullanıldığı ve kaç deneme başarısız olduğu yazar.
- Kullanıcılar, otomatik tanıt ekranında sağlayıcıyı ve hız/yetenek düzeyini kendileri de seçebilir; seçmezlerse yönetici ayarı kullanılır.

Sınırlar: kullanıcı başına saatte 40, toplamda günde 1000 analiz (`Code.gs` başındaki `AI_USER_PER_HOUR`, `AI_ALL_PER_DAY`).
**Dış bağlantı izni (bir kez):** *"Belirtilen izinler UrlFetchApp.fetch … script.external_request"* hatası, Apps Script'in dış bağlantı iznini henüz almadığı anlamına gelir (kod hatası değil). Çözüm:
1. Apps Script → **Proje ayarları** → "appsscript.json bildirim dosyasını düzenleyicide göster"i işaretleyin; açılan `appsscript.json` içindeki `oauthScopes` listesinde `https://www.googleapis.com/auth/script.external_request` bulunsun (paketteki dosyayı yapıştırın).
2. Düzenleyicide işlev listesinden **`izinleriVer`**'i seçip **Çalıştır** deyin; çıkan pencerede hesabınızı seçip **İzin ver** (gelişmiş → güvenli olmayan sayfaya git, kendi betiğiniz).
3. **Dağıt → Dağıtımları yönet → kalem → Sürüm: Yeni sürüm → Dağıt.** Sonra yapay zekâ ekranında tekrar deneyin.
Bu izin verilmeden de uygulama yapay zekâsız çalışır.

Not (gizlilik): yapay zekâ adımında yalnızca **boş** form görüntüsü (üzerine blok kimlikleri çizilmiş) sağlayıcıya gönderilir; öğrenci verisi gönderilmez.

## Okul ve öğrenci yönetimi
- **Yönetim → Okullar**: "+ Okul ekle", satırda Düzenle / Sil (yönetici, il, ilçe yetkilisi; yetki alanı sunucuda denetlenir). Aktif kullanıcısı olan okul silinemez; silinen okulun öğrenci listesi de silinir, eski sonuçlar kalır.
- **Yönetim → Öğrenciler**: okul seçin → "+ Öğrenci ekle", Düzenle, Sil, kutulardan çoklu seçip "Seçilenleri sil", arama ve sınıf süzgeci.
- **Formlar → Form tasarla ve yazdır**: okulu seçin, öğrencileri işaretleyin → **yalnızca işaretlenenlerin** kişiye özel formu basılır.

## Veli telefonları ve WhatsApp mesajı
Anne/baba telefonu, kişiye özel sonuç mesajı ve Chrome eklentisi için bkz. **VELI-WHATSAPP.md**.

## Güncelleme sonrası
Kodu GitHub Pages'e yükledikten sonra tarayıcıda bir kez yenileyin (servis çalışanı sürümü `optik-v10`). `Code.gs` ve `appsscript.json`'u Apps Script'e yapıştırıp **yeni sürüm dağıtın**. Mevcut kayıtlı şablonlar aynen çalışmaya devam eder.
