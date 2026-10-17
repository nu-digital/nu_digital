const pad = value => String(value).padStart(2, '0');

export function formatArticleDate(date = '') {
  const value = String(date).trim();
  const dayRange = value.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日?\s*[〜～~–]\s*(\d{1,2})日$/);
  if (dayRange) return `${dayRange[1]}.${pad(dayRange[2])}.${pad(dayRange[3])}–${pad(dayRange[4])}`;
  const full = value.match(/^(\d{4})[-./年](\d{1,2})[-./月](\d{1,2})日?$/);
  if (full) return `${full[1]}.${pad(full[2])}.${pad(full[3])}`;
  return value
    .replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g, (_, y, m, d) => `${y}.${pad(m)}.${pad(d)}`)
    .replace(/(\d{4})年\s*(\d{1,2})月/g, (_, y, m) => `${y}.${pad(m)}`)
    .replace(/(\d{1,2})月/g, (_, m) => pad(m))
    .replace(/[〜～~]\s*/g, '–')
    .replace(/\s+/g, '');
}

export function articleDateOrder(date = '') {
  const match = String(date).match(/^(\d{4})[年.\/-](\d{1,2})(?:[月.\/-](\d{1,2}))?/);
  return match ? Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3] || 1)) : 0;
}

export function articleCategory(collection, category = '') {
  return ['Blog', 'Product'].includes(category) ? category : collection === 'project' ? 'Product' : 'Blog';
}

/** Group adjacent image-only blocks; keep prose and meaningful section headings intact.
 * @returns {import('unified').Transformer<import('hast').Root>}
 */
export function rehypeArticleGallery() {
  return tree => {
    const text = node => node.type === 'text' ? node.value : (node.children || []).map(text).join('');
    const isImageBlock = node => {
      if (node.type === 'text') return !node.value.trim();
      if (node.type !== 'element') return false;
      if (node.tagName === 'img') return true;
      return ['p', 'figure', 'a'].includes(node.tagName) && node.children?.length && node.children.every(isImageBlock);
    };
    const hasImage = node => node.tagName === 'img' || (node.children || []).some(hasImage);
    const walk = node => {
      if (node.tagName === 'img') {
        node.properties ||= {};
        delete node.properties.title;
        node.properties.tabIndex = 0;
        node.properties.role = 'button';
        node.properties.ariaLabel = `${node.properties.alt || '写真'}を拡大`;
      }
      if (!node.children) return;
      node.children = node.children.filter(child => child.tagName !== 'figcaption');
      node.children.forEach(walk);
      if (node.type !== 'root' && !['div', 'section'].includes(node.tagName)) return;
      let photoSection = false;
      const blocks = node.children.filter(child => {
        if (child.tagName === 'h2') photoSection = /^写真|^フォト|^ギャラリー/.test(text(child));
        return !(photoSection && ['h3', 'h4', 'h5', 'h6'].includes(child.tagName));
      });
      const result = [];
      for (let i = 0; i < blocks.length;) {
        if (!hasImage(blocks[i]) || !isImageBlock(blocks[i])) { result.push(blocks[i++]); continue; }
        const photos = [];
        while (i < blocks.length && isImageBlock(blocks[i])) {
          if (hasImage(blocks[i])) photos.push(blocks[i]);
          i++;
        }
        result.push({ type: 'element', tagName: 'div', properties: { className: ['article-gallery'], 'data-count': photos.length }, children: photos });
      }
      node.children = result;
    };
    walk(tree);
  };
}
