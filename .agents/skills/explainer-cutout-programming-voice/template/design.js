/* Position-explicit vocabulary. The project owns composition and subject choices. */
window.CutoutDesign = (() => {
  const B = Cutout;
  const box = (parent, cls, x, y, w, h, content) => B.node('div', 'placed ' + cls, parent, content, {
    left: x + 'px', top: y + 'px', ...(w != null ? {width: w + 'px'} : {}), ...(h != null ? {height: h + 'px'} : {})
  });
  const text = (parent, cls, content, x, y, w) => box(parent, cls, x, y, w, null, content);
  function img(parent, {src, alt, x, y, width, height, rotation = 0, paperLabel = false}) {
    const e = B.node('img', paperLabel ? 'cutout paper-label' : 'cutout', parent);
    e.src = src; e.alt = alt || '';
    Object.assign(e.style, {left: x + 'px', top: y + 'px', width: width + 'px',
      ...(height != null ? {height: height + 'px'} : {height: 'auto'}), transform: `rotate(${rotation}deg)`});
    return e;
  }
  function plane(parent, color, x, y, w, h, rotation = 0) {
    const e = box(parent, 'color-plane', x, y, w, h);
    e.style.background = color; e.style.transform = `rotate(${rotation}deg)`; return e;
  }
  function arrow(parent, d, color = '#2548f4') {
    const s = B.svg('svg', parent, {class: 'arrow', viewBox: '0 0 1080 1920', width: 1080, height: 1920});
    B.svg('path', s, {d, fill: 'none', stroke: color, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'});
    return s;
  }
  return {box, text, img, plane, arrow};
})();
