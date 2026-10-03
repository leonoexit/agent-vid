// Outro "start" (AI for business): the two closing lines, then the takeaway as a big "start" button that gets pressed,
// the robot waving beside it. Fields: outro.line1, line2, line3 (button), credit.
(function () {
  const K = window.ExplainerKit;
  const { tl, h, fadeUp, show } = K;
  K.css(`
    .ost-head { position: absolute; left: 60px; right: 60px; top: 380px; text-align: center; display: block; }
    .ost-l1 { font: 400 92px/1.1 var(--font-display); color: var(--ink); }
    .ost-l2 { margin-top: 16px; font: 400 62px/1.2 var(--font-display); color: var(--muted); }
    .ost-btn { position: absolute; left: 110px; top: 830px; width: 860px; min-height: 170px; box-sizing: border-box; padding: 26px 40px 26px 150px;
      display: flex; align-items: center; border: 5px solid var(--ink); border-radius: 90px; background: var(--accent); color: var(--on-accent);
      font: 700 50px/1.2 var(--font-body); box-shadow: 0 12px 0 var(--ink); text-wrap: balance; }
    .ost-btn::before { content: ""; position: absolute; left: 58px; top: 50%; margin-top: -30px; border-left: 50px solid var(--on-accent);
      border-top: 30px solid transparent; border-bottom: 30px solid transparent; }
    .ost-mascot { position: absolute; left: 400px; top: 1130px; width: 280px; }
  `);
  K.registerHook("outro", "start", (stage, { S, T, s, at }) => {
    const outro = h("div", "scene", stage);
    show(outro, s.start);
    const head = h("div", "ost-head", outro);
    const l1 = h("div", "ost-l1", head, S.outro.line1);
    const l2 = h("div", "ost-l2", head, S.outro.line2);
    const btn = h("div", "ost-btn", outro, S.outro.line3);
    const bot = h("img", "mascot ost-mascot", outro);
    bot.src = `assets/mascot-${T.poses.outro}.png`;
    const credit = h("div", "credit", outro, S.outro.credit || "");
    fadeUp(l1, at(0.3), 0.5);
    fadeUp(l2, at(0.9), 0.5);
    tl.fromTo(btn, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" }, at(1.6));
    tl.fromTo(btn, { y: 0 }, { y: 10, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, at(2.7));
    tl.fromTo(bot, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" }, at(2.2));
    fadeUp(credit, at(3.4), 0.5, 10);
  });
})();
