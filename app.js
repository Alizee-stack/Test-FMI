
function playBeep() { try { const ctx = new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='sine'; o.frequency.value=1000; g.gain.setValueAtTime(0.0001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime+0.005); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+0.12); } catch(e){} }
function flashBeep(){ const el = document.getElementById('beepFlash'); el.style.display='block'; setTimeout(()=>{ el.style.display='none'; }, 400); }
const flip = (x) => (x === 1 ? 2 : 1);

function mkBlock(opts){
  const { name, type, correctionVec, beepPositions = [], withBars = false,
          initialRule = "opposite", ruleTogglesOnBeep = false, barEveryK = 3 } = opts;
  const n = correctionVec.length;
  const corr = correctionVec.map(x => parseInt(x, 10));
  let stim = new Array(n).fill(0);
  let barred = new Array(n).fill(false);
  let rulePerTrial = new Array(n).fill("");

  if (!withBars) {
    if (!ruleTogglesOnBeep) {
      for (let i=0;i<n;i++){
        if (initialRule === "same") { stim[i] = corr[i]; rulePerTrial[i] = "same"; }
        else { stim[i] = flip(corr[i]); rulePerTrial[i] = "opposite"; }
      }
    } else {
      let rule = initialRule;
      for (let i=0;i<n;i++){
        stim[i] = (rule === "same") ? corr[i] : flip(corr[i]);
        rulePerTrial[i] = rule;
        if (beepPositions.includes(i+1)) rule = (rule === "same") ? "opposite" : "same";
      }
    }
  } else {
    for (let i=0;i<n;i++) barred[i] = ((i+1) % barEveryK === 0);
    if (!ruleTogglesOnBeep) {
      if (initialRule === "opposite") {
        for (let i=0;i<n;i++){
          if (barred[i]) { stim[i] = corr[i]; rulePerTrial[i] = "same(bar)"; }
          else { stim[i] = flip(corr[i]); rulePerTrial[i] = "opposite(nonbar)"; }
        }
      } else {
        for (let i=0;i<n;i++){
          if (barred[i]) { stim[i] = flip(corr[i]); rulePerTrial[i] = "opposite(bar)"; }
          else { stim[i] = corr[i]; rulePerTrial[i] = "same(nonbar)"; }
        }
      }
    } else {
      let useOppositeNonbar = (initialRule === "opposite");
      for (let i=0;i<n;i++){
        if (barred[i]) {
          if (useOppositeNonbar) { stim[i] = corr[i]; rulePerTrial[i] = "same(bar)"; }
          else { stim[i] = flip(corr[i]); rulePerTrial[i] = "opposite(bar)"; }
        } else {
          if (useOppositeNonbar) { stim[i] = flip(corr[i]); rulePerTrial[i] = "opposite(nonbar)"; }
          else { stim[i] = corr[i]; rulePerTrial[i] = "same(nonbar)"; }
        }
        if (beepPositions.includes(i+1)) useOppositeNonbar = !useOppositeNonbar;
      }
    }
  }

  const trials = [];
  for (let i=0;i<n;i++){
    trials.push({
      idx: i+1,
      stim: stim[i],
      correct: corr[i],
      barred: barred[i],
      beep: beepPositions.includes(i+1),
      rule: rulePerTrial[i]
    });
  }
  return { name, type, trials, correctSeq: corr.join(" ") };
}

// Correction lists (20) — Phase 3 corrected per user's request
const C11 = [1,2,1,1,1,2,1,2,2,1,1,2,1,2,2,1,2,1,1,2];
const C12 = [1,1,2,1,2,2,1,2,1,2,2,1,2,2,1,2,1,2,1,2];
const C13 = [1,2,1,1,1,2,1,1,1,2,2,1,1,2,2,2,1,2,1,1];
const C21 = [1,1,1,2,1,2,2,1,1,2,1,1,1,2,1,1,2,1,2,2];
const C22 = [1,1,2,1,2,1,2,2,1,2,2,1,2,1,1,2,1,2,1,1];
const C23 = [1,2,1,2,2,2,1,2,1,1,1,1,2,2,2,2,1,1,1,2];

// Corrected by user:
const C31 = [1,2,1,2,2,2,1,2,1,1,2,1,2,1,1,2,1,1,2,2];
const C32 = [2,2,1,2,1,1,1,1,2,1,1,1,1,2,2,2,1,1,1,2];

// Beeps (Phase 3 corrected positions)
const beeps_p3_1 = [5,11,17];
const beeps_p3_2 = [7,11,15];
// Phase 2 beeps (unchanged)
const beeps_p2_1 = [4,10,15];
const beeps_p2_2 = [7,14];
const beeps_p2_3 = [5,13,19];
const barEveryK = 3;

const blk_11 = mkBlock({name:"Phase 1 – 1.1", type:"1.1", correctionVec:C11, withBars:false, initialRule:"same"});
const blk_12 = mkBlock({name:"Phase 1 – 1.2", type:"1.2", correctionVec:C12, withBars:false, initialRule:"opposite"});
const blk_13 = mkBlock({name:"Phase 1 – 1.3", type:"1.3", correctionVec:C13, withBars:true,  initialRule:"opposite", barEveryK});
const blk_21 = mkBlock({name:"Phase 2 – 2.1", type:"2.1", correctionVec:C21, beepPositions:beeps_p2_1, withBars:false, initialRule:"same"});
const blk_22 = mkBlock({name:"Phase 2 – 2.2", type:"2.2", correctionVec:C22, beepPositions:beeps_p2_2, withBars:false, initialRule:"opposite"});
const blk_23 = mkBlock({name:"Phase 2 – 2.3", type:"2.3", correctionVec:C23, beepPositions:beeps_p2_3, withBars:true,  initialRule:"opposite", barEveryK});
const blk_31 = mkBlock({name:"Phase 3 – 3.1", type:"3.1", correctionVec:C31, beepPositions:beeps_p3_1, withBars:false, initialRule:"opposite", ruleTogglesOnBeep:true});
const blk_32 = mkBlock({name:"Phase 3 – 3.2", type:"3.2", correctionVec:C32, beepPositions:beeps_p3_2, withBars:true,  initialRule:"opposite", ruleTogglesOnBeep:true, barEveryK});

const ALL = [blk_11, blk_12, blk_13, blk_21, blk_22, blk_23, blk_31, blk_32];

const consigneMap = {
  "1.1": "<b>Consigne 1.1</b><br/>Appuyez sur la touche <b>1</b> ou <b>2</b> identique au chiffre affiché en surbrillance (1→1, 2→2).",
  "1.2": "<b>Consigne 1.2</b><br/>Appuyez sur la touche <b>opposée</b> (1→2, 2→1).",
  "1.3": "<b>Consigne 1.3</b><br/><u>Chiffres barrés :</u> appuyez sur le <b>même</b> (1→1, 2→2). <u>Non barrés :</u> appuyez sur l’<b>opposé</b> (1→2, 2→1).",
  "2.1": "<b>Consigne 2.1</b><br/>Même règle que 1.1. <b>Ignorez le bip</b>.",
  "2.2": "<b>Consigne 2.2</b><br/>Même règle que 1.2. <b>Ignorez le bip</b>.",
  "2.3": "<b>Consigne 2.3</b><br/>Même règle que 1.3. <b>Ignorez le bip</b>.",
  "3.1": "<b>Consigne 3.1</b><br/>Règle initiale : <b>opposé</b>. À chaque <b>bip</b>, la règle <b>change</b> (opposé ↔ identique).",
  "3.2": "<b>Consigne 3.2</b><br/>Règle initiale (avec barres) : <b>non barré → opposé</b>, <b>barré → identique</b>. À chaque <b>bip</b>, ces règles <b>s’inversent</b>."
};

const blockTitle = document.getElementById("blockTitle");
const progressTxt = document.getElementById("progressTxt");
const consigneCard = document.getElementById("consigneCard");
const consigneHtml = document.getElementById("consigneHtml");
const startBtn = document.getElementById("startBtn");
const skipBtn = document.getElementById("skipBtn");
const stimCard = document.getElementById("stimCard");
const seriesRow = document.getElementById("seriesRow");
const legendTxt = document.getElementById("legendTxt");
const endPanel = document.getElementById("endPanel");
const summaryTxt = document.getElementById("summaryTxt");
const dlSeqCsvBtn = document.getElementById("dlSeqCsvBtn");
const restartBtn = document.getElementById("restartBtn");
const oneTable = document.getElementById("oneTable");

// Example overlay elements
const exampleOverlay = document.getElementById("exampleOverlay");
const exampleBadge = document.getElementById("exampleBadge");
const exampleStim = document.getElementById("exampleStim");
const exampleMap = document.getElementById("exampleMap");
const exampleContinue = document.getElementById("exampleContinue");

let blockIndex = 0, trialIndex = 0, running = false, trialStartTs = 0;
let logRows = [];
let showingExample = false;
let exampleTimer = null;

function clearExampleTimer(){ if (exampleTimer) { clearInterval(exampleTimer); exampleTimer = null; } }

function buildSeriesDOM(blk){
  seriesRow.innerHTML = "";
  for (const row of blk.trials){
    const span = document.createElement("span");
    span.className = "digit" + (row.barred ? " barred" : "");
    span.textContent = String(row.stim);
    span.id = "d"+row.idx;
    seriesRow.appendChild(span);
  }
  highlightCurrent(1);
}

function highlightCurrent(idx){
  for (const el of seriesRow.children){ el.classList.remove("current"); }
  const el = document.getElementById("d"+idx);
  if (el) el.classList.add("current");
}

function showExampleForPhase(phase){
  exampleOverlay.style.display = "flex";
  exampleBadge.textContent = "EXEMPLE – Phase " + phase;
  showingExample = true;
  // hide series while example is visible
  seriesRow.style.visibility = "hidden";

  // Simple mock sequence of 6 items, with current highlight moving automatically
  const demo = [1,2,1,2,1,2];
  let i = 0;
  exampleMap.textContent = (phase===1) ? "Règle: identique — appuyez sur la même touche (1/2)"
    : (phase===2) ? "Règle: identique — ignorez le 🔔 bip"
    : "Règle: opposé — au 🔔 bip la règle devient identique";

  clearExampleTimer();
  exampleTimer = setInterval(()=>{
    let hint = "";
    if (phase===1){ hint = "Appuyez sur " + demo[i]; }
    else if (phase===2){
      hint = (i===2) ? "🔔 Bip — ignorer" : ("Appuyez sur " + demo[i]);
      if (i===2) playBeep();
    } else {
      // Opposé on first two, then bip then identique
      if (i===2){ playBeep(); hint="🔔 Bip — la règle change"; }
      else if (i<2){ hint="Opposé — si 1 alors 2, si 2 alors 1"; }
      else { hint="Identique — appuyez sur la même touche"; }
    }
    exampleStim.innerHTML = "Élément en surbrillance → " + (demo[i]||"");
    exampleMap.textContent = hint;
    i = (i+1) % demo.length;
  }, 1200);

  exampleContinue.onclick = () => {
    clearExampleTimer();
    exampleOverlay.style.display = "none";
    showingExample = false;
    seriesRow.style.visibility = "visible"; // restore
    // proceed to real trials
    nextTrial();
  };
}

function maybeShowExample(){
  // Show example before the first block of each phase (1.1, 2.1, 3.1)
  if (blockIndex === 0) { showExampleForPhase(1); return true; }
  if (blockIndex === 3) { showExampleForPhase(2); return true; }
  if (blockIndex === 6) { showExampleForPhase(3); return true; }
  return false;
}

function showConsigne(){
  running = false;
  stimCard.style.display = "none";
  consigneCard.style.display = "block";
  endPanel.style.display = "none";
  if (blockIndex < ALL.length) {
    const blk = ALL[blockIndex];
    blockTitle.textContent = blk.name;
    consigneHtml.innerHTML = consigneMap[blk.type] || "";
    progressTxt.textContent = `Essai 0/${blk.trials.length} | Bloc ${blockIndex+1}/${ALL.length}`;
  } else {
    blockTitle.textContent = "Terminé";
    consigneCard.style.display = "none";
    stimCard.style.display = "none";
    showEnd();
  }
}

function startBlock(){
  if (blockIndex >= ALL.length) return;
  running = true;
  trialIndex = 0;
  consigneCard.style.display = "none";
  stimCard.style.display = "block";
  const blk = ALL[blockIndex];
  buildSeriesDOM(blk);
  if (!maybeShowExample()) nextTrial();
}

function nextTrial(){
  const blk = ALL[blockIndex];
  if (trialIndex >= blk.trials.length) {
    running = false;
    blockIndex += 1;
    showConsigne();
    return;
  }
  const row = blk.trials[trialIndex];
  highlightCurrent(row.idx);
  progressTxt.textContent = `Essai ${trialIndex}/${blk.trials.length} | Bloc ${blockIndex+1}/${ALL.length}`;
  if (row.beep) { playBeep(); flashBeep(); }
  trialStartTs = performance.now();
}

function onKey(e){
  if (!running || showingExample) return;
  const key = e.key;
  if (key !== "1" && key !== "2") return;
  const resp = parseInt(key, 10);
  const t = performance.now();
  const rt = t - trialStartTs;
  const blk = ALL[blockIndex];
  const row = blk.trials[trialIndex];
  const correct = row.correct;
  const isOk = (resp === correct) ? 1 : 0;

  logRows.push({
    block: blk.name,
    type: blk.type,
    trial: row.idx,
    stim: row.stim,
    barred: row.barred ? 1 : 0,
    beep: row.beep ? 1 : 0,
    rule: row.rule,
    response: resp,
    correct: correct,
    accuracy: isOk,
    rt_ms: Math.round(rt)
  });

  trialIndex += 1;
  nextTrial();
}

function makeOneTableHtml(rows, blks, correctMap, totalTimeSecMap){
  // Group rows per block and keep order
  const perBlock = {};
  for (const r of rows){ (perBlock[r.block] ||= []).push(r); }

  let html = '<table><thead><tr><th>Bloc</th><th>n essais</th><th>Erreurs (n)</th><th>Suite réponses (participant)</th><th>Suite correcte (attendue)</th><th>Temps total (secondes)</th></tr></thead><tbody>';
  for (const blk of blks){
    const bname = blk.name;
    const brs = perBlock[bname] || [];
    const n = brs.length;
    let errs = 0;
    const parts = [];
    const corrTokens = (correctMap[bname] || "").split(/\s+/).filter(Boolean);

    for (let i=0;i<brs.length;i++){
      const r = brs[i];
      if (r.accuracy === 0) errs += 1;
      const want = corrTokens[i] ? parseInt(corrTokens[i],10) : null;
      const txt = String(r.response);
      if (want !== null && r.response !== want){
        parts.push('<span class="wrong">'+txt+'</span>');
      } else {
        parts.push(txt);
      }
    }

    const tsec = ((totalTimeSecMap[bname]||0)).toFixed(3);
    html += `<tr>
      <td>${bname}</td>
      <td>${n}</td>
      <td>${errs}</td>
      <td class="seq-cell">${parts.join(" ")}</td>
      <td class="seq-cell">${correctMap[bname] || ""}</td>
      <td>${tsec}</td>
    </tr>`;
  }
  html += '</tbody></table>';
  return html;
}

function showEnd(){
  stimCard.style.display = "none";
  endPanel.style.display = "block";
  if (logRows.length === 0) { summaryTxt.textContent = "Aucune donnée."; return; }

  const n = logRows.length;
  const rtsCorrect = logRows.filter(r => r.accuracy === 1).map(r => r.rt_ms);
  const meanRt = rtsCorrect.length ? Math.round(rtsCorrect.reduce((s,x)=>s+x,0) / rtsCorrect.length) : NaN;
  summaryTxt.textContent = `Essais totaux: ${n} | RT moyen (réponses correctes): ${isNaN(meanRt) ? "—" : (meanRt + " ms")}`;

  const correctMap = {};
  const totalTimeSecMap = {};
  for (const blk of ALL){ correctMap[blk.name] = blk.correctSeq; }
  for (const r of logRows){ totalTimeSecMap[r.block] = (totalTimeSecMap[r.block] || 0) + (r.rt_ms/1000); }

  oneTable.innerHTML = makeOneTableHtml(logRows, ALL, correctMap, totalTimeSecMap);

  // Build CSV with errors count too
  window.__oneTableRows = (() => {
    const perBlock = {};
    for (const r of logRows){ (perBlock[r.block] ||= []).push(r); }
    const out = [];
    for (const blk of ALL){
      const bname = blk.name;
      const brs = perBlock[bname] || [];
      const respSeq = brs.map(r=>r.response).join(" ");
      const errs = brs.reduce((s,r)=> s + (r.accuracy===0?1:0), 0);
      const tsec = brs.reduce((s,r)=> s + (r.rt_ms/1000), 0);
      out.push({
        block: bname,
        n_trials: brs.length,
        n_errors: errs,
        participant_sequence: respSeq,
        correct_sequence: correctMap[bname] || "",
        total_time_seconds: tsec
      });
    }
    return out;
  })();
}

function toOneCsv(objs){
  const header = ["block","n_trials","n_errors","participant_sequence","correct_sequence","total_time_seconds"];
  const lines = [header.join(",")];
  for (const o of objs){
    const t = (o.total_time_seconds).toFixed(3);
    lines.push([o.block, o.n_trials, o.n_errors, `"${o.participant_sequence}"`, `"${o.correct_sequence}"`, t].join(","));
  }
  return lines.join("\n");
}
function downloadTextAs(filename, text, mime){
  const blob = new Blob([text], {type: mime || "text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

document.getElementById("startBtn").addEventListener("click", startBlock);
document.getElementById("skipBtn").addEventListener("click", () => { blockIndex += 1; showConsigne(); });
window.addEventListener("keydown", onKey);
document.getElementById("dlSeqCsvBtn").addEventListener("click", () => {
  const rows = window.__oneTableRows || [];
  const csv = toOneCsv(rows);
  downloadTextAs("table_suites_par_bloc.csv", csv, "text/csv;charset=utf-8");
});
document.getElementById("restartBtn").addEventListener("click", () => {
  blockIndex = 0; trialIndex = 0; running = false; logRows = [];
  exampleOverlay.style.display = "none"; showingExample = false; seriesRow.style.visibility = "visible"; clearExampleTimer();
  showConsigne();
});

showConsigne();
