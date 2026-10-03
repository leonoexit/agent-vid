// Project intro: answer first, then the three supporting ideas (pyramid principle).
(function () {
  const K = window.ExplainerKit;
  const { tl, h, fadeUp, out, show } = K;
  K.css(`
    .pointer-opening .intro-title { top: 180px; }
    .pointer-answer { position:absolute; left:70px; right:70px; top:520px; text-align:center; font:400 78px/1.2 var(--font-display); }
    .pointer-answer .accent { display:block; margin-top:12px; }
    .pointer-pillars { position:absolute; left:120px; right:120px; top:850px; display:flex; flex-direction:column; gap:28px; }
    .pointer-pillar { padding:24px 36px; border:4px solid var(--ink); border-radius:18px; background:var(--surface-2); font:600 42px/1.2 var(--font-body); }
    .pointer-opening .intro-mascot { left:750px; top:1340px; width:180px; }
  `);
  K.registerHook('intro', 'notify', (stage, {S,T,s,at,titleBox}) => {
    const intro=h('div','scene pointer-opening',stage);
    show(intro,s.start);
    const title=h('div','intro-title',intro);
    titleBox(title,S.title);
    fadeUp(title,at(0.1),0.45,16);
    const answer=h('div','pointer-answer',intro,S.intro.line1);
    h('span','accent',answer,`${S.intro.line2a} ${S.intro.line2b}`);
    fadeUp(answer,at(0.3),0.5,20);
    const pillars=h('div','pointer-pillars',intro);
    ['ĐỊA CHỈ · tìm đúng chỗ','ĐỌC · xem dữ liệu ở đó','SỬA · đổi dữ liệu ở đó'].forEach((text,i)=>{
      fadeUp(h('div','pointer-pillar',pillars,text),at(1.8+i*0.7),0.45,14);
    });
    const bot=h('img','mascot intro-mascot',intro);
    bot.src=`assets/mascot-${T.poses.intro}.png`;
    fadeUp(bot,at(2.2),0.45,12);
    out(intro,s.start+s.dur-0.45);
  });
})();
