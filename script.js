// ——— Credentials (ersetze durch reale Werte!) ———
const CREDENTIALS = { "user1":"pass1", "admin":"geheim" };

// ——— Elemente ———
const loginScreen = document.getElementById('login-screen');
const appScreen   = document.getElementById('app-screen');
const loginBtn    = document.getElementById('login-btn');
const resetBtn    = document.getElementById('reset-btn');
const addRowBtn   = document.getElementById('add-row');
const genCsvBtn   = document.getElementById('generate-csv');
const dlLink      = document.getElementById('download-link');
const tableBody   = document.querySelector('#tel-table tbody');
const userInput   = document.getElementById('user');
const pwdInput    = document.getElementById('pwd');

// ——— Animation wie im Original ———
let currentAnim = null;
document.querySelector('#user').addEventListener('focus',()=>{
  if(currentAnim) currentAnim.pause();
  currentAnim = anime({ targets:'path',
    strokeDashoffset: { value: 0, duration:700, easing:'easeOutQuart' },
    strokeDasharray:  { value:'240 1386', duration:700, easing:'easeOutQuart' }
  });
});
document.querySelector('#pwd').addEventListener('focus',()=>{
  if(currentAnim) currentAnim.pause();
  currentAnim = anime({ targets:'path',
    strokeDashoffset: { value:-336, duration:700, easing:'easeOutQuart' },
    strokeDasharray:  { value:'240 1386', duration:700, easing:'easeOutQuart' }
  });
});
loginBtn.addEventListener('focus',()=>{
  if(currentAnim) currentAnim.pause();
  currentAnim = anime({ targets:'path',
    strokeDashoffset: { value:-730, duration:700, easing:'easeOutQuart' },
    strokeDasharray:  { value:'530 1386', duration:700, easing:'easeOutQuart' }
  });
});

// ——— Login / Auth ———
function showApp(){
  loginScreen.style.display = 'none';
  appScreen.style.display   = 'flex';
}
function showLogin(){
  sessionStorage.clear();                   // Reset :contentReference[oaicite:9]{index=9}
  loginScreen.style.display = 'flex';
  appScreen.style.display   = 'none';
}
loginBtn.onclick = () => {
  let u = userInput.value, p = pwdInput.value;
  if(CREDENTIALS[u] && CREDENTIALS[u]===p){
    sessionStorage.setItem('loggedIn','1'); // sessionStorage :contentReference[oaicite:10]{index=10}
    showApp();
  } else {
    alert('Ungültiger Benutzername oder Passwort.');
  }
};
// Bei Reload: Zustand prüfen
if(sessionStorage.getItem('loggedIn')) showApp();

// ——— Reset-Button ———
resetBtn.onclick = showLogin;

// ——— Tabelle initial mit einer leeren Zeile ———
addRowBtn.onclick = addRow;
function addRow(){
  let row = tableBody.insertRow();          // insertRow/insertCell :contentReference[oaicite:11]{index=11}
  let c1 = row.insertCell(), c2 = row.insertCell(), c3 = row.insertCell(), c4 = row.insertCell();
  c1.innerHTML = '<input type="text" class="vorname" />';
  c2.innerHTML = '<input type="text" class="nachname" />';
  c3.innerHTML = '<input type="text" class="telefon" />';
  c4.innerHTML = '<button onclick="this.closest(\'tr\').remove()">❌</button>';
}
// gleich eine Zeile
addRow();

// ——— Hilfsfunktionen ———
function hasWhitespace(s){ return /\s/.test(s); }    // Regex auf whitespace :contentReference[oaicite:12]{index=12}
function replaceUmlauts(s){
  const map = { 'ä':'ae','ö':'oe','ü':'ue','Ä':'Ae','Ö':'Oe','Ü':'Ue','ß':'ss' };
  return s.replaceAll(/[^A-Za-z0-9_-]/g, ch=>map[ch]||ch);  // replaceAll :contentReference[oaicite:13]{index=13} :contentReference[oaicite:14]{index=14}
}
function formatPhone(p){ return p.startsWith('0')?p:('0'+p); }

// ——— CSV‑Erzeugung & Download ———
genCsvBtn.onclick = () => {
  let lines = [], errors = [];
  Array.from(tableBody.rows).forEach((r,i)=>{
    let v = r.querySelector('.vorname').value;
    let n = r.querySelector('.nachname').value;
    let t = r.querySelector('.telefon').value;
    if(hasWhitespace(v)||hasWhitespace(n)||hasWhitespace(t)){
      errors.push(`Zeile ${i+1}: keine Leerzeichen erlaubt.`);
    } else {
      lines.push([
        replaceUmlauts(v), replaceUmlauts(n),
        ...Array(15).fill(''), '1','4','1',
        formatPhone(t), '-1','V2'
      ].join(','));
    }
  });
  if(errors.length){
    alert(errors.join('\n'));
    return;
  }
  let csv = lines.join('\r\n');
  let blob = new Blob([csv], { type:'text/csv' });     // CSV als Blob :contentReference[oaicite:15]{index=15}
  let url  = URL.createObjectURL(blob);
  let ts   = new Date().toISOString().replace(/[:.]/g,'-'); // Zeitstempel :contentReference[oaicite:16]{index=16}
  dlLink.href        = url;
  dlLink.download    = `Telefonbuch-${ts}.csv`;
  dlLink.style.display = 'inline';
  dlLink.textContent = 'Download CSV';
};
