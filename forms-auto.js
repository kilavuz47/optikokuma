/* forms-auto.js — HARİCİ optik formu kendiliğinden tanıma ekranı
 *
 * Akış: boş formu yükle (bilgisayar: dosya/PDF · telefon: fotoğraf çek) → omr-detect.js formu düzeltir (4 köşe karesi YA DA kenardaki çizgiler:
 * iki yan çizgi / tek yan çizgi), bütün baloncukları milimetrik bulur, blokları (satır × sütun) ve rollerini tahmin eder (soru, öğrenci no, kurum kodu,
 * kitapçık, ad / soyad harf ızgarası) → kullanıcı görür, düzeltir (rol, ders adı, şık harfleri, bölme, çerçeve türü)
 * → isteğe bağlı yapay zekâ (Claude / Gemini / OpenAI / uyumlu; seviye: hızlı → en yetenekli) ders adı / harf önerir (konum üretmez)
 * → işaretli bir formla dener → "Onayla ve kaydet".
 */
'use strict';

const AU = { an: null, img: null, name: '', file: '', sel: '', frame: 'auto', aiSnap: null, aiNotes: [], aiAvail: null, ai: null, aiPick: { provider: '', tier: '' }, aiUsed: null, saved: null, match: null, busy: '', err: '' };
const AU_COL = { questions: '#e11d48', studentNo: '#2563eb', schoolCode: '#0d9488', booklet: '#9333ea', name: '#d97706', surname: '#92400e', ignore: '#94a3b8' };
const AU_ROLES = [['questions', 'Soru bloğu'], ['studentNo', 'Öğrenci numarası'], ['schoolCode', 'Kurum kodu'], ['booklet', 'Kitapçık türü'], ['name', 'Ad (harf ızgarası)'], ['surname', 'Soyad (harf ızgarası)'], ['ignore', 'Yok say']];
const AU_SHORT = { questions: 'Soru', studentNo: 'No', schoolCode: 'Kurum', booklet: 'Kitapçık', name: 'Ad', surname: 'Soyad', ignore: 'Yok' };
/** Çerçeve (formun düzeltilmesini sağlayan işaretler) türleri: köşe karesi olmayan formlarda kenardaki kısa siyah çizgiler (zamanlama izi) kullanılır. */
const AU_FRAMES = [['auto', 'Otomatik (önerilir)'], ['corners', 'Dört köşe karesi'], ['sides', 'İki yan çizgi (sol ve sağ kenar)'], ['track', 'Tek yan çizgi (yalnızca bir kenar)']];
const AU_FRAME_TR = { corners: 'dört köşe karesi', sides: 'iki yan çizgi (sol+sağ)', track: 'tek yan çizgi' };
const AU_TIERS = [['', 'Yönetici ayarı'], ['fast', 'Hızlı'], ['balanced', 'Dengeli'], ['best', 'En yetenekli']];
const AU_NAMEROLE = r => r === 'name' || r === 'surname';

/** Rol değişince bloğun ekseni: rakam alanında rakam başına bir SÜTUN (10 satır) ya da bir SATIR (10 sütun); soru bloğunda satır = soru. */
function auAxis(b, role) {
  if (role === 'name' || role === 'surname') { const al = n => n >= 20 && n <= 40; return al(b.rows) && !al(b.cols) ? 'col' : al(b.cols) && !al(b.rows) ? 'row' : b.rows >= b.cols ? 'col' : 'row'; }   // alfabe boyutu = harf sayısı; öbür boyut = harf konumu
  if (role === 'studentNo' || role === 'schoolCode') return b.rows === 10 ? 'col' : b.cols === 10 ? 'row' : 'col';
  if (role === 'booklet') return b.rows === 1 ? 'row' : 'col';
  return 'row';
}
const auQn = b => b.axis === 'row' ? b.rows : b.cols, auK = b => b.axis === 'row' ? b.cols : b.rows;

function auAnalyze(img, frame) {
  if (!window.OMRDetect) throw new Error('Tanıma modülü yüklenemedi (omr-detect.js). Sayfayı yenileyin.');
  return OMRDetect.analyze(img, { frame: frame || 'auto' });
}
/** Türkçe büyük harf ve yalnızca harf: ad/soyad ızgarası harfleri */
const auAlpha = s => String(s || '').toLocaleUpperCase('tr').replace(/[^A-ZÇĞİÖŞÜ]/g, '');

function autoTab(pane, redraw) {
  const S = App.state, root = h('div'); pane.append(root);
  let cv = null, base = null; const rows = new Map();

  const pickIn = h('input', { type: 'file', accept: 'image/*,application/pdf,.pdf', class: 'hidden', id: 'au-file', onchange: e => { const f = e.target.files[0]; e.target.value = ''; if (f) load(f); } });
  const camIn = h('input', { type: 'file', accept: 'image/*', capture: 'environment', class: 'hidden', id: 'au-cam', onchange: e => { const f = e.target.files[0]; e.target.value = ''; if (f) load(f); } });
  const testIn = h('input', { type: 'file', accept: 'image/*,application/pdf,.pdf', class: 'hidden', id: 'au-test', onchange: e => { const f = e.target.files[0]; e.target.value = ''; if (f) tryRead(f); } });

  async function loadAi(force) {
    try { const st = await api('aiStatus', force ? { refresh: true } : {}, { noAuthRedirect: true }); AU.ai = st; AU.aiAvail = !!st.available; } catch (e) { AU.ai = null; AU.aiAvail = false; }
  }
  /** Çerçeve türünü elle seçip aynı görüntüyü yeniden çözümler (bloklara yapılan düzeltmeler sıfırlanır). */
  async function reframe(kind) {
    if (!AU.img) return; AU.frame = kind; AU.busy = 'Çerçeve türüne göre yeniden çözümleniyor…'; AU.saved = null; AU.match = null; AU.aiSnap = null; AU.aiNotes = []; AU.aiUsed = null; draw();
    try {
      await new Promise(r => setTimeout(r, 30));
      const an = auAnalyze(AU.img, kind);
      if (!an.ok) { AU.an = null; AU.err = an.error || 'Form çözümlenemedi.'; } else { AU.err = ''; AU.an = an; AU.sel = ''; }
    } catch (e) { AU.an = null; AU.err = e.message; }
    AU.busy = ''; draw();
  }
  async function load(f) {
    AU.busy = 'Form çözümleniyor…'; AU.saved = null; AU.match = null; AU.aiSnap = null; AU.aiNotes = []; AU.aiUsed = null; AU.frame = 'auto'; AU.img = null; AU.err = ''; draw();
    try {
      await new Promise(r => setTimeout(r, 30));
      const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name || ''), img = await loadGray(isPdf ? (await pdfSources(f))[0] : f);
      AU.img = img; AU.file = f.name || 'form'; AU.name = AU.name || String(f.name || '').replace(/\.[^.]+$/, '').slice(0, 60);
      await new Promise(r => setTimeout(r, 10));
      const an = auAnalyze(img, 'auto');
      if (!an.ok) { AU.an = null; AU.busy = ''; AU.err = an.error || 'Form çözümlenemedi.'; draw(); return; }
      AU.err = ''; AU.an = an; AU.sel = '';
      // aynı form daha önce tanıtılmış mı?
      const known = S.templates.filter(t => t.json && t.json.auto && t.json.anchors && t.json.groups);
      if (known.length) { try { const r = OMRDetect.identify(img, known.map(t => t.json)); if (r.ok && r.best && r.best.score >= 0.6 && r.confident) AU.match = { name: known[r.best.index].name, score: r.best.score, id: known[r.best.index].templateId }; } catch (e) { } }
    } catch (e) { AU.an = null; AU.err = e.message; }
    AU.busy = ''; draw();
    if (AU.an && AU.aiAvail === null) { await loadAi(false); draw(); }
  }

  /* ---------------------------------------------------------------- tuval */
  function overlay(ctx, an, scale, opt) {
    opt = opt || {};
    const bw = an.bsz.w, bh = an.bsz.h;
    an.blocks.forEach(b => {
      const x0 = (b.x0 - bw / 2 - 3) * scale, y0 = (b.y0 - bh / 2 - 3) * scale, x1 = (b.x1 + bw / 2 + 3) * scale, y1 = (b.y1 + bh / 2 + 3) * scale, col = AU_COL[b.role] || '#888', on = b.id === AU.sel;
      ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = (on ? 4 : 2.2) * Math.max(1, scale * 1.4); if (b.role === 'ignore') ctx.setLineDash([8, 6]);
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      if (on && !opt.noDots) { ctx.lineWidth = 1.4; b.ys.forEach(y => b.xs.forEach(x => { ctx.beginPath(); ctx.ellipse(x * scale, y * scale, bw / 2 * scale, bh / 2 * scale, 0, 0, 7); ctx.stroke(); })); }
      ctx.restore();
      const label = `${b.id} ${AU_SHORT[b.role]}${b.name ? ' · ' + b.name : ''}`, fs = Math.max(11, Math.round(15 * Math.max(1, scale * 1.3)));
      ctx.font = `600 ${fs}px sans-serif`; const tw = ctx.measureText(label).width + 10, ty = opt.below ? y1 + 1 : Math.max(0, y0 - fs - 4);
      ctx.fillStyle = col; ctx.fillRect(x0, ty, tw, fs + 4); ctx.fillStyle = '#fff'; ctx.textBaseline = 'top'; ctx.fillText(label, x0 + 5, ty + 2);
    });
  }
  function paint() {
    if (!cv || !AU.an) return; const an = AU.an, r = an.rectified;
    if (!base || base.w !== r.w || base.src !== r.gray) { const c = document.createElement('canvas'); c.width = r.w; c.height = r.h; const x = c.getContext('2d'), id = x.createImageData(r.w, r.h), d = id.data, g = r.gray; for (let i = 0, j = 0; i < g.length; i++, j += 4) { d[j] = d[j + 1] = d[j + 2] = g[i]; d[j + 3] = 255; } x.putImageData(id, 0, 0); base = { c, w: r.w, src: r.gray }; }
    cv.width = r.w; cv.height = r.h; const cx = cv.getContext('2d'); cx.drawImage(base.c, 0, 0); overlay(cx, an, 1);
  }
  /** Yapay zekâya gidecek görüntü: düzeltilmiş form + blok kimlikleri (uzun kenar ≤ 1568 px) */
  function overlayJpeg() {
    const an = AU.an, r = an.rectified, sc = Math.min(1, 1568 / Math.max(r.w, r.h)), c = document.createElement('canvas'); c.width = Math.round(r.w * sc); c.height = Math.round(r.h * sc);
    const x = c.getContext('2d'); if (!base) paint(); x.drawImage(base.c, 0, 0, c.width, c.height); const keep = AU.sel; AU.sel = ''; overlay(x, an, sc, { noDots: true, below: true }); AU.sel = keep;
    return c.toDataURL('image/jpeg', 0.82).split(',')[1];
  }
  function onCanvasClick(e) {
    const an = AU.an; if (!an) return; const b = cv.getBoundingClientRect(), x = (e.clientX - b.left) * (cv.width / b.width), y = (e.clientY - b.top) * (cv.height / b.height), bw = an.bsz.w, bh = an.bsz.h;
    const hit = an.blocks.filter(k => x >= k.x0 - bw / 2 - 3 && x <= k.x1 + bw / 2 + 3 && y >= k.y0 - bh / 2 - 3 && y <= k.y1 + bh / 2 + 3).sort((p, q) => (p.rows * p.cols) - (q.rows * q.cols))[0];
    select(hit ? hit.id : '', true);
  }
  function select(id, scroll) {
    AU.sel = id; paint(); rows.forEach((el, k) => el.classList.toggle('sel', k === id));
    if (scroll && id && rows.get(id)) rows.get(id).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* ---------------------------------------------------------------- blok işlemleri */
  const renumber = () => AU.an.blocks.forEach((b, i) => { b.id = 'b' + (i + 1); });
  function splitDlg(b) {
    const n = h('input', { type: 'number', min: 1, max: b.rows - 1, value: Math.floor(b.rows / 2), id: 'au-split-n', style: { width: '90px' } });
    modal('Bloğu böl', h('div', null, h('p', null, `${b.id}: ${b.rows} satır × ${b.cols} sütun. Kaçıncı satırdan SONRA bölünsün? (İki ayrı ders aynı sütunda alt alta duruyorsa.)`), h('div', { class: 'row' }, h('label', null, 'Satır:'), n)), { buttons: [{ label: 'Vazgeç' }, { label: 'Böl', cls: 'primary', fn: () => {
      const k = parseInt(n.value); if (!(k >= 1 && k < b.rows)) { toast(`1 ile ${b.rows - 1} arası bir sayı girin`, 'bad'); return false; }
      if (!OMRDetect.splitBlock(AU.an.blocks, b.id, k)) { toast('Bu blok bölünemedi.', 'bad'); return false; }
      renumber(); AU.sel = ''; draw();
    } }] });
  }
  function problems() {
    const an = AU.an, used = an.blocks.filter(b => b.role !== 'ignore'), out = [];
    ['studentNo', 'schoolCode', 'booklet', 'name', 'surname'].forEach(r => { const n = used.filter(b => b.role === r).length; if (n > 1) out.push(`${n} blok "${AU_ROLES.find(x => x[0] === r)[1]}" seçilmiş; yalnızca ilki kullanılır. Fazlasını "Yok say" yapın.`); });
    if (!used.some(b => b.role === 'questions')) out.push('Soru bloğu yok.');
    if (used.some(b => b.role === 'surname') && !used.some(b => b.role === 'name')) out.push('Soyad ızgarası var ama ad ızgarası seçilmemiş; ad-soyad yan yana okunsun diye ilgili bloğu "Ad" olarak işaretleyin.');
    if (!used.some(b => b.role === 'studentNo')) out.push('Öğrenci numarası alanı seçilmemiş: okutulan formda öğrenci no okunmaz (numarayı elle girmeniz gerekir).');
    return out;
  }
  const letters = (b, k) => { const s = String(b.labels || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); return s.slice(0, k); };

  /* ---------------------------------------------------------------- yapay zekâ */
  async function aiRun(btn) {
    const an = AU.an; btn.disabled = true; const old = btn.textContent; btn.textContent = 'Yapay zekâ inceliyor…';
    try {
      const r = await api('aiAnalyzeForm', { image: overlayJpeg(), mediaType: 'image/jpeg', provider: AU.aiPick.provider || undefined, tier: AU.aiPick.tier || undefined, blocks: an.blocks.map(b => ({ id: b.id, rows: b.rows, cols: b.cols, role: b.role, glyph: b.glyph })) }, { timeout: 150000 });
      AU.aiUsed = { name: r.providerName || r.provider || '', model: r.model || '', tier: r.tier || '', failed: (r.tried || []).filter(t => !t.ok).length };
      AU.aiSnap = an.blocks.map(b => ({ id: b.id, role: b.role, axis: b.axis, name: b.name, labels: b.labels, ai: b.ai })); let n = 0;
      r.blocks.forEach(s => {
        const b = an.blocks.find(x => x.id === s.id); if (!b) return; const ch = [];
        if (s.role && s.role !== b.role && s.confidence >= 0.6) { b.role = s.role; b.axis = auAxis(b, s.role); ch.push('rol'); }
        if (b.role === 'questions' && s.name && !b.name) { b.name = s.name; ch.push('ders adı'); }
        if ((b.role === 'questions' || b.role === 'booklet') && s.labels && s.labels.length === auK(b) && /^[A-Z]+$/.test(s.labels) && s.labels !== letters(b, auK(b))) { b.labels = s.labels; ch.push('harfler'); }
        b.ai = { ch, note: s.note || '', conf: s.confidence }; if (ch.length) n++;
      });
      if (r.title && !AU.name) AU.name = r.title; AU.aiNotes = (r.notes || []).slice();
      toast(n ? `Yapay zekâ ${n} blok için öneri uyguladı. Kontrol edin.` : 'Yapay zekâ mevcut tahminlerle aynı görüşte.', 'ok'); draw();
    } catch (e) { toast(e.code === 'NOAI' ? 'Yapay zekâ anahtarı tanımlı değil; tanıma yapay zekâsız devam eder.' : e.message, 'bad', 8000); btn.disabled = false; btn.textContent = old; }
  }
  function aiUndo() { if (!AU.aiSnap) return; AU.aiSnap.forEach(s => { const b = AU.an.blocks.find(x => x.id === s.id); if (b) { b.role = s.role; b.axis = s.axis; b.name = s.name; b.labels = s.labels; b.ai = s.ai; } }); AU.aiSnap = null; AU.aiNotes = []; AU.aiUsed = null; draw(); }
  /** Seçime göre kullanılacak sağlayıcı ve (tahmini) model: sunucunun yaptığı en yeni model keşfi sonucu. */
  function aiPlanText() {
    const st = AU.ai; if (!st || !st.available) return '';
    const ok = (st.providers || []).filter(x => x.ok), P = ok.find(x => x.id === (AU.aiPick.provider || st.primary)) || ok[0]; if (!P) return '';
    const tier = AU.aiPick.tier || st.tier || 'balanced', m = P.manualModel || (P.models && (P.models[tier === 'auto' ? 'balanced' : tier] || P.models.balanced || P.models.best || P.models.fast)) || '';
    return `${P.name}${m ? ' · ' + m : ''}`;
  }
  function aiPicker() {
    const st = AU.ai, ok = ((st && st.providers) || []).filter(x => x.ok); if (!st || !st.available) return null;
    const ps = h('select', { id: 'au-ai-prov', 'aria-label': 'Yapay zekâ sağlayıcısı', onchange: e => { AU.aiPick.provider = e.target.value; draw(); } }, h('option', { value: '' }, 'Yönetici ayarı'), ...ok.map(x => h('option', { value: x.id }, x.name))), ts = h('select', { id: 'au-ai-tier', 'aria-label': 'Hız veya yetenek düzeyi', onchange: e => { AU.aiPick.tier = e.target.value; draw(); } }, AU_TIERS.map(([v, l]) => h('option', { value: v }, l)));
    ps.value = AU.aiPick.provider; ts.value = AU.aiPick.tier;
    return h('div', { class: 'grid', style: { marginTop: '.5rem' } }, ok.length > 1 ? h('div', { class: 'field' }, h('label', null, 'Yapay zekâ'), ps) : null, h('div', { class: 'field' }, h('label', null, 'Hız ↔ yetenek'), ts));
  }

  /* ---------------------------------------------------------------- deneme okuması ve kayıt */
  const testOut = h('div', { id: 'au-testout' });
  async function tryRead(f) {
    const mt = OMRDetect.makeTemplate(AU.an); if (mt.error) return toast(mt.error, 'bad');
    clear(testOut).append(h('p', { class: 'muted' }, 'Okunuyor…'));
    try {
      const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name || ''), img = await loadGray(isPdf ? (await pdfSources(f))[0] : f), out = await runRead(img, mt.tpl, {}), r = out.res;
      if (!r || !r.ok || !r.forms || !r.forms[0]) { const sd = mt.tpl.frameKind; clear(testOut).append(h('div', { class: 'alert bad' }, (out.error || (r && r.error) || 'Okunamadı') + (sd ? ' Formun kenarlarındaki çizgiler ve tüm baloncuk alanları net görünmeli.' : ' Formda dört köşe işareti görünmeli.'))); return; }
      const fm = r.forms[0], ans = fm.answers || '', marked = ans.split('').filter(c => /[A-H]/.test(c)).length, flags = (fm.flags || []).filter(x => x.q).length, fit = r.fit && r.fit.score != null ? ` · şablonla örtüşme %${Math.round(r.fit.score * 100)}` : '';
      const who = [fm.name, fm.surname].filter(Boolean).join(' ');
      let p = 0; const lines = mt.tpl.lessons.map(l => { const t = ans.slice(p, p + l.count); p += l.count; return `${l.name}: ${t}`; });
      clear(testOut).append(h('div', { class: 'alert ok' }, `Okundu${fit}. Öğrenci no: ${fm.studentNo || '—'}${who ? ' · Ad Soyad: ' + who : ''}${fm.schoolCode ? ' · Kurum kodu: ' + fm.schoolCode : ''}${fm.booklet ? ' · Kitapçık: ' + fm.booklet : ''} · ${marked}/${ans.length} soru işaretli, ${flags} şüpheli`), h('div', { class: 'mono small', style: { whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }, lines.join('\n')),
        h('p', { class: 'small muted' }, 'Cevapları kâğıttakilerle karşılaştırın. Hatalı bir ders/harf görürseniz blokları düzeltip yeniden deneyin.'));
    } catch (e) { clear(testOut).append(h('div', { class: 'alert bad' }, e.message)); }
  }
  async function save() {
    const mt = OMRDetect.makeTemplate(AU.an); if (mt.error) return toast(mt.error, 'bad');
    const name = AU.name.trim(); if (!name) return toast('Şablona bir ad verin.', 'bad');
    const tpl = mt.tpl; tpl.meta = { src: String(AU.file).slice(0, 60), ai: !!AU.aiSnap, at: new Date().toISOString().slice(0, 10) };
    if (JSON.stringify(tpl).length > 45000) return toast('Şablon çok büyük (45 KB sınırı).', 'bad');
    try { const r = await api('saveTemplate', { name, template: tpl }); await refreshBase(); AU.saved = { id: r.templateId, name, tpl }; toast('Şablon kaydedildi', 'ok'); draw(); } catch (e) { toast(e.message, 'bad'); }
  }

  /* ---------------------------------------------------------------- çizim */
  function blockRow(b, startQ) {
    const col = AU_COL[b.role], isQ = b.role === 'questions', isBk = b.role === 'booklet', k = auK(b);
    const roleSel = h('select', { 'aria-label': 'Blok türü', onchange: e => { const old = b.role; b.role = e.target.value; b.axis = auAxis(b, b.role); if (b.role !== 'questions') b.name = ''; if (old !== b.role && (['studentNo', 'schoolCode'].includes(b.role) || AU_NAMEROLE(b.role) || AU_NAMEROLE(old))) b.labels = ''; draw(); } }, AU_ROLES.map(([v, l]) => h('option', { value: v }, l))); roleSel.value = b.role;
    const el = h('div', { class: 'blk' + (b.id === AU.sel ? ' sel' : ''), 'data-id': b.id, style: { borderLeftColor: col }, onclick: e => { if (!/^(INPUT|SELECT|BUTTON|OPTION)$/.test(e.target.tagName)) select(b.id, false); } },
      h('div', { class: 'row between' }, h('span', { class: 'row' }, h('span', { class: 'pill', style: { background: col, color: '#fff' } }, b.id), h('b', null, `${b.rows} × ${b.cols}`), b.conf === 'low' ? h('span', { class: 'pill bad' }, 'kontrol') : b.conf === 'med' ? h('span', { class: 'pill warn' }, 'emin değil') : null), roleSel),
      isQ ? h('div', { class: 'grid', style: { marginTop: '.4rem' } },
        h('div', { class: 'field' }, h('label', null, 'Ders / bölüm adı'), h('input', { type: 'text', maxlength: 40, value: b.name || '', placeholder: 'örn: TÜRKÇE', 'data-f': 'name', oninput: e => { b.name = e.target.value; paintSoon(); sumSoon(); } })),
        h('div', { class: 'field' }, h('label', null, `Şık harfleri (${k} şık)`), h('input', { type: 'text', maxlength: 12, value: letters(b, k) || '', placeholder: 'ABCDEFGH'.slice(0, k), 'data-f': 'labels', oninput: e => { b.labels = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); } }))) : null,
      isBk ? h('div', { class: 'field', style: { marginTop: '.4rem' } }, h('label', null, `Kitapçık harfleri (${k})`), h('input', { type: 'text', maxlength: 8, value: letters(b, k) || '', placeholder: 'ABCD'.slice(0, k), 'data-f': 'labels', oninput: e => { b.labels = e.target.value.toUpperCase().replace(/[^A-Z]/g, ''); } })) : null,
      AU_NAMEROLE(b.role) ? h('div', { class: 'field', style: { marginTop: '.4rem' } }, h('label', null, `Alfabe (${k} harf, sırayla)`), h('input', { type: 'text', maxlength: 40, value: auAlpha(b.labels) || '', placeholder: OMRDetect.defaultAlphabet(k).join(''), 'data-f': 'labels', oninput: e => { b.labels = auAlpha(e.target.value); } }), h('div', { class: 'small muted' }, 'Boş bırakırsanız Türkçe alfabe (ABCÇDEFGĞH…) varsayılır; formdaki harf sırası farklıysa buraya yazın.')) : null,
      h('div', { class: 'small muted', style: { marginTop: '.3rem' } }, isQ ? `Sorular ${startQ + 1}–${startQ + auQn(b)} (${auQn(b)} soru)` : b.role === 'ignore' ? 'Okumaya katılmaz.' : b.role === 'booklet' ? 'Kitapçık türü işareti' : AU_NAMEROLE(b.role) ? `${auQn(b)} harflik ${b.role === 'name' ? 'ad' : 'soyad'} alanı (öğrenci adını/soyadını okur)` : `${auQn(b)} haneli ${b.role === 'studentNo' ? 'öğrenci numarası' : 'kurum kodu'}`,
        isQ && b.axis === 'row' && b.rows >= 2 ? h('button', { class: 'btn sm ghost', style: { marginLeft: '.6rem' }, onclick: () => splitDlg(b) }, 'Böl…') : null),
      b.why ? h('div', { class: 'small', style: { color: 'var(--warn)', marginTop: '.2rem' } }, b.why) : null,
      b.ai ? h('div', { class: 'small', style: { color: 'var(--brand)', marginTop: '.2rem' } }, `Yapay zekâ: ${b.ai.ch.length ? b.ai.ch.join(', ') + ' önerdi' : 'aynı görüşte'}${b.ai.note ? ' · ' + b.ai.note : ''}`) : null);
    rows.set(b.id, el); return el;
  }
  let pt = 0, st = 0; const paintSoon = () => { clearTimeout(pt); pt = setTimeout(paint, 120); }, sumSoon = () => { clearTimeout(st); st = setTimeout(drawSummary, 150); };
  const summary = h('div', { id: 'au-summary' });
  function drawSummary() {
    clear(summary); const an = AU.an; if (!an) return; const mt = OMRDetect.makeTemplate(an), pr = problems();
    if (mt.error) summary.append(h('div', { class: 'alert bad' }, mt.error));
    else { const t = mt.tpl; summary.append(h('div', { class: 'chips' }, h('span', { class: 'chip brand' }, `${t.questions} soru · ${t.choices} şık`), t.digits ? h('span', { class: 'chip' }, `${t.digits} haneli öğrenci no`) : null, t.schoolDigits ? h('span', { class: 'chip' }, `${t.schoolDigits} haneli kurum kodu`) : null, t.nameLen ? h('span', { class: 'chip' }, `ad: ${t.nameLen} harf`) : null, t.surnameLen ? h('span', { class: 'chip' }, `soyad: ${t.surnameLen} harf`) : null, h('span', { class: 'chip' }, `çerçeve: ${AU_FRAME_TR[an.frameKind] || 'dört köşe karesi'}`), t.booklets.length ? h('span', { class: 'chip' }, `Kitapçık ${t.booklets.join('/')}`) : null, h('span', { class: 'chip' }, `${t.lessons.length} ders`), h('span', { class: 'chip' }, `baloncuk ≈ ${Math.round(t.bsz.w)} px`)),
        h('div', { class: 'small muted', style: { marginTop: '.3rem' } }, t.lessons.map(l => `${l.name} ${l.count}`).join(' · '))); }
    pr.forEach(m => summary.append(h('div', { class: 'alert warn' }, m)));
    const sv = $('#au-save'); if (sv) sv.disabled = !!mt.error;
  }

  function draw() {
    clear(root); rows.clear(); const an = AU.an;
    const drop = h('div', { class: 'drop', id: 'au-drop', ondragover: e => { e.preventDefault(); drop.classList.add('over'); }, ondragleave: () => drop.classList.remove('over'), ondrop: e => { e.preventDefault(); drop.classList.remove('over'); const f = e.dataTransfer.files[0]; if (f) load(f); } },
      h('div', null, h('b', null, an ? 'Başka bir form tanıt' : 'Boş (işaretsiz) optik formu buraya bırakın'), h('div', { class: 'small muted' }, 'JPG, PNG veya PDF · bilgisayarda tarama dosyası, telefonda fotoğraf')),
      h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '.6rem' } }, h('button', { class: 'btn primary', id: 'au-pick', onclick: () => pickIn.click() }, 'Dosya seç'), h('button', { class: 'btn', id: 'au-cambtn', onclick: () => camIn.click() }, 'Fotoğraf çek')), pickIn, camIn);
    const frameSel = h('select', { id: 'au-frame', disabled: !!AU.busy, onchange: e => reframe(e.target.value) }, AU_FRAMES.map(([v, l]) => h('option', { value: v }, l))); frameSel.value = AU.frame;
    const frameRow = AU.img ? h('div', { class: 'field', style: { marginTop: '.7rem' } }, h('label', { for: 'au-frame' }, 'Çerçeve türü (formu düzeltmek için kullanılan işaretler)'), frameSel,
      h('div', { class: 'small muted', id: 'au-frame-note' }, an ? `Tanınan: ${AU_FRAME_TR[an.frameKind] || an.frameKind}. Yanlışsa başka bir tür seçin (bloklarda yaptığınız düzeltmeler sıfırlanır).` : 'Otomatik tanıma olmadıysa formdaki işarete göre türü elle seçin.')) : null;
    root.append(h('div', { class: 'card' }, h('h2', null, 'Harici formu otomatik tanıt'),
      h('p', { class: 'small muted', style: { marginTop: 0 } }, 'Piyasadaki herhangi bir optik formun (LGS/YKS denemeleri, yayınevi ve okul denemeleri; siyah, mavi, pembe ya da mor baskı) BOŞ bir örneğini yükleyin. Sistem formu dört köşe karesinden — köşe karesi yoksa kenarlardaki çizgilerden (iki kenarda ya da yalnızca bir kenarda) — düzeltir, baloncukları milimetrik bulur; soru bloklarını, öğrenci numarasını, kurum kodunu ve ad-soyad harf ızgaralarını tanır. Siz kontrol edip onaylayınca kayıtlı form olur ve sonraki bütün formlar ona göre okunur. Form tamamen görünmeli, düz ve gölgesiz olmalı.'), drop, frameRow));
    if (AU.busy) { root.append(h('div', { class: 'card' }, h('p', { class: 'muted' }, AU.busy))); return; }
    if (AU.err && !an) root.append(h('div', { class: 'alert bad', id: 'au-err' }, AU.err, h('div', { class: 'small', style: { marginTop: '.3rem' } }, 'Çerçeve türünü yukarıdan elle seçip yeniden deneyin (dört köşe karesi / iki yan çizgi / tek yan çizgi). Hiçbiri olmazsa "Elle tanımla" sekmesini kullanın.')));
    if (!an) return;
    if (AU.saved) { root.append(h('div', { class: 'card' }, h('div', { class: 'alert ok', id: 'au-saved' }, `"${AU.saved.name}" kayıtlı form olarak eklendi (${AU.saved.tpl.questions} soru).`), h('div', { class: 'row' }, h('button', { class: 'btn primary', id: 'au-mkexam', onclick: () => { App.newExam = { templateId: AU.saved.id }; App.go('exams'); } }, 'Bu formla sınav oluştur'), h('button', { class: 'btn', onclick: () => { AU.an = null; AU.saved = null; AU.name = ''; AU.img = null; draw(); } }, 'Başka form tanıt')))); return; }
    cv = h('canvas', { id: 'au-canvas', onclick: onCanvasClick, 'aria-label': 'Tanınan form düzeni' }); const wrap = h('div', { class: 'canvaswrap' }, cv);
    if (AU.match) root.append(h('div', { class: 'alert info', id: 'au-match' }, `Bu form zaten kayıtlı görünüyor: "${AU.match.name}" (örtüşme %${Math.round(AU.match.score * 100)}). Aynı formu tekrar kaydetmeniz gerekmez; sınav ayarlarında o şablonu seçin.`));
    an.warnings.forEach(w => root.append(h('div', { class: 'alert warn' }, w)));
    let q = 0; const list = h('div', { class: 'blocks', id: 'au-blocks' }, an.blocks.map(b => { const el = blockRow(b, q); if (b.role === 'questions') q += auQn(b); return el; }));
    const aiBtn = h('button', { class: 'btn', id: 'au-ai', onclick: ev => aiRun(ev.currentTarget) }, 'Yapay zekâ ile ders adı ve harfleri öner'), plan = aiPlanText();
    root.append(h('div', { class: 'review wide' },
      h('div', null, h('div', { class: 'card' }, h('h3', null, 'Tanınan düzen'), h('p', { class: 'small muted', style: { marginTop: 0 } }, `${an.nBubbles} baloncuk bulundu, ${an.blocks.length} blok. Renkli çerçeveler tanınan bloklardır; birine tıklayarak sağdaki ayarını açın ve baloncuk dairelerinin gerçek baloncuklarla çakıştığını doğrulayın.`), wrap, h('div', { class: 'chips', style: { marginTop: '.4rem' } }, AU_ROLES.map(([v, l]) => h('span', { class: 'chip', style: { borderLeft: '4px solid ' + AU_COL[v] } }, l))))),
      h('div', null,
        h('div', { class: 'card' }, h('h3', null, 'Bloklar'), list,
          AU.aiAvail ? aiPicker() : null,
          h('div', { class: 'row', style: { marginTop: '.6rem' } }, AU.aiAvail ? aiBtn : null, AU.aiSnap ? h('button', { class: 'btn ghost', id: 'au-ai-undo', onclick: aiUndo }, 'Önerileri geri al') : null),
          AU.aiAvail && plan ? h('p', { class: 'small muted', id: 'au-ai-plan' }, `Kullanılacak: ${plan} (en yeni sürüm sunucudan otomatik seçilir; sağlayıcı yanıt vermezse yedeğe geçilir).`) : null,
          AU.aiUsed ? h('p', { class: 'small', id: 'au-ai-used', style: { color: 'var(--brand)' } }, `Son öneri: ${AU.aiUsed.name}${AU.aiUsed.model ? ' · ' + AU.aiUsed.model : ''}${AU.aiUsed.failed ? ` · ${AU.aiUsed.failed} deneme başarısız olup yedek kullanıldı` : ''}`) : null,
          AU.aiAvail === false ? h('p', { class: 'small muted' }, 'Yapay zekâ önerisi kapalı (yönetici "Yönetim ▸ Yapay zekâ" bölümünden Claude, Gemini, OpenAI ya da uyumlu bir sağlayıcının anahtarını eklemedi). Tanıma yapay zekâsız çalışır; ders adlarını elle yazabilirsiniz.') : null,
          AU.aiNotes.length ? h('div', { class: 'alert info' }, AU.aiNotes.join(' · ')) : null),
        h('div', { class: 'card' }, h('h3', null, 'Özet'), summary,
          h('div', { class: 'field', style: { marginTop: '.7rem' } }, h('label', null, 'Şablon adı'), h('input', { type: 'text', id: 'au-name', value: AU.name, placeholder: 'Örn: XYZ Yayınları LGS Deneme', oninput: e => { AU.name = e.target.value; } })),
          h('div', { class: 'row', style: { marginTop: '.6rem' } }, h('button', { class: 'btn', id: 'au-try', onclick: () => testIn.click() }, 'İşaretli bir formla dene'), h('button', { class: 'btn primary', id: 'au-save', onclick: save }, 'Onayla ve kaydet'), testIn), testOut))));
    drawSummary(); paint();
  }
  draw();
}
