// Intro "notify" (AI for business): message notifications pile up while an unread counter races up and a clock spins,
// then the hook lines, then the title sign + subtitle. Fields: intro.prompt (first notification; its first number is the
// counter target, else 12), line1, line2a, line2b (accent).
(function () {
  const K = window.ExplainerKit;
  const { tl, h, fadeUp, out, show } = K;
  K.css(`
    .in-stack { position: absolute; left: 110px; top: 210px; width: 860px; height: 640px; display: block; }
    .in-card { position: absolute; left: 0; width: 860px; height: 128px; box-sizing: border-box; padding: 0 30px 0 132px; display: flex; flex-direction: column;
      justify-content: center; background: var(--surface-3); border: 3px solid var(--ink); border-radius: 26px; box-shadow: 6px 6px 0 var(--shadow); }
    .in-card::before { content: ""; position: absolute; left: 30px; top: 24px; width: 78px; height: 78px; border-radius: 50%; background: var(--muted-2); opacity: 0.35; }
    .in-card.main::before { background: var(--accent); opacity: 1; }
    .in-text { font: 700 38px/1.2 var(--font-body); color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .in-bar { height: 16px; border-radius: 8px; background: var(--ink); opacity: 0.14; margin: 8px 0; display: block; }
    .in-count { position: absolute; right: -24px; top: -30px; min-width: 92px; height: 92px; padding: 0 14px; box-sizing: border-box; border-radius: 46px;
      background: var(--bad); color: #fff; font: 800 46px/92px var(--font-body); text-align: center; display: block; }
    .in-clock { position: absolute; left: 110px; top: 1250px; width: 210px; height: 210px; border-radius: 50%; border: 8px solid var(--ink);
      background: var(--surface-3); box-sizing: border-box; display: block; }
    .in-hand { position: absolute; left: 97px; bottom: 97px; width: 8px; border-radius: 4px; background: var(--ink); transform-origin: 50% 100%; display: block; }
    .in-hand.m { height: 80px; } .in-hand.hr { height: 52px; background: var(--accent); }
    .in-hook { position: absolute; left: 60px; right: 60px; top: 930px; text-align: center; display: block; }
    .in-l1 { font: 400 88px/1.12 var(--font-display); color: var(--ink); }
    .in-l2 { margin-top: 14px; font: 400 64px/1.18 var(--font-display); color: var(--ink); }
    .in-mascot { position: absolute; left: 790px; top: 1170px; width: 220px; }
  `);
  K.registerHook("intro", "notify", (stage, { S, T, s, at, titleBox }) => {
    const intro = h("div", "scene", stage);
    show(intro, s.start);
    const stack = h("div", "in-stack", intro);
    const cards = [0, 1, 2, 3].map((i) => {
      const c = h("div", `in-card${i === 0 ? " main" : ""}`, stack);
      c.style.top = `${i * 150}px`;
      if (i === 0) h("div", "in-text", c, S.intro.prompt);
      else { h("div", "in-bar", c).style.width = `${70 - i * 12}%`; h("div", "in-bar", c).style.width = `${45 + i * 8}%`; }
      return c;
    });
    const target = parseInt((S.intro.prompt.match(/\d+/) || ["12"])[0], 10);
    const count = h("div", "in-count", cards[0], "0");
    const clockEl = h("div", "in-clock", intro);
    const hr = h("div", "in-hand hr", clockEl);
    const mn = h("div", "in-hand m", clockEl);
    const hook = h("div", "in-hook", intro);
    const l1 = h("div", "in-l1", hook, S.intro.line1);
    const l2 = h("div", "in-l2", hook);
    h("span", "", l2, `${S.intro.line2a} `);
    h("span", "accent", l2, S.intro.line2b);
    const bot = h("img", "mascot in-mascot", intro);
    bot.src = `assets/mascot-${T.poses.intro}.png`;
    const titleWrap = h("div", "intro-title", intro);
    titleBox(titleWrap, S.title);
    h("div", "intro-sub", titleWrap, S.subtitle || `${S.scenes.length} bước`);

    // Newest notification lands on top: cards drop in bottom-up order.
    [3, 2, 1, 0].forEach((i, k) => tl.fromTo(cards[i], { opacity: 0, y: -90, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.5)" }, at(0.15 + k * 0.3)));
    const p = { n: 0 };
    tl.fromTo(p, { n: 0 }, { n: target, duration: 1.4, ease: "power1.in", onUpdate: () => { count.textContent = String(Math.round(p.n)); } }, at(0.9));
    tl.fromTo(clockEl, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, at(1.1));
    tl.fromTo(mn, { rotation: 0 }, { rotation: 1440, duration: 2.6, ease: "power1.inOut" }, at(1.2));
    tl.fromTo(hr, { rotation: 20 }, { rotation: 140, duration: 2.6, ease: "power1.inOut" }, at(1.2));
    fadeUp(l1, at(2.2), 0.5);
    fadeUp(l2, at(2.8), 0.5);
    tl.fromTo(bot, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, at(2.4));
    [stack, clockEl, hook, bot].forEach((el) => out(el, at(4.2)));
    fadeUp(titleWrap, at(4.6), 0.6, 40);
    out(titleWrap, s.start + s.dur - 0.45);
  });
})();
