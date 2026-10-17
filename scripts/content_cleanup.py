"""Remove migration bookkeeping from reader-facing article bodies."""
import re


def clean_body(body):
    body = re.sub(r'^> 出典：個人ポートフォリオ。[^\n]*\n?', '', body, flags=re.M)
    body = re.sub(r'^(?:日付|期間|担当|タグ):[^\n]*\n?', '', body, flags=re.M)
    # Some imported records have no prose under these template headings.
    body = re.sub(r'^## (?:概要|本文|制作の工夫・振り返り|関連URL)\s*(?=## |\Z)', '', body, flags=re.M)
    return re.sub(r'\n{3,}', '\n\n', body).strip() + '\n'
