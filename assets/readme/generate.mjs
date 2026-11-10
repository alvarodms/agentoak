import fs from "node:fs";
// Generates the README diagrams in light and dark themes: node assets/readme/generate.mjs
const out = process.argv[2] ?? import.meta.dirname;
const themes = {
  light: { box:"#f6f8fa", stroke:"#d0d7de", text:"#1f2328", sub:"#59636e", line:"#8c959f",
           hiFill:"#dafbe1", hi:"#1a7f37", mem:"#8250df", memFill:"#fbefff", com:"#0969da", comFill:"#ddf4ff" },
  dark:  { box:"#161b22", stroke:"#30363d", text:"#e6edf3", sub:"#9198a1", line:"#6e7681",
           hiFill:"#12261e", hi:"#3fb950", mem:"#a371f7", memFill:"#211a33", com:"#4493f8", comFill:"#121d2f" },
};
const W = 980, H = 372, BW = 156, BH = 72, Y = 44;
const xs = [22, 217, 412, 607, 802];
const top = [
  ["Schedule", "every 4 hours"],
  ["Cycle", "a team of agents"],
  ["Verify", "build + claim check"],
  ["Commit", "game, memory, journal"],
  ["Release", "patch + website"],
];
function svg(t) {
  const box = (x, y, w, h, title, sub, fill = t.box, stroke = t.stroke, tc = t.text) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="${x + w / 2}" y="${y + h / 2 - 4}" text-anchor="middle" font-size="16" font-weight="600" fill="${tc}">${title}</text>
  <text x="${x + w / 2}" y="${y + h / 2 + 16}" text-anchor="middle" font-size="12.5" fill="${t.sub}">${sub}</text>`;
  const marker = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif" role="img" aria-label="Agent Oak overview: a scheduled cycle is verified, committed and released; memory and community feedback loop back into the next cycle">
  <defs>${marker("a", t.line)}${marker("m", t.mem)}${marker("c", t.com)}</defs>`;
  top.forEach(([a, b], i) => {
    s += i === 1 ? box(xs[i], Y, BW, BH, a, b, t.hiFill, t.hi, t.hi) : box(xs[i], Y, BW, BH, a, b);
    if (i < 4) s += `<line x1="${xs[i] + BW + 4}" y1="${Y + BH / 2}" x2="${xs[i + 1] - 5}" y2="${Y + BH / 2}" stroke="${t.line}" stroke-width="1.5" marker-end="url(#a)"/>`;
  });
  const by = Y + BH;
  // memory loop: Commit -> Memory -> Cycle
  const cx = xs[3] + BW / 2, cyX = xs[1] + BW / 2 + 30, my = 176;
  s += `<path d="M${cx} ${by + 4} V${my + 20} H${cyX + 242}" fill="none" stroke="${t.mem}" stroke-width="1.5" marker-end="url(#m)"/>`;
  s += box(cyX + 62, my - 6, 176, 52, "Memory", "what the agent knows", t.memFill, t.mem, t.mem);
  s += `<path d="M${cyX + 58} ${my + 20} H${cyX} V${by + 6}" fill="none" stroke="${t.mem}" stroke-width="1.5" marker-end="url(#m)"/>`;
  // community loop: Release -> Players -> Issues -> Cycle
  const rx = xs[4] + BW / 2, cy2 = xs[1] + BW / 2 - 30, ly = 300;
  s += `<path d="M${rx} ${by + 4} V${ly} H${xs[3] + BW + 6}" fill="none" stroke="${t.com}" stroke-width="1.5" marker-end="url(#c)"/>`;
  s += box(xs[3], ly - 30, BW, 60, "Players", "play each release", t.comFill, t.com, t.com);
  s += `<line x1="${xs[3] - 4}" y1="${ly}" x2="${xs[2] + BW + 6}" y2="${ly}" stroke="${t.com}" stroke-width="1.5" marker-end="url(#c)"/>`;
  s += box(xs[2], ly - 30, BW, 60, "GitHub Issues", "ideas, bugs, feedback", t.comFill, t.com, t.com);
  s += `<path d="M${xs[2] - 4} ${ly} H${cy2} V${by + 6}" fill="none" stroke="${t.com}" stroke-width="1.5" marker-end="url(#c)"/>`;
  s += `<text x="${cyX + 14}" y="${by + 34}" font-size="11.5" fill="${t.mem}" font-weight="600">memory loop</text>`;
  s += `<text x="${cy2 - 12}" y="${ly - 12}" font-size="11.5" fill="${t.com}" font-weight="600" text-anchor="end">community loop</text>`;
  return s + "\n</svg>\n";
}

const FONT = `font-family="-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif"`;
function kit(t) {
  const k = {};
  k.marker = (id, c) => `<marker id="${id}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`;
  k.open = (w, h, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ${FONT} role="img" aria-label="${label}">
  <defs>${k.marker("a", t.line)}${k.marker("m", t.mem)}${k.marker("c", t.com)}${k.marker("g", t.hi)}</defs>`;
  k.box = (x, y, w, h, title, sub, fill = t.box, stroke = t.stroke, tc = t.text) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="${x + w / 2}" y="${y + h / 2 + (sub ? -3 : 5)}" text-anchor="middle" font-size="15" font-weight="600" fill="${tc}">${title}</text>` +
    (sub ? `<text x="${x + w / 2}" y="${y + h / 2 + 15}" text-anchor="middle" font-size="12" fill="${t.sub}">${sub}</text>` : "");
  k.group = (x, y, w, h, label) => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="${t.stroke}" stroke-width="1.5" stroke-dasharray="5 5"/>
  <text x="${x + 14}" y="${y + 23}" font-size="11.5" font-weight="700" letter-spacing="1.2" fill="${t.sub}">${label}</text>`;
  k.path = (d, c = t.line, m = "a", extra = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.5" marker-end="url(#${m})" ${extra}/>`;
  k.label = (x, y, txt, c = t.sub, anchor = "start") => `<text x="${x}" y="${y}" font-size="11.5" font-weight="600" fill="${c}" text-anchor="${anchor}">${txt}</text>`;
  return k;
}

function cycle(t) {
  const k = kit(t), W = 1000, H = 300, GY = 30, GH = 250, R1 = 78, R2 = 190, BH = 62;
  let s = k.open(W, H, "A cycle: advisors and a Producer plan, optional designers write briefs, an implementer builds, the build and the agent's claims are checked with a fix loop, then reflection rewrites memory and the verified changes are committed");
  const g = [[10, 160], [194, 160], [378, 428], [830, 160]];
  ["PLAN", "DESIGN  ·  OPTIONAL", "BUILD AND VERIFY", "CLOSE"].forEach((l, i) => (s += k.group(g[i][0], GY, g[i][1], GH, l)));
  const mid = GY + GH / 2 + 6;
  for (let i = 0; i < 3; i++) {
    const x1 = g[i][0] + g[i][1] + 3, x2 = g[i + 1][0] - 4;
    s += i === 2 ? k.path(`M${x1} ${mid} H${x2}`, t.hi, "g") : k.path(`M${x1} ${mid} H${x2}`);
  }
  s += k.label(g[2][0] + g[2][1] - 10, mid + 4, "verified", t.hi, "end");
  // plan
  s += k.box(20, R1, 140, BH, "Advisors", "four separate memos");
  s += k.box(20, R2, 140, BH, "Producer", "sets the objective", t.hiFill, t.hi, t.hi);
  s += k.path(`M90 ${R1 + BH + 4} V${R2 - 5}`);
  // design
  s += k.box(204, R1, 140, BH, "Gameplay", "Designer");
  s += k.box(204, R2, 140, BH, "Sprite", "Designer");
  // build
  const bx = [388, 532, 676], bw = 120;
  s += k.box(bx[0], R1, bw, BH, "Implementer", "changes the game");
  s += k.box(bx[1], R1, bw, BH, "Build check", "does it compile?");
  s += k.box(bx[2], R1, bw, BH, "Claim check", "claims vs. diff");
  s += k.box(bx[1], R2, bw, BH, "Fix agent", "repairs the change", t.memFill, t.mem, t.mem);
  s += k.path(`M${bx[0] + bw + 3} ${R1 + BH / 2} H${bx[1] - 5}`);
  s += k.path(`M${bx[1] + bw + 3} ${R1 + BH / 2} H${bx[2] - 5}`);
  const c1 = bx[1] + bw / 2, c2 = bx[2] + bw / 2;
  s += k.path(`M${c1 - 16} ${R1 + BH + 4} V${R2 - 5}`, t.mem, "m");
  s += k.path(`M${c1 + 16} ${R2 - 4} V${R1 + BH + 5}`, t.mem, "m");
  s += k.label(c1 - 24, R1 + BH + 30, "fails", t.mem, "end");
  s += k.label(c1 + 24, R1 + BH + 30, "rebuild", t.mem);
  s += k.path(`M${c2} ${R1 + BH + 4} V${R2 + BH / 2} H${bx[1] + bw + 6}`, t.mem, "m");
  s += k.label(c2 - 8, R2 + BH / 2 - 8, "mismatch", t.mem, "end");
  // close
  s += k.box(840, R1, 140, BH, "Reflection", "rewrites memory");
  s += k.box(840, R2, 140, BH, "Commit", "then release");
  s += k.path(`M910 ${R1 + BH + 4} V${R2 - 5}`);
  return s + "\n</svg>\n";
}

function memory(t) {
  const k = kit(t), W = 1000, H = 330;
  let s = k.open(W, H, "Memory is the only bridge between cycles: each cycle's plan reads it and each cycle's reflection rewrites it, while a public journal keeps the history");
  s += k.box(40, 16, 920, 48, "Journal", "", t.box, t.stroke, t.text);
  s += `<text x="${500 + 38}" y="45" font-size="12.5" fill="${t.sub}">public history, one entry per cycle</text>`.replace(`x="538"`, `x="540"`);
  s += k.box(40, 262, 920, 52, "", "", t.memFill, t.mem, t.mem);
  s += `<text x="500" y="285" text-anchor="middle" font-size="15" font-weight="600" fill="${t.mem}">Memory</text><text x="500" y="303" text-anchor="middle" font-size="12" fill="${t.sub}">the project as it is now: vision, roadmap, what has been built, how the code works, mistakes to avoid</text>`;
  const cyc = (x, label) => {
    let o = k.group(x, 100, 400, 124, label);
    const bx = [x + 20, x + 150, x + 280], y = 142;
    ["Plan", "Build", "Reflect"].forEach((n, i) => (o += k.box(bx[i], y, 100, 56, n, "")));
    o += k.path(`M${bx[0] + 103} ${y + 28} H${bx[1] - 5}`) + k.path(`M${bx[1] + 103} ${y + 28} H${bx[2] - 5}`);
    const p = bx[0] + 50, r = bx[2] + 50;
    o += k.path(`M${p} 259 V${y + 61}`, t.mem, "m", `stroke-dasharray="5 4"`);
    o += k.label(p + 10, 246, "reads", t.mem);
    o += k.path(`M${r} ${y + 60} V258`, t.mem, "m");
    o += k.label(r + 10, 246, "rewrites", t.mem);
    o += k.path(`M${r} ${y - 4} V69`);
    o += k.label(r + 8, 88, "appends");
    return o;
  };
  s += cyc(40, "CYCLE N") + cyc(560, "CYCLE N+1");
  s += `<text x="500" y="158" text-anchor="middle" font-size="12" fill="${t.sub}">no shared</text><text x="500" y="175" text-anchor="middle" font-size="12" fill="${t.sub}">context</text>`;
  return s + "\n</svg>\n";
}

for (const [n, t] of Object.entries(themes)) {
  fs.writeFileSync(`${out}/overview-${n}.svg`, svg(t));
  fs.writeFileSync(`${out}/cycle-${n}.svg`, cycle(t));
  fs.writeFileSync(`${out}/memory-${n}.svg`, memory(t));
}
