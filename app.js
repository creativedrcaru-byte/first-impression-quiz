const questions = [
  {roles:['사교계 인사이자 배우','연인을 살해한 혐의로 교수형에 처해진 여성'],bad:1,answer:'A'},
  {roles:['할리우드 스타','아우슈비츠의 SS 경비병'],bad:1,answer:'A'},
  {roles:['남극 탐험가','6명을 살해하고 황산으로 시신을 훼손한 범죄자'],bad:1,answer:'B'},
  {roles:['사기꾼','교육과 의학 연구에 수백만 달러를 기부한 사업가'],bad:0,answer:'A'},
  {roles:['발명가','홀로코스트에 가담한 나치 전범'],bad:1,answer:'A'},
  {roles:['여성 참정권 운동에 참여하고 여성 시설을 설립한 인물','21명을 독살한 여성 연쇄살인범'],bad:1,answer:'B'},
  {roles:['국가에 수백만 파운드 상당의 그림을 기부한 인물','런던의 절도 전문 갱단 조직원'],bad:1,answer:'A'},
  {roles:['엔지니어이자 발명가','7명 넘는 피해자를 성폭행하고 살해한 범죄자'],bad:1,answer:'A'}
];
const app = document.getElementById('app');
let current = 0, choices = [], mode = 'end', revealed = false, locked = false, finished = false;
const imagePath = (n,side) => `assets/${n}${side}.jpg`;
function roleFor(q,side){return q.roles[side===q.answer?q.bad:1-q.bad];}
function renderQuestion(){
  const q=questions[current];
  app.innerHTML=`<div class="eyebrow">A QUESTION OF FIRST IMPRESSIONS</div><h1 id="question-title" tabindex="-1">다음 중 악인을 고르세요.</h1><p class="intro">두 사람의 사진을 보고, 아래 설명 중 ‘악인’에 해당한다고 생각하는 사람을 선택하세요.</p>
  <div class="question-header"><div class="counter"><strong>${String(current+1).padStart(2,'0')}</strong><span>/ 08</span></div><label class="mode">정답 공개 <select aria-label="정답 공개" id="mode" ${choices.length?'disabled':''}><option value="end" ${mode==='end'?'selected':''}>마지막에 · 추천</option><option value="each" ${mode==='each'?'selected':''}>매 문항 선택 후</option></select></label></div>
  <div class="progress" aria-label="8문항 중 ${current+1}번째">${questions.map((_,i)=>`<i class="${i===current?'current':i<current?'done':''}"></i>`).join('')}</div>
  <div class="portraits">${['A','B'].map(side=>`<button class="portrait ${choices[current]===side?'selected':''}" data-side="${side}" aria-label="${current+1}번 ${side} 인물 선택" ${locked||revealed?'disabled':''}><img src="${imagePath(current+1,side)}" alt="${current+1}번 ${side} 인물 사진"><span class="portrait-bottom"><span class="letter">${side}</span><span class="choose-label">${choices[current]===side?'선택함 ✓':'이 사람 선택 →'}</span></span></button>`).join('')}</div>
  <div class="comparison"><span class="comparison-label">두 사람 중 한 명은</span><div class="roles"><span>${q.roles[0]}</span><em>VS</em><span>${q.roles[1]}</span></div></div>
  ${revealed?`<div class="feedback" role="status"><button id="next" class="primary">${current===7?'결과 보기':'다음 문항 →'}</button><strong>${choices[current]===q.answer?'맞혔습니다.':'정답을 확인하세요.'} 정답은 ${q.answer}입니다.</strong><br>A: ${roleFor(q,'A')}<br>B: ${roleFor(q,'B')}</div>`:''}
  <div class="below"><button id="back" class="back" ${current===0||locked?'disabled':''}>← 이전 문항</button><span>${mode==='end'?'선택하면 다음 문항으로 넘어갑니다.':'선택 후 정답과 설명을 확인합니다.'} <span class="keyboard-hint">· A / B 키</span></span></div>`;
  document.getElementById('mode').onchange=e=>{mode=e.target.value;renderQuestion();};
  app.querySelectorAll('[data-side]').forEach(b=>b.onclick=()=>choose(b.dataset.side));
  document.getElementById('back').onclick=()=>{if(current>0&&!locked){current--;revealed=false;renderQuestion();}};
  const next=document.getElementById('next'); if(next)next.onclick=advance;
}
function choose(side){
  if(locked||revealed||finished)return;
  choices[current]=side;
  if(mode==='each'){revealed=true;renderQuestion();document.getElementById('next').focus();return;}
  locked=true;renderQuestion();
  setTimeout(()=>{locked=false;advance();},240);
}
function advance(){revealed=false;if(current<questions.length-1){current++;renderQuestion();document.getElementById('question-title').focus({preventScroll:true});}else{finished=true;renderResults();window.scrollTo(0,0);}}
function renderResults(){
  const score=questions.reduce((n,q,i)=>n+(choices[i]===q.answer),0);
  app.innerHTML=`<div class="result-top"><div class="eyebrow">YOUR CHOICES, REVEALED</div><h1 id="result-title" tabindex="-1">당신의 첫인상은<br>어떤 선택을 했나요?</h1><div class="score">${score}<small> / 8</small></div><p class="intro">제공된 정답표와 일치한 선택 수입니다.</p><div class="callout"><h2>우리는 무엇을 보고 판단했을까요?</h2><p>사진 속 표정, 옷차림, 분위기 중 무엇이 선택에 영향을 주었나요?<br>이번 선택의 근거와 실제로 확인할 수 있는 사실을 함께 이야기해 보세요.</p></div><button class="primary" id="restart">처음부터 다시 하기 ↻</button></div>
  <div class="results-heading"><h2>8개의 선택, 정답 확인</h2><span>내 선택과 두 사람의 설명</span></div>
  <div class="result-list">${questions.map((q,i)=>`<article class="result-card"><header><strong>${String(i+1).padStart(2,'0')} <span style="font-weight:400">· 내 선택 ${choices[i]} / 정답 ${q.answer}</span></strong><span class="tag ${choices[i]===q.answer?'':'wrong'}">${choices[i]===q.answer?'일치':'불일치'}</span></header><div class="result-faces">${['A','B'].map(side=>`<div class="result-face"><img src="${imagePath(i+1,side)}" alt="${i+1}번 ${side} 인물"><p><b>${side}</b>${side===q.answer?'<span class="answer-indicator">정답 인물</span>':'<span class="answer-indicator">&nbsp;</span>'}${roleFor(q,side)}</p></div>`).join('')}</div></article>`).join('')}</div>
  <p class="result-note">사진, 인물 설명과 정답은 제공된 원본 이미지 기준입니다. 정답 순서: A · A · B · A · A · B · A · A.<br>이 활동은 첫인상에 대해 토론하기 위한 자료이며, 성격이나 도덕성을 진단하는 검사가 아닙니다.</p>`;
  document.getElementById('restart').onclick=()=>{current=0;choices=[];revealed=false;locked=false;finished=false;renderQuestion();window.scrollTo(0,0);};
  document.getElementById('result-title').focus({preventScroll:true});
}
document.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||['SELECT','INPUT','TEXTAREA','BUTTON'].includes(e.target.tagName))return;const key=e.key.toUpperCase();if(key==='A'||key==='B'){e.preventDefault();choose(key);}});
document.getElementById('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.getElementById('fullscreen').textContent='브라우저 F11로 전체 화면';}};
document.addEventListener('fullscreenchange',()=>{document.getElementById('fullscreen').textContent=document.fullscreenElement?'전체 화면 종료 ↙':'전체 화면 ↗';});
renderQuestion();
