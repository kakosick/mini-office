const $=i=>document.getElementById(i),R=n=>Math.floor(Math.random()*n);
const cv=$('g'),c=cv.getContext('2d'),W=800,H=480,WALL=520,AIS=255;
let mode='play',tasks=0,fatigue=0,needBreak=false,best=0,coins=0,owned=0,outfit=0,spd=0,scene='office',fade=0,day=1,jam=false,evT=45,msg='',msgT=0,sitT=0,clock=540,lastMin=-1,msgs=0,cur=null,ca=null,amb=4;
const keys={},P={x:130,y:190,col:'#a78bfa',hair:'#ff7ab8',n:'Ты',z:1,mv:0,face:1};
const rr=(x,y,w,h,r)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fill()};

/* ---------- мир ---------- */
const desks=[[90,90],[260,90],[90,310],[260,310],[390,310]].map(([x,y])=>({x,y,w:80,h:40}));
const seats=desks.map(d=>d.y<200?[d.x+40,d.y+58]:[d.x+40,d.y-20]);
const arc={x:620,y:40,w:50,h:60},cof={x:700,y:40,w:50,h:50},sofa={x:600,y:400,w:140,h:44};
const walls=[{x:WALL-4,y:0,w:8,h:200},{x:WALL-4,y:300,w:8,h:H-300},{x:0,y:0,w:W,h:30}];
const plants=[[24,50],[495,445],[565,50],[775,300]],pr=plants.map(([x,y])=>({x:x-12,y:y-12,w:24,h:24}));
const printer={x:380,y:32,w:46,h:26},cooler={x:482,y:352,w:22,h:30};
const shop={x:436,y:34,w:30,h:38},tbl={x:610,y:225,w:90,h:50};
const OUT=['#a78bfa','#f472b6','#34d399','#fbbf24','#60a5fa'];
const solids=[...desks,arc,cof,sofa,...walls,...pr,printer,cooler,shop,tbl];
const stations=[{k:'desk',...desks[0],label:'E — взять задачу'},{k:'arcade',...arc,label:'E — играть в аркаду'},
{k:'coffee',...cof,label:'E — выпить кофе'},{k:'sofa',...sofa,label:'E — отдохнуть на диване'},{k:'shop',...shop,label:'E — магазин'},{k:'door',x:28,y:440,w:44,h:36,label:'E — выйти на улицу'},{k:'table',...tbl,label:'E — настольный теннис'},{k:'printer',...printer,label:'E — починить принтер'}];
const spots=[{x:645,y:120,e:'🎮'},{x:725,y:110,e:'☕'},{x:635,y:424,e:'😴'},{x:700,y:424,e:'😴'}];
const wins=[40,150,260,370,560,680];

const bg=document.createElement('canvas');bg.width=W;bg.height=H;const b=bg.getContext('2d');
function buildBG(){
 for(let y=0;y<H;y+=40)for(let x=0;x<WALL;x+=40){b.fillStyle=((x+y)/40)%2?'#c5d3dc':'#d1dde5';b.fillRect(x,y,40,40)}
 b.fillStyle='rgba(60,90,110,.16)';b.fillRect(0,235,WALL,40);
 b.fillStyle='#4a3326';b.fillRect(WALL,0,W-WALL,H);
 for(let y=0;y<H;y+=22)for(let x=WALL-66;x<W;x+=66){b.fillStyle=`hsl(27 38% ${38+((x*7+y*3)%9)}%)`;b.fillRect(x+(y/22%2)*33,y,64,20)}
 b.fillStyle='#4a3326';b.fillRect(WALL-66,0,62,H);
 b.fillStyle='#2f6b7a';b.beginPath();b.ellipse(670,260,95,48,0,0,7);b.fill();
 b.strokeStyle='#e9d9a6';b.lineWidth=3;b.setLineDash([8,6]);b.stroke();b.setLineDash([]);
 b.fillStyle='#34495e';b.fillRect(0,0,W,30);b.fillStyle='#22313f';b.fillRect(0,30,W,4);
 b.strokeStyle='#e8eef2';b.lineWidth=2;
 wins.forEach(x=>{b.clearRect(x,5,70,18);b.strokeRect(x,5,70,18);b.beginPath();b.moveTo(x+35,5);b.lineTo(x+35,23);b.stroke()});
 walls.slice(0,2).forEach(w=>{b.fillStyle='#34495e';b.fillRect(w.x,w.y,w.w,w.h);b.fillStyle='#5b7389';b.fillRect(w.x,w.y,2,w.h)});
 desks.forEach((d,i)=>{
  b.fillStyle='rgba(0,0,0,.18)';b.fillRect(d.x+3,d.y+4,d.w,d.h);
  b.fillStyle='#2d4a5a';b.beginPath();b.ellipse(seats[i][0],seats[i][1],11,10,0,0,7);b.fill();
  b.fillStyle='#b88d5e';b.fillRect(d.x,d.y,d.w,d.h);b.fillStyle='#8f6a42';b.fillRect(d.x,d.y+d.h-4,d.w,4);
  b.fillStyle='#1c2530';b.fillRect(d.x+26,d.y+3,28,17);b.fillRect(d.x+37,d.y+20,6,3);
  b.fillStyle='#2b3342';b.fillRect(d.x+26,d.y+27,28,7);
  b.fillStyle='#fff';b.beginPath();b.arc(d.x+12,d.y+16,5,0,7);b.fill();b.fillRect(d.x+60,d.y+8,12,16);
  b.fillStyle='#e0b24a';b.fillRect(d.x+70,d.y+4,4,6);
 });
 const f=(col,o)=>{b.fillStyle=col;b.beginPath();b.roundRect(...o,4);b.fill()};
 f('#4b2b9a',[arc.x,arc.y,arc.w,arc.h]);f('#ff4fa3',[arc.x+4,arc.y+2,42,5]);f('#0b0b22',[arc.x+8,arc.y+10,34,24]);
 f('#2a1766',[arc.x+6,arc.y+38,38,12]);f('#e34a4a',[arc.x+13,arc.y+41,6,6]);f('#ffd54f',[arc.x+28,arc.y+42,5,5]);f('#52c7d2',[arc.x+36,arc.y+42,5,5]);
 f('#56707d',[cof.x,cof.y,cof.w,cof.h]);f('#2b3a44',[cof.x+8,cof.y+8,34,16]);f('#e8eef2',[cof.x+19,cof.y+30,12,12]);f('#e34a4a',[cof.x+40,cof.y+30,5,5]);
 f('#1f8a7a',[sofa.x,sofa.y,sofa.w,sofa.h]);f('#17695d',[sofa.x,sofa.y,sofa.w,14]);
 f('#27a392',[sofa.x+6,sofa.y+14,62,26]);f('#27a392',[sofa.x+72,sofa.y+14,62,26]);f('#ff9a5c',[sofa.x+10,sofa.y+16,16,14]);
 f('#aab6bf',[printer.x,printer.y,printer.w,printer.h]);f('#fff',[printer.x+8,printer.y-4,30,8]);f('#3ddc84',[printer.x+38,printer.y+16,4,4]);
 f('#dfe9ee',[cooler.x,cooler.y+12,22,18]);f('#6ec6f5',[cooler.x+3,cooler.y,16,14]);
 plants.forEach(([x,y])=>{b.fillStyle='#9a5b3a';b.fillRect(x-7,y+2,14,10);
  [[-6,-2,7],[6,-3,7],[0,-8,8]].forEach(([a,d,r])=>{b.fillStyle='#2f9e5a';b.beginPath();b.arc(x+a,y+d,r,0,7);b.fill()})});
}
buildBG();

/* ---------- ИИ-коллеги ---------- */
const J=['Почему программисты любят тёмную тему? Свет притягивает баги.','Массив — как шкаф: всё по полкам, а нумерация с нуля.','Вчера мой код заработал с первого раза. Подозреваю подвох.','Лучший баг — тот, что воспроизводится только у начальства.','— Сколько программистов нужно для лампочки? — Ни одного, это аппаратная проблема.'];
const AM=['Кто за бабл-ти?','Дедлайн — это мем, но он реальный','За окном дождь, вайб имба','Тссс, не ломай мне вайб','Принтер опять кринж','Ну это база, без вариантов'];
const defs=[
['Алиса','#7c5cdb','#3a2a1e','Привет! Рада тебя видеть.','Разбираю отчёты, всё по плану.','Кофе — это святое. Я за!','Увидимся, заходи ещё!',['Интересная мысль!','Хм, надо подумать.']],
['Макс-бот','#d6457f','#222','Приветствую, коллега. Системы в норме.','Обработано 3 запроса. Точнее, 4.','Кофеин: загружаю. Пошли!','Отключаюсь. До связи.',['Запрос принят.','Не распознал, но звучит бодро.']],
['Нейра','#1f9d78','#b5532a','Ой, привет! Как твой день?','Пишу документацию. Никто не читает, но я стараюсь.','Обожаю перерывы! Особенно с аркадой.','Пока-пока! Удачи с задачами!',['Ого, расскажи подробнее!','Ммм, понимаю.']],
['Гриша-GPT','#e09a2b','#6b6b6b','О, привет. Я как раз думал о тебе… или о кофе.','Работаю. Ну, почти. Окно открыто.','Наконец-то разумное предложение.','Бывай. Я пошёл мечтать.',['Согласен, но с оговорками.','Ха, неплохо.']]];
const agents=defs.map(([n,col,hair,hi,work,cof,bye,x],i)=>({n,col,hair,L:{hi,work,cof,bye,x},seat:seats[i+1],x:seats[i+1][0],y:seats[i+1][1],st:'work',t:3+R(8)+i*2,path:[],mv:0,face:1,say:'',sayT:0,talk:false,fr:0,need:false,q:null,last:-999}));
function follow(a,dt){
 const p=a.path[0];if(!p)return true;
 const dx=p[0]-a.x,dy=p[1]-a.y,d=Math.hypot(dx,dy);
 if(d<3){a.path.shift();return!a.path.length}
 a.x+=dx/d*75*dt;a.y+=dy/d*75*dt;a.mv=1;a.face=dx||a.face;return false;
}
function updateAgent(a,dt){
 a.mv=0;if(a.talk)return;if(a.sayT>0)a.sayT-=dt;
 if(a.st==='work'){a.t-=dt;if(a.t<=0){a.spot=spots[R(spots.length)];a.path=[[a.x,AIS],[WALL+25,AIS],[a.spot.x,a.spot.y]];a.st='toRest'}}
 else if(a.st==='toRest'){if(follow(a,dt)){a.st='rest';a.t=6+R(6)}}
 else if(a.st==='rest'){a.t-=dt;if(a.t<=0){a.path=[[WALL+25,AIS],[WALL-25,AIS],[a.seat[0],AIS],[...a.seat]];a.st='toWork'}}
 else if(follow(a,dt)){a.st='work';a.t=8+R(8)}
}

/* ---------- игрок и взаимодействие ---------- */
const hit=(x,y)=>solids.some(r=>x+7>r.x&&x-7<r.x+r.w&&y+7>r.y&&y-7<r.y+r.h);
function movePlayer(dt){
 let dx=0,dy=0;
 if(keys.KeyA||keys.ArrowLeft)dx--;if(keys.KeyD||keys.ArrowRight)dx++;
 if(keys.KeyW||keys.ArrowUp)dy--;if(keys.KeyS||keys.ArrowDown)dy++;
 P.mv=dx||dy?1:0;if(!P.mv)return;P.face=dx||P.face;
 const l=Math.hypot(dx,dy),sp=150*(1+spd*.15)*(1-fatigue/300)*dt,nx=P.x+dx/l*sp,ny=P.y+dy/l*sp;
 const st=scene==='street';if(st||!hit(nx,P.y))P.x=nx;if(st||!hit(P.x,ny))P.y=ny;
 P.x=Math.max(10,Math.min(W-10,P.x));P.y=Math.max(10,Math.min(H-10,P.y));if(st)P.y=Math.max(250,Math.min(400,P.y));
}
function near(){if(scene==='street')return nearStreet();
 let r=null,bd=1e9;
 for(const a of agents){const d=Math.hypot(P.x-a.x,P.y-a.y);if(d<52&&d<bd){bd=d;r={k:'agent',a,label:'E — поговорить: '+a.n}}}
 if(r)return r;bd=75;
 for(const s of stations){if(s.k==='printer'&&!jam)continue;const d=Math.hypot(P.x-(s.x+s.w/2),P.y-(s.y+s.h/2));if(d<bd){bd=d;r=s}}
 return r;
}
function say(t){msg=t;msgT=3.2}
function hud(){
 $('sc').textContent=tasks;$('best').textContent=best;$('coins').textContent=coins;save();$('fat').style.width=fatigue+'%';
 $('fat').style.background=fatigue>=70?'var(--hot)':'var(--acc)';
 $('note').textContent=needBreak?'Задача сделана — пора отдохнуть!':'';
}
function interact(){
 const s=near();if(!s)return;
 if(s.k==='door'){go('street');return}
 if(s.k==='sdoor'){go('office');return}
 if(s.k==='sshop'){shopBuy(s.i);return}
 if(s.k==='agent')openChat(s.a);
 else if(s.k==='shop')buy();
 else if(s.k==='table')startPong();
 else if(s.k==='printer'){jam=false;coins+=3;say('Принтер починен! +3 монеты');beep(800);hud()}
 else if(s.k==='desk')needBreak?say('Сначала перерыв: аркада, кофе, диван или разговор.'):openTask();
 else if(s.k==='arcade'){mode='arcade';ar={x:W/2,items:[],t:20,pts:0,spawn:0}}
 else if(s.k==='coffee'){fatigue=Math.max(0,fatigue-20);needBreak=false;say('Кофе выпит. Можно возвращаться к работе.');beep(660);hud()}
 else{mode='sit';sitT=4}
}
let ac;function beep(f,d=.12){try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.value=.05;
 g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}

/* ---------- монеты, магазин, сохранение ---------- */
const IT=[['🪴',10,'растение'],['🖼️',20,'постер'],['💡',30,'лампу'],['🐱',50,'кота']];
function buy(){
 if(owned>=IT.length){say('Всё куплено — стол как с обложки!');return}
 const it=IT[owned];if(coins<it[1]){say(`Нужно ${it[1]} монет на ${it[2]}, у тебя ${coins}`);return}
 coins-=it[1];owned++;say(`Куплено: ${it[0]} на твой стол!`);beep(900,.2);hud();
}
function save(){try{localStorage.setItem('lamp',JSON.stringify({tasks,coins,owned,outfit,spd,best,day,fr:agents.map(a=>a.fr)}))}catch(e){}}
try{const s=JSON.parse(localStorage.getItem('lamp')||'null');if(s){tasks=s.tasks|0;coins=s.coins|0;owned=s.owned|0;outfit=s.outfit|0;spd=s.spd|0;P.col=OUT[outfit]||P.col;best=s.best|0;day=s.day|0||1;agents.forEach((a,i)=>a.fr=s.fr?.[i]|0)}}catch(e){}
/* ---------- простые задачи ---------- */
const WD=['КОТ','ДОМ','ЛЕС','СОН','МИР','КИТ','МАК'];
const CQ=[['[10,20,30].length','3','В массиве три элемента.'],['[1,2,3].includes(2)','true','Есть ли двойка в списке? Ответь true или false.'],
['["a","b","c"][0]','a','Индексы начинаются с нуля.'],['[1,2,3].push(4)','4','push возвращает новую длину массива.'],
['[1,2,3].reverse()[0]','3','После reverse первым станет последний.'],['[2,4].map(x => x + 1).join(",")','3,5','К каждому элементу прибавь 1.']];
const gens=[
 ()=>{const a=1+R(9),e=1+R(9);return{q:`${a} + ${e} = ?`,a:''+(a+e),h:`Начни с ${a} и прибавь ${e}.`}},
 ()=>{const s=1+R(5),d=1+R(3),r=[0,1,2].map(i=>s+d*i);return{q:`Продолжи ряд: ${r.join(', ')}, ?`,a:''+(s+d*3),h:`Каждый раз прибавляется ${d}.`}},
 ()=>{const w=WD[R(WD.length)];return{q:`Собери слово из букв: ${[...w].sort(()=>Math.random()-.5).join(' ')}`,a:w,h:`Первая буква — «${w[0]}».`}},
 ()=>{const q=CQ[R(CQ.length)];return{q:`Что вернёт код?\n${q[0]}`,a:q[1],h:q[2]}}];
const norm=s=>s.trim().replace(/\s+/g,'').toLowerCase();
function openTask(){
 cur=cur||gens[R(gens.length)]();mode='task';$('tq').textContent=cur.q;$('ta').value='';$('tf').textContent='';
 $('task').style.display='block';$('ta').focus();
}
function closeTask(){$('task').style.display='none';mode='play';for(const k in keys)keys[k]=false}
function submitTask(){
 if(norm($('ta').value)===norm(cur.a)){
  closeTask();cur=null;tasks++;coins+=3;fatigue=Math.min(100,fatigue+20);needBreak=true;
  say('Задача выполнена! +3 монеты. Заслужил перерыв.');beep(880,.25);hud();
 }else $('tf').textContent='Почти! Попробуй ещё раз.';
}
$('tb').onclick=submitTask;$('tc').onclick=closeTask;$('th').onclick=()=>{$('tf').textContent='Подсказка: '+cur.h};
$('ta').onkeydown=e=>{if(e.key==='Enter')submitTask();if(e.key==='Escape')closeTask()};

/* ---------- чат с коллегами ---------- */
function add(who,t){const m=document.createElement('div');m.className='m'+(who==='me'?' me':'');m.textContent=t;$('log').append(m);$('log').scrollTop=1e5}
function reply(a,t){
 t=t.toLowerCase();const h=(...w)=>w.some(x=>t.includes(x)),L=a.L,pick=s=>s[R(s.length)];
 if(h('помо','подскаж','задач','не получ'))return a.q?'Подсказка: '+a.q.h:cur?'Подсказка: '+cur.h:'Сначала возьми задачу у своего стола — тогда помогу.';
 if(h('шут','анекд','смеш'))return pick(J);
 if(h('кофе','чай','перерыв','аркад','игр'))return L.cof;
 if(h('пока','до встреч','бывай'))return L.bye;
 if(h('как дела','как ты','работ','чем занят'))return a.st==='rest'?'Я сейчас на перерыве — отдыхаю!':L.work;
 if(h('привет','здрав','хай'))return(a.last>-999&&clock-a.last>120?'Куда пропал? ':'')+(a.fr>=8?L.hi+' Мы же настоящие друзья!':needBreak?L.hi+' Ты закончил задачу? Загляни в аркаду!':L.hi);
 return pick(L.x);
}
function send(t,local){if(t.startsWith('Сыграем')&&ca){const a=ca;closeChat();startTtt(a);return}
 if(!t.trim()||!ca)return;add('me',t);$('ci').value='';beep(520,.06);const a=ca;
 if(a.q&&norm(t)===norm(a.q.a)){a.q=null;a.need=false;coins+=5;a.fr=Math.min(10,a.fr+2);$('cn').textContent=a.n+' ❤'+Math.floor(a.fr);
  setTimeout(()=>{add('bot','Верно, ты меня выручил! Спасибо!');say('+5 монет за помощь');beep(900,.2);hud()},400);return}
 const useAI=smp&&!local&&!/помо|подскаж|задач/i.test(t);hist.push('Игрок: '+t);
 (useAI?ask(a,t).catch(()=>reply(a,t)):new Promise(r=>setTimeout(()=>r(reply(a,t)),450))).then(ans=>{if(ca!==a)return;hist.push(a.n+': '+ans);add('bot',ans);a.fr=Math.min(10,a.fr+.5);$('cn').textContent=a.n+' ❤'+Math.floor(a.fr);beep(400,.06);
  if(++msgs%3===0){fatigue=Math.max(0,fatigue-5);if(needBreak){needBreak=false;say('Душевно поболтали — перерыв засчитан.')}hud()}});
}
function openChat(a){hist=[];ca=a;a.talk=true;a.sayT=0;mode='chat';$('cn').textContent=a.n+' ❤'+Math.floor(a.fr);$('log').textContent='';$('chat').style.display='flex';add('bot',reply(a,'привет'));if(a.need&&!a.q){a.q=gens[R(gens.length)]();add('bot','Выручи, я застряла! Ответь: '+a.q.q)}$('ci').focus()}
function closeChat(){if(ca){ca.talk=false;ca.last=clock}ca=null;$('chat').style.display='none';mode='play';for(const k in keys)keys[k]=false}
['Привет!','Как работа?','Пойдём на кофе?','Расскажи шутку','Помоги с задачей','Сыграем в крестики-нолики?'].forEach(t=>{const e=document.createElement('button');e.className='g';e.textContent=t;e.onclick=()=>send(t,1);$('qr').append(e)});
$('cs').onclick=()=>send($('ci').value);$('cx').onclick=closeChat;
$('ci').onkeydown=e=>{if(e.key==='Enter')send($('ci').value);if(e.key==='Escape')closeChat()};

/* ---------- свободный чат с ИИ ---------- */
let smp=null,hist=[];
try{window.claude?.use('sample').then(s=>smp=s).catch(()=>{})}catch(e){}
async function ask(a,t){
 const p=`Ты — ${a.n}, ИИ-коллега в уютной офисной игре. Твой характер: ${a.L.hi} Отвечай по-русски, 1–2 коротких предложения, дружелюбно, с лёгким юмором. Дружба с игроком: ${Math.floor(a.fr)} из 10. Сейчас ты ${a.st==='rest'?'на перерыве':'работаешь'}. Диалог:\n${hist.slice(-8).join('\n')}\nОтветь только репликой ${a.n}, без имени в начале.`;
 const r=await smp(p,{modelTier:'quick',cache:false});return(r.text||'').trim()||reply(a,t);
}
/* ---------- выход, телефон ---------- */
function esc(){if(mode==='arcade')endArcade();else if(mode==='pong'||mode==='ttt'){mode='play';for(const k in keys)keys[k]=false}}
document.querySelectorAll('#pad [data-k]').forEach(b=>{const k=b.dataset.k,on=e=>{e.preventDefault();if(mode!=='task'&&mode!=='chat')keys[k]=true},off=()=>{keys[k]=false};b.onpointerdown=on;b.onpointerup=off;b.onpointerleave=off;b.onpointercancel=off});
$('be').onclick=()=>{if(mode==='play')interact()};$('bx').onclick=esc;
function rest(t){fatigue=Math.max(0,fatigue-25);needBreak=false;mode='play';for(const k in keys)keys[k]=false;say(t);hud()}
/* ---------- настольный теннис ---------- */
let pg=null;
function startPong(){mode='pong';pg={bx:W/2,by:H/2,vx:260,vy:100,py:H/2,ay:H/2,ps:0,as:0}}
function updatePong(dt){
 const g=pg;if(keys.KeyW||keys.ArrowUp)g.py-=330*dt;if(keys.KeyS||keys.ArrowDown)g.py+=330*dt;g.py=Math.max(55,Math.min(H-55,g.py));
 g.ay+=Math.max(-230*dt,Math.min(230*dt,g.by-g.ay));g.bx+=g.vx*dt;g.by+=g.vy*dt;
 if(g.by<17||g.by>H-17)g.vy*=-1;
 if(g.vx<0&&g.bx<40&&g.bx>25&&Math.abs(g.by-g.py)<52){g.vx=Math.abs(g.vx)*1.06;g.vy=Math.max(-320,Math.min(320,g.vy+(g.by-g.py)*3));beep(500,.05)}
 if(g.vx>0&&g.bx>W-40&&g.bx<W-25&&Math.abs(g.by-g.ay)<52){g.vx=-Math.abs(g.vx)*1.06;g.vy=Math.max(-320,Math.min(320,g.vy+(g.by-g.ay)*3));beep(420,.05)}
 if(g.bx<0||g.bx>W){const lost=g.bx<0;lost?g.as++:g.ps++;g.bx=W/2;g.by=H/2;g.vx=lost?260:-260;g.vy=R(240)-120;beep(200,.15)}
 if(g.ps>=5||g.as>=5){const w=g.ps>=5;if(w)coins+=4;rest(w?`Победа 5:${g.as}! +4 монеты`:`Проиграл ${g.ps}:5, зато отдохнул!`)}
}
function drawPong(){
 const g=pg;c.fillStyle='#14532d';c.fillRect(0,0,W,H);c.strokeStyle='#fff';c.lineWidth=3;c.strokeRect(10,10,W-20,H-20);
 c.setLineDash([12,10]);c.beginPath();c.moveTo(W/2,10);c.lineTo(W/2,H-10);c.stroke();c.setLineDash([]);
 c.fillStyle='#fff';c.font='800 40px Nunito,sans-serif';c.textAlign='center';c.fillText(g.ps+'   '+g.as,W/2,60);
 c.fillStyle='#ffd54f';rr(24,g.py-45,10,90,4);c.fillStyle='#ff7ab8';rr(W-34,g.ay-45,10,90,4);c.fillStyle='#fff';c.beginPath();c.arc(g.bx,g.by,7,0,7);c.fill();
 c.font='14px Nunito,sans-serif';c.fillText('W/S или ▲▼ — ракетка. До 5 очков. Esc — выход',W/2,H-22);
}
/* ---------- крестики-нолики с коллегой ---------- */
let gt=null;
const LN=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],won=(b,p)=>LN.some(l=>l.every(i=>b[i]===p));
function aiMove(b){
 const f=p=>{for(const l of LN){const v=l.map(i=>b[i]);if(v.filter(x=>x===p).length===2&&v.includes(''))return l[v.indexOf('')]}};
 let m=f('O');if(m==null)m=f('X');if(m==null&&b[4]==='')m=4;
 if(m==null){const e=b.map((v,i)=>v?-1:i).filter(i=>i>=0);m=e[R(e.length)]}return m;
}
function startTtt(a){gt={b:Array(9).fill(''),a,wait:0,over:0,res:'',end:0};mode='ttt'}
function chk(){const b=gt.b;if(won(b,'X'))gt.res='win';else if(won(b,'O'))gt.res='lose';else if(b.every(v=>v))gt.res='draw';if(gt.res){gt.over=1;gt.end=1.6}}
function tPlay(i){if(!gt||gt.over||gt.wait>0||gt.b[i])return;gt.b[i]='X';beep(600,.06);chk();if(!gt.over)gt.wait=.5}
function updateTtt(dt){
 if(gt.over){if((gt.end-=dt)<=0){const r=gt.res;coins+=r==='win'?5:r==='draw'?2:1;gt.a.fr=Math.min(10,gt.a.fr+1);rest(r==='win'?'Победа! +5 монет':r==='draw'?'Ничья! +2 монеты':'Проиграл, зато весело! +1 монета')}}
 else if(gt.wait>0&&(gt.wait-=dt)<=0){gt.b[aiMove(gt.b)]='O';beep(420,.06);chk()}
}
cv.onclick=e=>{if(mode!=='ttt')return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H,cx=Math.floor((x-250)/100),cy=Math.floor((y-90)/100);if(cx>=0&&cx<3&&cy>=0&&cy<3)tPlay(cy*3+cx)};
function drawTtt(){
 c.fillStyle='#1c2937';c.fillRect(0,0,W,H);c.strokeStyle='#52c7d2';c.lineWidth=4;
 for(let i=1;i<3;i++){c.beginPath();c.moveTo(250+i*100,90);c.lineTo(250+i*100,390);c.moveTo(250,90+i*100);c.lineTo(550,90+i*100);c.stroke()}
 c.font='800 64px Nunito,sans-serif';c.textAlign='center';
 gt.b.forEach((v,i)=>{if(v){c.fillStyle=v==='X'?'#ffd54f':'#ff7ab8';c.fillText(v,300+i%3*100,162+Math.floor(i/3)*100)}});
 c.fillStyle='#e4edf3';c.font='700 18px Nunito,sans-serif';
 c.fillText(gt.over?(gt.res==='win'?'Ты победил!':gt.res==='lose'?gt.a.n+' побеждает':'Ничья'):'Твой ход (X): клик или цифры 1–9. Играешь с '+gt.a.n+'. Esc — выход',W/2,60);
}
/* ---------- улица под дождём ---------- */
const SH=[{n:'Мока',cx:180,col:'#f472b6',rgb:'244,114,182',what:'бабл-ти, 4 мон.'},{n:'Шмот',cx:340,col:'#a78bfa',rgb:'167,139,250',what:'новый худи, 12 мон.'},
 {n:'Техно',cx:500,col:'#22d3ee',rgb:'34,211,238',what:'кроссы-ускорители, 25 мон.'},{n:'Декор',cx:660,col:'#fbbf24',rgb:'251,191,36',what:'вещи на стол'}];
function go(sc){scene=sc;fade=1;P.x=sc==='street'?70:62;P.y=sc==='street'?320:408;beep(300,.2);if(sc==='street')say('☔ На улице дождь. Вайб!')}
function nearStreet(){
 if(P.x<110&&P.y<330)return{k:'sdoor',label:'E — вернуться в офис'};
 if(P.y<300)for(let i=0;i<4;i++)if(Math.abs(P.x-SH[i].cx)<55)return{k:'sshop',i,label:'E — '+SH[i].n+': '+SH[i].what};
 return null;
}
function shopBuy(i){
 if(i===3){buy();return}
 const cost=[4,12,25][i];
 if(coins<cost){say(`Не хватает монет: нужно ${cost}`);return}
 if(i===1&&outfit>=OUT.length-1){say('Гардероб полон — ты чистый вайб');return}
 if(i===2&&spd>=3){say('Кроссы уже на максималках');return}
 coins-=cost;
 if(i===0){fatigue=Math.max(0,fatigue-30);needBreak=false;say('🧋 Бабл-ти выпит. Вайб восстановлен')}
 if(i===1){outfit++;P.col=OUT[outfit];say('Новый худи! Ты выглядишь огонь')}
 if(i===2){spd++;say('Новые кроссы: ты быстрее!')}
 beep(900,.15);hud();
}
function lab(){const s=near();if(s&&mode==='play'){c.font='700 13px Nunito,sans-serif';c.textAlign='center';const w=c.measureText(s.label).width+16;c.fillStyle='rgba(20,30,40,.9)';rr(P.x-w/2,P.y-58,w,22,8);c.fillStyle='#fff';c.fillText(s.label,P.x,P.y-43)}}
function drawStreet(){
 const t=performance.now()/1000,g=c.createLinearGradient(0,0,0,H);
 g.addColorStop(0,'#150d2e');g.addColorStop(.5,'#2b1d4d');g.addColorStop(1,'#10131f');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.fillStyle='#1d1540';for(let i=0;i<14;i++)c.fillRect(i*60,60+(i*37)%50,44,180);
 c.fillStyle='#3a3f55';c.fillRect(0,240,W,180);c.fillStyle='#2a2f45';for(let x=0;x<W;x+=60)c.fillRect(x,240,2,180);
 c.fillStyle='#161a28';c.fillRect(0,420,W,60);c.fillStyle='#8a8fa8';for(let x=-80;x<W;x+=80)c.fillRect(x+(t*40)%80,452,40,3);
 c.fillStyle='#2d2a4a';c.fillRect(0,90,100,150);c.fillStyle='#111';c.fillRect(30,175,40,65);c.fillStyle='#ffe9a8';c.fillRect(10,110,24,24);c.fillRect(64,110,24,24);
 c.textAlign='center';c.font='800 18px Nunito,sans-serif';c.fillStyle='#fff';c.fillText('ОФИС',50,84);
 SH.forEach(s=>{const x=s.cx-70;c.fillStyle='#262140';c.fillRect(x,100,140,140);c.fillStyle=s.col;c.fillRect(x,100,140,16);
  c.fillStyle='#ffe9a8';c.fillRect(x+12,130,40,40);c.fillRect(x+88,130,40,40);c.fillStyle='#111';c.fillRect(s.cx-16,175,32,65);
  c.font='800 20px Nunito,sans-serif';c.shadowColor=s.col;c.shadowBlur=14;c.fillStyle='#fff';c.fillText(s.n,s.cx,92);c.shadowBlur=0});
 SH.forEach((s,i)=>{c.globalAlpha=.22;c.fillStyle=s.col;c.beginPath();c.ellipse(s.cx+20,330+(i%2)*40,46,10,0,0,7);c.fill();c.globalAlpha=1});
 [120,420,720].forEach(x=>{c.fillStyle='#555a70';c.fillRect(x-2,250,4,100);c.fillStyle='#ffd88a';c.beginPath();c.arc(x,250,6,0,7);c.fill()});
 const cx=((t*120)%1000)-100;c.fillStyle='#e11d48';rr(cx,436,74,22,6);c.fillStyle='#bfe9ff';c.fillRect(cx+48,440,16,8);
 person(P,false,null);
 c.globalCompositeOperation='lighter';[120,420,720].forEach(x=>glow(x,250,120,'255,200,120',.22));SH.forEach(s=>glow(s.cx,200,110,s.rgb,.18));glow(cx+80,448,50,'255,240,180',.35);c.globalCompositeOperation='source-over';
 c.strokeStyle='rgba(180,200,255,.45)';c.lineWidth=1;c.beginPath();
 for(let i=0;i<140;i++){const x=(i*67+t*70)%W,y=(i*131+t*520)%H;c.moveTo(x,y);c.lineTo(x-3,y+13)}c.stroke();
 c.fillStyle=vig;c.fillRect(0,0,W,H);lab();
 if(msgT>0){c.font='800 15px Nunito,sans-serif';c.textAlign='center';const w=c.measureText(msg).width+28;c.fillStyle='rgba(14,124,134,.95)';rr(W/2-w/2,40,w,30,10);c.fillStyle='#fff';c.fillText(msg,W/2,60)}
}
/* ---------- аркада ---------- */
let ar=null;
function endArcade(){
 const p=ar.pts;best=Math.max(best,p);fatigue=Math.max(0,fatigue-30);needBreak=false;mode='play';
 for(const k in keys)keys[k]=false;say(`Аркада: ${p} очк. Отдохнул — можно работать!`);beep(740,.25);hud();
}
function updateArcade(dt){
 if(keys.ArrowLeft||keys.KeyA)ar.x-=360*dt;if(keys.ArrowRight||keys.KeyD)ar.x+=360*dt;
 ar.x=Math.max(40,Math.min(W-40,ar.x));ar.t-=dt;ar.spawn-=dt;
 if(ar.spawn<=0){ar.spawn=.45;ar.items.push({x:30+R(W-60),y:-10,bomb:Math.random()<.25,v:140+R(120)})}
 for(const it of ar.items){it.y+=it.v*dt;
  if(!it.done&&it.y>H-48&&it.y<H-20&&Math.abs(it.x-ar.x)<44){it.done=1;ar.pts=Math.max(0,ar.pts+(it.bomb?-2:1));beep(it.bomb?150:900,.07)}}
 ar.items=ar.items.filter(i=>!i.done&&i.y<H+20);if(ar.t<=0)endArcade();
}
function drawArcade(){
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0d0a2e');g.addColorStop(1,'#3a1466');c.fillStyle=g;c.fillRect(0,0,W,H);
 c.fillStyle='#fff';for(let i=0;i<40;i++)c.fillRect((i*97)%W,(i*53+performance.now()/20*(1+i%3))%H,2,2);
 c.fillStyle='#ffe9fb';c.font='800 22px Nunito,monospace';c.textAlign='left';c.fillText('АРКАДА   очки: '+ar.pts,20,34);
 c.textAlign='right';c.fillText(Math.ceil(ar.t)+' с',W-20,34);c.textAlign='center';c.font='26px serif';
 ar.items.forEach(it=>c.fillText(it.bomb?'💣':'⭐',it.x,it.y));
 c.fillStyle='#52c7d2';rr(ar.x-40,H-40,80,14,6);
 c.fillStyle='#c9b8ee';c.font='14px Nunito,monospace';c.fillText('← → ловить звёзды, обходить бомбы. Esc — выход',W/2,H-10);
}

/* ---------- рисование ---------- */
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const SK={d:[[143,211,244],[214,240,255]],s:[[255,154,98],[255,217,160]],n:[[16,25,58],[39,64,107]]};
function sky(h){return h<15.5?SK.d:h<18?SK.d.map((v,i)=>mix(v,SK.s[i],(h-15.5)/2.5)):h<19.5?SK.s.map((v,i)=>mix(v,SK.n[i],(h-18)/1.5)):SK.n}
function glow(x,y,r,rgb,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}
function bubble(x,y,t){
 c.font='700 12px Nunito,sans-serif';c.textAlign='center';const w=c.measureText(t).width+14;
 c.fillStyle='#fff';rr(x-w/2,y-22,w,21,8);c.beginPath();c.moveTo(x-4,y-2);c.lineTo(x+4,y-2);c.lineTo(x,y+4);c.fill();
 c.fillStyle='#1b2733';c.fillText(t,x,y-8);
}
function person(p,sit,em){
 const t=performance.now()/1000,bob=p.mv?Math.sin(t*12)*1.5:0,sw=p.mv?Math.sin(t*12)*3:0,x=p.x,y=p.y+(sit?4:0);
 c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(x,y+10,10,4,0,0,7);c.fill();
 if(!sit){c.fillStyle=p.z?'#4b5563':'#2b3342';c.fillRect(x-6+sw,y+3,5,8);c.fillRect(x+1-sw,y+3,5,8);if(p.z){c.fillStyle='#fff';c.fillRect(x-7+sw,y+9,7,3);c.fillRect(x-sw,y+9,7,3)}}
 c.fillStyle=p.col;rr(x-(p.z?9:7),y-7+bob,p.z?18:14,13,4);
 c.fillStyle='#f0c8a0';c.beginPath();c.arc(x,y-12+bob,7,0,7);c.fill();
 c.fillStyle=p.hair;c.beginPath();c.arc(x,y-14+bob,7,Math.PI,0);c.fill();
 if(p.z){c.strokeStyle='#ff4fa3';c.lineWidth=2.5;c.beginPath();c.arc(x,y-13+bob,8.5,Math.PI,0);c.stroke();c.fillStyle='#ff4fa3';c.fillRect(x-11,y-14+bob,4,7);c.fillRect(x+7,y-14+bob,4,7)}
 c.fillStyle='#222';const f=p.face>0?1:-1;c.fillRect(x-3+f,y-12+bob,2,2);c.fillRect(x+2+f,y-12+bob,2,2);
 c.font='700 11px Nunito,sans-serif';c.textAlign='center';const w=c.measureText(p.n).width+10;
 c.fillStyle='rgba(20,30,40,.75)';rr(x-w/2,y+13,w,15,6);c.fillStyle='#fff';c.fillText(p.n,x,y+24);
 if(p.sayT>0)bubble(x,y-26,p.say);else if(em){c.font='16px serif';c.fillText(em,x,y-26)}
}
function draw(){
 if(mode==='arcade'){drawArcade();return}if(mode==='pong'){drawPong();return}if(mode==='ttt'){drawTtt();return}if(scene==='street'){drawStreet();return}
 const h=clock/60,[top,bot]=sky(h).map(v=>mix(v,[84,76,122],.6)),dark=Math.max(.22,h<15?0:Math.min(.5,(h-15)/6*.5));
 wins.forEach(x=>{const g=c.createLinearGradient(0,5,0,23);g.addColorStop(0,`rgb(${top})`);g.addColorStop(1,`rgb(${bot})`);c.fillStyle=g;c.fillRect(x,5,70,18)});
 c.drawImage(bg,0,0);
 const rn=performance.now()/1000;c.strokeStyle='rgba(200,215,255,.6)';c.lineWidth=1;
 wins.forEach((x,k)=>{for(let i=0;i<5;i++){const px=x+((i*17+k*5+rn*30)%70),py=5+((i*9+rn*50*(1+i%2))%16);c.beginPath();c.moveTo(px,py);c.lineTo(px-1.5,py+5);c.stroke()}});
 c.fillStyle='#fff';c.beginPath();c.arc(470,15,9,0,7);c.fill();c.strokeStyle='#1b2733';c.lineWidth=1.5;c.stroke();
 const hr=h%12/12*6.283,mn=clock%60/60*6.283;c.beginPath();c.moveTo(470,15);c.lineTo(470+Math.sin(hr)*5,15-Math.cos(hr)*5);c.moveTo(470,15);c.lineTo(470+Math.sin(mn)*7,15-Math.cos(mn)*7);c.stroke();
 desks.forEach((d,i)=>{const on=i?agents[i-1].st==='work':!needBreak;c.fillStyle=on?(i?'#52c7d2':'#7ee0ea'):'#101820';c.fillRect(d.x+28,d.y+5,24,13);
  if(on&&Math.random()<.04){c.fillStyle='#fff';c.fillRect(d.x+30,d.y+8,8+R(10),2)}});
 c.fillStyle='#e34a4a';rr(shop.x,shop.y,shop.w,shop.h,4);c.fillStyle='#1c2530';c.fillRect(shop.x+4,shop.y+5,22,20);c.fillStyle='#ffd54f';c.fillRect(shop.x+6,shop.y+8,6,6);c.fillStyle='#7ee0ea';c.fillRect(shop.x+16,shop.y+8,6,6);
 c.font='18px serif';c.textAlign='center';IT.slice(0,owned).forEach((it,i)=>c.fillText(it[0],[162,130,98,150][i],[110,80,126,127][i]));
 if(jam)c.fillText('🔧',printer.x+23,printer.y-8);
 c.fillStyle='#1d6b4a';rr(tbl.x,tbl.y,tbl.w,tbl.h,4);c.strokeStyle='#fff';c.lineWidth=2;c.strokeRect(tbl.x+3,tbl.y+3,tbl.w-6,tbl.h-6);c.beginPath();c.moveTo(tbl.x+tbl.w/2,tbl.y+3);c.lineTo(tbl.x+tbl.w/2,tbl.y+tbl.h-3);c.stroke();
 const lg=c.createLinearGradient(0,0,W,0);lg.addColorStop(0,'#ff4fa3');lg.addColorStop(.5,'#52c7d2');lg.addColorStop(1,'#a78bfa');c.fillStyle=lg;c.fillRect(0,30,W,3);
 c.font='800 15px Nunito,sans-serif';c.textAlign='center';c.shadowColor='#ff4fa3';c.shadowBlur=12;c.fillStyle='#ffd1ec';c.fillText('no cap, just vibes',215,64);c.shadowBlur=0;
 c.fillStyle='#3b2a5e';rr(28,440,44,36,4);c.shadowColor='#ff4fa3';c.shadowBlur=8;c.fillStyle='#ff9fd0';c.font='700 10px Nunito,sans-serif';c.fillText('ВЫХОД',50,462);c.shadowBlur=0;
 const tt=performance.now()/1000;c.fillStyle=Math.sin(tt*6)>0?'#ff4fa3':'#52c7d2';c.fillRect(arc.x+10,arc.y+14,30,14);
 for(let i=0;i<11;i++){const x=535+i*25;c.fillStyle=['#ffd54f','#ff7ab8','#7ee0ea','#9be37a'][i%4];c.globalAlpha=.6+.4*Math.sin(tt*3+i);
  c.beginPath();c.arc(x,36+Math.sin(i*.9)*3,3,0,7);c.fill()}c.globalAlpha=1;
 const ppl=[...agents.map(a=>({y:a.y,f:()=>person(a,a.st==='work',a.need?'🆘':a.st==='work'?'⌨️':a.st==='rest'?a.spot.e:null)})),
  {y:P.y,f:()=>person(P,mode==='sit',mode==='sit'?'💤':needBreak?'🎉':null)}].sort((p,q)=>p.y-q.y);
 ppl.forEach(p=>p.f());
 const s=near();
 if(s&&mode==='play'){c.font='700 13px Nunito,sans-serif';c.textAlign='center';const w=c.measureText(s.label).width+16;
  c.fillStyle='rgba(20,30,40,.9)';rr(P.x-w/2,P.y-58,w,22,8);c.fillStyle='#fff';c.fillText(s.label,P.x,P.y-43)}
 c.fillStyle=`rgba(34,14,70,${dark})`;c.fillRect(0,0,W,H);
 c.globalCompositeOperation='lighter';const k=.25+dark*.8;
 desks.forEach((d,i)=>{glow(d.x+72,d.y+8,60,'255,214,140',.18*k);if(i?agents[i-1].st==='work':!needBreak)glow(d.x+40,d.y+30,50,'82,199,210',.12*k)});
 glow(arc.x+25,arc.y+40,90,'255,79,163',(.15+.05*Math.sin(tt*6))*k*1.6);glow(cof.x+25,cof.y+30,50,'255,170,80',.15*k);
 glow(670,36,170,'255,200,120',.14*k);[100,300,500,700].forEach((x,i)=>glow(x,34,110,i%2?'82,199,210':'255,79,163',.16*k));wins.forEach(x=>glow(x+35,30,60,'255,230,180',.06*(1-dark)));
 c.globalCompositeOperation='source-over';
 c.fillStyle=vig;c.fillRect(0,0,W,H);
 if(msgT>0){c.font='800 15px Nunito,sans-serif';c.textAlign='center';const w=c.measureText(msg).width+28;
  c.fillStyle='rgba(14,124,134,.95)';rr(W/2-w/2,40,w,30,10);c.fillStyle='#fff';c.fillText(msg,W/2,60)}
}
const vig=c.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,W*.65);vig.addColorStop(0,'rgba(0,0,0,0)');vig.addColorStop(1,'rgba(0,0,0,.35)');

/* ---------- цикл ---------- */
addEventListener('keydown',e=>{
 if(mode==='task'||mode==='chat')return;
 keys[e.code]=true;if(mode==='ttt'&&/^Digit[1-9]$/.test(e.code))tPlay(+e.code[5]-1);
 if(e.code==='KeyE'&&mode==='play')interact();
 if(e.code==='Escape')esc();
 if(e.code.startsWith('Arrow'))e.preventDefault();
});
addEventListener('keyup',e=>{keys[e.code]=false});
let last=performance.now();
function loop(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;
 if(msgT>0)msgT-=dt;
 clock+=dt*2;if(clock>=1260){day++;clock=540;say(`День ${day-1} завершён: задач ${tasks}, монет ${coins}`);hud()}
 const mi=Math.floor(clock);if(mi!==lastMin){lastMin=mi;$('tm').textContent='День '+day+', '+String(Math.floor(mi/60)).padStart(2,'0')+':'+String(mi%60).padStart(2,'0')}
 agents.forEach(a=>updateAgent(a,dt));
 if((amb-=dt)<=0){amb=5+R(6);const a=agents[R(4)];if(!a.talk&&(a.st==='work'||a.st==='rest')){a.say=AM[R(AM.length)];a.sayT=3.5}}
 if((evT-=dt)<=0){evT=40+R(40);const r=R(3);
  if(r===0){fatigue=Math.max(0,fatigue-10);say('🍩 Кто-то принёс пончики! Усталость падает');agents.forEach(a=>{a.say='Ура, пончики!';a.sayT=3});beep(1000,.2);hud()}
  else if(r===1&&!jam){jam=true;say('🔧 Принтер завис! Подойди и почини')}
  else{const a=agents[R(4)];if(!a.need){a.need=true;say(a.n+' просит помощи!')}}}
 if(mode==='play')movePlayer(dt);
 else if(mode==='arcade')updateArcade(dt);else if(mode==='pong')updatePong(dt);else if(mode==='ttt')updateTtt(dt);
 else if(mode==='sit'){sitT-=dt;if(sitT<=0){mode='play';fatigue=Math.max(0,fatigue-40);needBreak=false;say('Отдохнул на диване. Бодр и готов!');beep(700,.2);hud()}}
 draw();if(fade>0){fade-=dt*2;c.fillStyle=`rgba(10,5,25,${Math.min(1,fade)})`;c.fillRect(0,0,W,H)}requestAnimationFrame(loop);
}
hud();requestAnimationFrame(loop);
