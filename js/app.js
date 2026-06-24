const KEY = "go_on_off_settings_v1";

const starter = {
  businessPlan: { sections: [
    { title: "Streszczenie inwestycyjne", subtitle: "System operacyjny dla pracy wysokiego ryzyka", text: "GO ON [OFF] SHORE łączy specjalistów, firmy, partnerów, dokumenty, certyfikaty i gotowość mobilizacyjną.", table: { enabled: false, columns: 3, rows: 3, cellWidth: 180, cellHeight: 54, cells: [] } }
  ]},
  presentation: { slides: [
    { title: "Start", theme: "Otwarcie projektu", code: "<div style='padding:34px;color:white;font-family:Inter,sans-serif'><h1>GO ON <span style='color:#ff6b2a'>[OFF]</span> SHORE</h1><p>Marketplace & Centrum Spraw</p></div>" },
    { title: "Problem", theme: "Chaos rekrutacji i certyfikatów", code: "<div style='padding:28px;color:white;font-family:Inter,sans-serif'><h2>Problem rynku</h2><p>Przestoje, dokumenty, certyfikaty i brak warstwy zaufania.</p></div>" }
  ]},
  roadmap: { versions: [
    { name: "MVP 1.1", quarters: [
      { name: "Q3 2026", work: "Start UI, główne podstrony i konfigurator ustawień.", goal: "Działający prototyp do pokazania.", finalEffect: "Pierwsza wersja demonstracyjna.", hires: [ { role: "Tech Lead", department: "IT", responsibility: "Architektura i prowadzenie developmentu." } ] }
    ]}
  ]},
  accounts: { accountTypes: [
    { name: "Konto Użytkownika", functions: [ { name: "Profil specjalisty", description: "Dane, doświadczenie, certyfikaty i preferencje pracy.", startQuarter: "Q3 2026" } ] },
    { name: "Konto Firmy", functions: [ { name: "Panel rekrutacji", description: "Ogłoszenia, kandydaci, statusy i shortlisty.", startQuarter: "Q3 2026" } ] },
    { name: "Konto Partnera", functions: [ { name: "Marketplace usług", description: "Szkolenia, eksperci, produkty, usługi i leady.", startQuarter: "Q4 2026" } ] }
  ]},
  organization: { roles: [
    { role: "CEO", department: "Zarząd", responsibility: "Strategia, inwestorzy i rozwój projektu." },
    { role: "Tech Lead", department: "IT", responsibility: "Architektura, code review i wdrożenia." }
  ]}
};

let state = load();
let accountView = "Konto Użytkownika";

function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || structuredClone(starter); } catch(e){ return structuredClone(starter); } }
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); render(); }
function esc(v){ return String(v ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"); }
function quarters(){ return [...new Set(state.roadmap.versions.flatMap(v => v.quarters.map(q => q.name)).filter(Boolean))]; }
function card(title, text){ return `<article class="preview-card"><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`; }

function tableHtml(t){
  if(!t?.enabled) return "";
  let out = `<table class="config-table">`;
  for(let r=0;r<Number(t.rows||1);r++){
    out += "<tr>";
    for(let c=0;c<Number(t.columns||1);c++){
      const i = r*Number(t.columns||1)+c;
      out += `<td style="width:${Number(t.cellWidth||160)}px;height:${Number(t.cellHeight||54)}px">${esc(t.cells?.[i]||"")}</td>`;
    }
    out += "</tr>";
  }
  return out + "</table>";
}

function render(){
  renderBusiness(); renderPresentation(); renderRoadmap(); renderAccounts(); renderOrg();
  renderBusinessEditor(); renderPresentationEditor(); renderRoadmapEditor(); renderAccountsEditor(); renderOrgEditor();
}

function renderBusiness(){
  businessPreview.innerHTML = state.businessPlan.sections.map((s,i)=>`<article class="card business-section"><h3>${esc(s.title)}</h3><h4>${esc(s.subtitle)}</h4><p>${esc(s.text)}</p>${tableHtml(s.table)}</article>`).join("") || card("Brak sekcji","Dodaj blok w ustawieniach.");
}
function renderPresentation(){
  presentationPreview.innerHTML = state.presentation.slides.map((s,i)=>`<article class="preview-card"><span class="badge">Slajd ${i+1}</span><h3>${esc(s.title)}</h3><p>${esc(s.theme)}</p><iframe class="slide-frame" sandbox srcdoc="${esc(s.code)}"></iframe></article>`).join("");
}
function renderRoadmap(){
  roadmapPreview.innerHTML = state.roadmap.versions.map(v=>`<article class="preview-card"><h3>${esc(v.name)}</h3>${v.quarters.map(q=>`<div class="version-q"><h4>${esc(q.name)}</h4><p><b>Prace:</b> ${esc(q.work)}</p><p><b>Cel:</b> ${esc(q.goal)}</p><p><b>Efekt:</b> ${esc(q.finalEffect)}</p>${q.hires.map(h=>`<span class="badge">${esc(h.role)} · ${esc(h.department)}</span>`).join("")}</div>`).join("")}</article>`).join("");
}
function renderAccounts(){
  const acc = state.accounts.accountTypes.find(a=>a.name===accountView) || state.accounts.accountTypes[0];
  accountsPreview.innerHTML = (acc?.functions||[]).map(f=>`<article class="preview-card"><span class="badge">${esc(f.startQuarter)}</span><h3>${esc(f.name)}</h3><p>${esc(f.description)}</p></article>`).join("") || card("Brak funkcji","Dodaj funkcję w ustawieniach.");
}
function renderOrg(){
  const hires = state.roadmap.versions.flatMap(v=>v.quarters.flatMap(q=>q.hires.map(h=>({...h, source:q.name}))));
  organizationPreview.innerHTML = [...state.organization.roles, ...hires].map(r=>`<article class="preview-card"><span class="badge">${esc(r.department)}</span><h3>${esc(r.role)}</h3><p>${esc(r.responsibility)}</p>${r.source?`<p class="muted">Start: ${esc(r.source)}</p>`:""}</article>`).join("");
}

function renderBusinessEditor(){
  businessEditor.innerHTML = state.businessPlan.sections.map((s,i)=>{
    const t = s.table; const count = Number(t.columns||1)*Number(t.rows||1);
    while(t.cells.length<count) t.cells.push(""); t.cells = t.cells.slice(0,count);
    return `<article class="editor-card"><h3>Blok #${i+1}</h3><div class="field-grid"><label>Tytuł<input data-biz="${i}:title" value="${esc(s.title)}"></label><label>Podtytuł<input data-biz="${i}:subtitle" value="${esc(s.subtitle)}"></label></div><label>Tekst<textarea data-biz="${i}:text">${esc(s.text)}</textarea></label><div class="table-builder"><label><input type="checkbox" data-table-on="${i}" ${t.enabled?"checked":""}> Dodaj tabelkę</label><div class="field-grid"><label>Kolumny<input type="number" data-table="${i}:columns" value="${t.columns}"></label><label>Wiersze<input type="number" data-table="${i}:rows" value="${t.rows}"></label><label>Szerokość komórki<input type="number" data-table="${i}:cellWidth" value="${t.cellWidth}"></label><label>Wysokość komórki<input type="number" data-table="${i}:cellHeight" value="${t.cellHeight}"></label></div><div class="table-cells" style="grid-template-columns:repeat(${t.columns},minmax(110px,1fr))">${t.cells.map((cell,ci)=>`<textarea data-cell="${i}:${ci}">${esc(cell)}</textarea>`).join("")}</div></div><div class="editor-actions"><button class="action danger" data-remove-biz="${i}">Usuń blok</button></div></article>`;
  }).join("");
}
function renderPresentationEditor(){
  presentationEditor.innerHTML = state.presentation.slides.map((s,i)=>`<article class="editor-card"><h3>Slajd #${i+1}</h3><div class="field-grid"><label>Tytuł<input data-slide="${i}:title" value="${esc(s.title)}"></label><label>Temat przewodni<input data-slide="${i}:theme" value="${esc(s.theme)}"></label></div><label>Kod wizualizacji<textarea class="slide-code" data-slide="${i}:code">${esc(s.code)}</textarea></label><iframe class="slide-frame" sandbox srcdoc="${esc(s.code)}"></iframe><div class="editor-actions"><button class="action danger" data-remove-slide="${i}">Usuń slajd</button></div></article>`).join("");
}
function renderRoadmapEditor(){
  roadmapEditor.innerHTML = state.roadmap.versions.map((v,vi)=>`<article class="editor-card"><h3>Wersja #${vi+1}</h3><label>Nazwa wersji<input data-version="${vi}:name" value="${esc(v.name)}"></label><div class="editor-actions"><button class="action" data-add-q="${vi}">+ Dodaj Q</button><button class="action danger" data-remove-version="${vi}">Usuń wersję</button></div>${v.quarters.map((q,qi)=>`<div class="version-q"><h4>Q #${qi+1}</h4><div class="field-grid"><label>Nazwa Q<input data-q="${vi}:${qi}:name" value="${esc(q.name)}"></label><label>Cel Q<input data-q="${vi}:${qi}:goal" value="${esc(q.goal)}"></label></div><label>Co wykonujemy<textarea data-q="${vi}:${qi}:work">${esc(q.work)}</textarea></label><label>Efekt końcowy<textarea data-q="${vi}:${qi}:finalEffect">${esc(q.finalEffect)}</textarea></label>${q.hires.map((h,hi)=>`<div class="hire-row"><div class="field-grid"><label>Stanowisko<input data-hire="${vi}:${qi}:${hi}:role" value="${esc(h.role)}"></label><label>Dział<input data-hire="${vi}:${qi}:${hi}:department" value="${esc(h.department)}"></label></div><label>Odpowiedzialność<textarea data-hire="${vi}:${qi}:${hi}:responsibility">${esc(h.responsibility)}</textarea></label><button class="action danger" data-remove-hire="${vi}:${qi}:${hi}">Usuń osobę</button></div>`).join("")}<div class="editor-actions"><button class="action" data-add-hire="${vi}:${qi}">+ Dodaj osobę</button><button class="action danger" data-remove-q="${vi}:${qi}">Usuń Q</button></div></div>`).join("")}</article>`).join("");
}
function renderAccountsEditor(){
  const opts = quarters().map(q=>`<option value="${esc(q)}">${esc(q)}</option>`).join("");
  accountsEditor.innerHTML = state.accounts.accountTypes.map((a,ai)=>`<article class="editor-card"><h3>${esc(a.name)}</h3>${a.functions.map((f,fi)=>`<div class="version-q"><div class="field-grid"><label>Nazwa funkcji<input data-fn="${ai}:${fi}:name" value="${esc(f.name)}"></label><label>Q rozpoczęcia<select data-fn="${ai}:${fi}:startQuarter"><option value="">Wybierz Q</option>${opts}</select></label></div><label>Opis funkcji<textarea data-fn="${ai}:${fi}:description">${esc(f.description)}</textarea></label><button class="action danger" data-remove-fn="${ai}:${fi}">Usuń funkcję</button></div>`).join("")}</article>`).join("");
  document.querySelectorAll("[data-fn$=':startQuarter']").forEach(sel=>{ const [a,f]=sel.dataset.fn.split(":"); sel.value=state.accounts.accountTypes[a].functions[f].startQuarter||""; });
}
function renderOrgEditor(){
  organizationEditor.innerHTML = state.organization.roles.map((r,i)=>`<article class="editor-card"><h3>Rola #${i+1}</h3><div class="field-grid"><label>Stanowisko<input data-org="${i}:role" value="${esc(r.role)}"></label><label>Dział<input data-org="${i}:department" value="${esc(r.department)}"></label></div><label>Odpowiedzialność<textarea data-org="${i}:responsibility">${esc(r.responsibility)}</textarea></label><button class="action danger" data-remove-org="${i}">Usuń rolę</button></article>`).join("");
}

document.addEventListener("input", e=>{
  const el=e.target;
  if(el.dataset.biz){ const [i,k]=el.dataset.biz.split(":"); state.businessPlan.sections[i][k]=el.value; save(); }
  if(el.dataset.table){ const [i,k]=el.dataset.table.split(":"); state.businessPlan.sections[i].table[k]=Number(el.value); save(); }
  if(el.dataset.cell){ const [i,c]=el.dataset.cell.split(":"); state.businessPlan.sections[i].table.cells[c]=el.value; save(); }
  if(el.dataset.slide){ const [i,k]=el.dataset.slide.split(":"); state.presentation.slides[i][k]=el.value; save(); }
  if(el.dataset.version){ const [i,k]=el.dataset.version.split(":"); state.roadmap.versions[i][k]=el.value; save(); }
  if(el.dataset.q){ const [v,q,k]=el.dataset.q.split(":"); state.roadmap.versions[v].quarters[q][k]=el.value; save(); }
  if(el.dataset.hire){ const [v,q,h,k]=el.dataset.hire.split(":"); state.roadmap.versions[v].quarters[q].hires[h][k]=el.value; save(); }
  if(el.dataset.fn){ const [a,f,k]=el.dataset.fn.split(":"); state.accounts.accountTypes[a].functions[f][k]=el.value; save(); }
  if(el.dataset.org){ const [i,k]=el.dataset.org.split(":"); state.organization.roles[i][k]=el.value; save(); }
});

document.addEventListener("change", e=>{ if(e.target.dataset.tableOn){ state.businessPlan.sections[e.target.dataset.tableOn].table.enabled=e.target.checked; save(); } });

document.addEventListener("click", e=>{
  const b=e.target.closest("button"); if(!b) return;
  if(b.dataset.settingsTab){ document.querySelectorAll(".settings-tab,.settings-panel").forEach(x=>x.classList.remove("active")); b.classList.add("active"); document.getElementById("settings-"+b.dataset.settingsTab).classList.add("active"); }
  if(b.dataset.accountView){ accountView=b.dataset.accountView; document.querySelectorAll(".side-account").forEach(x=>x.classList.remove("active")); b.classList.add("active"); renderAccounts(); }
  if(b.id==="addBusinessSection"){ state.businessPlan.sections.push({title:"Nowy tytuł",subtitle:"Podtytuł",text:"Treść...",table:{enabled:false,columns:3,rows:3,cellWidth:160,cellHeight:54,cells:[]}}); save(); }
  if(b.dataset.removeBiz){ state.businessPlan.sections.splice(Number(b.dataset.removeBiz),1); save(); }
  if(b.id==="addSlide"){ state.presentation.slides.push({title:"Nowy slajd",theme:"Temat",code:"<div style='padding:24px;color:white'>Nowy slajd</div>"}); save(); }
  if(b.dataset.removeSlide){ state.presentation.slides.splice(Number(b.dataset.removeSlide),1); save(); }
  if(b.id==="addVersion"){ state.roadmap.versions.push({name:"Nowa wersja",quarters:[]}); save(); }
  if(b.dataset.removeVersion){ state.roadmap.versions.splice(Number(b.dataset.removeVersion),1); save(); }
  if(b.dataset.addQ){ state.roadmap.versions[b.dataset.addQ].quarters.push({name:"Q",work:"",goal:"",finalEffect:"",hires:[]}); save(); }
  if(b.dataset.removeQ){ const [v,q]=b.dataset.removeQ.split(":"); state.roadmap.versions[v].quarters.splice(Number(q),1); save(); }
  if(b.dataset.addHire){ const [v,q]=b.dataset.addHire.split(":"); state.roadmap.versions[v].quarters[q].hires.push({role:"Nowa rola",department:"Dział",responsibility:"Odpowiedzialność"}); save(); }
  if(b.dataset.removeHire){ const [v,q,h]=b.dataset.removeHire.split(":"); state.roadmap.versions[v].quarters[q].hires.splice(Number(h),1); save(); }
  if(b.id==="addAccountFunction"){ state.accounts.accountTypes[0].functions.push({name:"Nowa funkcja",description:"Opis funkcji",startQuarter:quarters()[0]||""}); save(); }
  if(b.dataset.removeFn){ const [a,f]=b.dataset.removeFn.split(":"); state.accounts.accountTypes[a].functions.splice(Number(f),1); save(); }
  if(b.id==="addOrgRole"){ state.organization.roles.push({role:"Nowa rola",department:"Dział",responsibility:"Opis"}); save(); }
  if(b.dataset.removeOrg){ state.organization.roles.splice(Number(b.dataset.removeOrg),1); save(); }
});

render();
