const $ = selector => document.querySelector(selector);
const fieldInputs = [...document.querySelectorAll('[data-field]')];
let token, articles = [], current = null, images = null, imageTarget = 'body', previewTimer, previewSequence = 0, saving = false, loading = false;

async function api(url, data) {
  const response = await fetch(url, data === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Editor-Token': token }, body: JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || '処理に失敗しました。');
  return result;
}
function message(text, error = false) { $('#message').textContent = text; $('#message').classList.toggle('error', error); }
function draft() { return { metadata: Object.fromEntries(fieldInputs.map(input => [input.dataset.field, input.value])), body: $('#body').value }; }
function dirty() {
  return current && (fieldInputs.some(input => input.value !== current.metadata[input.dataset.field].replace(/\r\n/g, '\n')) || $('#body').value !== current.body.replace(/\r\n/g, '\n'));
}
function updateState() {
  const changed = dirty();
  $('#save-state').textContent = saving ? '保存しています…' : changed ? '未保存' : '保存済み';
  $('#save-state').classList.toggle('dirty', !!changed);
  $('#save').disabled = !changed || saving || loading;
  $('#reload').disabled = saving || loading;
  fieldInputs.forEach(input => { input.disabled = saving || loading; });
  $('#body').disabled = saving || loading;
  $('#insert-image').disabled = saving || loading;
  $('#cover-picker').disabled = saving || loading;
}
function renderList() {
  const query = $('#search').value.trim().toLocaleLowerCase();
  const collection = $('#collection').value;
  const filtered = articles.filter(article => (!collection || article.metadata.category === collection) && (!query || [article.id, ...Object.values(article.metadata), article.body].join(' ').toLocaleLowerCase().includes(query)));
  $('#count').textContent = `${filtered.length} / ${articles.length}`;
  $('#articles').replaceChildren(...filtered.map(article => {
    const button = document.createElement('button'); button.className = 'article' + (article.id === current?.id ? ' active' : '');
    button.setAttribute('aria-current', String(article.id === current?.id));
    const kind = document.createElement('span'); kind.className = 'kind'; kind.textContent = article.metadata.category;
    const title = document.createElement('strong'); title.textContent = article.metadata.title || article.id;
    const meta = document.createElement('small'); const date = document.createElement('span'); date.textContent = article.displayDate || '日付なし';
    meta.append(date); button.append(kind, title, meta); button.onclick = () => openArticle(article.id); return button;
  }));
  if (!filtered.length) $('#articles').textContent = '該当する記事はありません。';
}
async function refreshPreview() {
  if (!current) return;
  const sequence = ++previewSequence;
  try { const result = await api('/api/preview', draft()); if (sequence === previewSequence) $('#preview').srcdoc = result.html; }
  catch (error) { if (sequence === previewSequence) message(error.message, true); }
}
function comparison() {
  const serialize = data => fieldInputs.map(input => `${input.dataset.field}: ${data.metadata[input.dataset.field]}`).join('\n') + '\n\n' + data.body;
  $('#before').textContent = serialize(current); $('#after').textContent = serialize(draft());
}
function edited() {
  updateState(); message(''); comparison(); clearTimeout(previewTimer); previewSequence++;
  previewTimer = setTimeout(refreshPreview, 350);
}
function applyArticle(article) {
  current = article; fieldInputs.forEach(input => { input.value = article.metadata[input.dataset.field]; }); $('#body').value = article.body;
  $('#file-path').textContent = article.metadata.title; $('#empty').hidden = true; $('#editor').hidden = false;
  const index = articles.findIndex(item => item.id === article.id); if (index >= 0) articles[index] = article;
  updateState(); renderList(); comparison(); refreshPreview();
}
async function openArticle(id) {
  if (saving || loading) return;
  if (dirty() && !confirm('未保存の変更を破棄して記事を開きますか？')) return;
  loading = true; updateState();
  try { applyArticle(await api(`/api/article?id=${encodeURIComponent(id)}`)); message(''); }
  catch (error) { message(error.message, true); }
  finally { loading = false; updateState(); }
}
async function save() {
  if (!dirty() || saving || loading) return;
  saving = true; updateState();
  try {
    const data = draft();
    const metadata = Object.fromEntries(Object.entries(data.metadata).filter(([key, value]) => value !== current.metadata[key]));
    applyArticle(await api('/api/save', { id: current.id, version: current.version, body: data.body, metadata }));
    message('保存しました。');
  } catch (error) { message(error.message, true); }
  finally { saving = false; updateState(); }
}
$('#save').onclick = save;
$('#reload').onclick = () => current && openArticle(current.id);
for (const input of fieldInputs) input.addEventListener('input', edited);
$('#body').addEventListener('input', edited);
for (const id of ['search', 'collection']) $(`#${id}`).addEventListener('input', renderList);
function tab(diff) { $('#edit-view').hidden = diff; $('#diff-view').hidden = !diff; $('#edit-tab').setAttribute('aria-pressed', String(!diff)); $('#diff-tab').setAttribute('aria-pressed', String(diff)); comparison(); }
$('#edit-tab').onclick = () => tab(false); $('#diff-tab').onclick = () => tab(true);
window.addEventListener('beforeunload', event => { if (dirty()) { event.preventDefault(); event.returnValue = ''; } });
window.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') { event.preventDefault(); save(); } });
function renderImages() {
  const matched = images.filter(src => src.toLowerCase().includes($('#image-search').value.toLowerCase()));
  $('#image-count').textContent = `${matched.length}枚`;
  $('#images').replaceChildren(...matched.map(src => {
    const button = document.createElement('button'); const image = document.createElement('img'); image.src = src; image.alt = src.split('/').at(-1); image.loading = 'lazy'; const caption = document.createElement('span'); caption.textContent = src; button.append(image, caption);
    button.onclick = () => {
      if (imageTarget === 'cover') $('[data-field="image"]').value = src;
      else { const body = $('#body'); body.setRangeText(`\n![画像の説明](${encodeURI(src)})\n`, body.selectionStart, body.selectionEnd, 'end'); body.focus(); }
      $('#images-dialog').close(); edited();
    };
    return button;
  }));
}
async function pickImage(target) {
  imageTarget = target;
  try { images ||= await api('/api/images'); $('#image-search').value = ''; renderImages(); $('#images-dialog').showModal(); }
  catch (error) { message(error.message, true); }
}
$('#cover-picker').onclick = () => pickImage('cover'); $('#insert-image').onclick = () => pickImage('body'); $('#close-images').onclick = () => $('#images-dialog').close(); $('#image-search').oninput = renderImages;
try { ({ token } = await api('/api/session')); articles = await api('/api/articles'); renderList(); if (articles.length) await openArticle(articles[0].id); }
catch (error) { $('#empty').textContent = `起動に失敗しました: ${error.message}`; $('#empty').hidden = false; }
