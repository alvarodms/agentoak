/* ============================================================
   PROFESSOR OAK'S RESEARCH TERMINAL — Application Logic
   ============================================================ */

(function () {
  'use strict';

  let journalData = [];
  let guideData = null;
  let strategyData = null;
  let currentView = 'journal';

  // ---- Pokémon Dex Map (display name → national dex ID) ----
  // Used to look up sprite URLs from PokéAPI CDN
  const POKEMON_DEX = {
    // Gen 1
    'Bulbasaur':1,'Ivysaur':2,'Venusaur':3,'Charmander':4,'Charmeleon':5,'Charizard':6,
    'Squirtle':7,'Wartortle':8,'Blastoise':9,'Caterpie':10,'Metapod':11,'Butterfree':12,
    'Weedle':13,'Kakuna':14,'Beedrill':15,'Pidgey':16,'Pidgeotto':17,'Pidgeot':18,
    'Rattata':19,'Raticate':20,'Spearow':21,'Fearow':22,'Ekans':23,'Arbok':24,
    'Pikachu':25,'Raichu':26,'Sandshrew':27,'Sandslash':28,'Nidoran F':29,'Nidorina':30,
    'Nidoqueen':31,'Nidoran M':32,'Nidorino':33,'Nidoking':34,'Clefairy':35,'Clefable':36,
    'Vulpix':37,'Ninetales':38,'Jigglypuff':39,'Wigglytuff':40,'Zubat':41,'Golbat':42,
    'Oddish':43,'Gloom':44,'Vileplume':45,'Paras':46,'Parasect':47,'Venonat':48,
    'Venomoth':49,'Diglett':50,'Dugtrio':51,'Meowth':52,'Persian':53,'Psyduck':54,
    'Golduck':55,'Mankey':56,'Primeape':57,'Growlithe':58,'Arcanine':59,'Poliwag':60,
    'Poliwhirl':61,'Poliwrath':62,'Abra':63,'Kadabra':64,'Alakazam':65,'Machop':66,
    'Machoke':67,'Machamp':68,'Bellsprout':69,'Weepinbell':70,'Victreebel':71,
    'Tentacool':72,'Tentacruel':73,'Geodude':74,'Graveler':75,'Golem':76,'Ponyta':77,
    'Rapidash':78,'Slowpoke':79,'Slowbro':80,'Magnemite':81,'Magneton':82,
    'Farfetch D':83,'Doduo':84,'Dodrio':85,'Seel':86,'Dewgong':87,'Grimer':88,
    'Muk':89,'Shellder':90,'Cloyster':91,'Gastly':92,'Haunter':93,'Gengar':94,
    'Onix':95,'Drowzee':96,'Hypno':97,'Krabby':98,'Kingler':99,'Voltorb':100,
    'Electrode':101,'Exeggcute':102,'Exeggutor':103,'Cubone':104,'Marowak':105,
    'Hitmonlee':106,'Hitmonchan':107,'Lickitung':108,'Koffing':109,'Weezing':110,
    'Rhyhorn':111,'Rhydon':112,'Chansey':113,'Tangela':114,'Kangaskhan':115,
    'Horsea':116,'Seadra':117,'Goldeen':118,'Seaking':119,'Staryu':120,'Starmie':121,
    'Mr Mime':122,'Scyther':123,'Jynx':124,'Electabuzz':125,'Magmar':126,'Pinsir':127,
    'Tauros':128,'Magikarp':129,'Gyarados':130,'Lapras':131,'Ditto':132,'Eevee':133,
    'Vaporeon':134,'Jolteon':135,'Flareon':136,'Porygon':137,'Omanyte':138,
    'Omastar':139,'Kabuto':140,'Kabutops':141,'Aerodactyl':142,'Snorlax':143,
    'Articuno':144,'Zapdos':145,'Moltres':146,'Dratini':147,'Dragonair':148,
    'Dragonite':149,'Mewtwo':150,'Mew':151,
    // Gen 2
    'Chikorita':152,'Bayleef':153,'Meganium':154,'Cyndaquil':155,'Quilava':156,
    'Typhlosion':157,'Totodile':158,'Croconaw':159,'Feraligatr':160,'Sentret':161,
    'Furret':162,'Hoothoot':163,'Noctowl':164,'Ledyba':165,'Ledian':166,
    'Spinarak':167,'Ariados':168,'Crobat':169,'Chinchou':170,'Lanturn':171,
    'Pichu':172,'Cleffa':173,'Igglybuff':174,'Togepi':175,'Togetic':176,
    'Natu':177,'Xatu':178,'Mareep':179,'Flaaffy':180,'Ampharos':181,'Bellossom':182,
    'Marill':183,'Azumarill':184,'Sudowoodo':185,'Politoed':186,'Hoppip':187,
    'Skiploom':188,'Jumpluff':189,'Aipom':190,'Sunkern':191,'Sunflora':192,
    'Yanma':193,'Wooper':194,'Quagsire':195,'Espeon':196,'Umbreon':197,
    'Murkrow':198,'Slowking':199,'Misdreavus':200,'Unown':201,'Wobbuffet':202,
    'Girafarig':203,'Pineco':204,'Forretress':205,'Dunsparce':206,'Gligar':207,
    'Steelix':208,'Snubbull':209,'Granbull':210,'Qwilfish':211,'Scizor':212,
    'Shuckle':213,'Heracross':214,'Sneasel':215,'Teddiursa':216,'Ursaring':217,
    'Slugma':218,'Magcargo':219,'Swinub':220,'Piloswine':221,'Corsola':222,
    'Remoraid':223,'Octillery':224,'Delibird':225,'Mantine':226,'Skarmory':227,
    'Houndour':228,'Houndoom':229,'Kingdra':230,'Phanpy':231,'Donphan':232,
    'Porygon2':233,'Stantler':234,'Smeargle':235,'Tyrogue':236,'Hitmontop':237,
    'Smoochum':238,'Elekid':239,'Magby':240,'Miltank':241,'Blissey':242,
    'Raikou':243,'Entei':244,'Suicune':245,'Larvitar':246,'Pupitar':247,
    'Tyranitar':248,'Lugia':249,'Ho Oh':250,'Celebi':251,
    // Gen 3
    'Treecko':252,'Grovyle':253,'Sceptile':254,'Torchic':255,'Combusken':256,
    'Blaziken':257,'Mudkip':258,'Marshtomp':259,'Swampert':260,'Poochyena':261,
    'Mightyena':262,'Zigzagoon':263,'Linoone':264,'Wurmple':265,'Silcoon':266,
    'Beautifly':267,'Cascoon':268,'Dustox':269,'Lotad':270,'Lombre':271,
    'Ludicolo':272,'Seedot':273,'Nuzleaf':274,'Shiftry':275,'Taillow':276,
    'Swellow':277,'Wingull':278,'Pelipper':279,'Ralts':280,'Kirlia':281,
    'Gardevoir':282,'Surskit':283,'Masquerain':284,'Shroomish':285,'Breloom':286,
    'Slakoth':287,'Vigoroth':288,'Slaking':289,'Nincada':290,'Ninjask':291,
    'Shedinja':292,'Whismur':293,'Loudred':294,'Exploud':295,'Makuhita':296,
    'Hariyama':297,'Azurill':298,'Nosepass':299,'Skitty':300,'Delcatty':301,
    'Sableye':302,'Mawile':303,'Aron':304,'Lairon':305,'Aggron':306,
    'Meditite':307,'Medicham':308,'Electrike':309,'Manectric':310,'Plusle':311,
    'Minun':312,'Volbeat':313,'Illumise':314,'Roselia':315,'Gulpin':316,
    'Swalot':317,'Carvanha':318,'Sharpedo':319,'Wailmer':320,'Wailord':321,
    'Numel':322,'Camerupt':323,'Torkoal':324,'Spoink':325,'Grumpig':326,
    'Spinda':327,'Trapinch':328,'Vibrava':329,'Flygon':330,'Cacnea':331,
    'Cacturne':332,'Swablu':333,'Altaria':334,'Zangoose':335,'Seviper':336,
    'Lunatone':337,'Solrock':338,'Barboach':339,'Whiscash':340,'Corphish':341,
    'Crawdaunt':342,'Baltoy':343,'Claydol':344,'Lileep':345,'Cradily':346,
    'Anorith':347,'Armaldo':348,'Feebas':349,'Milotic':350,'Castform':351,
    'Kecleon':352,'Shuppet':353,'Banette':354,'Duskull':355,'Dusclops':356,
    'Tropius':357,'Chimecho':358,'Absol':359,'Wynaut':360,'Snorunt':361,
    'Glalie':362,'Spheal':363,'Sealeo':364,'Walrein':365,'Clamperl':366,
    'Huntail':367,'Gorebyss':368,'Relicanth':369,'Luvdisc':370,'Bagon':371,
    'Shelgon':372,'Salamence':373,'Beldum':374,'Metang':375,'Metagross':376,
    'Regirock':377,'Regice':378,'Registeel':379,'Latias':380,'Latios':381,
    'Kyogre':382,'Groudon':383,'Rayquaza':384,'Jirachi':385,'Deoxys':386,
    // Gen 4 (may appear as custom additions)
    'Budew':406,'Roserade':407,'Lucario':448,'Gible':443,'Gabite':444,'Garchomp':445,
    'Riolu':447,'Mime Jr':439,'Bonsly':438,'Happiny':440,'Togekiss':468,
    'Magmortar':467,'Electivire':466,'Porygon Z':474,'Glaceon':471,'Leafeon':470,
    'Weavile':461,'Honchkrow':430,'Mismagius':429,'Ambipom':424,'Dusknoir':477,
    'Gallade':475,'Froslass':478,'Rotom':479,'Uxie':480,'Mesprit':481,'Azelf':482,
    'Dialga':483,'Palkia':484,'Heatran':485,'Regigigas':486,'Giratina':487,
    'Cresselia':488,'Darkrai':491,'Shaymin':492,'Arceus':493,
  };

  // ---- Pokémon Sprite Helpers ----
  function pokemonSpriteUrl(name) {
    const id = POKEMON_DEX[name];
    if (!id) return null;
    // Try Gen 3 Emerald sprite first; onerror falls back to modern
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/' + id + '.png';
  }

  function pokemonSpriteFallbackSrc(name) {
    const id = POKEMON_DEX[name];
    if (!id) return null;
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png';
  }

  // Creates an <img> element for a Pokémon sprite; returns null if unknown
  function makeSpriteImg(name, cssClass) {
    const src = pokemonSpriteUrl(name);
    if (!src) return null;
    const img = document.createElement('img');
    img.src = src;
    img.alt = name;
    img.className = cssClass || 'pokemon-thumb';
    img.loading = 'lazy';
    const fallback = pokemonSpriteFallbackSrc(name);
    img.onerror = function () {
      if (fallback && this.src !== fallback) {
        this.onerror = function () { this.style.display = 'none'; };
        this.src = fallback;
      } else {
        this.style.display = 'none';
      }
    };
    return img;
  }

  // ---- Bootstrap ----
  document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    loadJournalData();
    loadGuideData();
    loadStrategyData();
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
    document.querySelector('.roadmap-view').classList.toggle('active', view === 'roadmap');
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

  // ---- Strategy ----

  async function loadStrategyData() {
    try {
      const resp = await fetch('data/strategy.json');
      if (!resp.ok) throw new Error('Failed to load strategy data');
      strategyData = await resp.json();
      renderStrategy();
      renderRoadmap();
    } catch (err) {
      document.querySelector('.strategy-view').innerHTML =
        '<div class="info-card"><p>\u26A0 Unable to load strategy data.</p></div>';
      document.querySelector('.roadmap-view').innerHTML =
        '<div class="roadmap-loading"><p>\u26A0 Unable to load roadmap data.</p></div>';
    }
  }

  function renderStrategy() {
    const container = document.querySelector('.strategy-view');
    container.innerHTML = '';

    // Vision
    if (strategyData.vision && strategyData.vision.title) {
      const visionCard = document.createElement('div');
      visionCard.className = 'info-card';
      visionCard.innerHTML =
        '<h3>\uD83C\uDFAF ROM Hack Vision</h3>' +
        '<p><strong>' + escapeHtml(strategyData.vision.title) + '</strong> \u2014 ' +
        escapeHtml(strategyData.vision.description) + '</p>';
      container.appendChild(visionCard);
    }

    // Starters
    if (strategyData.starters && strategyData.starters.length > 0) {
      const starterCard = document.createElement('div');
      starterCard.className = 'info-card';
      const starterEmojis = { 'Rock': '\uD83E\uDEA8', 'Dragon': '\uD83D\uDC09', 'Steel': '\u2699\uFE0F', 'Fire': '\uD83D\uDD25', 'Water': '\uD83D\uDCA7', 'Grass': '\uD83C\uDF3F' };

      const titleEl = document.createElement('h3');
      titleEl.textContent = '\u2694\uFE0F New Starter Trio';
      starterCard.appendChild(titleEl);

      const grid = document.createElement('div');
      grid.className = 'starter-grid';
      strategyData.starters.forEach(function (s) {
        var primaryType = s.types.split(/\s*[\/\u2192]\s*/)[0].trim();
        var emoji = starterEmojis[primaryType] || '\uD83D\uDC7E';
        var card = document.createElement('div');
        card.className = 'starter-card';

        var spriteWrap = document.createElement('div');
        spriteWrap.className = 'pokemon-sprite-wrap';
        var img = makeSpriteImg(s.name, null);
        if (img) {
          spriteWrap.appendChild(img);
        } else {
          spriteWrap.innerHTML = '<span style="font-size:48px">' + emoji + '</span>';
        }
        card.appendChild(spriteWrap);

        var nameEl = document.createElement('div');
        nameEl.className = 'pokemon-name';
        nameEl.textContent = s.name;
        card.appendChild(nameEl);

        var typeEl = document.createElement('div');
        typeEl.className = 'pokemon-type';
        typeEl.textContent = s.types;
        card.appendChild(typeEl);

        var identityEl = document.createElement('div');
        identityEl.className = 'pokemon-identity';
        identityEl.style.cssText = 'font-size:11px;color:var(--text-muted);margin-top:4px';
        identityEl.textContent = s.identity;
        card.appendChild(identityEl);

        grid.appendChild(card);
      });
      starterCard.appendChild(grid);
      container.appendChild(starterCard);
    }

    // Roadmap
    if (strategyData.roadmap) {
      var roadmapCard = document.createElement('div');
      roadmapCard.className = 'info-card';
      var html = '<h3>\uD83D\uDCCB Implementation Roadmap</h3><ul>';

      if (strategyData.roadmap.completed) {
        strategyData.roadmap.completed.forEach(function (entry) {
          var color = entry.status === 'completed' ? 'var(--green-bright)' :
                      entry.status === 'failed' ? 'var(--red, #ff4444)' :
                      'var(--yellow-bright)';
          var icon = entry.status === 'completed' ? '\u2713' :
                     entry.status === 'failed' ? '\u2717' : '\u26A0';
          html += '<li><strong style="color:' + color + '">' + icon + ' Cycle ' + entry.cycle + '</strong> \u2014 ' + escapeHtml(entry.description) + '</li>';
        });
      }

      if (strategyData.roadmap.upcoming) {
        strategyData.roadmap.upcoming.forEach(function (entry) {
          html += '<li><strong style="color:var(--text-muted)">\u25CB Cycle ' + entry.cycle + '</strong> \u2014 ' + escapeHtml(entry.objective) + '</li>';
        });
      }

      html += '</ul>';
      roadmapCard.innerHTML = html;
      container.appendChild(roadmapCard);
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
    const typeEmojis = { 'Rock': '\uD83E\uDEA8', 'Dragon': '\uD83D\uDC09', 'Steel': '\u2699\uFE0F', 'Fire': '\uD83D\uDD25', 'Water': '\uD83D\uDCA7', 'Grass': '\uD83C\uDF3F', 'Normal': '\u2B50', 'Psychic': '\uD83D\uDD2E', 'Ground': '\uD83C\uDFDC\uFE0F', 'Ice': '\u2744\uFE0F', 'Electric': '\u26A1' };
    const titleEl = document.createElement('h3');
    titleEl.textContent = '\u2694\uFE0F Starter Pok\u00E9mon';
    section.appendChild(titleEl);

    const grid = document.createElement('div');
    grid.className = 'starter-grid';

    guideData.starters.forEach(s => {
      const types = s.types || [];
      const typeStr = types.join(' / ');
      const emoji = typeEmojis[types[0]] || '\uD83D\uDC7E';
      const card = document.createElement('div');
      card.className = 'starter-card';

      const spriteWrap = document.createElement('div');
      spriteWrap.className = 'pokemon-sprite-wrap';
      const img = makeSpriteImg(s.species, null);
      if (img) {
        spriteWrap.appendChild(img);
      } else {
        spriteWrap.innerHTML = '<span style="font-size:48px">' + emoji + '</span>';
      }
      card.appendChild(spriteWrap);

      const nameEl = document.createElement('div');
      nameEl.className = 'pokemon-name';
      nameEl.textContent = s.species;
      card.appendChild(nameEl);

      const typeEl = document.createElement('div');
      typeEl.className = 'pokemon-type';
      typeEl.textContent = typeStr;
      card.appendChild(typeEl);

      grid.appendChild(card);
    });

    section.appendChild(grid);
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

    const headerDiv = document.createElement('div');
    headerDiv.className = 'guide-card-header';
    headerDiv.setAttribute('onclick', 'toggleGuideCard(this)');
    headerDiv.innerHTML =
      '<span class="guide-card-title">' + escapeHtml(opts.title) + '</span>' +
      '<span class="type-badge ' + typeCls + '">' + escapeHtml(opts.typeBadge) + '</span>' +
      '<span class="card-expand">\u25BC</span>';
    card.appendChild(headerDiv);

    if (opts.subtitle) {
      const sub = document.createElement('div');
      sub.className = 'guide-card-subtitle';
      sub.textContent = opts.subtitle;
      card.appendChild(sub);
    }

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'guide-card-body';

    const table = document.createElement('table');
    table.className = 'party-table';
    table.innerHTML = '<thead><tr><th>Pok\u00E9mon</th><th>Lv</th><th>Held Item</th><th>Moves</th></tr></thead>';
    const tbody = document.createElement('tbody');

    opts.party.forEach(mon => {
      const tr = document.createElement('tr');

      // Pokémon name cell with sprite
      const nameTd = document.createElement('td');
      nameTd.className = 'mon-name';
      const img = makeSpriteImg(mon.species, 'pokemon-thumb');
      if (img) nameTd.appendChild(img);
      nameTd.appendChild(document.createTextNode(mon.species));

      const lvTd = document.createElement('td');
      lvTd.className = 'mon-level';
      lvTd.textContent = mon.level;

      const itemTd = document.createElement('td');
      itemTd.textContent = mon.heldItem || '\u2014';

      const movesTd = document.createElement('td');
      movesTd.className = 'mon-moves';
      if (mon.moves && mon.moves.length) {
        movesTd.textContent = mon.moves.join(', ');
      } else {
        movesTd.innerHTML = '<span class="text-muted">Default</span>';
      }

      tr.appendChild(nameTd);
      tr.appendChild(lvTd);
      tr.appendChild(itemTd);
      tr.appendChild(movesTd);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    bodyDiv.appendChild(table);
    card.appendChild(bodyDiv);
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

    const headerDiv = document.createElement('div');
    headerDiv.className = 'guide-card-header';
    headerDiv.setAttribute('onclick', 'toggleGuideCard(this)');
    headerDiv.innerHTML =
      '<span class="guide-card-title">' + escapeHtml(name) + '</span>' +
      '<span class="encounter-count">' + allSpecies.size + ' species</span>' +
      '<span class="card-expand">\u25BC</span>';
    card.appendChild(headerDiv);

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'guide-card-body';

    if (route.land) bodyDiv.appendChild(renderEncounterTable('\uD83C\uDF3F Grass / Cave', route.land));
    if (route.water) bodyDiv.appendChild(renderEncounterTable('\uD83C\uDF0A Surfing', route.water));
    if (route.rockSmash) bodyDiv.appendChild(renderEncounterTable('\uD83E\uDEA8 Rock Smash', route.rockSmash));
    if (route.fishing) {
      if (route.fishing.oldRod) bodyDiv.appendChild(renderEncounterTable('\uD83C\uDFA3 Old Rod', route.fishing.oldRod));
      if (route.fishing.goodRod) bodyDiv.appendChild(renderEncounterTable('\uD83C\uDFA3 Good Rod', route.fishing.goodRod));
      if (route.fishing.superRod) bodyDiv.appendChild(renderEncounterTable('\uD83C\uDFA3 Super Rod', route.fishing.superRod));
    }

    card.appendChild(bodyDiv);
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

    const group = document.createElement('div');
    group.className = 'encounter-group';

    const groupTitle = document.createElement('div');
    groupTitle.className = 'encounter-group-title';
    groupTitle.innerHTML = title;
    group.appendChild(groupTitle);

    const table = document.createElement('table');
    table.className = 'encounter-table';
    table.innerHTML = '<thead><tr><th>Pok\u00E9mon</th><th>Level</th><th>Rate</th><th>Rarity</th></tr></thead>';
    const tbody = document.createElement('tbody');

    deduped.forEach(m => {
      const tr = document.createElement('tr');

      const nameTd = document.createElement('td');
      nameTd.className = 'mon-name';
      const img = makeSpriteImg(m.species, 'pokemon-thumb-sm');
      if (img) nameTd.appendChild(img);
      nameTd.appendChild(document.createTextNode(m.species));

      const lvTd = document.createElement('td');
      lvTd.textContent = m.minLevel === m.maxLevel ? m.minLevel : m.minLevel + '\u2013' + m.maxLevel;

      const rateTd = document.createElement('td');
      rateTd.textContent = m.totalRate + '%';

      const rarityTd = document.createElement('td');
      rarityTd.innerHTML = '<span class="rarity-badge rarity-' + rarityClass(m.totalRate) + '">' + rarityLabel(m.totalRate) + '</span>';

      tr.appendChild(nameTd);
      tr.appendChild(lvTd);
      tr.appendChild(rateTd);
      tr.appendChild(rarityTd);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    group.appendChild(table);
    return group; // returns a DOM element
  }

  // ---- Roadmap / Kanban ----

  function renderRoadmap() {
    const container = document.querySelector('.roadmap-view');
    if (!strategyData || !strategyData.roadmap) {
      container.innerHTML = '<div class="roadmap-loading"><p>\u26A0 No roadmap data available.</p></div>';
      return;
    }
    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'roadmap-header';
    header.innerHTML =
      '<h2>\uD83D\uDDFA\uFE0F Implementation Roadmap</h2>' +
      '<p>Development progress across all cycles \u2014 from completed work to planned objectives.</p>';
    container.appendChild(header);

    const board = document.createElement('div');
    board.className = 'kanban-board';

    const { completed = [], upcoming = [] } = strategyData.roadmap;

    // De-duplicate upcoming by (cycle + objective) and split by priority
    const seenUpcoming = new Set();
    const highPriority = [];
    const lowPriority = [];
    upcoming.forEach(entry => {
      const key = entry.cycle + '|' + entry.objective;
      if (seenUpcoming.has(key)) return;
      seenUpcoming.add(key);
      if (entry.priority === 'HIGH') {
        highPriority.push(entry);
      } else {
        lowPriority.push(entry);
      }
    });

    // Sort high priority by cycle
    highPriority.sort((a, b) => a.cycle - b.cycle);
    lowPriority.sort((a, b) => a.cycle - b.cycle);

    const doneItems = completed.filter(c => c.status === 'completed').reverse(); // newest first
    const issueItems = completed.filter(c => c.status !== 'completed').reverse();

    board.appendChild(buildKanbanColumn('col-done', '\u2705 Completed', doneItems, 'completed'));
    board.appendChild(buildKanbanColumn('col-issues', '\u26A0\uFE0F Issues', issueItems, 'issues'));
    board.appendChild(buildKanbanColumn('col-high', '\uD83D\uDD25 Up Next', highPriority, 'upcoming'));
    board.appendChild(buildKanbanColumn('col-planned', '\uD83D\uDCCB Planned', lowPriority, 'upcoming'));

    container.appendChild(board);
  }

  function buildKanbanColumn(colClass, title, items, type) {
    const col = document.createElement('div');
    col.className = 'kanban-column ' + colClass;

    const header = document.createElement('div');
    header.className = 'kanban-column-header';
    header.innerHTML =
      '<span class="kanban-column-title">' + escapeHtml(title) + '</span>' +
      '<span class="kanban-column-count">' + items.length + '</span>';
    col.appendChild(header);

    const cards = document.createElement('div');
    cards.className = 'kanban-cards';

    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = 'padding:16px 12px;font-family:var(--font-mono);font-size:11px;color:var(--text-muted);text-align:center';
      empty.textContent = 'No items';
      cards.appendChild(empty);
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'kanban-card';

      const meta = document.createElement('div');
      meta.className = 'kanban-card-meta';

      const cycleBadge = document.createElement('span');
      cycleBadge.className = 'kanban-cycle-badge';
      cycleBadge.textContent = 'CYCLE ' + String(item.cycle).padStart(2, '0');
      meta.appendChild(cycleBadge);

      if (type === 'completed' || type === 'issues') {
        const statusBadge = document.createElement('span');
        statusBadge.className = 'kanban-status-badge kanban-status-' + (item.status || 'completed');
        const labels = { completed: '\u2713 Done', failed: '\u2717 Failed', partial: '\u26A0 Partial' };
        statusBadge.textContent = labels[item.status] || item.status;
        meta.appendChild(statusBadge);
      } else {
        const priorityBadge = document.createElement('span');
        priorityBadge.className = 'kanban-status-badge kanban-status-' + (item.priority === 'HIGH' ? 'high' : 'low');
        priorityBadge.textContent = item.priority || 'LOW';
        meta.appendChild(priorityBadge);
      }

      card.appendChild(meta);

      const desc = document.createElement('div');
      desc.className = 'kanban-card-desc';
      // Strip markdown bold markers for cleaner display
      const text = (item.description || item.objective || '').replace(/\*\*/g, '');
      desc.textContent = text;
      card.appendChild(desc);

      if (type === 'upcoming' && item.complexity) {
        const complexity = document.createElement('span');
        complexity.className = 'kanban-complexity';
        complexity.textContent = item.complexity;
        card.appendChild(complexity);
      }

      cards.appendChild(card);
    });

    col.appendChild(cards);
    return col;
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
