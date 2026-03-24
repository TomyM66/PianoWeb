'use strict';

const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {

const CHROMATIC=[{name:'C',black:false},{name:'C#',black:true},{name:'D',black:false},{name:'D#',black:true},{name:'E',black:false},{name:'F',black:false},{name:'F#',black:true},{name:'G',black:false},{name:'G#',black:true},{name:'A',black:false},{name:'A#',black:true},{name:'B',black:false}];
const OCTAVES=[4,5,6];
const KB_WHITE=['a','z','e','r','t','y','u','i','o','p','q','s','d','f','g','h','j','k','l','m','w','x','c','v','b','n',',',';'];
const SAMPLES_BASE='https://tonejs.github.io/audio/salamander/';
const WHITE_KEY_W=54;
const SOLFEGE_MAP={do:'C',ré:'D',re:'D',mi:'E',fa:'F',sol:'G',la:'A',si:'B',ti:'B'};

let isRecording=false, recordedNotes=[], recordStart=0, readerPlayInterval=null, sampler=null;

/* ══ BUILD PIANO ══ */
const notes=[];
for(const oct of OCTAVES) for(const c of CHROMATIC) notes.push({full:`${c.name}${oct}`,name:c.name,black:c.black});

const keyMap={}, kbMap={};
const keysDiv=document.getElementById('keys');
let wi=0;
notes.forEach((note,i)=>{
  const el=document.createElement('div');
  if(!note.black){
    el.className='key-white'; el.dataset.note=note.full;
    const ch=KB_WHITE[wi]||'';
    el.innerHTML=`<span class="kb">${ch.toUpperCase()}</span><span class="lbl">${note.name}</span>`;
    if(ch) kbMap[ch]=note.full; wi++; keysDiv.appendChild(el);
  } else {
    const wb=notes.slice(0,i).filter(n=>!n.black).length;
    el.className='key-black'; el.dataset.note=note.full;
    el.style.left=`${wb*WHITE_KEY_W-11}px`;
    el.innerHTML=`<span class="kb"></span>`; keysDiv.appendChild(el);
  }
  keyMap[note.full]=el;
});

/* ══ AUDIO ══ */
function buildSampler(cb){
  const reverb=new Tone.Reverb({decay:2.8,wet:0.22}).toDestination();
  const eq=new Tone.EQ3({low:3,mid:0,high:-4,lowFrequency:300,highFrequency:4000}).connect(reverb);
  const comp=new Tone.Compressor({threshold:-24,ratio:3,attack:0.02,release:0.3}).connect(eq);
  const s=new Tone.Sampler({
    urls:{
      A0:'A0.mp3',C1:'C1.mp3','D#1':'Ds1.mp3','F#1':'Fs1.mp3',
      A1:'A1.mp3',C2:'C2.mp3','D#2':'Ds2.mp3','F#2':'Fs2.mp3',
      A2:'A2.mp3',C3:'C3.mp3','D#3':'Ds3.mp3','F#3':'Fs3.mp3',
      A3:'A3.mp3',C4:'C4.mp3','D#4':'Ds4.mp3','F#4':'Fs4.mp3',
      A4:'A4.mp3',C5:'C5.mp3','D#5':'Ds5.mp3','F#5':'Fs5.mp3',
      A5:'A5.mp3',C6:'C6.mp3','D#6':'Ds6.mp3','F#6':'Fs6.mp3',
      A6:'A6.mp3',C7:'C7.mp3','D#7':'Ds7.mp3','F#7':'Fs7.mp3',
      A7:'A7.mp3',C8:'C8.mp3'
    },
    release:1.6, baseUrl:SAMPLES_BASE, onload:cb
  });
  s.connect(comp); return s;
}

function playNote(noteStr,el){
  if(!sampler||!sampler.loaded) return;
  sampler.triggerAttackRelease(noteStr,'2n');
  animateKey(noteStr,el);
  if(isRecording) recordedNotes.push({note:noteStr,time:Date.now()-recordStart});
}

function animateKey(noteStr,el){
  el.classList.add('active');
  setTimeout(()=>el.classList.remove('active'),260);
  const rect=el.getBoundingClientRect();
  const f=document.createElement('div');
  f.className='note-flash'; f.textContent=noteStr.replace('#','♯');
  f.style.left=`${rect.left+rect.width/2-16}px`; f.style.top=`${rect.top-8}px`;
  document.body.appendChild(f); setTimeout(()=>f.remove(),800);
}

/* ══ EVENTS PIANO ══ */
keysDiv.addEventListener('mousedown',e=>{
  const el=e.target.closest('[data-note]');
  if(el){Tone.start();playNote(el.dataset.note,el);}
});
keysDiv.addEventListener('touchstart',e=>{
  e.preventDefault();
  for(const t of e.changedTouches){
    const el=document.elementFromPoint(t.clientX,t.clientY)?.closest('[data-note]');
    if(el){Tone.start();playNote(el.dataset.note,el);}
  }
},{passive:false});
document.addEventListener('keydown',e=>{
  if(e.repeat) return;
  const note=kbMap[e.key.toLowerCase()];
  if(note&&keyMap[note]){Tone.start();playNote(note,keyMap[note]);}
});

/* ══ NOTE READER ══ */
const notesInput=document.getElementById('notes-input');
const seqDisplay=document.getElementById('seq-display');
const tempoRange=document.getElementById('tempo-val');
const tempoLabel=document.getElementById('tempo-label');
const octaveSel=document.getElementById('octave-sel');
const btnPlay=document.getElementById('btn-play-notes');
const btnStop=document.getElementById('btn-stop-notes');

tempoRange.addEventListener('input',()=>tempoLabel.textContent=tempoRange.value+' bpm');

function parseNotes(str){
  return str.toLowerCase().replace(/[,;]+/g,' ').trim().split(/\s+/).filter(Boolean).map(s=>{
    const b=SOLFEGE_MAP[s]; if(b) return b+octaveSel.value;
    if(/^[a-g]#?\d$/.test(s)) return s.charAt(0).toUpperCase()+s.slice(1);
    return null;
  }).filter(Boolean);
}

function renderSeq(parsed,activeIdx=-1){
  seqDisplay.innerHTML='';
  const raw=notesInput.value.toLowerCase().replace(/[,;]+/g,' ').trim().split(/\s+/).filter(Boolean);
  raw.forEach((s,i)=>{
    const el=document.createElement('div');
    el.className='seq-note'+(i===activeIdx?' playing':'');
    el.textContent=s;
    seqDisplay.appendChild(el);
  });
}

notesInput.addEventListener('input',()=>renderSeq(parseNotes(notesInput.value)));

btnPlay.addEventListener('click',()=>{
  Tone.start();
  const parsed=parseNotes(notesInput.value); if(!parsed.length) return;
  if(readerPlayInterval) clearTimeout(readerPlayInterval);
  btnPlay.disabled=true; btnStop.disabled=false;
  const ms=Math.round(60000/parseInt(tempoRange.value)); let idx=0;
  const tick=()=>{
    if(idx>=parsed.length){
      btnPlay.disabled=false; btnStop.disabled=true;
      renderSeq(parsed,-1); readerPlayInterval=null; return;
    }
    renderSeq(parsed,idx);
    const note=parsed[idx];
    if(sampler&&sampler.loaded){
      sampler.triggerAttackRelease(note,'8n');
      if(isRecording) recordedNotes.push({note,time:Date.now()-recordStart});
      const el=keyMap[note]; if(el) animateKey(note,el);
    }
    idx++; readerPlayInterval=setTimeout(tick,ms);
  };
  tick();
});

btnStop.addEventListener('click',()=>{
  if(readerPlayInterval){clearTimeout(readerPlayInterval);readerPlayInterval=null;}
  btnPlay.disabled=false; btnStop.disabled=true;
  renderSeq(parseNotes(notesInput.value),-1);
});

/* ══ RECORDING ══ */
const recDot=document.getElementById('rec-dot');
const btnRecord=document.getElementById('btn-record');
btnRecord.addEventListener('click',()=>{
  isRecording=!isRecording;
  if(isRecording){
    recordedNotes=[]; recordStart=Date.now();
    recDot.classList.add('recording'); btnRecord.classList.add('active');
    showToast('● Enregistrement en cours…');
  } else {
    recDot.classList.remove('recording'); btnRecord.classList.remove('active');
    showToast(`■ Arrêté · ${recordedNotes.length} note(s)`);
  }
});

/* ══ SAVE ══ */
document.getElementById('btn-save').addEventListener('click',()=>{
  document.getElementById('save-box').scrollIntoView({behavior:'smooth'});
  document.getElementById('save-titre').focus();
});

document.getElementById('btn-do-save').addEventListener('click', async () => {
  const titre   = document.getElementById('save-titre').value.trim();
  const auteur  = document.getElementById('save-auteur').value.trim();
  const access  = document.getElementById('save-access').value;
  const vitesse = parseInt(document.getElementById('save-vitesse').value);
  const notes   = notesInput.value.trim() || recordedNotes.map(r => r.note).join(' ');
  const user    = JSON.parse(sessionStorage.getItem('utilisateurConnecte') || '{}');

  if (!titre) { showToast('⚠ Titre requis'); return; }
  if (!user.id) { showToast('⚠ Vous devez être connecté'); return; }

  try {
    const res = await fetch(`${API_URL}/morceaux`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        utilisateur_id: user.id,
        titre, auteur,
        accessibilite: access,
        vitesse, notes
      })
    });

    if (res.ok) {
      showToast(`✓ "${titre}" sauvegardé en base`);
      document.getElementById('save-titre').value  = '';
      document.getElementById('save-auteur').value = '';
    } else {
      const data = await res.json();
      showToast(`⚠ ${data.erreur || 'Erreur sauvegarde'}`);
    }
  } catch (e) {
    showToast('⚠ Impossible de contacter le serveur');
  }
});

/* ══ PROFIL ══ */
const modalProfile=document.getElementById('modal-profile');
document.getElementById('btn-profile').addEventListener('click',()=>{
  const user = JSON.parse(sessionStorage.getItem('utilisateurConnecte') || '{}');
  if (user.pseudo) document.getElementById('p-user').value = user.pseudo;
  if (user.email)  document.getElementById('p-email').value = user.email;
  modalProfile.classList.add('open');
});
document.getElementById('modal-close-btn').addEventListener('click',()=>modalProfile.classList.remove('open'));
modalProfile.addEventListener('click',e=>{if(e.target===modalProfile)modalProfile.classList.remove('open');});

/* ══ LOGOUT ══ */
document.getElementById('btn-logout').addEventListener('click',()=>{
  sessionStorage.removeItem('utilisateurConnecte');
  showToast('Déconnexion…');
  setTimeout(()=>{ window.location.href='accueil.html'; },1200);
});

/* ══ TOAST ══ */
const toast=document.getElementById('toast'); let toastTimer;
function showToast(msg){
  toast.textContent=msg; toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);
}

/* ══ PARTICLES ══ */
const pColors=['#5865f2','#00d4ff','#9b59f5'];
for(let i=0;i<24;i++){
  const p=document.createElement('div'); p.className='particle';
  p.style.setProperty('--dur',`${7+Math.random()*8}s`);
  p.style.setProperty('--delay',`${Math.random()*10}s`);
  p.style.left=`${Math.random()*100}vw`; p.style.top=`${30+Math.random()*70}vh`;
  const sz=`${1+Math.random()*2.5}px`; p.style.width=sz; p.style.height=sz;
  const c=pColors[Math.floor(Math.random()*pColors.length)];
  p.style.background=c; p.style.boxShadow=`0 0 6px ${c}`;
  document.body.appendChild(p);
}

/* ══ INIT SAMPLER ══ */
const loading=document.getElementById('loading');
sampler=buildSampler(()=>{loading.style.opacity='0';setTimeout(()=>loading.remove(),600);});

}); // fin DOMContentLoaded
