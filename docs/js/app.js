/* ============================================================
   PROFESSOR OAK'S RESEARCH TERMINAL — Application Logic
   ============================================================ */

(function () {
  'use strict';

  let journalData = [];
  let currentView = 'journal';

  // ---- Bootstrap ----
  document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadJournalData();
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

  // ---- Utilities ----
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})();
