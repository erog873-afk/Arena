const COIN="data:image/png;base64,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";(function(){
const COLORS=['#FF6B63','#20845F','#376FEA','#F6D14A','#A855F7','#14B8A6','#F97316','#EC4899'];
const COUNT=20;
let ME='',feePct=0;
let bets=[],gameId=1,phase='waiting',t=COUNT,winner=null,hash='',off=0,countEndsAt=0,animGame=0;
const $=id=>document.getElementById(id);
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=n=>n.toLocaleString('ru-RU');
const pct=(v,s)=>(v/s*100).toFixed(2).replace('.',',')+'%';
const total=()=>bets.reduce((a,b)=>a+b.v,0);
const rnd=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let x=Math.imul(seed^seed>>>15,1|seed);x=x+Math.imul(x^x>>>7,61|x)^x;return((x^x>>>14)>>>0)/4294967296};
const area=p=>Math.abs(p.reduce((s,a,i)=>{const b=p[(i+1)%p.length];return s+a[0]*b[1]-b[0]*a[1]},0))/2;
const clip=(p,nx,ny,d)=>{const o=[];for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],da=nx*a[0]+ny*a[1]-d,db=nx*b[0]+ny*b[1]-d;if(da<=0)o.push(a);if(da*db<0){const k=da/(da-db);o.push([a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k])}}return o};
const centroid=p=>{let x=0,y=0,A=0;p.forEach((a,i)=>{const b=p[(i+1)%p.length],c=a[0]*b[1]-b[0]*a[1];A+=c;x+=(a[0]+b[0])*c;y+=(a[1]+b[1])*c});A/=2;return[x/(6*A),y/(6*A)]};
/* Делим квадрат косыми линиями: площадь плитки = доля ставки */
function split(poly,items,out,r){
  if(items.length===1){out.push({b:items[0],poly});return}
  const sum=items.reduce((a,b)=>a+b.v,0);let acc=0,k=0;
  while(k<items.length-1&&acc+items[k].v/2<sum/2){acc+=items[k].v;k++}
  k=Math.max(1,k);
  const A=items.slice(0,k),B=items.slice(k),want=A.reduce((a,b)=>a+b.v,0)/sum*area(poly);
  const ang=r()*Math.PI,nx=Math.cos(ang),ny=Math.sin(ang),pr=poly.map(p=>nx*p[0]+ny*p[1]);
  let lo=Math.min(...pr),hi=Math.max(...pr);
  for(let i=0;i<40;i++){const m=(lo+hi)/2;area(clip(poly,nx,ny,m))<want?lo=m:hi=m}
  const d=(lo+hi)/2;
  split(clip(poly,nx,ny,d),A,out,r);split(clip(poly,-nx,-ny,-d),B,out,r);
}
const tiles=()=>{const o=[];if(bets.length)split([[0,0],[100,0],[100,100],[0,100]],[...bets],o,rnd(gameId));return o};
const pts=p=>p.map(a=>a[0].toFixed(3)+','+a[1].toFixed(3)).join(' ');

/* Точка внутри плитки, максимально удалённая от её границ (центр наибольшего вписанного круга) → [x, y, радиус] */
const pole=p=>{
  /* Аватарка стоит ровно в центре плитки (центр масс); если рядом граница — уменьшается, чтобы не вылезти за свою плитку */
  const c=centroid(p);
  return[c[0],c[1],inPoly(p,c[0],c[1])?edgeD(p,c[0],c[1]):0];
};
let L=null,els={},rowsKey='';
const NS='http://www.w3.org/2000/svg';
function buildEmpty(){
  L=null;els={};rowsKey='';
  $('stage').innerHTML='<div class="pvpArenaEmpty"><div class="pvpArenaEmptyGrid"></div><div class="pvpArenaEmptyRink"></div><div class="pvpArenaEmptyPuck"></div><p class="pvpArenaEmptyLabel">Ожидание ставок</p></div>';
  $('list').hidden=true;
}
function buildLayers(){
  const st=$('stage');
  st.innerHTML='<svg class="pvpArenaTilesSvg" viewBox="0 0 100 100" preserveAspectRatio="none"></svg><div class="pvpArenaOverlay"></div><div class="pvpArenaCountdown" hidden><p class="pvpArenaCountdownValue"></p></div>';
  L={svg:st.querySelector('svg'),ov:st.querySelector('.pvpArenaOverlay'),cd:st.querySelector('.pvpArenaCountdown'),cv:st.querySelector('.pvpArenaCountdownValue')};
  els={};
}
/* Арена НЕ пересоздаётся: элементы живут, обновляются только геометрия/прозрачность.
   Анимация появления играет только у новой плитки. */
function render(){
  $('total').textContent=fmt(total());$('pcount').textContent=bets.length;
  const s=total();
  if(!bets.length){
    if(L||!$('stage').firstChild)buildEmpty();
  }else{
    if(!L)buildLayers();
    const T=tiles(),seen={};
    T.forEach(x=>{
      const n=x.b.id;seen[n]=1;
      const dim=!!winner&&winner.id!==n;
      let e=els[n];
      if(!e){
        const g=document.createElementNS(NS,'g');g.setAttribute('class','pvpArenaTileGroup');
        g.style.setProperty('--pvp-arena-tile-enter-ms','420ms');
        const poly=document.createElementNS(NS,'polygon');poly.setAttribute('class','pvpArenaTilePolygon');
        poly.setAttribute('fill',x.b.c);poly.setAttribute('stroke','rgba(255,255,255,0.16)');poly.setAttribute('stroke-width','0.18');
        g.appendChild(poly);L.svg.appendChild(g);
        const av=document.createElement('div');av.className='pvpArenaAvatar';
        av.style.setProperty('--pvp-arena-tile-enter-ms','420ms');av.style.setProperty('--pvp-arena-avatar-delay','120ms');
        av.style.transition='opacity .6s';
        const im=document.createElement('img');im.className='pvpArenaAvatarImage';im.alt='';im.onerror=()=>{im.onerror=null;im.src=meAv(x.b.name)};im.src=x.b.av;
        av.appendChild(im);L.ov.appendChild(av);
        e=els[n]={g,poly,av,out:null};
      }
      e.poly.setAttribute('points',pts(x.poly));
      e.poly.setAttribute('fill-opacity',dim?.3:.96);
      const c=pole(x.poly),sz=Math.min(16,c[2]*1.84);   /* аватарка вписана в свою плитку: диаметр = 92% самого большого круга внутри */
      e.av.style.setProperty('--pvp-avatar-x',c[0]+'%');e.av.style.setProperty('--pvp-avatar-y',c[1]+'%');e.av.style.setProperty('--pvp-avatar-size',sz+'%');
      e.av.style.opacity=sz<2.2?0:(dim?.4:1);   /* слишком крошечная плитка — аватарку не показываем */
      if(winner&&winner.id===n){
        if(!e.out){const o=document.createElementNS(NS,'polygon');o.setAttribute('class','pvpArenaWinnerOutline');o.setAttribute('fill','none');o.setAttribute('stroke','#fff');o.setAttribute('stroke-width','1');L.svg.appendChild(o);e.out=o}
        e.out.setAttribute('points',pts(x.poly));
      }
    });
    Object.keys(els).forEach(n=>{if(!seen[n]){els[n].g.remove();els[n].av.remove();if(els[n].out)els[n].out.remove();delete els[n]}});
    L.cd.hidden=phase!=='count';L.cv.textContent=t;
    $('list').hidden=false;
    $('gid').textContent='Игра #'+gameId;
    $('hash').textContent='Хэш игры: '+hash;
    const view=[...bets].sort((a,b)=>(b.id===ME)-(a.id===ME)||b.v-a.v);
    const key=view.map(b=>b.id+':'+b.v).join('|');
    if(key!==rowsKey){rowsKey=key;
      $('rows').innerHTML=view.map(b=>`<div class="Cell--container Cell--container-md" style="opacity:1"><div class="Cell--before-md Cell--before"><img radius="100" src="${esc(b.av)}" alt="" data-f="${meAv(b.name)}" onerror="this.onerror=null;this.src=this.dataset.f" style="border-radius:100px"></div><div class="Cell--content"><div class="Cell--title-container"><div class="Cell--title"><h3>${b.id===ME?'Вы':esc(b.name)}</h3></div></div><div style="margin-bottom:3px"></div><div class="Cell--children">Шанс ${pct(b.v,s)}</div></div><div class="Cell--after"><div style="width:max-content"><div class="IconText--content" style="cursor:auto"><img radius="0" src="${COIN}" width="20" height="20" alt="" style="border-radius:0;margin-right:6px"><p style="color:rgb(255,191,50);font-size:16px;font-weight:600">${fmt(b.v)}</p></div></div></div></div>`).join('');
    }
  }
  document.querySelectorAll('#bets button').forEach(b=>b.disabled=phase==='run'||phase==='done');
  $('emojis').hidden=!bets.some(b=>b.id===ME);
}
const meAv=n=>'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#3390ec"/><text x="50" y="66" font-size="48" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">${esc(String(Array.from(n||'?')[0]||'?').toUpperCase())}</text></svg>`);
/* ====== ОНЛАЙН: вход через Telegram, события сервера (SSE) ====== */
let token='',es=null,failShown=false;
const notify=m=>{try{const w=tg();if(w&&w.showAlert&&w.isVersionAtLeast&&w.isVersionAtLeast('6.2')){w.showAlert(m);return}}catch(e){}alert(m)};
let balNow=0;
const setBal=n=>{balNow=Number(n)||0;$('balVal').textContent=fmt(balNow)};
async function api(path,body){
  const r=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(body||{})});
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(j.error||'Ошибка');
  return j;
}
const addBet=v=>{
  const before=balNow;
  if(before>=v)setBal(before-v);   /* сразу показываем списание, не ждём ответа сервера */
  return api('/api/bet',{amount:v}).then(r=>setBal(r.balance)).catch(e=>{setBal(before);notify(e.message)});
};

function applyState(s){
  off=s.now-Date.now();
  if(s.gameId!==gameId)reset();
  gameId=s.gameId;
  hash=s.hash.slice(0,8)+'...'+s.hash.slice(-8);
  feePct=s.fee||0;
  /* имя и аватарка игрока берутся из Telegram (сервер проверяет подпись initData) */
  bets=s.bets.map(b=>({id:b.id,name:b.name,v:b.v,c:b.c,av:b.photo||meAv(b.name)}));
  countEndsAt=s.countEndsAt;
  if(s.phase==='count')t=Math.max(0,Math.ceil((countEndsAt-(Date.now()+off))/1000));
  if(s.phase==='run'||s.phase==='done'){
    const w=bets.find(b=>b.id===s.winnerId)||null;
    if(s.phase==='run'){
      if(w&&animGame!==s.gameId){animGame=s.gameId;launch(w,s.seed,s.runStartAt,s.runDur)}
      return;
    }
    if(animGame!==s.gameId){animGame=s.gameId;winner=w;phase='done';render()}   /* зашёл уже после розыгрыша */
    return;
  }
  phase=s.phase;winner=null;render();
}
setInterval(()=>{if(phase==='count'){t=Math.max(0,Math.ceil((countEndsAt-(Date.now()+off))/1000));if(L)L.cv.textContent=t}},250);

function connect(){
  if(es)es.close();
  es=new EventSource('/events?token='+encodeURIComponent(token));
  es.addEventListener('state',e=>applyState(JSON.parse(e.data)));
  es.addEventListener('balance',e=>setBal(JSON.parse(e.data).balance));
  es.addEventListener('emoji',e=>{const d=JSON.parse(e.data);showEmoji(d.id,d.e)});
  es.onerror=()=>{if(es.readyState===2){es.close();setTimeout(start,2000)}};   /* сессия пропала — входим заново; обрывы сети EventSource переживает сам */
}
async function start(){
  try{
    const w=tg();
    if(w){try{w.ready();w.expand&&w.expand()}catch(e){}}
    let guest='';try{guest=localStorage.getItem('guest')||''}catch(e){}
    const r=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({initData:(w&&w.initData)||'',guest})});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||'Не удалось войти');
    if(j.guest){try{localStorage.setItem('guest',j.guest)}catch(e){}}
    token=j.token;ME=j.user.id;setBal(j.user.balance);failShown=false;
    connect();
  }catch(e){
    if(!failShown){failShown=true;notify(e.message||'Нет соединения с сервером')}
    setTimeout(start,3000);
  }
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&token&&(!es||es.readyState===2))start()});

/* ====== ШАЙБА: плавная непрерывная траектория (сплайн) по всей арене, без телепортов ====== */
function makePuck(){
  const p=document.createElement('div');p.className='pvpArenaPuck';
  p.innerHTML='<div class="pvpArenaPuckLabel"></div><div class="pvpArenaPuckInner"><div class="pvpArenaPuckRing"></div><div class="pvpArenaPuckMarkVertical"></div><div class="pvpArenaPuckMarkHorizontal"></div></div>';
  p.style.animation='pvpArenaAvatarEnter .3s ease-out both';
  return p;
}
/* Шайба летит прямыми, отскакивает от бортов арены, сперва быстро, потом трение → останавливается в плитке победителя.
   Путь считаем «развёрткой»: прямая от центра до зеркальной копии точки финиша, затем складываем обратно в арену. */
let raf=0,resetT=0;
const inPoly=(p,x,y)=>{let o=false;for(let i=0,j=p.length-1;i<p.length;j=i++){if((p[i][1]>y)!==(p[j][1]>y)&&x<(p[j][0]-p[i][0])*(y-p[i][1])/(p[j][1]-p[i][1])+p[i][0])o=!o}return o};
const edgeD=(p,x,y)=>{let m=1e9;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length],dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1;let t=((x-a[0])*dx+(y-a[1])*dy)/l;t=Math.max(0,Math.min(1,t));m=Math.min(m,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy))}return m};
/* Поле со скруглёнными углами: центр шайбы не уходит в «срезанный» угол, а скользит по его дуге — так шайба всегда видна, даже в самом углу */
const rr=(x,y,R)=>{if(!(R>0))return[x,y];const cx=x<R?R:x>100-R?100-R:x,cy=y<R?R:y>100-R?100-R:y,dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy);return d>R?[cx+dx*R/d,cy+dy*R/d]:[x,y]};
function landingPoint(poly,R,RND){
  /* Центр шайбы (плюсик) может дойти прямо до границы поля, в том числе до угла; круг шайбы при этом чуть уходит под край и обрезается */
  const lo=0.2,hi=99.8;
  const onB=(a,b)=>(a[0]<.01&&b[0]<.01)||(a[0]>99.99&&b[0]>99.99)||(a[1]<.01&&b[1]<.01)||(a[1]>99.99&&b[1]>99.99);
  const dIn=(x,y)=>{let m=1e9;for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length];if(onB(a,b))continue;const dx=b[0]-a[0],dy=b[1]-a[1],l=dx*dx+dy*dy||1;let t=((x-a[0])*dx+(y-a[1])*dy)/l;t=Math.max(0,Math.min(1,t));m=Math.min(m,Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy))}return m};
  const ok=q=>inPoly(poly,q[0],q[1])&&dIn(q[0],q[1])>=1.5;
  const r=RND();
  if(r<.15){const q=[50+(RND()-.5)*8,50+(RND()-.5)*8];if(ok(q))return q}
  if(r<.27&&R>0){const k=RND()*4|0,sx=k&1?1:-1,sy=k&2?1:-1,cx=k&1?100-R:R,cy=k&2?100-R:R,q=[cx+sx*R*.7071,cy+sy*R*.7071];if(ok(q))return q}   /* прямо в угол */
  if(r<.55){for(let i=0;i<120;i++){const k=RND()*4|0,t=lo+RND()*(hi-lo),q=rr(...(k===0?[lo,t]:k===1?[hi,t]:k===2?[t,lo]:[t,hi]),R);if(ok(q))return q}}
  for(let i=0;i<200;i++){const q=rr(lo+RND()*(hi-lo),lo+RND()*(hi-lo),R);if(ok(q))return q}
  const c=centroid(poly);return rr(Math.max(lo,Math.min(hi,c[0])),Math.max(lo,Math.min(hi,c[1])),R);
}
const CAM_ZOOM=2.6,CAM_IN=.35,CAM_IN_LEN=.1,CAM_OUT=.88;   /* во сколько раз приближаем; доли времени заезда: начало и длина наезда, начало отъезда */
let camEl=null;
function launch(w,seed,startAt,dur){
  phase='run';render();
  const RND=rnd(seed>>>0);
  const stage=$('stage'),puck=makePuck();
  /* камера: слой с плитками, аватарками и шайбой масштабируется и следует за шайбой */
  let cam=stage.querySelector(':scope>.pvpCam');
  if(!cam){cam=document.createElement('div');cam.className='pvpCam';stage.insertBefore(cam,stage.firstChild);if(L&&L.svg)cam.appendChild(L.svg);if(L&&L.ov)cam.appendChild(L.ov)}
  camEl=cam;
  const R=(parseFloat(getComputedStyle(stage).borderTopLeftRadius)||0)/(stage.clientWidth||1)*100;
  const tw=tiles().find(x=>x.b.id===w.id),end=landingPoint(tw.poly,R,RND);cam.appendChild(puck);
  const TT=tiles(),lab=puck.querySelector('.pvpArenaPuckLabel');
  let labW=0;
  const setLab=(x,y)=>{const h=TT.find(q=>inPoly(q.poly,x,y));if(h&&lab.textContent!==h.b.name){lab.textContent=h.b.name;labW=lab.offsetWidth}
    if(labW){const W=stage.clientWidth||1,px0=x*W/100,cx=Math.max(labW/2+4,Math.min(W-labW/2-4,px0));lab.style.transform='translateX(calc(-50% + '+(cx-px0)+'px))'}   /* подпись не заходит за левый/правый край поля */
    if(y<14){lab.style.setProperty('bottom','auto','important');lab.style.top='calc(100% + 6px)'}else{lab.style.removeProperty('bottom');lab.style.top=''}};
  setLab(50,50);
  const M=0,S=100,P0=[50,50],C=[end[0],end[1]];           /* арена 5..95, центр шайбы не заходит за борт */
  const fold=u=>{u=((u%(2*S))+2*S)%(2*S);return u>S?2*S-u:u};
  const unf=(v,k)=>(k&1)===0?k*S+v:k*S+(S-v);
  let cand=[];
  for(let i=-14;i<=14;i++)for(let j=-14;j<=14;j++){
    const dx=unf(C[0],i)-P0[0],dy=unf(C[1],j)-P0[1],d=Math.hypot(dx,dy);
    if(d>800&&d<1200&&Math.min(Math.abs(dx),Math.abs(dy))>120&&Math.abs(Math.abs(dx)-Math.abs(dy))>60)cand.push([dx,dy]);
  }
  const [DX,DY]=cand.length?cand[RND()*cand.length|0]:[unf(C[0],8)-P0[0],unf(C[1],5)-P0[1]];
  const DUR=dur;
  const step=()=>{
    const u=Math.max(0,Math.min(1,(Date.now()+off-startAt)/DUR)),f=1-Math.pow(1-u,4.2);   /* быстрый старт → долгое плавное торможение до нуля */
    const [px,py]=rr(fold(P0[0]+DX*f)+M,fold(P0[1]+DY*f)+M,R);
    puck.style.setProperty('--pvp-puck-x',px+'%');
    puck.style.setProperty('--pvp-puck-y',py+'%');
    setLab(px,py);
    /* приближение как в референсе: плавно наезжаем на шайбу, едем за ней, в конце отъезжаем на всё поле */
    const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
    const sc=1+(CAM_ZOOM-1)*sm((u-CAM_IN)/CAM_IN_LEN)*(1-sm((u-CAM_OUT)/(1-CAM_OUT)));
    const tx=Math.max(-(sc-1)*100,Math.min(0,50-sc*px)),ty=Math.max(-(sc-1)*100,Math.min(0,50-sc*py));   /* камера не выходит за границы поля */
    cam.style.transform=sc>1.0005?'translate('+tx+'%,'+ty+'%) scale('+sc+')':'';
    if(u<1){raf=requestAnimationFrame(step);return}
    winner=w;phase='done';render();
    puck.querySelector('.pvpArenaPuckInner').classList.add('isLanded');
    showWin(w);
  };
  raf=requestAnimationFrame(step);
}
function reset(){cancelAnimationFrame(raf);winner=null;animGame=0;if(camEl)camEl.style.transform=''}



/* Окно победителя: кто выиграл, сколько и во сколько раз больше ставки */
const winEl=$('winModal');
function showWin(w){
  const tot=total(),won=tot-Math.floor(tot*feePct/100),mult=w.v>0?won/w.v:1;
  $('wGame').textContent='Игра #'+gameId;
  const im=$('wAv');im.onerror=()=>{im.onerror=null;im.src=meAv(w.name)};im.src=w.av;
  $('wName').textContent=w.name;
  $('wMult').textContent='x'+mult.toFixed(2);
  $('wWon').textContent=fmt(won);$('wWon2').textContent=fmt(won);
  $('wChance').textContent='Шанс '+pct(w.v,tot);
  document.querySelectorAll('#winModal .wCoin').forEach(i=>i.src=COIN);
  winEl.classList.remove('closing');winEl.hidden=false;
}
const closeWin=()=>{if(winEl.hidden||winEl.classList.contains('closing'))return;winEl.classList.add('closing');setTimeout(()=>{winEl.hidden=true;winEl.classList.remove('closing')},280)};
$('wClose').onclick=closeWin;$('wX').onclick=closeWin;
$('wBack').addEventListener('click',e=>{if(e.target===$('wBack'))closeWin()});
/* Смайлик вылетает прямо в поле того игрока, который его нажал */
function showEmoji(name,em){
  const e=els[name];if(!L||!e)return;
  const g=k=>parseFloat(e.av.style.getPropertyValue(k))||50;
  const sz=g('--pvp-avatar-size'),x=g('--pvp-avatar-x'),y=g('--pvp-avatar-y')-sz*.42;   /* на верхней кромке аватарки */
  const d=document.createElement('div');d.className='pvpArenaEmoji';d.textContent=em;
  d.style.setProperty('--ex',(x+(Math.random()-.5)*6)+'%');d.style.setProperty('--ey',(y+(Math.random()-.5)*4)+'%');
  d.style.setProperty('--efs',Math.max(28,Math.round($('stage').clientWidth*.15))+'px');
  L.ov.appendChild(d);setTimeout(()=>d.remove(),2850);
}
document.querySelectorAll('#emojis .emojiBtn').forEach(b=>b.onclick=()=>api('/api/emoji',{e:b.dataset.e}).catch(()=>{}));
const btn=document.querySelectorAll('#bets button');
[100,500,2500].forEach((v,i)=>btn[i].onclick=()=>addBet(v));
/* «+» — «Новая ставка»: сумма от 10 до 20 000 */
const cb=$('customBet'),ci=$('cbInput'),cm=$('cbMeasure'),chint=$('cbHint'),cok=$('cbSend');
const MIN=10,MAX=20000;
const cbVal=()=>parseInt(ci.value.replace(/\D/g,''),10)||0;
const cbSync=()=>{const v=cbVal();ci.value=v?v.toLocaleString('ru-RU'):'';cm.textContent=ci.value||'0';ci.style.width=Math.ceil(cm.getBoundingClientRect().width+2)+'px';
  const okv=v>=MIN&&v<=MAX;cok.textContent=okv?'Отправить ставку':'Введите сумму';cok.disabled=!okv;
  cok.classList.toggle('bg-primary',okv);cok.classList.toggle('text-primary-foreground',okv);cok.classList.toggle('bg-secondary',!okv);cok.classList.toggle('text-secondary-foreground',!okv)};   /* пока сумма не подходит — серая кнопка «Введите сумму», от 25 — «Отправить ставку» */
const tg=()=>window.Telegram&&Telegram.WebApp;
const closeCB=()=>{if(cb.hidden||cb.classList.contains('closing'))return;cb.classList.add('closing');setTimeout(()=>{cb.hidden=true;cb.classList.remove('closing');document.documentElement.classList.remove('cbOpen');try{tg()&&tg().enableVerticalSwipes&&tg().enableVerticalSwipes()}catch(e){}},280)};
btn[3].onclick=()=>{cb.classList.remove('closing');cb.hidden=false;document.documentElement.classList.add('cbOpen');try{tg()&&tg().disableVerticalSwipes&&tg().disableVerticalSwipes()}catch(e){}ci.value='';cbSync()};   /* клавиатура сама не открывается — человек нажимает на поле сам */
ci.addEventListener('input',cbSync);
cb.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{ci.value=String(Math.min(MAX*10,cbVal()+Number(b.dataset.add)));cbSync()});
cok.onclick=()=>{const v=cbVal();if(v>=MIN&&v<=MAX){addBet(v);closeCB()}};
$('cbClose').onclick=closeCB;
$('cbBack').addEventListener('click',e=>{if(e.target===$('cbBack'))closeCB()});
ci.addEventListener('keydown',e=>{if(e.key==='Enter')cok.click();if(e.key==='Escape')closeCB()});
render();
start();
})();
