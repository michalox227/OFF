const STORAGE_KEY = "go_on_off_settings_v1";

const defaultData = {
  businessPlan: {
    sections: [
      {
        title: "Streszczenie inwestycyjne",
        subtitle: "GO ON [OFF] SHORE jako system operacyjny rynku pracy wysokiego ryzyka.",
        text: "Projekt łączy specjalistów, firmy, partnerów, dokumenty, certyfikaty, dostępność i warstwę compliance w jednym środowisku.",
        table: { enabled: false, columns: 3, rows: 3, cellWidth: 180, cellHeight: 54, cells: [] }
      }
    ]
  },
  presentation: {
    slides: [
      { title: "Start", theme: "Otwarcie projektu", code: "<div style='padding:36px;color:white;font-family:Inter,sans-serif'><h1>GO ON <span style='color:#ff6b2a'>[OFF]</span> SHORE</h1><p>Marketplace & Centrum Spraw</p></div>" },
      { title: "Problem", theme: "Chaos rekrutacji, certyfikatów i mobilizacji", code: "<div style='padding:28px;color:white;font-family:Inter,sans-serif'><h2>Problem rynku</h2><ul><li>Przestoje między kontraktami</li><li>Wygasające certyfikaty</li><li>Brak wspólnej warstwy zaufania</li></ul></div>" }
    ]
  },
  roadmap: {
    versions: [
      {
        name: "MVP 1.1",
        quarters: [
          { name: "Q3 2026", work: "Start projektu, struktura UI, główne podstrony i podstawowy konfigurator.", goal: "Pokazać działający prototyp platformy.", finalEffect: "Pierwsza wersja demonstracyjna.", hires: [{ role: "Tech Lead", department: "IT", responsibility: "Architektura i prowadzenie developmentu." }] }
        ]
      }
    ]
  },
  accounts: {
    accountTypes: [
      { name: "Konto Użytkownika", functions: [{ name: "Profil specjalisty", description: "Dane, doświadczenie, certyfikaty i preferencje pracy.", startQuarter: "Q3 2026" }] },
      { name: "Konto Firmy", functions: [{ name: "Panel rekrutacji", description: "Ogłoszenia, kandydaci, statusy i shortlisty.", startQuarter: "Q3 2026" }] },
      { name: "Konto Partnera", functions: [{ name: "Marketplace usług", description: "Szkolenia, eksperci, produkty, usługi i leady.", startQuarter: "Q4 2026" }] }
    ]
  },
  organization: {
    roles: [
      { role: "CEO", department: "Zarząd", responsibility: "Strategia, inwestorzy i rozwój projektu." },
      { role: "Tech Lead", department: "IT", responsibility: "Architektura, code review i wdrożenia." }
    ]
  }
};

let data = loadData();
let activeAccount = "Konto Użytkownika";

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? mergeData(defaultData, JSON.parse(saved)) : structuredClone(defaultData);
  } catch (error) {
    console.warn("Nie udało się odczytać danych ustawień", error);
    return structuredClone(defaultData);
  }
}

function mergeData(base, saved) {
  return {
    businessPlan: saved.businessPlan || base.businessPlan,
    presentation: saved.presentation || base.presentation,
    roadmap: saved.roadmap || base.roadmap,
    accounts: saved.accounts || base.accounts,
    organization: saved.organization || base.organization
  };
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderAll();
}

function qList() {
  const out = [];
  data.roadmap.versions.forEach(version => version.quarters.forEach(q => out.push(q.name)));
  return [...new Set(out)].filter(Boolean);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[char]));
}

function renderAll() {
  renderBusinessPreview();
  renderPresentationPreview();
  renderRoadmapPreview();
  renderAccountsPreview();
  renderOrganizationPreview();
  renderBusinessEditor();
  renderPresentationEditor();
  renderRoadmapEditor();
  renderAccountsEditor();
  renderOrganizationEditor();
}

function renderBusinessPreview() {
  const root = document.getElementById("businessPreview");
  root.innerHTML = data.businessPlan.sections.map(section => {
    const table = section.table?.enabled ? renderTable(section.table) : "";
    return `<article class="card business-section"><h3>${escapeHtml(section.title)}</h3><h4>${escapeHtml(section.subtitle)}</h4><p>${escapeHtml(section.text)}</p>${table}</article>`;
  }).join("") || emptyCard("Brak sekcji", "Dodaj pierwszy blok w Ustawienia → Biznes Plan.");
}

function renderTable(table) {
  const columns = Number(table.columns || 1);
  const rows = Number(table.rows || 1);
  const width = Number(table.cellWidth || 160);
  const height = Number(table.cellHeight || 54);
  let html = `<table class="config-table">`;
  for (let r = 0; r < rows; r++) {
    html += "<tr>";
    for (let c = 0; c < columns; c++) {
      const index = r * columns + c;
      html += `<td style="width:${width}px;height:${height}px">${escapeHtml(table.cells?.[index] || "")}</td>`;
    }
    html += "</tr>";
  }
  return html + "</table>";
}

function renderPresentationPreview() {
  const root = document.getElementById("presentationPreview");
  root.innerHTML = data.presentation.slides.map((slide, index) => `
    <article class="preview-card">
      <span class="badge">Slajd ${index + 1}</span>
      <h3>${escapeHtml(slide.title)}</h3>
      <p>${escapeHtml(slide.theme)}</p>
      <iframe class="slide-frame" sandbox srcdoc="${escapeHtml(slide.code || "")}"></iframe>
    </article>
  `).join("") || emptyCard("Brak slajdów", "Dodaj slajd w Ustawienia → Prezentacja.");
}

function renderRoadmapPreview() {
  const root = document.getElementById("roadmapPreview");
  root.innerHTML = data.roadmap.versions.map(version => `
    <article class="preview-card">
      <h3>${escapeHtml(version.name)}</h3>
      ${(version.quarters || []).map(q => `
        <div class="version-q">
          <h4>${escapeHtml(q.name)}</h4>
          <p><b>Prace:</b> ${escapeHtml(q.work)}</p>
          <p><b>Cel:</b> ${escapeHtml(q.goal)}</p>
          <p><b>Efekt końcowy:</b> ${escapeHtml(q.finalEffect)}</p>
          <div>${(q.hires || []).map(h => `<span class="badge">${escapeHtml(h.role)} · ${escapeHtml(h.department)}</span>`).join("")}</div>
        </div>
      `).join("")}
    </article>
  `).join("") || emptyCard("Brak wersji", "Dodaj wersję w Ustawienia → Road Mapa.");
}

function renderAccountsPreview() {
  const root = document.getElementById("accountsPreview");
  const account = data.accounts.accountTypes.find(a => a.name === activeAccount) || data.accounts.accountTypes[0];
  if (!account) {
    root.innerHTML = emptyCard("Brak kont", "Dodaj konto i funkcje w ustawieniach.");
    return;
  }
  root.innerHTML = (account.functions || []).map(fn => `
    <article class="preview-card">
      <span class="badge">${escapeHtml(fn.startQuarter)}</span>
      <h3>${escapeHtml(fn.name)}</h3>
      <p>${escapeHtml(fn.description)}</p>
    </article>
  `).join("") || emptyCard("Brak funkcji", "Dodaj funkcję do wybranego konta.");
}

function renderOrganizationPreview() {
  const root = document.getElementById("organizationPreview");
  const roadmapHires = [];
  data.roadmap.versions.forEach(v => v.quarters.forEach(q => (q.hires || []).forEach(h => roadmapHires.push({ role: h.role, department: h.department, responsibility: h.responsibility, source: q.name }))));
  const roles = [...data.organization.roles, ...roadmapHires];
  root.innerHTML = roles.map(role => `
    <article class="preview-card">
      <span class="badge">${escapeHtml(role.department || "Dział")}</span>
      <h3>${escapeHtml(role.role)}</h3>
      <p>${escapeHtml(role.responsibility)}</p>
      ${role.source ? `<p class="muted">Start: ${escapeHtml(role.source)}</p>` : ""}
    </article>
  `).join("") || emptyCard("Brak ról", "Dodaj role w ustawieniach lub w Road Mapie.");
}

function emptyCard(title, text) {
  return `<article class="preview-card"><h3>${title}</h3><p>${text}</p></article>`;
}

function renderBusinessEditor() {
  const root = document.getElementById("businessEditor");
  root.innerHTML = data.businessPlan.sections.map((section, index) => businessSectionForm(section, index)).join("");
}

function businessSectionForm(section, index) {
  const table = section.table || { enabled:false, columns:3, rows:3, cellWidth:160, cellHeight:54, cells:[] };
  const cells = Array.from({ length: Number(table.columns || 1) * Number(table.rows || 1) }, (_, cellIndex) => `
    <textarea data-business-cell="${index}:${cellIndex}" placeholder="Komórka ${cellIndex + 1}">${escapeHtml(table.cells?.[cellIndex] || "")}</textarea>
  `).join("");
  return `
    <article class="editor-card">
      <h3>Blok biznesplanu #${index + 1}</h3>
      <div class="field-grid">
        <label>Tytuł<input data-business="${index}:title" value="${escapeHtml(section.title)}"></label>
        <label>Podtytuł<input data-business="${index}:subtitle" value="${escapeHtml(section.subtitle)}"></label>
      </div>
      <div class="field-grid full"><label>Tekst<textarea data-business="${index}:text">${escapeHtml(section.text)}</textarea></label></div>
      <div class="table-builder">
        <label><input type="checkbox" data-business-table-enabled="${index}" ${table.enabled ? "checked" : ""}> Dodaj tabelkę</label>
        <div class="field-grid">
          <label>Liczba kolumn<input type="number" min="1" max="12" data-business-table="${index}:columns" value="${table.columns}"></label>
          <label>Liczba wierszy<input type="number" min="1" max="30" data-business-table="${index}:rows" value="${table.rows}"></label>
          <label>Szerokość komórki<input type="number" min="60" data-business-table="${index}:cellWidth" value="${table.cellWidth}"></label>
          <label>Wysokość komórki<input type="number" min="32" data-business-table="${index}:cellHeight" value="${table.cellHeight}"></label>
        </div>
        <div class="table-cells" style="grid-template-columns:repeat(${table.columns}, minmax(110px, 1fr))">${cells}</div>
      </div>
      <div class="editor-actions"><button class="action danger" data-remove-business="${index}">Usuń blok</button></div>
    </article>`;
}

function renderPresentationEditor() {
  const root = document.getElementById("presentationEditor");
  root.innerHTML = data.presentation.slides.map((slide, index) => `
    <article class="editor-card">
      <h3>Slajd #${index + 1}</h3>
      <div class="field-grid">
        <label>Tytuł slajdu<input data-slide="${index}:title" value="${escapeHtml(slide.title)}"></label>
        <label>Temat przewodni<input data-slide="${index}:theme" value="${escapeHtml(slide.theme)}"></label>
      </div>
      <label>Kod wizualizacji slajdu<textarea class="slide-code" data-slide="${index}:code">${escapeHtml(slide.code)}</textarea></label>
      <iframe class="slide-frame" sandbox srcdoc="${escapeHtml(slide.code || "")}"></iframe>
      <div class="editor-actions"><button class="action danger" data-remove-slide="${index}">Usuń slajd</button></div>
    </article>
  `).join("");
}

function renderRoadmapEditor() {
  const root = document.getElementById("roadmapEditor");
  root.innerHTML = data.roadmap.versions.map((version, versionIndex) => `
    <article class="editor-card">
      <h3>Wersja platformy #${versionIndex + 1}</h3>
      <label>Nazwa wersji<input data-version="${versionIndex}:name" value="${escapeHtml(version.name)}"></label>
      <div class="editor-actions"><button class="action" data-add-quarter="${versionIndex}">+ Dodaj Q</button><button class="action danger" data-remove-version="${versionIndex}">Usuń wersję</button></div>
      ${(version.quarters || []).map((q, qIndex) => quarterForm(q, versionIndex, qIndex)).join("")}
    </article>
  `).join("");
}

function quarterForm(q, versionIndex, qIndex) {
  return `
    <div class="version-q">
      <h4>Q #${qIndex + 1}</h4>
      <div class="field-grid">
        <label>Nazwa Q<input data-quarter="${versionIndex}:${qIndex}:name" value="${escapeHtml(q.name)}"></label>
        <label>Cel Q<input data-quarter="${versionIndex}:${qIndex}:goal" value="${escapeHtml(q.goal)}"></label>
      </div>
      <label>Co ma być wykonywane w danym Q<textarea data-quarter="${versionIndex}:${qIndex}:work">${escapeHtml(q.work)}</textarea></label>
      <label>Efekt końcowy<textarea data-quarter="${versionIndex}:${qIndex}:finalEffect">${escapeHtml(q.finalEffect)}</textarea></label>
      <div class="hire-list">${(q.hires || []).map((h, hIndex) => hireForm(h, versionIndex, qIndex, hIndex)).join("")}</div>
      <div class="editor-actions"><button class="action" data-add-hire="${versionIndex}:${qIndex}">+ Dodaj osobę</button><button class="action danger" data-remove-quarter="${versionIndex}:${qIndex}">Usuń Q</button></div>
    </div>`;
}

function hireForm(h, versionIndex, qIndex, hIndex) {
  return `
    <div class="hire-row">
      <div class="field-grid">
        <label>Stanowisko<input data-hire="${versionIndex}:${qIndex}:${hIndex}:role" value="${escapeHtml(h.role)}"></label>
        <label>Dział firmy<input data-hire="${versionIndex}:${qIndex}:${hIndex}:department" value="${escapeHtml(h.department)}"></label>
      </div>
      <label>Za co odpowiada w projekcie<textarea data-hire="${versionIndex}:${qIndex}:${hIndex}:responsibility">${escapeHtml(h.responsibility)}</textarea></label>
      <div class="editor-actions"><button class="action danger" data-remove-hire="${versionIndex}:${qIndex}:${hIndex}">Usuń osobę</button></div>
    </div>`;
}

function renderAccountsEditor() {
  const root = document.getElementById("accountsEditor");
  const quarterOptions = qList().map(q => `<option value="${escapeHtml(q)}">${escapeHtml(q)}</option>`).join("");
  root.innerHTML = data.accounts.accountTypes.map((account, accountIndex) => `
    <article class="editor-card">
      <h3>${escapeHtml(account.name)}</h3>
      ${(account.functions || []).map((fn, fnIndex) => `
        <div class="version-q">
          <div class="field-grid">
            <label>Nazwa funkcji<input data-function="${accountIndex}:${fnIndex}:name" value="${escapeHtml(fn.name)}"></label>
            <label>Q rozpoczęcia prac<select data-function="${accountIndex}:${fnIndex}:startQuarter"><option value="">Wybierz Q</option>${quarterOptions}</select></label>
          </div>
          <label>Opis funkcji<textarea data-function="${accountIndex}:${fnIndex}:description">${escapeHtml(fn.description)}</textarea></label>
          <div class="editor-actions"><button class="action danger" data-remove-function="${accountIndex}:${fnIndex}">Usuń funkcję</button></div>
        </div>
      `).join("")}
    </article>
  `).join("");
  document.querySelectorAll("[data-function$=':startQuarter']").forEach(select => {
    const [accountIndex, fnIndex] = select.dataset.function.split(":");
    select.value = data.accounts.accountTypes[accountIndex].functions[fnIndex].startQuarter || "";
  });
}

function renderOrganizationEditor() {
  const root = document.getElementById("organizationEditor");
  root.innerHTML = data.organization.roles.map((role, index) => `
    <article class="editor-card">
      <h3>Rola #${index + 1}</h3>
      <div class="field-grid">
        <label>Stanowisko<input data-org="${index}:role" value="${escapeHtml(role.role)}"></label>
        <label>Dział<input data-org="${index}:department" value="${escapeHtml(role.department)}"></label>
      </div>
      <label>Odpowiedzialność<textarea data-org="${index}:responsibility">${escapeHtml(role.responsibility)}</textarea></label>
      <div class="editor-actions"><button class="action danger" data-remove-org="${index}">Usuń rolę</button></div>
    </article>
  `).join("");
}

function setByPath(target, path, value) {
  target[path] = value;
}

document.addEventListener("input", event => {
  const el = event.target;
  if (el.dataset.business) {
    const [index, field] = el.dataset.business.split(":");
    data.businessPlan.sections[index][field] = el.value;
    saveData();
  }
  if (el.dataset.businessTable) {
    const [index, field] = el.dataset.businessTable.split(":");
    data.businessPlan.sections[index].table[field] = Number(el.value);
    resizeCells(data.businessPlan.sections[index].table);
    saveData();
  }
  if (el.dataset.businessCell) {
    const [index, cellIndex] = el.dataset.businessCell.split(":");
    data.businessPlan.sections[index].table.cells[cellIndex] = el.value;
    saveData();
  }
  if (el.dataset.slide) {
    const [index, field] = el.dataset.slide.split(":");
    data.presentation.slides[index][field] = el.value;
    saveData();
  }
  if (el.dataset.version) {
    const [index, field] = el.dataset.version.split(":");
    data.roadmap.versions[index][field] = el.value;
    saveData();
  }
  if (el.dataset.quarter) {
    const [v, q, field] = el.dataset.quarter.split(":");
    data.roadmap.versions[v].quarters[q][field] = el.value;
    saveData();
  }
  if (el.dataset.hire) {
    const [v, q, h, field] = el.dataset.hire.split(":");
    data.roadmap.versions[v].quarters[q].hires[h][field] = el.value;
    saveData();
  }
  if (el.dataset.function) {
    const [a, f, field] = el.dataset.function.split(":");
    data.accounts.accountTypes[a].functions[f][field] = el.value;
    saveData();
  }
  if (el.dataset.org) {
    const [index, field] = el.dataset.org.split(":");
    data.organization.roles[index][field] = el.value;
    saveData();
  }
});

document.addEventListener("change", event => {
  if (event.target.dataset.businessTableEnabled) {
    const index = event.target.dataset.businessTableEnabled;
    data.businessPlan.sections[index].table.enabled = event.target.checked;
    saveData();
  }
});

document.addEventListener("click", event => {
  const btn = event.target.closest("button");
  if (!btn) return;

  if (btn.dataset.settingsTab) {
    document.querySelectorAll(".settings-tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".settings-panel").forEach(panel => panel.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(`settings-${btn.dataset.settingsTab}`).classList.add("active");
  }

  if (btn.dataset.accountView) {
    activeAccount = btn.dataset.accountView;
    document.querySelectorAll(".side-account").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    renderAccountsPreview();
  }

  if (btn.id === "addBusinessSection") {
    data.businessPlan.sections.push({ title:"Nowy tytuł", subtitle:"Podtytuł", text:"Treść sekcji...", table:{ enabled:false, columns:3, rows:3, cellWidth:160, cellHeight:54, cells:[] } });
    saveData();
  }
  if (btn.dataset.removeBusiness) { data.businessPlan.sections.splice(Number(btn.dataset.removeBusiness), 1); saveData(); }

  if (btn.id === "addSlide") { data.presentation.slides.push({ title:"Nowy slajd", theme:"Temat przewodni", code:"<div style='padding:24px;color:white'>Nowy slajd</div>" }); saveData(); }
  if (btn.dataset.removeSlide) { data.presentation.slides.splice(Number(btn.dataset.removeSlide), 1); saveData(); }

  if (btn.id === "addVersion") { data.roadmap.versions.push({ name:"Nowa wersja", quarters:[] }); saveData(); }
  if (btn.dataset.removeVersion) { data.roadmap.versions.splice(Number(btn.dataset.removeVersion), 1); saveData(); }
  if (btn.dataset.addQuarter) { data.roadmap.versions[btn.dataset.addQuarter].quarters.push({ name:"Q", work:"", goal:"", finalEffect:"", hires:[] }); saveData(); }
  if (btn.dataset.removeQuarter) { const [v,q] = btn.dataset.removeQuarter.split(":"); data.roadmap.versions[v].quarters.splice(Number(q), 1); saveData(); }
  if (btn.dataset.addHire) { const [v,q] = btn.dataset.addHire.split(":"); data.roadmap.versions[v].quarters[q].hires.push({ role:"Nowa rola", department:"Dział", responsibility:"Odpowiedzialność" }); saveData(); }
  if (btn.dataset.removeHire) { const [v,q,h] = btn.dataset.removeHire.split(":"); data.roadmap.versions[v].quarters[q].hires.splice(Number(h), 1); saveData(); }

  if (btn.id === "addAccountFunction") {
    const account = data.accounts.accountTypes[0];
    account.functions.push({ name:"Nowa funkcja", description:"Opis funkcji", startQuarter:qList()[0] || "" });
    saveData();
  }
  if (btn.dataset.removeFunction) { const [a,f] = btn.dataset.removeFunction.split(":"); data.accounts.accountTypes[a].functions.splice(Number(f), 1); saveData(); }

  if (btn.id === "addOrgRole") { data.organization.roles.push({ role:"Nowa rola", department:"Dział", responsibility:"Opis odpowiedzialności" }); saveData(); }
  if (btn.dataset.removeOrg) { data.organization.roles.splice(Number(btn.dataset.removeOrg), 1); saveData(); }
});

function resizeCells(table) {
  const count = Number(table.columns || 1) * Number(table.rows || 1);
  table.cells = table.cells || [];
  while (table.cells.length < count) table.cells.push("");
  table.cells = table.cells.slice(0, count);
}

renderAll();
