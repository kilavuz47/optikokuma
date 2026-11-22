# Harici optik formu otomatik tanıma — kurulum ve kullanım

## Ne yapar?
Piyasadaki herhangi bir optik formun (LGS/YKS denemesi, yayınevi ve okul denemeleri) **boş bir örneğini** yüklersiniz (bilgisayarda dosya/PDF, telefonda "Fotoğraf çek").
Sistem formu düzeltir, bütün baloncukları **milimetrik** bulur ve blokları tanır: sorular, öğrenci numarası, kurum kodu, kitapçık türü, **ad ve soyad harf ızgaraları**.
**Formlar → Harici formu otomatik tanıt** ekranında sonucu görür, gerekirse düzeltir ve **Onayla ve kaydet** dersiniz; form kayıtlı şablon olur.
Sınav oluştururken bu şablonu seçince dersler/soru sayısı şablondan gelir ("Dersleri bu formdan al"). Okutma (toplu dosya, PDF, telefon fotoğrafı) şablonla otomatik eşleşir; sayfa 90°/180° dönük de olsa yön kendiliğinden bulunur.

> Baloncukların **kesin konumu her zaman görüntü işlemeyle** bulunur (deterministik, her seferinde aynı sonuç). **Yapay zekâ** isteğe bağlı olarak formun **tamamını** önerir: bölümlerin yerini, satır/sütun sayılarını, ad-soyad ızgaralarını, ders adlarını, harfleri, soru sırasını. Yapay zekâ kutuyu ve sayıları söyler, uygulama onları gerçek baloncuklara oturtur; sonuç sıradan bloklardır ve bütün **elle düzenleme araçları** onlarda da çalışır. Anahtarsız da (kendi sohbet uygulamanızla) ve yapay zekâsız da her şey çalışır.

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

## Tanınan bölümlere elle müdahale (düzenleyici)
Otomatik tanıma yanlış ya da eksik bir şey bulursa her bölümü kendiniz düzeltebilirsiniz. Tuvalde bir çerçeveye (ya da sağdaki listeden bir bloğa) tıklayınca o blok seçilir: baloncuk daireleri, **okunacak harfler/rakamlar** (A B C D…, 0–9, alfabe) ve **soru numaraları** çerçevenin içinde görünür; gerçek baloncuğa denk gelmeyen daireler kırmızıdır. Hiçbir bloğa girmeyen baloncuklar turuncu kesikli halkayla gösterilir (kaçırılan bölümü bulmak için).

| Yapmak istediğiniz | Nasıl |
|---|---|
| Çerçeveyi taşımak | Çerçevenin içinden sürükleyin · ok tuşları · ▲◀▶▼ düğmeleri |
| **Milim milim** ayar | "Adım" seçin: 0,5 / 1 / 2 / 5 / 10 / 25 piksel. Ok tuşları adım kadar; **Shift** ×5, **Alt** ×0,5 |
| Çerçeveyi büyütmek/küçültmek | Kenar ve köşe kutucuklarından çekin · ya da Sol/Sağ/Üst/Alt için **− daralt / + genişlet** (karşı kenar sabit kalır, aradaki satır-sütunlar eşit dağılır) |
| Soru/şık sayısı | Kenar için **± satır/sütun** · ya da "Soru sayısı" ve "Şık sayısı" kutularına yazın · **Shift + kenar sürükleme** satır/sütun ekler-çıkarır |
| Gerçek baloncuklara hizalamak | **Baloncuklara oturt** (önce en iyi örtüşen kaymayı bulur, sonra her sütun/satırı baloncuklara çeker) · "Sürüklerken bırakınca oturt" kutusu · **Dikdörtgeni yeniden say** (içindeki baloncuklardan satır/sütun sayısını yeniden bulur) |
| Üst üste/yan yana tek görünen iki bölümü **ayırmak** | **Böl…** (önerilen nokta kafesteki en geniş boşluktur) · ya da **Yatay böl / Dikey böl** aracını seçip tuvalde iki satır/sütun arasına tıklayın |
| İki parçayı **birleştirmek** | **Birleştir…**: alt alta için sütunlar, yan yana için satırlar aynı hizada olmalı |
| Bulunamayan bölümü **eklemek** | **＋ Bölüm ekle** → tuvalde bölümün çevresine dikdörtgen çizin; içinde baloncuk bulunursa ızgara onlardan kurulur, bulunmazsa (silik baskı) satır × sütun sayısını yazarsınız |
| Türünü seçmek | Listede bloğun türü: soru, öğrenci no, kurum kodu, kitapçık, ad, soyad, yok say. **Okuma yönü**: "her satır bir soru" ya da "her sütun bir soru"; rakam/harf alanlarında da yön seçilir. Ad ve soyad bazen tek satır, bazen ayrı satır olur: yan yana tek blok olarak görünürse **Böl**, ayrı görünürse tek blok yapmak için **Birleştir** |
| Ders adı, şık harfleri, alfabe | Listedeki kutulara yazın (boş alfabe = Türkçe alfabe) |
| Soru sırası | Varsayılan: soldan sağa sütunlar, her sütunda yukarıdan aşağı. **▲ Sıra / ▼ Sıra** ile elle değiştirilir ("Okuma sırasına dön" ile sıfırlanır) |
| Hatayı geri almak | **↶ Geri al / ↷ Yinele** (Ctrl+Z / Ctrl+Y); ardışık küçük kaydırmalar tek adımda birleşir · **Del** seçili bloğu siler (geri alınabilir) |
| Büyütüp bakmak | **Yakınlaştır** (×2…×6) · **Bloğa git** seçili bloğu büyütüp ortalar |

Elle düzeltilen bloklar listede "✎ elle" etiketi taşır. Özet bölümü; üst üste binen blokları, aynı türden fazladan blokları ve gerçek baloncuklara pek denk gelmeyen ızgaraları uyarı olarak gösterir. Kaydettiğiniz şablonun `meta.edited` alanı elle düzenlendiğini işaretler. Düzenledikten sonra **"İşaretli bir formla dene"** ile cevapları kâğıtla karşılaştırmanız önerilir. Çerçeve türünü değiştirmek ya da yeni form yüklemek bloklardaki düzeltmeleri sıfırlar.

Dokunmatik ekranda: çerçevenin üstünde parmakla sürükleme blok taşır (boşlukta sayfa kayar); milimetrik ayar için düğmeler daha rahattır.

## Formdaki soru sayısı ≠ sınavdaki soru sayısı (ders bazlı eşleme)
Yayınevi formlarında her ders genelde aynı sayıda satır taşır (örn. 3 blok × 20 satır); sınavınız ise farklı olabilir (Türkçe 10, Din 5, Matematik 21…). Sistem bunu **birebir tutmasa da** okur:
- **Sınavlar → Cevap anahtarı** artık **ders ders** girilir: her dersin kendi adıyla bir kutusu vardır (örn. `ABCDABCDAB`); "1..N" diye tek dizi yazılmaz. İptal soru için `*`, tanımsız için `.` kullanılır.
- Form şablonu seçilince **"Formla eşleme"** tablosu çıkar: her sınav dersi formdaki bir bloğa ve o bloğun bir **başlangıç satırına** yerleşir. Varsayılan otomatiktir (dersler sırayla bloklara, bloğun ilk satırından); gerekirse bloğu ve başlangıç satırını elle seçersiniz ("Hepsini otomatiğe çevir" ile sıfırlanır).
- Bloktaki **kullanılmayan satırlar okunmaz** (örn. formda 20 satır, sınavda 10 soru → ilk 10 satır). Sınav derslerinin sığmadığı bir eşleme kaydedilemez; nedeni yazılır.
- Okutmada öğrenci cevapları **dersine göre** ayrılır ve puanlanır (ders D/Y/B/net, sıralama, karne). Okutma ekranı "formdaki 35 satır yok sayılır" gibi bir bilgi satırı gösterir.
- Eşleme sınav kaydında saklanır (`formMap`); eşleme tanımsızsa eski davranış (birebir) aynen sürer.

## Kodlanmış (kişiye özel) baskı
Tanıtılan harici formun **üzerine**, öğrenciye ait bilgilerin **dolu baloncuk** olarak basılması: Formlar → kayıtlı formun yanındaki **Kodlu baskı**.
1. Öğrencileri seçin (okul/sınıf süzgeci, ara, "Görünenleri seç"); doldurulacak alanları seçin: **öğrenci no, kurum kodu, ad–soyad, kitapçık**. Formda ad ve soyad **ayrı bloklarsa** ayrı, **tek blokta** ise art arda (ad, boşluk, soyad) kodlanır; sığmayan ad kısaltılır ve uyarılır. Sayı alanlarında sola ya da sağa hizalama seçilir.
2. **Kâğıt** (A4/A3/Letter/özel) ve **tarama çözünürlüğü** (dpi): boş form sayfanın tamamı taranmışsa `0` (kâğıda göre ölçeklenir); kırpılmış taramada gerçek dpi'yi yazın.
3. **Hizalama sayfası** ile deneyin: düz kâğıda %100 ölçekle basıp gerçek formun üstüne koyun, ışığa tutun — kırmızı halkalar form baloncuklarının üstüne gelmeli. Kayma varsa **sağa/aşağı kaydır (mm)** ve **yatay/dikey ölçek (%)** girin, yeniden deneyin; tutunca **Ayarı şablona kaydet** (sonraki baskılarda hazır gelir).
4. **Seçilenler için yazdır**: her öğrenci ayrı sayfa; yalnızca seçili alanların baloncukları basılır (sorular ve yazılar basılmaz). Önizleme kırmızı konumları ve siyah dolu baloncukları gösterir; **Doğrulama**: üretilen baloncuklar motor tarafından geri okunarak sınanmıştır (numara, kurum kodu, ad-soyad).
- Yalnızca otomatik tanıtılan (harici) formlarda vardır; hazır katalog formlarında kişiye özel form zaten "Form tasarla ve yazdır"dadır.
- Yazıcı ölçeği: yazdırırken tarayıcıda **ölçek %100 / "Gerçek boyut"**, kenar boşluğu **yok** seçin; üstte-altta yazıcı kenar payı olan makinelerde dikey kaydırma ile telafi edin.

## Yapay zekâ ile TAM tanıma (konum + sayılar + ad/harf)
İki yol vardır; ikisi de aynı JSON şemasını (`optinet-layout/1`) ve aynı birleştirme kurallarını kullanır.

**1) Dışarıdaki bir sohbet yapay zekâsı (anahtar gerekmez).** *Formlar ▸ Otomatik tanıt ▸ API'siz yapay zekâ (sohbet uygulamasıyla)*:
1. Pencerede **"Tam tanıma"** seçili gelir. Uygulama formu **cetvelli** (kenarlarda 0–1000 ölçeği, her 100'de mavi kesikli ızgara) ve algılanan bloklar b1, b2… numaralı olarak hazırlar; **hazır istemi** de üretir (algılanan bloklar kutu koordinatları ve satır×sütun sayılarıyla istemin içindedir).
2. Görüntüyü indirip/kopyalayıp sohbet uygulamasına yükleyin, istemi yapıştırın.
3. Uygulama yanıtı **yapıştırarak** ya da **dosya olarak (.json / .txt) yükleyerek** alır. Dosya yüklenince hemen uygulanır. Kod çiti, açıklama, akıllı tırnak, sondaki virgül gibi küçük bozukluklar tolere edilir; yanıt yarıda kesilmişse ya da JSON yoksa açık bir hata verilir ve pencere açık kalır. (Word/PDF dosyası okunamaz; yanıtı metin olarak yapıştırın.)
4. Yapay zekânın kutuları tuvalde **mor kesikli** çizilir, otomatik tanıma **renkli çerçevelerle** kalır: ikisi yan yana görünür ("Yapay zekânın kutularını göster" ile kapatılabilir).

**2) Uygulamanın kendi yapay zekâsı** (yönetici anahtar tanımlamışsa): **Yapay zekâ ile tam tanıma** düğmesi aynı işi tek tıkla yapar (aynı cetvelli görüntü + blok listesi sunucuya gider, yanıt aynı şekilde uygulanır). Eski **"Yalnızca ders adı ve harfleri öner"** düğmesi hızlı/ucuz seçenek olarak durur. *(Bu düğme için `Code.gs`'in yeni sürümünü Apps Script'e yapıştırıp yeni sürüm dağıtmak gerekir; sohbet uygulamasıyla çalışan yol Code.gs'e bağlı değildir.)*

**Yapay zekâ ne verir?** Her blok için: kutu, satır/sütun sayısı, yön (her satır mı her sütun mu bir soru/hane), tür, ders adı, şık harfleri (ad/soyad ızgaralarında alfabe), başlangıç soru numarası; eksik bloklar için "ekle", yanlış bulunanlar için "yok say" önerisi.

**Uygulama bunu nasıl birleştirir?**
- **Konumu yapay zekâ değil görüntü belirler.** Kutu yaklaşık yeterlidir (±%1,5 sapma sorun olmaz): uygulama kutunun içindeki **gerçek baloncuklardan** ızgarayı kurar ve satır/sütun sayısını yapay zekânın sayısıyla karşılaştırır. Baloncukları algılanmamış (silik baskı) bir bölge ise yapay zekânın sayılarıyla ızgara kurulur ve gerçek baloncuklara oturtulur; oturma zayıfsa bloğun üstünde uyarı çıkar.
- **Sayılar uyuşmazsa** (ör. yapay zekâ 21 satır dedi, görüntüde 20 var) görüntü esas alınır, yapay zekânın değeri bloğun üstünde **"Yapay zekâ önerisini uygula (21×4…)"** düğmesiyle bekler; önerilen yerleşim tuvalde mor noktalı çizgiyle görünür.
- Otomatik tanımanın **kaçırdığı bölümler** yapay zekâ "ekle" derse eklenir. Yapay zekâ listesinde olmayan algılanmış bloklar **silinmez**, "yapay zekâ bu bloğu listesine almadı (yanlış tespit olabilir)" notuyla işaretlenir; "yok say" önerilen bloklar silinmez, *Yok say* türüne alınır.
- **Soru sırası:** bütün soru bloklarına *farklı* başlangıç numarası verildiyse sıra buna göre kurulur (her ders 1'den başlıyorsa okuma sırası aynen kalır).
- Elle dokunduğunuz hiçbir şeyin üstüne yazılmaz: **kilitli tür/ders adı/harf, elle taşıdığınız/boyutlandırdığınız ya da satır-sütun eklediğiniz bloklar** korunur; yapay zekâ farklı düşünüyorsa blok kartında "elle ayarınız korundu" notu ve (konumsa) öneri düğmesi görünür.
- Bütün uygulama **tek bir geri alma adımıdır**: **Önerileri geri al** düğmesi ya da Geri al. Yapay zekâdan sonra elle düzenleme yaptıysanız düğme bunu da geri alacağını sorar.
- Yapay zekânın çizdiği ya da düzelttiği bloklar sıradan bloklardır: taşıma/boyutlandırma/ok düğmeleri, satır-sütun ekle/çıkar, böl/birleştir, **Bölüm ekle** ve sil aynen çalışır.

Sınır: yapay zekâ kutuları ±%2'den fazla saparsa (özellikle sayı vermezse) otomatik oturma zayıflar; bu durumda blok kartındaki öneri/uyarıya bakıp elle düzeltin. Gerçek formlarla ilk denemede sonucu mutlaka tuvalde gözle kontrol edin ve işaretli bir formla deneyin.

## Yapay zekâ ve elle düzenleme birlikte
İkisi aynı bloklar üzerinde, birbirini bozmadan çalışır:
- Elle yaptığınız her ayar (blok türü, ders adı, şık harfleri, alfabe…) **kilitlenir**; yapay zekâ sonradan farklı bir öneri getirse bile onu **ezmez**. Bildirimde "Elle yaptığınız N ayar korundu" yazar, blok kartında "elle ayarınız korundu: ders adı" notu görünür.
- Elle dokunmadığınız alanlara yapay zekâ önerisi uygulanır; bir alanı **boşaltırsanız** yapay zekâ onu yeniden önerebilir.
- **Önerileri geri al:** yalnızca ad/harf önerisinde (eski akış) yapay zekânın son uygulamasını geri alır, elle ayarlar kalır. Tam tanımada tek geri alma adımıdır (yapay zekâdan sonraki elle düzenlemeleri de geri alacaksa önce sorar). Yapay zekâ önerisinden sonra geometriyi (taşıma, satır/sütun) elle düzeltmeye de devam edebilirsiniz.

## Koşullar ve sınırlar
- Form tamamen görünmeli, düz ve gölgesiz olmalı. Tarama için en az 200 dpi.
- Şablon **boş** formdan çıkarılır; kayıttan sonra aynı formun işaretli kopyasıyla "İşaretli bir formla dene" yapıp cevapları kâğıtla karşılaştırın (özellikle yan çizgili ve renkli formlarda).
- Köşe karesi de yan çizgi de olmayan formlar için "Elle tanımla" sekmesi kullanılır.
- Bu özellikler yapay (sentetik) örnek formlarla ve çok sayıda deneme varyantıyla (dönük, perspektifli, gürültülü, JPG, pembe/mor/silik) sınandı. **Gerçek yayınevi formlarını** ilk kullanımda mutlaka işaretli bir örnekle deneyin; tutmayan bir form görürseniz örneğini gönderin.

## Yapay zekâ adımı (isteğe bağlı)
Anahtar yoksa **"Yapay zekâ ile tam tanıma"** ve "Yalnızca ders adı ve harfleri öner" düğmeleri görünmez; yine de **"API'siz yapay zekâ"** düğmesiyle ücretsiz bir sohbet uygulamasından yardım alabilirsiniz. Ücretsiz seçeneklerin hepsi için bkz. **UCRETSIZ-YAPAY-ZEKA.md**. Desteklenen sağlayıcılar: **Anthropic (Claude), Google (Gemini), OpenAI** ve OpenAI uyumlu herhangi bir hizmet (örn. OpenRouter, Groq).

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

Not (gizlilik): yapay zekâ adımında yalnızca **boş** form görüntüsü (üzerine blok kimlikleri ve cetvel çizilmiş) ve blok listesi sağlayıcıya gönderilir; öğrenci verisi gönderilmez.

## Okul ve öğrenci yönetimi
- **Yönetim → Okullar**: "+ Okul ekle", satırda Düzenle / Sil (yönetici, il, ilçe yetkilisi; yetki alanı sunucuda denetlenir). Aktif kullanıcısı olan okul silinemez; silinen okulun öğrenci listesi de silinir, eski sonuçlar kalır.
- **Yönetim → Öğrenciler**: okul seçin → "+ Öğrenci ekle", Düzenle, Sil, kutulardan çoklu seçip "Seçilenleri sil", arama ve sınıf süzgeci.
- **Formlar → Form tasarla ve yazdır**: okulu seçin, öğrencileri işaretleyin → **yalnızca işaretlenenlerin** kişiye özel formu basılır.

## Veli telefonları ve WhatsApp mesajı
Anne/baba telefonu, kişiye özel sonuç mesajı ve Chrome eklentisi için bkz. **VELI-WHATSAPP.md**.

## Güncelleme sonrası
Kodu GitHub Pages'e yükledikten sonra tarayıcıda bir kez yenileyin (servis çalışanı sürümü `optik-v14`). `Code.gs` ve `appsscript.json`'u Apps Script'e yapıştırıp **yeni sürüm dağıtın**. Mevcut kayıtlı şablonlar aynen çalışmaya devam eder.

## Sınav analizi
Dışarıdan alınan sınavları Excel/satır satır ekleme ve sistem sınavlarıyla birlikte analiz için bkz. **SINAV-ANALIZ.md**.
