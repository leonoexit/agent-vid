/* brand-signature.js: applies window.BRAND (from brand.json) to the page and animates the signature.
 * Markup hooks (the theme decides where they sit):
 *   [data-brand="name|signature|tagline|hudLabel|outroLine|url"]  text filled from BRAND
 *   img[data-brand-logo]                                           src = BRAND.logo
 *   #sig > .sig-txt + svg .sig-line                                signature, revealed from BRAND.signatureAt
 * BRAND.colors { primary, secondary, accent } become CSS vars --brand-primary / --brand-secondary / --brand-accent.
 * Usage: MotionKit.brand(kit)  — call before building scenes so text is in place before tweens are created. */
(function () {
  function brand(kit, { sig = "#sig", steps = 8 } = {}) {
    const B = window.BRAND || {};
    const { tl, $, $$ } = kit;
    $$("[data-brand]").forEach((el) => {
      const v = B[el.dataset.brand];
      if (v != null) el.textContent = v;
    });
    $$("img[data-brand-logo]").forEach((img) => B.logo && (img.src = B.logo));
    const root = document.documentElement.style;
    for (const [k, v] of Object.entries(B.colors || {})) if (v) root.setProperty(`--brand-${k}`, v);

    const box = $(sig);
    if (!box || B.signature === "" || B.signature === false) return box && (box.style.display = "none");
    const txt = $(".sig-txt", box);
    const line = $(".sig-line", box);
    const at = B.signatureAt ?? 1.0;
    if (txt) {
      txt.textContent = B.signature ?? B.name ?? "";
      tl.set(txt, { clipPath: "inset(0% 100% 0% 0%)" }, 0);
      tl.to(txt, { clipPath: "inset(-20% -20% -20% 0%)", duration: 0.6, ease: `steps(${steps})` }, at);
    }
    if (line) {
      tl.set(line, { strokeDashoffset: 1 }, 0);
      tl.to(line, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, at + 0.45);
    }
  }
  window.MotionKit = Object.assign(window.MotionKit || {}, { brand });
})();
