// Widget "chat": a short phone-style conversation; the agent's replies appear after a "typing…" bubble.
// script.json: { kind: "chat", heading?: "...", them?: "Khách", me?: "AI agent",
//   messages: [{ from: "them", text: "Áo này còn size M không?" }, { from: "me", text: "Còn ạ, 2 màu..." }] }
// 2–4 messages, each ≤ 60 chars (≤ 34 with a prop: the list then starts below it). "me" = the agent / the good side (right, accent).
(function () {
  const { tl, h, fadeUp, css, register } = window.ExplainerKit;
  css(`
    .ch-head { font-size: 28px; font-weight: 600; color: var(--muted); }
    .ch-list { margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
    .card:has(.prop) .ch-list { margin-top: 160px; }
    .ch-msg { position: relative; max-width: 720px; box-sizing: border-box; padding: 8px 20px 10px; border: 3px solid var(--ink); border-radius: 22px 22px 22px 6px;
      background: var(--surface-2); font-size: 29px; line-height: 1.22; align-self: flex-start; }
    .ch-msg.me { align-self: flex-end; border-radius: 22px 22px 6px 22px; background: color-mix(in srgb, var(--accent) 16%, var(--surface-2)); border-color: var(--accent); }
    .ch-who { font-size: 20px; font-weight: 700; color: var(--muted); margin-bottom: 2px; }
    .ch-msg.me .ch-who { color: var(--accent); }
    .ch-typing { position: absolute; right: 22px; bottom: 16px; font-size: 40px; letter-spacing: 6px; color: var(--accent); line-height: 1; }
  `);
  register("chat", (card, sc, at) => {
    const w = sc.widget;
    if (w.heading) fadeUp(h("div", "ch-head", card, w.heading), at(0.8), 0.35, 8);
    const list = h("div", "ch-list", card);
    let t = at(1.1);
    w.messages.forEach((m) => {
      const me = m.from === "me";
      const msg = h("div", `ch-msg${me ? " me" : ""}`, list);
      h("div", "ch-who", msg, me ? w.me || "AI agent" : w.them || "Khách");
      const body = h("div", "", msg, m.text);
      if (me) {
        // "typing…" first, then the reply text replaces it.
        const dots = h("div", "ch-typing", msg, "•••");
        tl.fromTo(msg, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, t);
        tl.fromTo(body, { opacity: 0 }, { opacity: 1, duration: 0.25 }, t + 0.7);
        tl.fromTo(dots, { opacity: 1 }, { opacity: 0, duration: 0.15 }, t + 0.6);
        t += 1.3;
      } else {
        fadeUp(msg, t, 0.3, 14);
        t += 0.9;
      }
    });
  });
})();
