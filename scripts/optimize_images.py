"""Optimize public images in place. Requires Pillow; originals stay locally ignored."""
import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
MAX_EDGE = 2560


def save_webp(source, destination):
    """Keep small WebP files byte-identical; preserve orientation and transparency."""
    with Image.open(source) as image:
        if image.format == 'WEBP' and max(image.size) <= MAX_EDGE:
            if source != destination:
                shutil.copyfile(source, destination)
            return
        if getattr(image, 'n_frames', 1) != 1:
            raise ValueError(f'Animated image needs separate handling: {source}')
        oriented = ImageOps.exif_transpose(image)
        oriented.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        oriented = oriented.convert('RGBA' if 'A' in oriented.getbands() or 'transparency' in oriented.info else 'RGB')
        temporary = destination.with_name(destination.name + '.tmp')
        oriented.save(temporary, format='WEBP', quality=88, method=6,
                      lossless=image.format == 'PNG',
                      **({'icc_profile': image.info['icc_profile']} if image.info.get('icc_profile') else {}))
    with Image.open(temporary) as check:
        check.load()
        assert check.format == 'WEBP' and max(check.size) <= MAX_EDGE
    temporary.replace(destination)


def main():
    image_root = ROOT / 'public/images'
    originals = ROOT / '.image-originals'
    mapping = {}
    report = []
    for source in sorted(image_root.rglob('*')):
        if source.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'):
            continue
        destination = source.with_suffix('.webp')
        # Keep distinct same-stem PNG/JPEG assets separate.
        if source.suffix.lower() in ('.jpg', '.jpeg') and source.with_suffix('.png').exists():
            destination = source.with_name(source.stem + '-jpg.webp')
        if destination != source and destination.exists():
            raise FileExistsError(destination)
        with Image.open(source) as image:
            before_size = image.size
        if source == destination and max(before_size) <= MAX_EDGE:
            continue
        backup = originals / source.relative_to(image_root)
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copyfile(source, backup)
        before_bytes = source.stat().st_size
        before_hash = hashlib.sha256(source.read_bytes()).hexdigest()
        save_webp(source, destination)
        if source != destination:
            source.unlink()
        old_url = '/' + source.relative_to(ROOT / 'public').as_posix()
        new_url = '/' + destination.relative_to(ROOT / 'public').as_posix()
        mapping[old_url] = new_url
        with Image.open(destination) as image:
            after_size = image.size
        report.append(dict(source=old_url, destination=new_url, beforeSize=before_size,
                           afterSize=after_size, beforeBytes=before_bytes,
                           afterBytes=destination.stat().st_size, beforeSha256=before_hash,
                           afterSha256=hashlib.sha256(destination.read_bytes()).hexdigest()))
    for folder in ['app', 'components', 'content', 'data', 'lib']:
        for path in (ROOT / folder).rglob('*'):
            if path.suffix not in ('.ts', '.tsx', '.md', '.css'):
                continue
            text = path.read_text(encoding='utf-8')
            updated = text
            for old, new in mapping.items():
                updated = updated.replace(old, new)
                if old.startswith('/images/member/'):
                    updated = updated.replace('"' + Path(old).name + '"', '"' + Path(new).name + '"')
            updated = updated.replace('/images/icons/${post.author}.png', '/images/icons/${post.author}.webp')
            if updated != text:
                path.write_text(updated, encoding='utf-8')
    if report:
        (ROOT / 'docs/image-optimization.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Optimized {len(report)} images; resized {sum(r["beforeSize"] != r["afterSize"] for r in report)}.')


if __name__ == '__main__':
    main()
