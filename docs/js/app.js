/* ============================================================
   PROFESSOR OAK'S RESEARCH TERMINAL — Application Logic
   ============================================================ */

(function () {
  'use strict';

  let journalData = [];
  let guideData = null;
  let currentView = 'journal';

  // ---- Bootstrap ----
  document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadJournalData();
    loadGuideData();
    bindNavigation();
  });

  // ---- Load Data ----
  async function loadJournalData() {
    try {
      const resp = await fetch('data/journals.json');
      if (!resp.ok) throw new Error('Failed to load journal data');
      journalData = await resp.json();
      renderStats();
      renderTimeline();
    } catch (err) {
      document.getElementById('timeline').innerHTML =
        '<div class="loading-state"><p>⚠ Unable to load research logs.</p></div>';
    }
  }

  // ---- Render Stats Banner ----
  function renderStats() {
    const totalCycles = journalData.length;
    const builds = journalData.filter(j => j.buildResult);
    const successes = builds.filter(j => j.buildResult.status === 'success').length;
    const failures = builds.length - successes;
    const filesModified = new Set(journalData.flatMap(j => j.filesModified || [])).size;
    document.getElementById('stat-cycles').textContent = String(totalCycles).padStart(3, '0');
    document.getElementById('stat-builds').textContent = successes + '/' + builds.length;
    document.getElementById('stat-builds').className = 'stat-value ' + (failures > 0 ? '' : 'success');
    document.getElementById('stat-files').textContent = String(filesModified);
  }

  // ---- Render Timeline ----
  function renderTimeline() {
    const container = document.getElementById('timeline');
    container.innerHTML = '';

    // Render newest first
    const sorted = [...journalData].sort((a, b) => b.cycle - a.cycle);

    sorted.forEach(entry => {
      container.appendChild(createJournalCard(entry));
    });
  }

  // ---- Create Journal Card ----
  function createJournalCard(entry) {
    const card = document.createElement('div');
    card.className = 'journal-card mode-' + (entry.mode || 'research');

    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }) + ' · ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: false
    });

    // Build indicator
    let buildHtml = '';
    if (entry.buildResult) {
      const isSuccess = entry.buildResult.status === 'success';
      buildHtml = '<div class="build-indicator ' + (isSuccess ? 'success' : 'failure') + '">' +
        '<span class="led"></span>' +
        (isSuccess ? 'BUILD PASSED' : 'BUILD FAILED') +
        '</div>';
    }

    // Files modified
    let filesHtml = '';
    if (entry.filesModified && entry.filesModified.length > 0) {
      filesHtml = '<div class="card-section">' +
        '<div class="section-title"><span class="icon">📁</span> Files Modified</div>' +
        '<ul class="files-list">' +
        entry.filesModified.map(f => '<li>' + escapeHtml(f) + '</li>').join('') +
        '</ul></div>';
    }

    // Stats
    let statsHtml = '';
    if (entry.stats) {
      statsHtml = '<div class="card-section"><div class="section-title"><span class="icon">📊</span> Stats</div><div class="stats-bar">';
      if (entry.stats.tokensUsed != null) {
        statsHtml += '<span class="stat-chip">Tokens: <strong>' + entry.stats.tokensUsed.toLocaleString() + '</strong></span>';
      }
      statsHtml += '</div></div>';
    }

    card.innerHTML =
      '<div class="card-header" onclick="toggleCard(this)">' +
        '<span class="cycle-badge">CYCLE ' + String(entry.cycle).padStart(4, '0') + '</span>' +
        '<span class="mode-badge ' + (entry.mode || '') + '">' + escapeHtml(entry.mode || 'unknown') + '</span>' +
        '<span class="card-date">' + dateStr + '</span>' +
        '<span class="card-expand">▼</span>' +
      '</div>' +
      '<div class="card-objective">' + escapeHtml(entry.objective || '') + '</div>' +
      buildHtml +
      '<div class="card-body"><div class="card-body-inner">' +
        '<div class="card-section">' +
          '<div class="section-title"><span class="icon">🧠</span> Reasoning</div>' +
          '<div class="reasoning-block">' + escapeHtml(entry.reasoning || '') + '</div>' +
        '</div>' +
        filesHtml +
        '<div class="card-section">' +
          '<div class="section-title"><span class="icon">📋</span> Summary</div>' +
          '<div class="summary-block">' + escapeHtml(entry.summary || '') + '</div>' +
        '</div>' +
        '<div class="card-section">' +
          '<div class="section-title"><span class="icon">🔮</span> Next Steps</div>' +
          '<div class="next-steps-block">' + escapeHtml(entry.nextSteps || '') + '</div>' +
        '</div>' +
        statsHtml +
      '</div></div>';

    return card;
  }

  // ---- Toggle Card ----
  window.toggleCard = function (headerEl) {
    const card = headerEl.closest('.journal-card');
    card.classList.toggle('expanded');
  };

  // ---- Navigation ----
  function bindNavigation() {
    document.querySelectorAll('.header-nav button').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        switchView(view);
      });
    });
  }

  function switchView(view) {
    currentView = view;

    // Update nav buttons
    document.querySelectorAll('.header-nav button').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });

    // Toggle views
    document.querySelector('.main-content').classList.toggle('active', view === 'journal');
    document.querySelector('.guide-view').classList.toggle('active', view === 'guide');
    document.querySelector('.strategy-view').classList.toggle('active', view === 'strategy');
    document.querySelector('.about-view').classList.toggle('active', view === 'about');
  }

  // ---- Decorative Particles ----
  function createParticles() {
    const count = 15;
    const body = document.body;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      body.appendChild(p);
    }
  }

  // ---- Game Guide ----

  async function loadGuideData() {
    try {
      const resp = await fetch('data/game-guide.json');
      if (!resp.ok) throw new Error('Failed to load guide data');
      guideData = await resp.json();
      renderGuide();
    } catch (err) {
      document.querySelector('.guide-view').innerHTML =
        '<div class="info-card"><p>\u26A0 Unable to load game guide data.</p></div>';
    }
  }

  function renderGuide() {
    const container = document.querySelector('.guide-view');
    container.innerHTML = '';
    container.appendChild(renderStartersSection());
    container.appendChild(renderGymLeadersSection());
    container.appendChild(renderEliteFourSection());
    container.appendChild(renderChampionSection());
    container.appendChild(renderRivalsSection());
    container.appendChild(renderRoutesSection());
  }

  // ---- Starters ----

  function renderStartersSection() {
    const section = document.createElement('div');
    section.className = 'info-card';
    const starterEmojis = ['\uD83E\uDEA8', '\uD83D\uDC09', '\u2699\uFE0F'];
    const starterTypes = ['Rock / Ground', 'Dragon', 'Steel / Psychic'];
    section.innerHTML =
      '<h3>\u2694\uFE0F Starter Pok\u00E9mon</h3>' +
      '<div class="starter-grid">' +
        guideData.starters.map((s, i) =>
          '<div class="starter-card">' +
            '<div class="pokemon-sprite">' + starterEmojis[i] + '</div>' +
            '<div class="pokemon-name">' + escapeHtml(s.species) + '</div>' +
            '<div class="pokemon-type">' + starterTypes[i] + '</div>' +
          '</div>'
        ).join('') +
      '</div>';
    return section;
  }

  // ---- Gym Leaders ----

  function renderGymLeadersSection() {
    const section = document.createElement('div');
    section.className = 'guide-section';
    section.innerHTML = '<h2 class="guide-section-title">\uD83C\uDFDF\uFE0F Gym Leaders</h2>';
    guideData.gymLeaders.forEach(gym => {
      section.appendChild(createTrainerCard({
        title: 'Gym ' + gym.gym + ': ' + gym.name,
        subtitle: gym.location + (gym.doubleBattle ? ' \u00B7 Double Battle' : ''),
        typeBadge: gym.type,
        party: gym.party,
      }));
    });
    return section;
  }

  // ---- Elite Four ----

  function renderEliteFourSection() {
    const section = document.createElement('div');
    section.className = 'guide-section';
    section.innerHTML = '<h2 class="guide-section-title">\uD83C\uDFC6 Elite Four</h2>';
    guideData.eliteFour.forEach((e4, i) => {
      section.appendChild(createTrainerCard({
        title: 'Elite Four #' + (i + 1) + ': ' + e4.name,
        subtitle: e4.type + ' Specialist',
        typeBadge: e4.type,
        party: e4.party,
      }));
    });
    return section;
  }

  // ---- Champion ----

  function renderChampionSection() {
    if (!guideData.champion) return document.createElement('div');
    const section = document.createElement('div');
    section.className = 'guide-section';
    section.innerHTML = '<h2 class="guide-section-title">\uD83D\uDC51 Champion</h2>';
    section.appendChild(createTrainerCard({
      title: 'Champion ' + guideData.champion.name,
      subtitle: 'The final challenge',
      typeBadge: 'Champion',
      party: guideData.champion.party,
    }));
    return section;
  }

  // ---- Rivals ----

  function renderRivalsSection() {
    const section = document.createElement('div');
    section.className = 'guide-section';
    section.innerHTML = '<h2 class="guide-section-title">\uD83C\uDFC3 Rival Battles</h2>';

    // Group by location, show Brendan only (May mirrors)
    const brendanBattles = guideData.rivals
      .filter(r => r.rival === 'Brendan')
      .sort((a, b) => {
        const maxA = Math.max(...a.party.map(p => p.level));
        const maxB = Math.max(...b.party.map(p => p.level));
        return maxA - maxB;
      });

    brendanBattles.forEach(battle => {
      section.appendChild(createTrainerCard({
        title: battle.rival + ' \u2014 ' + battle.location,
        subtitle: battle.starterMatchup ? 'If player chose: ' + battle.starterMatchup : '',
        typeBadge: 'Rival',
        party: battle.party,
      }));
    });
    return section;
  }

  // ---- Routes ----

  function renderRoutesSection() {
    const section = document.createElement('div');
    section.className = 'guide-section';
    section.innerHTML = '<h2 class="guide-section-title">\uD83D\uDDFA\uFE0F Wild Encounters by Location</h2>';

    // Sort routes: Route NNN first (numerically), then alphabetical
    const routeNames = Object.keys(guideData.routes).sort((a, b) => {
      const aNum = a.match(/^Route (\d+)$/);
      const bNum = b.match(/^Route (\d+)$/);
      if (aNum && bNum) return parseInt(aNum[1]) - parseInt(bNum[1]);
      if (aNum) return -1;
      if (bNum) return 1;
      return a.localeCompare(b);
    });

    routeNames.forEach(name => {
      section.appendChild(createRouteCard(name, guideData.routes[name]));
    });
    return section;
  }

  // ---- Shared: Trainer Card ----

  function createTrainerCard(opts) {
    const card = document.createElement('div');
    card.className = 'guide-card';

    const typeCls = typeClass(opts.typeBadge);
    card.innerHTML =
      '<div class="guide-card-header" onclick="toggleGuideCard(this)">' +
        '<span class="guide-card-title">' + escapeHtml(opts.title) + '</span>' +
        '<span class="type-badge ' + typeCls + '">' + escapeHtml(opts.typeBadge) + '</span>' +
        '<span class="card-expand">\u25BC</span>' +
      '</div>' +
      (opts.subtitle ? '<div class="guide-card-subtitle">' + escapeHtml(opts.subtitle) + '</div>' : '') +
      '<div class="guide-card-body">' +
        '<table class="party-table">' +
          '<thead><tr><th>Pok\u00E9mon</th><th>Lv</th><th>Held Item</th><th>Moves</th></tr></thead>' +
          '<tbody>' +
            opts.party.map(mon =>
              '<tr>' +
                '<td class="mon-name">' + escapeHtml(mon.species) + '</td>' +
                '<td class="mon-level">' + mon.level + '</td>' +
                '<td>' + (mon.heldItem ? escapeHtml(mon.heldItem) : '\u2014') + '</td>' +
                '<td class="mon-moves">' + (mon.moves ? mon.moves.map(m => escapeHtml(m)).join(', ') : '<span class="text-muted">Default</span>') + '</td>' +
              '</tr>'
            ).join('') +
          '</tbody>' +
        '</table>' +
      '</div>';
    return card;
  }

  window.toggleGuideCard = function (headerEl) {
    headerEl.closest('.guide-card').classList.toggle('expanded');
  };

  // ---- Shared: Route Card ----

  function createRouteCard(name, route) {
    const card = document.createElement('div');
    card.className = 'guide-card';

    // Count unique species across all encounter types
    const allSpecies = new Set();
    ['land', 'water', 'rockSmash'].forEach(type => {
      if (route[type]) route[type].forEach(m => allSpecies.add(m.species));
    });
    if (route.fishing) {
      ['oldRod', 'goodRod', 'superRod'].forEach(rod => {
        if (route.fishing[rod]) route.fishing[rod].forEach(m => allSpecies.add(m.species));
      });
    }

    let bodyHtml = '';
    if (route.land) bodyHtml += renderEncounterTable('\uD83C\uDF3F Grass / Cave', route.land);
    if (route.water) bodyHtml += renderEncounterTable('\uD83C\uDF0A Surfing', route.water);
    if (route.rockSmash) bodyHtml += renderEncounterTable('\uD83E\uDEA8 Rock Smash', route.rockSmash);
    if (route.fishing) {
      if (route.fishing.oldRod) bodyHtml += renderEncounterTable('\uD83C\uDFA3 Old Rod', route.fishing.oldRod);
      if (route.fishing.goodRod) bodyHtml += renderEncounterTable('\uD83C\uDFA3 Good Rod', route.fishing.goodRod);
      if (route.fishing.superRod) bodyHtml += renderEncounterTable('\uD83C\uDFA3 Super Rod', route.fishing.superRod);
    }

    card.innerHTML =
      '<div class="guide-card-header" onclick="toggleGuideCard(this)">' +
        '<span class="guide-card-title">' + escapeHtml(name) + '</span>' +
        '<span class="encounter-count">' + allSpecies.size + ' species</span>' +
        '<span class="card-expand">\u25BC</span>' +
      '</div>' +
      '<div class="guide-card-body">' + bodyHtml + '</div>';
    return card;
  }

  function renderEncounterTable(title, mons) {
    // Deduplicate by species, combining level ranges
    const seen = new Map();
    mons.forEach(m => {
      const key = m.species;
      if (seen.has(key)) {
        const existing = seen.get(key);
        existing.minLevel = Math.min(existing.minLevel, m.minLevel);
        existing.maxLevel = Math.max(existing.maxLevel, m.maxLevel);
        existing.totalRate += m.rate;
      } else {
        seen.set(key, { ...m, totalRate: m.rate });
      }
    });
    const deduped = [...seen.values()].sort((a, b) => b.totalRate - a.totalRate);

    return '<div class="encounter-group">' +
      '<div class="encounter-group-title">' + title + '</div>' +
      '<table class="encounter-table">' +
        '<thead><tr><th>Pok\u00E9mon</th><th>Level</th><th>Rate</th><th>Rarity</th></tr></thead>' +
        '<tbody>' +
          deduped.map(m =>
            '<tr>' +
              '<td class="mon-name">' + escapeHtml(m.species) + '</td>' +
              '<td>' + (m.minLevel === m.maxLevel ? m.minLevel : m.minLevel + '\u2013' + m.maxLevel) + '</td>' +
              '<td>' + m.totalRate + '%</td>' +
              '<td><span class="rarity-badge rarity-' + rarityClass(m.totalRate) + '">' + rarityLabel(m.totalRate) + '</span></td>' +
            '</tr>'
          ).join('') +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  // ---- Type / Rarity Helpers ----

  function typeClass(type) {
    return 'type-' + (type || '').toLowerCase().replace(/[^a-z]/g, '');
  }

  function rarityClass(rate) {
    if (rate >= 20) return 'common';
    if (rate >= 10) return 'uncommon';
    if (rate >= 4) return 'rare';
    return 'ultrarare';
  }

  function rarityLabel(rate) {
    if (rate >= 20) return 'Common';
    if (rate >= 10) return 'Uncommon';
    if (rate >= 4) return 'Rare';
    return 'Ultra-Rare';
  }

  // ---- Utilities ----
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})();
