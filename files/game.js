/* Sky Hopper: an original 2D side-scrolling platformer.
 * Vanilla JavaScript, Canvas 2D, Web Audio. No external assets or dependencies. */
(function () {
  'use strict';

  var TILE = 32, VW = 960, VH = 540;
  var GRAVITY = 1700, MAX_FALL = 900;
  var WALK = 220, RUN = 360, ACC_WALK = 1800, ACC_RUN = 2600, FRICTION = 2200;
  var JUMP_V = 640, JUMP_CUT = 0.45, STOMP_V = 420;
  var LEVEL_TIME = 300;
  var PW = 24;

  const LEVELS = [
 {
  "name": "Grassland Adventure",
  "theme": 0,
  "sky": [
   "#6ec6ff",
   "#d6f3ff"
  ],
  "ground": "#6b4a2a",
  "top": "#3fae3f",
  "boss": false,
  "map": [
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "...................................................................ss....ss.........................",
   "....................................................................................................",
   "........................................................K.............QQ............................",
   "..........................K...........................................QQ............................",
   "........................................cccc......................##########........................",
   "........B?B?B........ccc............................................................................",
   "....................####................####........................................................",
   "..............PP....................WW......................ccccc...................................",
   "..S...........PP.E................E...........E.C...........E.........................E.C.......F...",
   "##############################..####################..##########################..##################",
   "##############################..####################..##########################..##################"
  ]
 },
 {
  "name": "Underground Caverns",
  "theme": 1,
  "sky": [
   "#1b1433",
   "#2d1f4f"
  ],
  "ground": "#4a4a5c",
  "top": "#7a7a94",
  "boss": false,
  "map": [
   "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
   "W..................................................................................................W",
   "W..................................................................................................W",
   "W.............................WWWWWW..................................ssssss.......................W",
   "W.......................................................................QQ.........................W",
   "W.......................................................................QQ.........................W",
   "W.....................................................................########.....................W",
   "W.....................K..................ccc.......................................................W",
   "W.................................................................K................................W",
   "W.......................................###........................................................W",
   "W..................................................................................................W",
   "W.......................................................BBB?BBB....................................W",
   "W.............###...................###...............................................####.........W",
   "W.........................ccccc.............................PP.....................................W",
   "W..S......E...................E...................C.........PP..E...........C.......E...........F..W",
   "W#####################..##########################...#########################..###################W",
   "W#####################..##########################...#########################..###################W"
  ]
 },
 {
  "name": "Sky Platforms",
  "theme": 2,
  "sky": [
   "#8ad3ff",
   "#fff3d6"
  ],
  "ground": "#8a6fd1",
  "top": "#c9b6ff",
  "boss": false,
  "map": [
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "..............................K.................................K...................................",
   "................................................cc..................................................",
   ".................................................E..................................................",
   "........................cc................cc....###...cc......................cc....................",
   "..............................cc............C.......................................................",
   "..................cc....###...............###.........###...cc..........cc....####..cc..............",
   "...................E..........===...cc..............................................................",
   "............cc....###.......................................###...cc....###.........###.............",
   "....................................###.............................................................",
   "............###...................................................###...............................",
   "..S.........................................................................................CE..F...",
   "##########..............................................................................############",
   "##########..............................................................................############"
  ]
 },
 {
  "name": "Lava Fortress",
  "theme": 3,
  "sky": [
   "#3a1212",
   "#7a2b12"
  ],
  "ground": "#4b2a2a",
  "top": "#a34b2a",
  "boss": false,
  "map": [
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   "....................................................................................................",
   ".................................K........................K.....................K...................",
   "....................................................................................................",
   "....................ccc.......................ccc.....................ccc...........................",
   "........BB?BB.......................................................................................",
   "..................########....WW............########........WW......##########......WW..............",
   "..............................WW............................WW......................WW..............",
   "..S...........E.............E.WW.......E..........C.....E...WW....E...............C.WW......E...F...",
   "####################LLLL######################LLLL####################LLLLLL########################",
   "####################LLLL######################LLLL####################LLLLLL########################"
  ]
 },
 {
  "name": "Final Castle",
  "theme": 4,
  "sky": [
   "#1a0f2e",
   "#4a2a6b"
  ],
  "ground": "#303040",
  "top": "#6b6b80",
  "boss": true,
  "map": [
   "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
   "W..................................................................................................W",
   "W..................................................................................................W",
   "W..................................................................................................W",
   "W..................................................................................................W",
   "W..................................................................................................W",
   "W...................K.........................K....................................................W",
   "W..................................................................................................W",
   "W...........................................................................K......................W",
   "W...................................................................####...........................W",
   "W...ccc.........................................................ccc................................W",
   "W.............................................................................####......####.......W",
   "W...............WW..........WW........######...........WW.....####....................X............W",
   "W...............WW..........WW.........................WW..........................................W",
   "W.S.......E.....WW....E.....WW....E...............E....WW.E.......C................................W",
   "W#######################################LL#########################################################W",
   "W#######################################LL#########################################################W"
  ]
 }
];

  // ---------- DOM helpers ----------
  function $(id) { return document.getElementById(id); }
  var canvas = $('game');
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  var hudEl = $('hud'), touchEl = $('touch'), errorBox = $('error-box');
  var SCREENS = {
    title: 'screen-title', levels: 'screen-levels', help: 'screen-help', settings: 'screen-settings',
    pause: 'screen-pause', gameover: 'screen-gameover', complete: 'screen-complete', victory: 'screen-victory'
  };

  function showError(msg) {
    if (errorBox) {
      errorBox.textContent = 'Something went wrong (' + msg + '). Reload the page to keep playing.';
      errorBox.hidden = false;
    }
  }
  window.addEventListener('error', function (e) { showError(e.message || 'unknown error'); });

  // ---------- Storage ----------
  function loadJSON(key, fb) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch (e) { return fb; }
  }
  function saveJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  var settings = Object.assign({ volume: 0.7, music: true, sfx: true }, loadJSON('skyhopper.settings', {}));
  var progress = Object.assign({ unlocked: 1, best: {}, highScore: 0 }, loadJSON('skyhopper.progress', {}));
  function saveSettings() { saveJSON('skyhopper.settings', settings); }

  // ---------- Audio (synthesized at runtime, original) ----------
  var AC = null, master = null, sfxBus = null, musicBus = null, musicTimer = null, musicStep = 0;

  function ensureAudio() {
    try {
      if (!AC) {
        var Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return;
        AC = new Ctor();
        master = AC.createGain(); sfxBus = AC.createGain(); musicBus = AC.createGain();
        sfxBus.connect(master); musicBus.connect(master); master.connect(AC.destination);
        applyVolume();
      }
      if (AC.state === 'suspended') AC.resume();
    } catch (e) { AC = null; }
  }
  function applyVolume() {
    if (!master) return;
    master.gain.value = settings.volume;
    sfxBus.gain.value = settings.sfx ? 1 : 0;
    musicBus.gain.value = settings.music ? 0.3 : 0;
  }
  function tone(freq, dur, type, vol, bus, bend) {
    if (!AC || !freq) return;
    try {
      var t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, t);
      if (bend) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * bend), t + dur);
      g.gain.setValueAtTime(vol || 0.15, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(bus || sfxBus);
      o.start(t); o.stop(t + dur + 0.05);
    } catch (e) { /* audio failures must never break gameplay */ }
  }
  function later(ms, fn) { setTimeout(fn, ms); }
  var SFX = {
    jump: function () { tone(420, 0.16, 'square', 0.10, null, 2.2); },
    coin: function () { tone(988, 0.07, 'square', 0.12); later(60, function () { tone(1319, 0.14, 'square', 0.12); }); },
    stomp: function () { tone(260, 0.12, 'triangle', 0.25, null, 0.4); },
    power: function () { [523, 659, 784, 1046].forEach(function (f, i) { later(i * 70, function () { tone(f, 0.12, 'square', 0.12); }); }); },
    hurt: function () { tone(330, 0.35, 'sawtooth', 0.18, null, 0.3); },
    brick: function () { tone(180, 0.15, 'square', 0.2, null, 0.5); },
    shield: function () { tone(880, 0.25, 'sine', 0.15, null, 1.5); },
    fire: function () { tone(600, 0.12, 'sawtooth', 0.08, null, 0.5); },
    click: function () { tone(700, 0.05, 'square', 0.08); },
    lose: function () { [392, 330, 262, 196].forEach(function (f, i) { later(i * 180, function () { tone(f, 0.3, 'triangle', 0.18); }); }); },
    win: function () { [523, 659, 784, 659, 784, 1046].forEach(function (f, i) { later(i * 110, function () { tone(f, 0.18, 'square', 0.12); }); }); }
  };
  var THEMES = [
    { bpm: 132, bass: [0, 0, 3, 3, 5, 5, 3, 3], lead: [12, 14, 15, 14, 12, 10, 12, -1], wave: 'triangle' },
    { bpm: 110, bass: [0, 0, -4, -4, -2, -2, -4, -4], lead: [7, -1, 9, -1, 10, 7, -1, 5], wave: 'sine' },
    { bpm: 150, bass: [0, 7, 0, 7, 3, 10, 3, 10], lead: [19, 17, 15, 17, 19, 22, 19, -1], wave: 'square' },
    { bpm: 124, bass: [-5, -5, -5, -2, -7, -7, -3, -3], lead: [5, 7, 8, 5, 10, 8, 7, -1], wave: 'sawtooth' },
    { bpm: 140, bass: [0, 0, 5, 5, 7, 7, 8, 8], lead: [12, 15, 19, 15, 24, 19, 15, 12], wave: 'square' }
  ];
  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function startMusic(theme) {
    stopMusic();
    if (!AC || !settings.music) return;
    var th = THEMES[theme % THEMES.length];
    var stepMs = 60000 / th.bpm / 2;
    musicStep = 0;
    musicTimer = setInterval(function () {
      var i = musicStep % 8;
      musicStep++;
      tone(midi(45 + th.bass[i]), 0.22, 'triangle', 0.5, musicBus);
      var l = th.lead[i];
      if (l >= 0) tone(midi(57 + l), 0.16, th.wave, 0.2, musicBus);
    }, stepMs);
  }
  function stopMusic() { if (musicTimer) { clearInterval(musicTimer); musicTimer = null; } }

  // ---------- Game state ----------
  var G = {
    level: 0, lives: 3, score: 0, coins: 0, timeLeft: LEVEL_TIME,
    tiles: [], enemies: [], items: [], parts: [], movers: [], warps: [],
    flag: null, checkpoint: null, saved: null, spawn: null, boss: null,
    p: null, camX: 0, worldW: VW, worldH: VH, shake: 0,
    phase: 'play', phaseT: 0, bossStarted: false, bossArena: 0
  };

  function mkPlayer(x, y) {
    return {
      x: x, y: y, w: PW, h: 36, vx: 0, vy: 0, ground: false, hitX: false, hitCeil: false, ceilTile: null,
      coyote: 0, jbuf: 0, jumpHeld: false, jumping: false, warpCool: 0,
      face: 1, big: false, boost: 0, shield: 0, inv: 0, dead: false, crouch: false,
      anim: 0, state: 'idle'
    };
  }

  // ---------- Level construction ----------
  function buildLevel(i) {
    var L = LEVELS[i], rows = L.map, cols = rows[0].length, nrows = rows.length;
    G.level = i;
    G.tiles = []; G.enemies = []; G.items = []; G.parts = []; G.movers = [];
    G.flag = null; G.checkpoint = null; G.saved = null; G.warps = []; G.boss = null;
    G.camX = 0; G.worldW = cols * TILE; G.worldH = nrows * TILE;
    G.phase = 'play'; G.phaseT = 0; G.timeLeft = LEVEL_TIME; G.coins = 0; G.shake = 0;
    G.bossStarted = false; G.bossArena = L.boss ? (cols - 30) * TILE : 0;

    var spawn = null, entries = [], exits = [];
    for (var r = 0; r < nrows; r++) {
      for (var c = 0; c < cols; c++) {
        var ch = rows[r][c], x = c * TILE, y = r * TILE;
        var leftSame = c > 0 && rows[r][c - 1] === ch;
        var upSame = r > 0 && rows[r - 1][c] === ch;
        switch (ch) {
          case '#': G.tiles.push({ type: 'ground', x: x, y: y, bump: 0 }); break;
          case 'W': G.tiles.push({ type: 'wall', x: x, y: y, bump: 0 }); break;
          case 'B': G.tiles.push({ type: 'brick', x: x, y: y, bump: 0 }); break;
          case '?': G.tiles.push({ type: 'q', x: x, y: y, used: false, bump: 0 }); break;
          case 'P':
          case 'Q':
            G.tiles.push({ type: 'pipe', x: x, y: y, entry: ch === 'P', cap: !upSame, bump: 0 });
            if (!leftSame && !upSame) (ch === 'P' ? entries : exits).push({ x: x, y: y });
            break;
          case 'L': G.tiles.push({ type: 'lava', x: x, y: y }); break;
          case '=':
            if (!leftSame) {
              var n = 0;
              while (c + n < cols && rows[r][c + n] === '=') n++;
              G.movers.push({ x: x, y: y, w: n * TILE, h: 10, baseX: x, t: Math.random() * 6, amp: TILE * 3, speed: 0.9, prev: x, dx: 0 });
            }
            break;
          case 'E': G.enemies.push(mkEnemy('walker', x, y)); break;
          case 'K': G.enemies.push(mkEnemy('flier', x, y)); break;
          case 'X': G.boss = mkBoss(x, y); G.enemies.push(G.boss); break;
          case 'c': G.items.push(mkCoin(x, y, false)); break;
          case 's': G.items.push(mkCoin(x, y, true)); break;
          case 'C': G.checkpoint = { x: x + 12, y: y - 32, w: 8, h: 64, hit: false }; break;
          case 'F': G.flag = { x: x + 12, y: y - TILE * 4, w: 8, h: TILE * 5, t: 0 }; break;
          case 'S': spawn = { x: x, y: y + TILE - 36 }; break;
        }
      }
    }
    for (var k = 0; k < Math.min(entries.length, exits.length); k++) {
      G.warps.push({ entry: entries[k], exit: exits[k] });
    }
    G.spawn = spawn || { x: TILE * 2, y: (nrows - 2) * TILE - 36 };
    G.p = mkPlayer(G.spawn.x, G.spawn.y);
  }

  function mkCoin(x, y, secret) {
    return { kind: 'coin', x: x + 10, y: y + 10, w: 12, h: 12, secret: secret, taken: false, t: Math.random() * 6 };
  }
  function mkEnemy(kind, x, y) {
    if (kind === 'flier') return { kind: 'flier', x: x, y: y - 32, w: 28, h: 22, sx: x, sy: y - 32, vx: 0, vy: 0, dead: false, t: Math.random() * 6 };
    return { kind: 'walker', x: x, y: y, w: 28, h: 28, vx: -50, vy: 0, dead: false, t: Math.random() * 6, ground: false };
  }
  function mkBoss(x, y) {
    return { kind: 'boss', x: x, y: y, w: 96, h: 96, vx: 0, vy: 0, dead: false, hp: 6, flash: 0, cd: 2, t: 0, ground: false };
  }

  // ---------- Collision ----------
  function overlap(a, b) {
    var bw = b.w || TILE, bh = b.h || TILE;
    return a.x < b.x + bw && a.x + a.w > b.x && a.y < b.y + bh && a.y + a.h > b.y;
  }
  function solidAt(x, y) {
    for (var i = 0; i < G.tiles.length; i++) {
      var t = G.tiles[i];
      if (t.type !== 'lava' && x >= t.x && x < t.x + TILE && y >= t.y && y < t.y + TILE) return true;
    }
    return false;
  }

  // Moves an entity and resolves collisions with solid tiles and moving platforms.
  function collide(e, dt) {
    var i, t, m;
    e.hitX = false; e.hitCeil = false; e.ground = false; e.ceilTile = null;

    e.x += e.vx * dt;
    for (i = 0; i < G.tiles.length; i++) {
      t = G.tiles[i];
      if (t.type === 'lava') continue;
      if (overlap(e, t)) {
        if (e.vx > 0) e.x = t.x - e.w;
        else if (e.vx < 0) e.x = t.x + TILE;
        e.hitX = true;
      }
    }

    var oldBottom = e.y + e.h;
    e.y += e.vy * dt;
    for (i = 0; i < G.tiles.length; i++) {
      t = G.tiles[i];
      if (t.type === 'lava') continue;
      if (overlap(e, t)) {
        if (e.vy > 0) { e.y = t.y - e.h; e.vy = 0; e.ground = true; }
        else if (e.vy < 0) { e.y = t.y + TILE; e.vy = 0; e.hitCeil = true; e.ceilTile = t; }
      }
    }
    for (i = 0; i < G.movers.length; i++) {
      m = G.movers[i];
      if (e.vy >= 0 && oldBottom <= m.y + 6 && e.y + e.h >= m.y && e.x + e.w > m.x + 2 && e.x < m.x + m.w - 2) {
        e.y = m.y - e.h; e.vy = 0; e.ground = true; e.x += m.dx;
      }
    }
  }

  function updateMovers(dt) {
    for (var i = 0; i < G.movers.length; i++) {
      var m = G.movers[i];
      m.prev = m.x;
      m.t += dt * m.speed;
      m.x = m.baseX + Math.sin(m.t) * m.amp;
      m.dx = m.x - m.prev;
    }
  }

  // ---------- Input ----------
  var keys = {}, touchKeys = {};
  function down(a) {
    switch (a) {
      case 'left': return !!(keys.ArrowLeft || keys.a || keys.A || touchKeys.left);
      case 'right': return !!(keys.ArrowRight || keys.d || keys.D || touchKeys.right);
      case 'jump': return !!(keys[' '] || keys.w || keys.W || keys.ArrowUp || touchKeys.jump);
      case 'run': return !!(keys.Shift || touchKeys.run);
      case 'down': return !!(keys.ArrowDown || keys.s || keys.S || touchKeys.down);
    }
    return false;
  }
  window.addEventListener('keydown', function (e) {
    var k = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(k) >= 0) e.preventDefault();
    keys[k] = true;
    ensureAudio();
    if (e.repeat) return;
    if (k === 'p' || k === 'P' || k === 'Escape') {
      if (scene === 'play') pauseGame(); else if (scene === 'pause') resumeGame();
    } else if ((k === 'r' || k === 'R') && (scene === 'play' || scene === 'pause')) {
      restartLevel();
    } else if ((k === 'f' || k === 'F') && (scene === 'play' || scene === 'pause')) {
      toggleFullscreen();
    }
  });
  window.addEventListener('keyup', function (e) { keys[e.key] = false; });
  window.addEventListener('blur', function () { keys = {}; touchKeys = {}; });

  function bindTouch(id, action) {
    var el = $(id);
    if (!el) return;
    function on(ev) { if (ev.cancelable) ev.preventDefault(); ensureAudio(); touchKeys[action] = true; el.classList.add('pressed'); }
    function off(ev) { if (ev && ev.cancelable) ev.preventDefault(); touchKeys[action] = false; el.classList.remove('pressed'); }
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointercancel', off);
    el.addEventListener('pointerleave', off);
  }

  function toggleFullscreen() {
    try {
      var d = document;
      if (!d.fullscreenElement && !d.webkitFullscreenElement) {
        var el = d.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
        if (req) { var pr = req.call(el); if (pr && pr.catch) pr.catch(function () {}); }
      } else {
        var ex = d.exitFullscreen || d.webkitExitFullscreen;
        if (ex) { var pe = ex.call(d); if (pe && pe.catch) pe.catch(function () {}); }
      }
    } catch (e) { /* fullscreen is optional */ }
  }

  function isTouch() { return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); }

  // ---------- Scenes ----------
  var scene = 'title';
  function showScene(name) {
    scene = name;
    for (var k in SCREENS) {
      var el = $(SCREENS[k]);
      if (el) el.hidden = (k !== name);
    }
    var inGame = (name === 'play' || name === 'pause');
    hudEl.hidden = !inGame;
    touchEl.hidden = !(inGame && isTouch());
  }

  function startNewGame() {
    G.lives = 3; G.score = 0;
    startLevel(0);
  }
  function startLevel(i) {
    ensureAudio();
    buildLevel(i);
    showScene('play');
    startMusic(LEVELS[i].theme);
    updateHud();
  }
  function restartLevel() {
    SFX.click();
    startLevel(G.level);
  }
  function pauseGame() {
    if (scene !== 'play') return;
    stopMusic();
    showScene('pause');
  }
  function resumeGame() {
    if (scene !== 'pause') return;
    showScene('play');
    startMusic(LEVELS[G.level].theme);
  }

  function respawn() {
    var s = G.saved || G.spawn;
    G.p = mkPlayer(s.x, s.y);
    G.p.inv = 2;
    G.phase = 'play';
    G.camX = Math.max(0, Math.min(G.worldW - VW, s.x - VW * 0.4));
    startMusic(LEVELS[G.level].theme);
  }

  function kill() {
    var p = G.p;
    if (!p || p.dead || G.phase !== 'play') return;
    p.dead = true; p.vy = -520; p.vx = 0;
    G.phase = 'dying'; G.phaseT = 2.2;
    stopMusic(); SFX.lose();
  }

  function hurt() {
    var p = G.p;
    if (!p || p.dead || p.inv > 0) return;
    if (p.shield > 0) {
      p.shield = 0; p.inv = 1.2;
      SFX.shield(); burst(p.x + 12, p.y + 18, '#88eeff', 14);
      return;
    }
    SFX.hurt(); G.shake = 0.3;
    if (p.big) { p.big = false; p.h = 36; p.y += 12; p.inv = 1.5; return; }
    kill();
  }

  function gameOver() {
    G.phase = 'over';
    stopMusic();
    recordScore();
    showScene('gameover');
    $('gameover-score').textContent = String(G.score);
  }

  function levelComplete() {
    if (G.phase === 'complete') return;
    G.phase = 'complete';
    var bonus = Math.max(0, Math.round(G.timeLeft)) * 10;
    G.score += bonus;
    stopMusic(); SFX.win();
    var best = progress.best[G.level] || 0;
    if (G.score > best) progress.best[G.level] = G.score;
    if (progress.unlocked < G.level + 2 && G.level + 1 < LEVELS.length) progress.unlocked = G.level + 2;
    recordScore();
    if (G.level + 1 >= LEVELS.length) {
      showScene('victory');
      $('victory-score').textContent = String(G.score);
      $('victory-best').textContent = String(progress.highScore || 0);
    } else {
      showScene('complete');
      $('complete-score').textContent = String(G.score);
      $('complete-bonus').textContent = 'Time bonus: +' + bonus;
      $('complete-next').textContent = LEVELS[G.level + 1].name;
    }
  }

  function recordScore() {
    if (G.score > (progress.highScore || 0)) progress.highScore = G.score;
    saveJSON('skyhopper.progress', progress);
  }

  function addScore(n) { G.score += n; }

  function coinGain(secret) {
    G.coins++;
    addScore(secret ? 500 : 100);
    if (G.coins >= 100) { G.coins -= 100; G.lives++; SFX.power(); }
    else SFX.coin();
  }

  function updateHud() {
    $('hud-score').textContent = String(G.score).padStart(6, '0');
    $('hud-coins').textContent = 'x' + String(G.coins).padStart(2, '0');
    $('hud-lives').textContent = 'x' + G.lives;
    $('hud-time').textContent = String(Math.max(0, Math.ceil(G.timeLeft)));
    $('hud-world').textContent = (G.level + 1) + '  ' + LEVELS[G.level].name;
  }

  // ---------- Blocks and item spawning ----------
  function bumpTile(t) {
    if (t.type === 'brick') {
      if (G.p.big) {
        G.tiles = G.tiles.filter(function (x) { return x !== t; });
        burst(t.x + 16, t.y + 16, '#c8703a', 14);
        SFX.brick(); addScore(50);
      } else { t.bump = 0.12; SFX.click(); }
    } else if (t.type === 'q') {
      t.bump = 0.12;
      if (!t.used) { t.used = true; spawnBlockItem(t); }
    } else {
      t.bump = 0.08;
    }
  }

  function spawnBlockItem(t) {
    var r = Math.random(), x = t.x + 6, y = t.y - TILE + 4;
    if (r < 0.5) {
      coinGain(false);
      burst(t.x + 16, t.y - 8, '#ffe066', 8);
    } else if (r < 0.7) {
      G.items.push({ kind: 'mushroom', x: x, y: y, w: 24, h: 24, vx: 70, vy: -200, taken: false, t: 0 });
      SFX.power();
    } else if (r < 0.82) {
      G.items.push({ kind: 'star', x: x, y: y, w: 20, h: 20, vx: 90, vy: -200, taken: false, t: 0 });
      SFX.power();
    } else {
      G.items.push({ kind: 'shield', x: x + 2, y: y, w: 20, h: 20, vx: 0, vy: -120, taken: false, t: 0 });
      SFX.power();
    }
    addScore(50);
  }

  function burst(x, y, color, n) {
    for (var i = 0; i < n; i++) {
      G.parts.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 320,
        vy: -Math.random() * 300 - 40,
        life: 0.6 + Math.random() * 0.4,
        color: color, s: 3 + Math.random() * 3
      });
    }
  }

  // ---------- Player ----------
  function findWarp(p) {
    for (var i = 0; i < G.warps.length; i++) {
      var e = G.warps[i].entry;
      if (Math.abs((p.y + p.h) - e.y) <= 2 && p.x + p.w > e.x + 4 && p.x < e.x + 2 * TILE - 4) return G.warps[i];
    }
    return null;
  }

  function updatePlayer(dt) {
    var p = G.p;
    p.anim += dt;

    if (p.dead) {
      p.vy = Math.min(MAX_FALL, p.vy + GRAVITY * dt);
      p.y += p.vy * dt;
      return;
    }

    if (G.phase === 'flag') {
      p.face = 1; p.vx = 0;
      if (!p.ground) { p.vy = 180; p.x = G.flag.x - 18; collide(p, dt); p.state = 'slide'; }
      else G.phase = 'walk';
      return;
    }
    if (G.phase === 'walk') {
      p.face = 1; p.vx = WALK; p.state = 'run';
      p.vy = Math.min(MAX_FALL, p.vy + GRAVITY * dt);
      collide(p, dt);
      if (p.x > G.worldW - 64) levelComplete();
      return;
    }
    if (G.phase === 'won') {
      p.vx = 0; p.state = 'idle';
      p.vy = Math.min(MAX_FALL, p.vy + GRAVITY * dt);
      collide(p, dt);
      return;
    }
    if (G.phase !== 'play') return;

    var left = down('left'), right = down('right'), jump = down('jump'), dn = down('down'), run = down('run');
    var boost = p.boost > 0 ? 1.3 : 1;
    var maxV = (run ? RUN : WALK) * boost;
    var acc = (run ? ACC_RUN : ACC_WALK) * boost;

    p.crouch = dn && p.ground;
    if (left && !right) { p.vx -= acc * dt; p.face = -1; }
    else if (right && !left) { p.vx += acc * dt; p.face = 1; }
    else {
      var f = FRICTION * dt;
      if (Math.abs(p.vx) <= f) p.vx = 0; else p.vx -= Math.sign(p.vx) * f;
    }
    if (p.crouch) p.vx *= 0.85;
    p.vx = Math.max(-maxV, Math.min(maxV, p.vx));

    // Jump: buffered press, coyote time, and variable height
    if (jump && !p.jumpHeld) p.jbuf = 0.12;
    p.jumpHeld = jump;
    p.jbuf = Math.max(0, p.jbuf - dt);
    p.coyote = p.ground ? 0.1 : Math.max(0, p.coyote - dt);
    if (p.jbuf > 0 && (p.ground || p.coyote > 0)) {
      p.vy = -JUMP_V; p.jbuf = 0; p.coyote = 0; p.jumping = true; p.ground = false;
      SFX.jump();
    }
    if (!jump && p.jumping && p.vy < 0) { p.vy *= JUMP_CUT; p.jumping = false; }
    if (p.ground) p.jumping = false;

    // Secret warp pipes: press Down while standing on an entry pipe
    if (p.warpCool > 0) p.warpCool -= dt;
    if (dn && p.ground && p.warpCool <= 0) {
      var w = findWarp(p);
      if (w) {
        p.x = w.exit.x + TILE - p.w / 2;
        p.y = w.exit.y - p.h;
        p.vx = 0; p.vy = 0; p.warpCool = 0.6;
        SFX.power();
        burst(p.x + p.w / 2, p.y + p.h / 2, '#99bbff', 16);
      }
    }

    p.vy = Math.min(MAX_FALL, p.vy + GRAVITY * dt);
    collide(p, dt);
    if (p.hitX) p.vx = 0;
    if (p.hitCeil && p.ceilTile) bumpTile(p.ceilTile);

    for (var i = 0; i < G.tiles.length; i++) {
      var t = G.tiles[i];
      if (t.type === 'lava' && overlap(p, t)) { hurt(); break; }
    }

    p.state = !p.ground ? (p.vy < 0 ? 'jump' : 'fall') : (Math.abs(p.vx) > 30 ? 'run' : 'idle');
    if (p.inv > 0) p.inv -= dt;
    if (p.boost > 0) p.boost -= dt;
    if (p.shield > 0) p.shield -= dt;

    if (p.y > G.worldH + 120) kill();

    if (G.checkpoint && !G.checkpoint.hit && overlap(p, G.checkpoint)) {
      G.checkpoint.hit = true;
      G.saved = { x: G.checkpoint.x - 12, y: G.checkpoint.y - 40 };
      SFX.power();
      burst(G.checkpoint.x, G.checkpoint.y, '#ffe066', 18);
    }

    if (G.flag && overlap(p, G.flag)) {
      G.phase = 'flag';
      p.x = G.flag.x - 18; p.vx = 0;
      addScore(500);
      SFX.power();
      burst(G.flag.x, G.flag.y + 20, '#ffe066', 20);
    }
  }

  // ---------- Enemies ----------
  function updateBoss(e, dt) {
    var p = G.p;
    e.cd -= dt;
    e.flash = Math.max(0, e.flash - dt);
    if (!G.bossStarted && p.x > e.x - 420) G.bossStarted = true;
    if (!G.bossStarted) return;
    var dirX = (p.x + p.w / 2) > (e.x + e.w / 2) ? 1 : -1;
    e.vx = dirX * (e.hp <= 3 ? 130 : 85);
    e.vy = Math.min(MAX_FALL, e.vy + GRAVITY * dt);
    collide(e, dt);
    if (e.cd <= 0) {
      e.cd = e.hp <= 3 ? 1.0 : 1.8;
      var fx = dirX > 0 ? e.x + e.w : e.x - 14;
      G.enemies.push({ kind: 'fire', x: fx, y: e.y + 36, w: 14, h: 14, vx: dirX * 280, vy: 0, life: 3, dead: false, t: 0 });
      SFX.fire();
    }
  }

  function updateEnemies(dt) {
    var p = G.p;
    for (var i = 0; i < G.enemies.length; i++) {
      var e = G.enemies[i];
      if (e.dead) continue;
      e.t += dt;

      if (e.kind === 'walker') {
        e.vy = Math.min(MAX_FALL, e.vy + GRAVITY * dt);
        collide(e, dt);
        if (e.hitX) e.vx = -e.vx;
        if (e.ground) {
          var ax = e.vx > 0 ? e.x + e.w + 4 : e.x - 4;
          if (!solidAt(ax, e.y + e.h + 4)) e.vx = -e.vx;   // turn at ledges
        }
      } else if (e.kind === 'flier') {
        e.x = e.sx + Math.sin(e.t * 1.4) * 96;
        e.y = e.sy + Math.sin(e.t * 2.6) * 14;
      } else if (e.kind === 'boss') {
        updateBoss(e, dt);
      } else if (e.kind === 'fire') {
        e.x += e.vx * dt; e.life -= dt;
        if (e.life <= 0 || solidAt(e.x + 7, e.y + 7)) { e.dead = true; continue; }
      }

      if (p.dead || p.inv > 0) continue;
      if (!overlap(p, e)) continue;

      if (e.kind === 'fire') { e.dead = true; hurt(); continue; }

      var stomp = p.vy > 0 && (p.y + p.h - e.y) < 18;
      if (stomp) {
        p.vy = -STOMP_V;
        SFX.stomp();
        if (e.kind === 'boss') {
          e.hp--; e.flash = 0.4;
          addScore(500);
          burst(e.x + 48, e.y, '#ffb36b', 14);
          if (e.hp <= 0) {
            e.dead = true;
            addScore(2000);
            G.phase = 'won'; G.phaseT = 2.5;
            stopMusic(); SFX.win();
            burst(e.x + 48, e.y + 48, '#ffd84a', 40);
          }
        } else {
          e.dead = true;
          addScore(200);
          burst(e.x + e.w / 2, e.y, '#ff8866', 10);
        }
      } else {
        hurt();
      }
    }
    G.enemies = G.enemies.filter(function (e) { return !e.dead; });
  }

  // ---------- Items ----------
  function updateItems(dt) {
    var p = G.p;
    for (var i = 0; i < G.items.length; i++) {
      var it = G.items[i];
      if (it.taken) continue;
      it.t += dt;

      if (it.kind === 'coin') {
        if (!p.dead && overlap(p, it)) {
          it.taken = true;
          coinGain(it.secret);
          burst(it.x, it.y, '#ffe066', 6);
        }
      } else if (it.kind === 'mushroom' || it.kind === 'star') {
        it.vy = Math.min(MAX_FALL, it.vy + GRAVITY * dt);
        collide(it, dt);
        if (it.hitX) it.vx = -it.vx;
        if (!p.dead && overlap(p, it)) {
          it.taken = true;
          SFX.power();
          if (it.kind === 'mushroom') {
            if (!p.big) { p.big = true; p.h = 48; p.y -= 12; }
            addScore(1000);
          } else {
            p.boost = 8;
            addScore(1000);
          }
          burst(it.x, it.y, '#ffffff', 12);
        }
      } else if (it.kind === 'shield') {
        it.vy = Math.min(MAX_FALL, it.vy + GRAVITY * dt);
        collide(it, dt);
        if (!p.dead && overlap(p, it)) {
          it.taken = true;
          p.shield = 10;
          addScore(500);
          SFX.shield();
          burst(it.x, it.y, '#88eeff', 12);
        }
      }
    }
    G.items = G.items.filter(function (x) { return !x.taken; });
  }

  function updateParticles(dt) {
    for (var i = 0; i < G.parts.length; i++) {
      var q = G.parts[i];
      q.life -= dt;
      q.vy += GRAVITY * 0.5 * dt;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
    }
    G.parts = G.parts.filter(function (q) { return q.life > 0; });
  }

  function updateTiles(dt) {
    for (var i = 0; i < G.tiles.length; i++) {
      if (G.tiles[i].bump > 0) G.tiles[i].bump -= dt;
    }
  }

  // ---------- Camera ----------
  function updateCamera(dt) {
    var p = G.p;
    var target = p.x + p.w / 2 - VW * 0.4;
    G.camX += (target - G.camX) * Math.min(1, dt * 6);
    if (G.bossStarted && G.bossArena) G.camX = G.bossArena;
    G.camX = Math.max(0, Math.min(G.worldW - VW, G.camX));
  }

  // ---------- Main update ----------
  function step(dt) {
    if (G.phase === 'play') {
      G.timeLeft -= dt;
      if (G.timeLeft <= 0) { G.timeLeft = 0; kill(); }
    } else if (G.phase === 'dying') {
      G.phaseT -= dt;
      if (G.phaseT <= 0) {
        G.lives--;
        if (G.lives <= 0) gameOver();
        else respawn();
      }
    } else if (G.phase === 'won') {
      G.phaseT -= dt;
      if (G.phaseT <= 0) levelComplete();
    }
    updateMovers(dt);
    updatePlayer(dt);
    if (G.phase === 'play') updateEnemies(dt);
    updateItems(dt);
    updateParticles(dt);
    updateTiles(dt);
    updateCamera(dt);
    if (G.shake > 0) G.shake = Math.max(0, G.shake - dt);
    updateHud();
  }

  // ---------- Rendering ----------
  function drawSky(L) {
    var g = ctx.createLinearGradient(0, 0, 0, VH);
    g.addColorStop(0, L.sky[0]);
    g.addColorStop(1, L.sky[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, VW, VH);
  }

  function drawParallax(L, cx) {
    var hill = ['#6fcf7a', '#241a3d', '#b59cff', '#4a1e14', '#2a1a40'][L.theme % 5];
    ctx.fillStyle = hill;
    var off = (cx * 0.25) % 320;
    for (var i = -1; i < 5; i++) {
      var x = i * 320 - off;
      ctx.beginPath();
      ctx.moveTo(x, VH - 90);
      ctx.quadraticCurveTo(x + 160, VH - 300, x + 320, VH - 90);
      ctx.fill();
    }
    if (L.theme === 0 || L.theme === 2) {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      var co = (cx * 0.5) % 400;
      for (var j = -1; j < 4; j++) {
        var cxp = j * 400 - co + 60, cy = 70 + (j & 1) * 40;
        ctx.beginPath();
        ctx.arc(cxp, cy, 20, 0, Math.PI * 2);
        ctx.arc(cxp + 24, cy - 8, 26, 0, Math.PI * 2);
        ctx.arc(cxp + 50, cy, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawTile(t, cx, L, ts) {
    var x = Math.round(t.x - cx), y = Math.round(t.y);
    if (x < -TILE || x > VW) return;
    var b = t.bump > 0 ? -3 : 0;
    if (t.type === 'lava') {
      var wob = Math.sin(ts / 180 + t.x * 0.05) * 2;
      ctx.fillStyle = '#ff7a1a'; ctx.fillRect(x, y + wob, TILE, TILE);
      ctx.fillStyle = '#ffd34a'; ctx.fillRect(x + 2, y + wob, TILE - 4, 4);
    } else if (t.type === 'ground') {
      ctx.fillStyle = L.ground; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = L.top; ctx.fillRect(x, y, TILE, 6);
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(x + 6, y + 16, 6, 3); ctx.fillRect(x + 20, y + 24, 5, 3);
    } else if (t.type === 'wall') {
      ctx.fillStyle = '#55546a'; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = '#3a3a4a'; ctx.fillRect(x, y + 15, TILE, 2); ctx.fillRect(x + 15, y, 2, 15);
      ctx.fillStyle = '#7d7c96'; ctx.fillRect(x + 2, y + 2, TILE - 4, 2);
    } else if (t.type === 'brick') {
      ctx.fillStyle = '#b8562a'; ctx.fillRect(x, y + b, TILE, TILE);
      ctx.fillStyle = '#7a3418';
      ctx.fillRect(x, y + b + 15, TILE, 2); ctx.fillRect(x + 15, y + b, 2, 15); ctx.fillRect(x + 7, y + b + 17, 2, 15);
      ctx.fillStyle = '#e88b55'; ctx.fillRect(x + 2, y + b + 2, TILE - 4, 2);
    } else if (t.type === 'q') {
      if (t.used) {
        ctx.fillStyle = '#7a6a54'; ctx.fillRect(x, y + b, TILE, TILE);
      } else {
        var pulse = (Math.sin(ts / 180) + 1) / 2;
        ctx.fillStyle = 'rgb(' + Math.round(230 + pulse * 20) + ',' + Math.round(170 + pulse * 30) + ',40)';
        ctx.fillRect(x, y + b, TILE, TILE);
        ctx.fillStyle = '#fff3a0'; ctx.fillRect(x + 2, y + b + 2, TILE - 4, 3);
        ctx.fillStyle = '#7a4a10'; ctx.font = 'bold 20px monospace'; ctx.textAlign = 'center';
        ctx.fillText('?', x + TILE / 2, y + b + 24);
        ctx.textAlign = 'left';
      }
    } else if (t.type === 'pipe') {
      ctx.fillStyle = t.entry ? '#2fa34a' : '#2a8fd0';
      ctx.fillRect(x + 3, y, TILE - 6, TILE);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + 6, y, 3, TILE);
      if (t.cap) { ctx.fillStyle = t.entry ? '#1b6b30' : '#1b5a88'; ctx.fillRect(x, y, TILE, 8); }
    }
  }

  function drawMover(m, cx) {
    var x = Math.round(m.x - cx), y = Math.round(m.y);
    if (x + m.w < 0 || x > VW) return;
    ctx.fillStyle = '#c9a25a'; ctx.fillRect(x, y, m.w, m.h);
    ctx.fillStyle = '#8a6a30'; ctx.fillRect(x, y + m.h - 3, m.w, 3);
  }

  function drawFlag(cx) {
    var f = G.flag;
    if (!f) return;
    var x = Math.round(f.x - cx), y = Math.round(f.y);
    ctx.fillStyle = '#dddddd'; ctx.fillRect(x, y, 4, f.h);
    ctx.fillStyle = '#ff4a4a';
    var wave = Math.sin(performance.now() / 200) * 2;
    ctx.beginPath(); ctx.moveTo(x + 4, y + 8); ctx.lineTo(x + 36, y + 22 + wave); ctx.lineTo(x + 4, y + 36); ctx.fill();
    ctx.fillStyle = '#ffd84a'; ctx.beginPath(); ctx.arc(x + 2, y, 5, 0, Math.PI * 2); ctx.fill();
  }

  function drawCheckpoint(cx) {
    var c = G.checkpoint;
    if (!c) return;
    var x = Math.round(c.x - cx), y = Math.round(c.y);
    ctx.fillStyle = c.hit ? '#4aff8a' : '#aaaaaa';
    ctx.fillRect(x, y, 4, c.h);
    ctx.fillRect(x + 4, y, 14, 10);
  }

  function drawItem(it, cx) {
    var x = Math.round(it.x - cx), y = Math.round(it.y);
    if (x + 30 < 0 || x > VW) return;
    if (it.kind === 'coin') {
      var spin = Math.abs(Math.sin(it.t * 6));
      ctx.fillStyle = it.secret ? '#ff8ae8' : '#ffd84a';
      ctx.beginPath(); ctx.ellipse(x + 6, y + 6, Math.max(1.5, 6 * spin), 6, 0, 0, Math.PI * 2); ctx.fill();
    } else if (it.kind === 'mushroom') {
      ctx.fillStyle = '#ff4a4a'; ctx.beginPath(); ctx.arc(x + 12, y + 10, 12, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 6, y + 6, 4, 4); ctx.fillRect(x + 14, y + 6, 4, 4);
      ctx.fillStyle = '#ffe2c2'; ctx.fillRect(x + 6, y + 12, 12, 10);
    } else if (it.kind === 'star') {
      var pulse = Math.sin(it.t * 10) * 2;
      ctx.fillStyle = '#ffd84a';
      ctx.beginPath();
      for (var i = 0; i < 5; i++) {
        var a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        var r = i === 0 ? 11 + pulse : 11;
        ctx.lineTo(x + 10 + Math.cos(a) * r, y + 10 + Math.sin(a) * r);
      }
      ctx.closePath(); ctx.fill();
    } else if (it.kind === 'shield') {
      ctx.fillStyle = '#88eeff'; ctx.beginPath(); ctx.arc(x + 10, y + 10, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(x + 8, y + 6, 4, 8);
    }
  }

  function drawEnemy(e, cx, ts) {
    var x = Math.round(e.x - cx), y = Math.round(e.y);
    if (x + e.w < -40 || x > VW + 40) return;
    if (e.kind === 'walker') {
      var wob = Math.sin(e.t * 12) * 2;
      ctx.fillStyle = '#7a3f1a'; ctx.beginPath(); ctx.ellipse(x + 14, y + 14, 13, 12, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffd0a0'; ctx.fillRect(x + 6, y + 8 + wob, 16, 8);
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x + 8, y + 10 + wob, 3, 3); ctx.fillRect(x + 17, y + 10 + wob, 3, 3);
      ctx.fillStyle = '#2a1208'; ctx.fillRect(x + 4, y + 24, 8, 4); ctx.fillRect(x + 16, y + 24, 8, 4);
    } else if (e.kind === 'flier') {
      var flap = Math.sin(e.t * 20) * 5;
      ctx.fillStyle = '#e8e8ff'; ctx.beginPath(); ctx.ellipse(x + 14, y + 11 + flap, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#6a6aff'; ctx.beginPath(); ctx.arc(x + 14, y + 12, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x + 16, y + 9, 3, 3);
    } else if (e.kind === 'boss') {
      var flashOn = e.flash > 0 && Math.floor(e.flash * 20) % 2 === 0;
      ctx.fillStyle = flashOn ? '#ffffff' : '#3d2a5a';
      ctx.fillRect(x, y, e.w, e.h);
      ctx.fillStyle = '#b84bff'; ctx.fillRect(x + 8, y + 8, e.w - 16, 18);
      ctx.fillStyle = '#ffdf4a'; ctx.fillRect(x + 20, y + 14, 12, 8); ctx.fillRect(x + 62, y + 14, 12, 8);
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x + 24, y + 16, 4, 4); ctx.fillRect(x + 66, y + 16, 4, 4);
      ctx.fillStyle = '#dddddd';
      for (var k = 0; k < 4; k++) {
        ctx.beginPath(); ctx.moveTo(x + 10 + k * 20, y); ctx.lineTo(x + 18 + k * 20, y - 12); ctx.lineTo(x + 26 + k * 20, y); ctx.fill();
      }
      ctx.fillStyle = '#330000'; ctx.fillRect(x, y - 18, e.w, 8);
      ctx.fillStyle = '#ff4a4a'; ctx.fillRect(x, y - 18, e.w * (e.hp / 6), 8);
    } else if (e.kind === 'fire') {
      ctx.fillStyle = '#ff9a2a'; ctx.beginPath(); ctx.arc(x + 7, y + 7, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffe36a'; ctx.beginPath(); ctx.arc(x + 7, y + 7, 3, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawHero(p, cx) {
    if (!p.dead && p.inv > 0 && Math.floor(performance.now() / 70) % 2 === 0) return;
    var s = p.big ? 1.2 : 1;
    var running = p.state === 'run';
    var bob = running ? Math.sin(p.anim * 20) * 1.5 : 0;
    var leg = running ? Math.sin(p.anim * 20) * 3 : 0;
    ctx.save();
    ctx.translate(Math.round(p.x - cx + p.w / 2), Math.round(p.y + p.h));
    ctx.scale(p.face * s, (p.dead ? -1 : 1) * s * (p.crouch ? 0.7 : 1));
    if (p.shield > 0) {
      ctx.strokeStyle = 'rgba(128,220,255,0.9)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -18, 24, 0, Math.PI * 2); ctx.stroke();
    }
    if (p.boost > 0) { ctx.fillStyle = 'rgba(255,220,80,0.25)'; ctx.fillRect(-16, -38, 32, 40); }
    ctx.fillStyle = '#2e5fd6'; ctx.fillRect(-8, -12, 7, 10 + leg); ctx.fillRect(1, -12, 7, 10 - leg);
    ctx.fillStyle = '#4a2a14'; ctx.fillRect(-9, -2 + leg, 9, 3); ctx.fillRect(1, -2 - leg, 9, 3);
    ctx.fillStyle = '#2e5fd6'; ctx.fillRect(-9, -22 + bob, 18, 11);
    ctx.fillStyle = '#e53b3b'; ctx.fillRect(-10, -26 + bob, 20, 5); ctx.fillRect(-12, -25 + bob, 3, 8); ctx.fillRect(9, -25 + bob, 3, 8);
    ctx.fillStyle = '#ffd3a8'; ctx.fillRect(-8, -37 + bob, 16, 12);
    ctx.fillStyle = '#e53b3b'; ctx.fillRect(-9, -41 + bob, 18, 5); ctx.fillRect(-2, -39 + bob, 12, 2);
    ctx.fillStyle = '#1a1a1a'; ctx.fillRect(2, -33 + bob, 3, 4);
    ctx.fillStyle = '#4a2a14'; ctx.fillRect(-3, -27 + bob, 10, 3);
    ctx.restore();
  }

  function drawParticles(cx) {
    for (var i = 0; i < G.parts.length; i++) {
      var q = G.parts[i];
      ctx.globalAlpha = Math.max(0, Math.min(1, q.life));
      ctx.fillStyle = q.color;
      ctx.fillRect(Math.round(q.x - cx), Math.round(q.y), q.s, q.s);
    }
    ctx.globalAlpha = 1;
  }

  function renderWorld(ts) {
    var L = LEVELS[G.level], cx = G.camX;
    var sx = G.shake > 0 ? (Math.random() - 0.5) * 10 : 0;
    var sy = G.shake > 0 ? (Math.random() - 0.5) * 10 : 0;
    ctx.save();
    ctx.translate(sx, sy);
    drawSky(L);
    drawParallax(L, cx);
    for (var i = 0; i < G.tiles.length; i++) drawTile(G.tiles[i], cx, L, ts);
    for (i = 0; i < G.movers.length; i++) drawMover(G.movers[i], cx);
    drawFlag(cx);
    drawCheckpoint(cx);
    for (i = 0; i < G.items.length; i++) drawItem(G.items[i], cx);
    for (i = 0; i < G.enemies.length; i++) drawEnemy(G.enemies[i], cx, ts);
    if (G.p) drawHero(G.p, cx);
    drawParticles(cx);
    ctx.restore();
  }

  function renderTitle(ts) {
    var L = LEVELS[0], t = ts / 1000;
    drawSky(L);
    drawParallax(L, t * 30);
    ctx.fillStyle = L.ground; ctx.fillRect(0, VH - 70, VW, 70);
    ctx.fillStyle = L.top; ctx.fillRect(0, VH - 70, VW, 8);
    for (var i = 0; i < 9; i++) {
      var fx = ((i * 137 + t * 20) % (VW + 60)) - 30;
      ctx.fillStyle = '#ffe066'; ctx.beginPath(); ctx.arc(fx, VH - 84 + Math.sin(t * 2 + i) * 4, 4, 0, Math.PI * 2); ctx.fill();
    }
    var fake = { x: VW / 2 - 12, y: VH - 70 - 36 + Math.sin(t * 3) * 3, w: PW, h: 36, face: 1, state: 'run', anim: t, big: false, inv: 0, dead: false, crouch: false, shield: 0, boost: 0 };
    drawHero(fake, 0);
  }

  // ---------- Loop ----------
  var last = 0;
  function frame(ts) {
    var dt = Math.min(0.033, Math.max(0, (ts - last) / 1000));
    last = ts;
    try {
      if (scene === 'play') step(dt);
      if (scene === 'title' || scene === 'levels' || scene === 'help' || scene === 'settings') renderTitle(ts);
      else renderWorld(ts);
    } catch (err) {
      showError(err && err.message ? err.message : 'render error');
    }
    requestAnimationFrame(frame);
  }

  // ---------- Level select ----------
  function buildLevelList() {
    var list = $('level-list');
    list.innerHTML = '';
    LEVELS.forEach(function (L, i) {
      var locked = (i + 1) > progress.unlocked;
      var b = document.createElement('button');
      b.className = 'btn pixel level-btn';
      b.disabled = locked;
      b.textContent = (i + 1) + '. ' + L.name + (locked ? '  [locked]' : '') + (progress.best[i] ? '  best ' + progress.best[i] : '');
      b.addEventListener('click', function () { SFX.click(); ensureAudio(); startLevel(i); });
      list.appendChild(b);
    });
  }

  // ---------- Wiring ----------
  function on(id, fn) { var el = $(id); if (el) el.addEventListener('click', fn); }

  function wire() {
    on('btn-play', function () { ensureAudio(); SFX.click(); startNewGame(); });
    on('btn-levels', function () { ensureAudio(); SFX.click(); buildLevelList(); showScene('levels'); });
    on('btn-help', function () { ensureAudio(); SFX.click(); showScene('help'); });
    on('btn-settings', function () { ensureAudio(); SFX.click(); showScene('settings'); });
    on('btn-fs-title', toggleFullscreen);
    on('btn-fullscreen', toggleFullscreen);
    var backs = document.querySelectorAll('[data-back]');
    for (var i = 0; i < backs.length; i++) backs[i].addEventListener('click', function () { SFX.click(); showScene('title'); });
    on('btn-resume', function () { SFX.click(); resumeGame(); });
    on('btn-pause-restart', restartLevel);
    on('btn-pause-title', function () { stopMusic(); showScene('title'); });
    on('btn-gameover-retry', function () { ensureAudio(); G.lives = 3; G.score = 0; startLevel(G.level); });
    on('btn-gameover-title', function () { stopMusic(); showScene('title'); });
    on('btn-next', function () { ensureAudio(); SFX.click(); startLevel(G.level + 1); });
    on('btn-complete-title', function () { stopMusic(); showScene('title'); });
    on('btn-victory-title', function () { stopMusic(); showScene('title'); });
    on('t-pause', function () { if (scene === 'play') pauseGame(); else if (scene === 'pause') resumeGame(); });
    on('btn-mute', function () {
      var mute = settings.music || settings.sfx;
      settings.music = !mute; settings.sfx = !mute;
      applyVolume(); saveSettings();
      $('set-music').checked = settings.music; $('set-sfx').checked = settings.sfx;
      if (!settings.music) stopMusic(); else if (scene === 'play') startMusic(LEVELS[G.level].theme);
    });

    var vol = $('set-volume');
    if (vol) vol.addEventListener('input', function (e) {
      settings.volume = Number(e.target.value) / 100; applyVolume(); saveSettings();
    });
    var music = $('set-music');
    if (music) music.addEventListener('change', function (e) {
      settings.music = e.target.checked; applyVolume(); saveSettings();
      if (!settings.music) stopMusic(); else if (scene === 'play') startMusic(LEVELS[G.level].theme);
    });
    var sfx = $('set-sfx');
    if (sfx) sfx.addEventListener('change', function (e) { settings.sfx = e.target.checked; applyVolume(); saveSettings(); });

    bindTouch('t-left', 'left');
    bindTouch('t-right', 'right');
    bindTouch('t-jump', 'jump');
    bindTouch('t-run', 'run');
    bindTouch('t-down', 'down');
  }

  function init() {
    try {
      buildLevel(0);
      wire();
      $('hs-value').textContent = String(progress.highScore || 0);
      $('set-volume').value = Math.round(settings.volume * 100);
      $('set-music').checked = settings.music;
      $('set-sfx').checked = settings.sfx;
      showScene('title');
      requestAnimationFrame(function (ts) { last = ts; requestAnimationFrame(frame); });
    } catch (e) {
      showError(e.message || 'startup error');
    }
  }

  // Exposed for automated smoke tests only; the game never reads these.
  window.SkyHopperDebug = { G: G, LEVELS: LEVELS, step: step, startLevel: startLevel, getScene: function () { return scene; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
