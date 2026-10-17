"""Import the local migration package; generated Markdown is committed with the site."""
import json
import re
from optimize_images import save_webp
from content_cleanup import clean_body
import posixpath
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'nu-digital-content'
records = json.loads((SOURCE / 'catalog.json').read_text(encoding='utf-8'))['records']
records = [r for r in records if r['section'] in ('blog', 'news', 'works')]
EXCLUDED_IDS = {
    'blog/activity-2024-08-12-45b78e',  # 自作PC
    'blog/activity-2024-08-03-6e7911',  # PS Vitaのスティック修理
    'blog/activity-2026-05-22-d37027',  # IVRC一般部門に向けた企画・検証
}
excluded_records = [r for r in records if r['id'] in EXCLUDED_IDS]
records = [r for r in records if r['id'] not in EXCLUDED_IDS]

def route(record):
    section = 'project' if record['section'] == 'works' else record['section']
    slug = record['slug']
    for source in record['sources']:
        if source['source'] == 'website':
            path = urlparse(source['url']).path
            if path.startswith('/' + section + '/'):
                slug = path.rstrip('/').split('/')[-1]
    return f'/{section}/{slug}'

routes = {r['id']: route(r) for r in records}
for record in excluded_records:
    (ROOT / 'content' / (route(record).strip('/') + '.md')).unlink(missing_ok=True)
assets = set()
for record in records:
    body = (SOURCE / record['bodyFile']).read_text(encoding='utf-8')
    for excluded in excluded_records:
        relative = posixpath.relpath(excluded['bodyFile'], posixpath.dirname(record['bodyFile']))
        body = re.sub(r'^- \[[^\]]*\]\(' + re.escape(relative) + r'\)\s*$', '', body, flags=re.M)
    body = re.sub(r'^## 関連する活動・制作物\s*(?=## |\Z)', '', body, flags=re.M)
    def image_path(match):
        name = match[1]
        assets.add(name)
        return '/images/imported/' + name
    body = re.sub(r'(?:\.\./)+media/webp/([^\s)"<>]+)', image_path, body)
    for other in records:
        body = body.replace('../../' + other['bodyFile'], routes[other['id']])
        relative = posixpath.relpath(other['bodyFile'], posixpath.dirname(record['bodyFile']))
        body = body.replace('](' + relative + ')', '](' + routes[other['id']] + ')')
        body = body.replace('[' + other['id'] + '](', '[' + other['title'] + '](')
    # Import bookkeeping is retained in the source package, not in reader-facing text.
    body = re.sub(r'^# [^\n]+\n', '', body, count=1, flags=re.M)
    body = re.sub(r'^(?:元ファイル名|サイト内URL|トップの制作欄):[^\n]*\n', '', body, flags=re.M)
    body = re.sub(r'^対応写真:\n(?:- /images/imported/[^\n]+\n)+', '', body, flags=re.M)
    cover = next((i for i in record['images'] if i['assetId'] == record['coverImage']), None)
    if cover:
        name = Path(cover['file']).name
        assets.add(name)
        image = '/images/imported/' + name
    else:
        image = '/images/ogp/member.webp'
    meta = {
        'title': record['title'], 'image': image,
        'author': record.get('websiteAuthor') or ('yurarara' if any(s['source'] == 'portfolio' for s in record['sources']) else 'nu_digital'),
        'date': record.get('publishedAt') or record.get('date') or '',
        'dateLabel': record.get('dateLabel') or '',
        'category': 'メンバーの活動・作品' if record['scope'] == 'member' else ('制作コンテンツ' if record['section'] == 'works' else '団体の活動'),
        'excerpt': record['summary'], 'sourceId': record['id'],
    }
    target = ROOT / 'content' / (routes[record['id']].strip('/') + '.md')
    target.parent.mkdir(parents=True, exist_ok=True)
    front = '\n'.join(f'{key}: {json.dumps(value, ensure_ascii=False)}' for key, value in meta.items())
    target.write_text('---\n' + front + '\n---\n\n' + clean_body(body), encoding='utf-8')

destination = ROOT / 'public/images/imported'
destination.mkdir(parents=True, exist_ok=True)
for name in sorted(assets):
    source = SOURCE / 'media/webp' / name
    if source.exists():
        save_webp(source, destination / name)
    elif not (destination / name).exists():
        raise FileNotFoundError(source)
print(f'Imported {len(records)} articles and {len(assets)} images; existing website URLs preserved.')
