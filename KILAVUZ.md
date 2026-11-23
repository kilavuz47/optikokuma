# Kullanım kılavuzu (uygulama içi) — geliştirici notu

OptiNet'in kullanım kılavuzu uygulamanın içindedir; ayrı bir site ya da PDF gerekmez.
Kılavuzu **kullanmak** için: soldaki menüde **Kılavuz**, üst çubuktaki **?** düğmesi (bulunduğunuz ekranın konusunu açar),
giriş ekranındaki "Kullanım kılavuzu" bağlantısı ya da girişsiz adres `…/#/kilavuz` (veli ve yeni üyeler için; `#/kilavuz/uye-okul` gibi konu adresleri de çalışır).

## Dosyalar

| Dosya | Görevi |
|---|---|
| `kilavuz.js` | Motor: kategori/konu listesi, arama (Türkçe harf duyarsız), rol süzgeci, "ekranı aç" düğmeleri, bağlamsal **?**, yazdır / PDF |
| `kilavuz-icerik.js` | İçerik 1: giriş, üyelik, veli arayüzü, okul hazırlığı, formlar, sınav tanımlama (`Guide.define`) |
| `kilavuz-icerik-2.js` | İçerik 2: okutma, dış sınav, sonuçlar, analiz, iletişim, yönetim, yardım (`Guide.add`) |
| `testler/test_guide_labels.js` | Tarayıcısız doğrulama: ekran adları kodda gerçekten var mı, bağlantılar doğru mu |
| `testler/test_guide_ui.js` | Tarayıcı testi: girişsiz kılavuz, rol süzgeci, arama, bağlam düğmesi, yazdırma |

`testler/` klasörü güncelleme paketinde gelir; yalnızca geliştirici içindir, siteye yüklenmez.

Yeni bir `.js` içerik dosyası eklerseniz `index.html` ve `sw.js` içindeki `SHELL` listesine yazın ve `VERSION`'u artırın
(dosya adı `kilavuz-icerik-3.js` biçiminde olursa etiket denetimi onu da otomatik bulur).

## Konu ekleme / düzeltme

Konu bir nesnedir:

```js
{ id: 'okut-ornek', cat: 'okutma', title: 'Başlık', aud: 'ogretmen', kw: 'eş anlamlı sözcükler',
  sum: 'Arama sonucunda ve listede görünen tek cümlelik özet.',
  go: { view: 'scan', label: 'Okutma ekranını aç' },
  see: ['kuyruk', 'okut-sorun'],
  body: [ ['p', '…'], ['steps', [['Başlık', 'ayrıntı'], …]], ['tip', '…'] ] }
```

- `aud`: `herkes` · `veli` · `ogretmen` · `okul` · `yetkili` · `admin`. Konu o role ve üstüne gösterilir; "Tümü" süzgeci hepsini açar.
- `go`: `{ view, tab?, newExam?, label? }` giriş yapmış kullanıcıyı ilgili ekrana götürür (rolünde o ekran yoksa düğme yerine not görünür).
  Girişsiz sayfalar için `{ href: '#/kayit', label }` kullanın.
- `body` blokları: `p`, `h`, `ul`, `steps`, `tip`, `warn`, `info`, `table`, `flow`.
- Satır içi işaretler: `**kalın**`, `[[Ekrandaki düğme/alan adı]]`, `` `kod` ``, `{{Menü → yol}}`, `((konu-id|bağlantı metni))`.
- Kategoriler ve hızlı başlangıç kartları `kilavuz-icerik.js` başındaki `Guide.define` içindedir.

**Kural:** Ekranda görünen bir adı `[[ ]]` içine yazıyorsanız o ad kodda **aynen** bulunmalıdır. Düğmeyi yeniden adlandırırsanız
kılavuz testi hata verir ve hangi konunun düzeltilmesi gerektiğini söyler.

## Testler

```
REPO=<optikokuma klasörü> node testler/test_guide_labels.js                 # saniyeler içinde, tarayıcı gerekmez
REPO=<optikokuma klasörü> CODE=<Code.gs> node testler/test_guide_ui.js     # Playwright gerekir
```

Etiket testi şunları denetler: kimliklerin benzersizliği, kategori/rol geçerliliği, tablo sütun sayıları, eşleşmeyen `** [[ {{ \``,
`[[…]]` adlarının kaynak kodda varlığı, `((konu|metin))`, `see`, hızlı kart, yol haritası ve bağlamsal **?** eşlemesindeki konu kimlikleri,
`go.view`/`go.tab` değerlerinin menüde ve sekmelerde bulunması.

## İçerik kaynakları (kod → kılavuz)

Kılavuz metinleri tahminle değil kodu okuyarak yazıldı; bir kural değişirse ilgili konu da değişmelidir:

| Konu | Kural nerede |
|---|---|
| Üyelik, onay, giriş kilidi | `Code.gs` (başvuru onayı: okul başvurusunu ilçe/il yetkilisi ya da sistem yöneticisi, öğretmeni okul yöneticisi onaylar; 8 yanlış girişte 10 dk kilit; veli sorgulamasında 1 saat) |
| Sınav yetkileri, kapsam | `Code.gs` + `exams.js` (kişisel sınavı yalnız sahibi okutur; okul sınavında öğretmen salt görüntüler; `genel` kapsamı yalnız yönetici) |
| Cevap anahtarı, puan yöntemleri | `exams.js`, `scoring.js` |
| Sonuç kaydı | `Code.gs` (`sınav|okulKodu|okulNo` anahtarıyla yeniden okutma eskisinin yerini alır) |
