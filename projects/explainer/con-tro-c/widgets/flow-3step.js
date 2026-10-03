// Widget "flow-3step": how the agent works in 3 steps (receive → handle → report), drawn as icons joined by arrows;
// a small dot then runs along the arrows like a job moving through the process.
// script.json: { kind: "flow-3step", heading?: "...", steps: [{ icon: "inbox", title: "Nhận việc", text: "Đọc tin nhắn mới" }] (exactly 3) }
// icon: inbox | gear | report | chat | doc | check | clock | money | cart | phone. title ≤ 12 chars, text ≤ 34 chars. No prop.
(function () {
  const { tl, h, fadeUp, pop, css, register } = window.ExplainerKit;
  // Simple line icons (24x24 grid, stroked with currentColor) so no emoji font or icon library is needed.
  const ICONS = {
    inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/><circle cx="12" cy="12" r="6.5"/>',
    report: '<path d="M4 20V4h16v16z"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 11h7M9 14h7M9 17h5"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M7.5 12.5l3 3 6-6.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    money: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9v6M18 9v6"/>',
    cart: '<path d="M3 4h3l2.5 11h10l2-8H7"/><circle cx="10" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
  };
  css(`
    .f3-head { font-size: 30px; font-weight: 600; line-height: 1.3; color: var(--ink); }
    .f3-row { position: absolute; left: 30px; right: 30px; top: 120px; display: flex; justify-content: space-between; }
    .f3-step { width: 250px; display: flex; flex-direction: column; align-items: center; text-align: center; }
    .f3-icon { width: 150px; height: 150px; box-sizing: border-box; border: 5px solid var(--ink); border-radius: 50%; background: var(--surface-2);
      display: flex; align-items: center; justify-content: center; color: var(--ink); }
    .f3-step:nth-child(2) .f3-icon { border-color: var(--accent); color: var(--accent); }
    .f3-step:nth-child(3) .f3-icon { border-color: var(--ok); color: var(--ok); }
    .f3-icon svg { width: 84px; height: 84px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
    .f3-num { margin-top: 16px; font-size: 24px; font-weight: 700; color: var(--muted); letter-spacing: 0.08em; }
    .f3-title { margin-top: 2px; font-family: var(--font-display); font-size: 40px; line-height: 1.1; }
    .f3-text { margin-top: 10px; font-size: 27px; line-height: 1.25; color: var(--muted); }
    .f3-arrow { position: absolute; top: 187px; width: 64px; height: 16px; }
    .f3-arrow::before { content: ""; position: absolute; left: 0; right: 12px; top: 6px; height: 4px; background: var(--ink); }
    .f3-arrow::after { content: ""; position: absolute; right: 0; top: 0; border-left: 16px solid var(--ink); border-top: 8px solid transparent; border-bottom: 8px solid transparent; }
    .f3-dot { position: absolute; left: 0; top: 183px; width: 24px; height: 24px; margin-left: -12px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 5px var(--hl); }
  `);
  register("flow-3step", (card, sc, at) => {
    const w = sc.widget;
    if (w.heading) fadeUp(h("div", "f3-head", card, w.heading), at(0.8), 0.35, 8);
    const row = h("div", "f3-row", card);
    // Step centres inside the card (row spans 30..880, three 250px columns spread with space-between).
    const cx = [30 + 125, 455, 880 - 125];
    w.steps.slice(0, 3).forEach((s, k) => {
      const st = h("div", "f3-step", row);
      const ic = h("div", "f3-icon", st);
      ic.innerHTML = `<svg viewBox="0 0 24 24">${ICONS[s.icon] || ICONS.check}</svg>`;
      const language = String(window.SCRIPT?.language || "vi").toLowerCase();
      h("div", "f3-num", st, `${language.startsWith("en") ? "STEP" : "BƯỚC"} ${k + 1}`);
      h("div", "f3-title", st, s.title);
      h("div", "f3-text", st, s.text || "");
      const t = at(1.1 + k * 0.9);
      pop(ic, t);
      [...st.children].slice(1).forEach((el, j) => fadeUp(el, t + 0.2 + j * 0.1, 0.3, 10));
      if (k < 2) {
        const ar = h("div", "f3-arrow", card);
        ar.style.left = `${cx[k] + 118}px`; // centred in the gap between two icons
        tl.fromTo(ar, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, t + 0.55);
      }
    });
    // One job travels through the pipeline after all steps are visible.
    const dot = h("div", "f3-dot", card);
    tl.fromTo(dot, { opacity: 0, x: cx[0] }, { opacity: 1, x: cx[0], duration: 0.2 }, at(4.0));
    tl.to(dot, { x: cx[2], duration: 1.6, ease: "power1.inOut" }, at(4.2));
    tl.to(dot, { opacity: 0, scale: 2, duration: 0.3 }, at(5.9));
  });
})();
