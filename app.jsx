// Classic Jupyter Notebook portfolio — interactive
const { useState, useEffect, useRef, useCallback, useMemo } = React;
const D = window.PORTFOLIO;

const IS_MAC = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
const MOD = IS_MAC ? "⌘" : "Ctrl";

function md(text) {
  const out = []; let last = 0, idx = 0;
  // bold **x**, italic *x*, link [x](y), inline code `x`
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) out.push(<strong key={idx++}>{t.slice(2,-2)}</strong>);
    else if (t.startsWith("`")) out.push(<code key={idx++}>{t.slice(1,-1)}</code>);
    else if (t.startsWith("[")) { const lm = t.match(/\[([^\]]+)\]\(([^)]+)\)/); out.push(<a key={idx++} href={lm[2]} target="_blank" rel="noopener">{md(lm[1])}</a>); }
    else if (t.startsWith("*")) out.push(<em key={idx++}>{t.slice(1,-1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const Logo = ({ onClick }) => (
  <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" onClick={onClick} style={{cursor:"pointer"}}>
    <ellipse cx="8" cy="3" rx="5.5" ry="1.7" fill="none" stroke="#767677" strokeWidth="0.6"/>
    <ellipse cx="8" cy="13" rx="5.5" ry="1.7" fill="none" stroke="#767677" strokeWidth="0.6"/>
    <circle cx="8" cy="8" r="3" fill="#F37726"/>
  </svg>
);

const I = {
  save:    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M2 2h9l3 3v9H2z"/><path d="M5 2v4h6V2M5 14v-5h6v5"/></svg>,
  plus:    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v10M3 8h10"/></svg>,
  cut:     <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="4" cy="11" r="2"/><circle cx="12" cy="11" r="2"/><path d="M5.5 9.5L13 3M10.5 9.5L3 3"/></svg>,
  copy:    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="5" y="5" width="9" height="9"/><path d="M2 11V2h9"/></svg>,
  paste:   <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="4" width="10" height="10"/><path d="M6 4V2h4v2"/></svg>,
  up:      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M8 13V3M3 8l5-5 5 5"/></svg>,
  down:    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M8 3v10M3 8l5 5 5-5"/></svg>,
  run:     <svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 3l9 5-9 5z"/></svg>,
  stop:    <svg viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="4" width="8" height="8"/></svg>,
  restart: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 8a5 5 0 1 0 1.5-3.5"/><path d="M3 3v3h3"/></svg>,
  fast:    <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 3l5 5-5 5zM8 3l5 5-5 5z"/></svg>,
  trash:   <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M3 4h10M5 4V2.5h6V4M4 4l1 10h6l1-10"/></svg>,
  undo:    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 8h6a3 3 0 0 1 0 6H6"/><path d="M5 5L2 8l3 3"/></svg>,
  redo:    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M11 8H5a3 3 0 0 0 0 6h5"/><path d="M11 5l3 3-3 3"/></svg>,
};

const PromptIn = ({n, busy}) => <div className="prompt in">{busy ? "In [*]:" : `In [${n}]:`}</div>;
const PromptOut = ({n}) => <div className="prompt out">Out[{n}]:</div>;
const PromptEmpty = () => <div className="prompt empty">In [ ]:</div>;

function hi(name) {
  if (/^R\.?\s*Lal\*?$/i.test(name.trim())) return <span className="author-me">{name}</span>;
  return name;
}

/* === Outputs === */
function HeroOut() {
  const a = D.about;
  const [zoomed, setZoomed] = useState(false);
  return (
    <>
      {zoomed && <div className="photo-backdrop" onClick={()=>setZoomed(false)}/>}
      <div className="hero">
        <img className={"hero-photo" + (zoomed ? " zoomed" : "")} src="img/rohit.png" alt="Rohit Lal" onClick={()=>setZoomed(z=>!z)}/>
        <div>
          <div className="hero-name">{a.name}</div>
          <div className="hero-tag">{a.expertise}</div>
          <div className="hero-bio">
            {a.bio.map((p, i) => <p key={i}>{md(p)}</p>)}
          </div>
          <div className="hero-meta">
            <div><span className="k">'location'</span>: <span className="v">'{a.location}'</span></div>
            {a.links.map(l => (
              <div key={l.label}><span className="k">'{l.label}'</span>: <span className="v">'<a href={l.url} target="_blank" rel="noopener">{l.url.replace(/^(https?:\/\/|mailto:)/,"").replace(/\/$/,"")}</a>'</span></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function NewsOut() {
  const [sortDir, setSortDir] = useState("desc");
  const [filter, setFilter] = useState("");
  let items = [...D.news];
  if (filter) {
    const f = filter.toLowerCase();
    items = items.filter(n => n.desc.toLowerCase().includes(f) || n.date.toLowerCase().includes(f));
  }
  if (sortDir === "asc") items.reverse();
  return (
    <div className="df-out">
      <div className="pub-controls">
        <span>filter:</span>
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="e.g. NASA, ICCV"
          style={{fontFamily:"var(--mono)",fontSize:11.5,padding:"2px 6px",border:"1px solid var(--rule)",borderRadius:2,outline:"none",width:140}}/>
        <span style={{marginLeft:8}}>{items.length} of {D.news.length}</span>
      </div>
      <div className="output-scroll" style={{maxHeight: 460}}>
        <table className="df" style={{width:"100%",tableLayout:"fixed"}}>
          <thead style={{position:"sticky",top:0,background:"white",zIndex:1}}>
            <tr>
              <th style={{width:50}}></th>
              <th className="sortable text-col" style={{width:110}} onClick={()=>setSortDir(d=>d==="desc"?"asc":"desc")}>
                date <span className="arr">{sortDir==="desc"?"▼":"▲"}</span>
              </th>
              <th className="text-col">description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n, i) => (
              <tr key={i}>
                <td className="idx-col">{i}</td>
                <td className="text-col">{n.date}</td>
                <td className="text-col"><span className="desc">{md(n.desc)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="df-meta">[{items.length} rows × 2 columns] · scroll for more</div>
    </div>
  );
}

function ExperienceOut() {
  return (
    <div className="exp-rows">
      {D.experience.map((e, i) => (
        <div className="item" key={i}>
          <div className="head">{e.title}</div>
          <div className="sub"><a href={e.url} target="_blank" rel="noopener">{e.company}</a> · {e.location} · {e.date}</div>
          <div className="desc">{e.desc}</div>
        </div>
      ))}
    </div>
  );
}

function PublicationsOut() {
  const [sort, setSort] = useState("year");
  const [filter, setFilter] = useState("all");
  let pubs = [...D.publications];
  if (filter === "first") pubs = pubs.filter(p => /^R\.?\s*Lal/.test((Array.isArray(p.authors)?p.authors[0]:p.authors.split(",")[0])));
  if (sort === "year") pubs.sort((a,b)=>b.year-a.year);
  return (
    <div className="pub-list">
      <div className="pub-controls">
        <span>sort_by:</span>
        <button className={sort==="year"?"active":""} onClick={()=>setSort("year")}>year ↓</button>
        <button className={sort==="venue"?"active":""} onClick={()=>setSort("venue")}>venue</button>
        <span style={{marginLeft:12}}>filter:</span>
        <button className={filter==="all"?"active":""} onClick={()=>setFilter("all")}>all ({D.publications.length})</button>
        <button className={filter==="first"?"active":""} onClick={()=>setFilter("first")}>first-author</button>
      </div>
      {pubs.map((p) => (
        <div className="pub-item" key={p.key}>
          <div className="pub-bibkey">[{p.key}]</div>
          <div>
            <div className="pub-title">{p.title}</div>
            <div className="pub-authors">
              {(Array.isArray(p.authors) ? p.authors : String(p.authors).split(/,\s*/)).map((a, j) => (
                <React.Fragment key={j}>{j > 0 && ", "}{hi(a)}</React.Fragment>
              ))}
            </div>
            <div className="pub-venue">{p.venue} · {p.year}</div>
            <div className="pub-links">
              {p.links.map(l => <a key={l.label} href={l.url} target="_blank" rel="noopener">{l.label}</a>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const SKILL_ICONS = {
  "Python": "img/software/py.png", "PyTorch": "img/software/pytorch.png", "TensorFlow": "img/software/tf.png",
  "OpenCV": "img/software/cv.png", "C/C++": "img/software/c.png", "MATLAB": "img/software/matlab.png",
  "Photoshop": "img/software/ps.png", "Illustrator": "img/software/ai.png", "Git": "img/software/git.png",
  "LaTeX": "img/software/tex.png", "GCP": "img/software/gcp.png", "Arduino": "img/software/ard.png",
};

function SkillsOut({ animate }) {
  const rows = D.skills;
  const N = rows.length;
  const SIZE = 560;
  const CX = SIZE / 2, CY = SIZE / 2 + 6;
  const R = 180;
  const RINGS = [0.2, 0.4, 0.6, 0.8, 1.0];

  // axis angle for skill i: start at top, go clockwise
  const angle = (i) => -Math.PI / 2 + (i / N) * Math.PI * 2;
  const ptOnAxis = (i, frac) => {
    const a = angle(i);
    return [CX + Math.cos(a) * R * frac, CY + Math.sin(a) * R * frac];
  };

  // polygon points based on each skill's level (animated 0->1)
  const polyPoints = rows.map((s, i) => {
    const frac = animate ? s.level / 100 : 0;
    return ptOnAxis(i, frac).join(",");
  }).join(" ");

  // grid polygons (concentric)
  const ringPoly = (frac) =>
    rows.map((_, i) => ptOnAxis(i, frac).join(",")).join(" ");

  return (
    <div className="fig">
      <div className="radar-wrap">
        <svg viewBox={`0 0 ${SIZE} ${SIZE + 40}`} width="100%" style={{maxWidth: 620}}>
          {/* concentric rings */}
          {RINGS.map((f, k) => (
            <polygon key={k} className="radar-grid" points={ringPoly(f)} />
          ))}
          {/* axes */}
          {rows.map((_, i) => {
            const [x, y] = ptOnAxis(i, 1);
            return <line key={i} className="radar-axis" x1={CX} y1={CY} x2={x} y2={y} />;
          })}
          {/* tick labels on top axis */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((f, k) => (
            <text key={k} className="radar-tick" x={CX + 4} y={CY - R * f + 3}>
              {Math.round(f * 100)}
            </text>
          ))}
          {/* polygon */}
          <polygon
            className="radar-poly"
            points={polyPoints}
            style={{ transition: "all 0.9s cubic-bezier(.2,.8,.2,1)" }}
          />
          {/* dots + labels */}
          {rows.map((s, i) => {
            const a = angle(i);
            const [dx, dy] = ptOnAxis(i, animate ? s.level / 100 : 0);
            const [lx, ly] = ptOnAxis(i, 1.18);
            // anchor labels based on angle
            const cos = Math.cos(a), sin = Math.sin(a);
            const anchor = Math.abs(cos) < 0.3 ? "middle" : (cos > 0 ? "start" : "end");
            const dyShift = sin < -0.5 ? -4 : (sin > 0.5 ? 14 : 4);
            return (
              <g key={s.name}>
                <circle className="radar-dot" cx={dx} cy={dy} r={4}
                  style={{ transition: "all 0.9s cubic-bezier(.2,.8,.2,1)" }}/>
                <text className="radar-label" x={lx} y={ly + dyShift} textAnchor={anchor}>
                  {s.name}
                </text>
                <text className="radar-pct" x={lx} y={ly + dyShift + 13} textAnchor={anchor}>
                  {s.level}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="fig-caption">Figure 1: Tool proficiency radar (self-reported, 0–100).</div>
    </div>
  );
}

function ContactOut() {
  return (
    <div className="contact-out">
      {"{"}<br/>
      <span>&nbsp;&nbsp;</span><span className="k">'email'</span>: <span className="s">'<a href="mailto:take2rohit@gmail.com">take2rohit@gmail.com</a>'</span>,<br/>
      <span>&nbsp;&nbsp;</span><span className="k">'github'</span>: <span className="s">'<a href="https://github.com/take2rohit/" target="_blank" rel="noopener">github.com/take2rohit</a>'</span>,<br/>
      <span>&nbsp;&nbsp;</span><span className="k">'linkedin'</span>: <span className="s">'<a href="https://in.linkedin.com/in/rohit-lal" target="_blank" rel="noopener">linkedin.com/in/rohit-lal</a>'</span>,<br/>
      <span>&nbsp;&nbsp;</span><span className="k">'scholar'</span>: <span className="s">'<a href="https://scholar.google.com/citations?user=q2nc3QoAAAAJ" target="_blank" rel="noopener">scholar.google.com/...</a>'</span>,<br/>
      <span>&nbsp;&nbsp;</span><span className="k">'twitter'</span>: <span className="s">'<a href="https://twitter.com/take2rohit" target="_blank" rel="noopener">@take2rohit</a>'</span><br/>
      {"}"}
    </div>
  );
}

/* === Egg / REPL cell === */
function EggCell({ id, selected, onSelect, onDelete }) {
  const [val, setVal] = useState("");
  const [history, setHistory] = useState([]);
  const exec = () => {
    const v = val.trim();
    let result;
    if (!v) return;
    if (v === "help" || v === "help()") result = {ok: "Try: import this, me.fun_fact(), 42, sum(range(101)), matrix(), confetti(), about_me, skills.top(3), coffee()"};
    else if (v === "import this") result = {ok: "The Zen of Rohit\n  Beautiful is better than ugly.\n  Models should fail loudly.\n  Pose estimation is hard. Occlusion makes it harder.\n  Foundation models > task-specific tricks.\n  Read the paper. Then read it again."};
    else if (v === "me.fun_fact()" || v === "fun_fact()") result = {ok: "🏓 I play table tennis competitively. 📷 I shoot landscapes. 🥾 Hiked >100mi this year."};
    else if (v === "matrix()") { document.body.classList.toggle("matrix"); result = {ok: "// reality.glitch() — toggle again to revert"}; }
    else if (v === "confetti()") { window.__confetti && window.__confetti(); result = {ok: "🎉🎊✨"}; }
    else if (v === "coffee()") result = {ok: "☕ Brewing... [████████████] 100%\n>>> ready"};
    else if (v === "about_me") result = {ok: "Rohit Lal — Computer Scientist @ NASA IMPACT.\nMS by Research, UC Riverside.\nFoundation models for science, computer vision, NLP."};
    else if (v === "skills.top(3)") result = {ok: "['Python (95)', 'PyTorch (92)', 'Git (90)']"};
    else if (v === "exit" || v === "quit") result = {ok: "Use Ctrl-D (i.e. EOF) to exit. Just kidding — keep exploring."};
    else if (v === "ls") result = {ok: "about/  experience/  news/  publications.bib  skills.json  contact.yml"};
    else if (v === "whoami") result = {ok: "rohit"};
    else if (v === "pwd") result = {ok: "/home/rohit/portfolio"};
    else if (v === "date") result = {ok: new Date().toString()};
    else if (v.startsWith("print(") && v.endsWith(")")) {
      try { result = {ok: String(eval(v.slice(6,-1))).slice(0, 500)}; } catch(e) { result = {err: "SyntaxError: " + e.message}; }
    } else {
      try {
        if (!/^[\d+\-*/().,\s]+$/.test(v)) throw new Error("name '" + v.split(/\s|[(]/)[0] + "' is not defined");
        result = {ok: String(eval(v))};
      } catch(e) { result = {err: "NameError: " + e.message}; }
    }
    setHistory(h => [...h, {input: v, ...result}]);
    setVal("");
  };
  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); exec(); } };
  return (
    <div id={id} className={"cell code-cell egg-cell" + (selected ? " selected" : "") + (history.length ? " activated" : "")} onClick={onSelect}>
      <div className="cell-actions">
        <button className="cell-action danger" title="Delete cell" onClick={(e)=>{e.stopPropagation(); onDelete();}}>{I.trash}</button>
      </div>
      <div className="cell-row in-row">
        <div className="sel-bar in" onClick={(e)=>e.stopPropagation()}/>
        <div className="prompt">In [&gt;]:</div>
        <div className="input-wrap">
          <input className="repl-input" value={val} onChange={e=>setVal(e.target.value)} onKeyDown={onKey}
            placeholder="// secret REPL — try: import this, matrix(), confetti(), me.fun_fact(), help" />
          {history.length > 0 && (
            <div className="repl-out">
              {history.map((h, i) => (
                <div key={i}>
                  <span style={{color:"var(--prompt-in)"}}>&gt;&gt;&gt; </span>{h.input}{"\n"}
                  {h.ok && <span className="ok">{h.ok}</span>}
                  {h.err && <span className="err">{h.err}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* === Cells === */
function CodeCell({ id, prompt, busy, executed, code, output, selected, editMode, inCollapsed, outCollapsed, running, onSelect, onCollapseIn, onCollapseOut, onDelete }) {
  return (
    <div id={id} className={"cell code-cell" + (selected ? " selected" : "") + (editMode ? " edit-mode" : "") + (running ? " running" : "")} onClick={onSelect} tabIndex={-1}>
      <div className="cell-actions">
        <button className="cell-action" title="Run (Shift+Enter)" onClick={(e)=>{e.stopPropagation(); const ev = new CustomEvent("run-cell", {detail: id}); window.dispatchEvent(ev);}}>{I.run}</button>
        <button className="cell-action" title="Copy code" onClick={(e)=>{
          e.stopPropagation();
          const txt = (typeof code === "string") ? code : (Array.isArray(code) ? code.join("\n") : "");
          if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(()=>{});
          const btn = e.currentTarget;
          btn.classList.add("copied");
          setTimeout(()=>btn.classList.remove("copied"), 900);
        }}>{I.copy}</button>
        <button className="cell-action danger" title="Delete cell (DD)" onClick={(e)=>{e.stopPropagation(); onDelete();}}>{I.trash}</button>
      </div>
      <div className="cell-row in-row">
        <div className="sel-bar in" title="Click to collapse input"
             onClick={(e)=>{e.stopPropagation(); onCollapseIn();}}/>
        <PromptIn n={prompt} busy={busy} />
        <div className={"input-wrap" + (inCollapsed ? " collapsed" : "")}>
          <div className="input-area" contentEditable={true} suppressContentEditableWarning={true} spellCheck={false}
               onKeyDown={(e)=>{
                 // Let Shift+Enter and Cmd/Ctrl+Enter bubble to the global handler
                 const isRun = (e.shiftKey && e.key === "Enter") || ((e.metaKey || e.ctrlKey) && e.key === "Enter");
                 if (!isRun) e.stopPropagation();
               }}
               onBeforeInput={(e)=>{ e.preventDefault(); }}
               onPaste={(e)=>e.preventDefault()}
               onCut={(e)=>e.preventDefault()}
               onDrop={(e)=>e.preventDefault()}>
            <pre>{code}</pre>
          </div>
          {inCollapsed && <div className="collapse-stub-in" onClick={(e)=>{e.stopPropagation(); onCollapseIn();}}>Input collapsed — click to expand</div>}
        </div>
      </div>
      {executed && (
        <div className="cell-row out-row">
          <div className="sel-bar out" title="Click to collapse output"
               onClick={(e)=>{e.stopPropagation(); onCollapseOut();}}/>
          <PromptOut n={prompt} />
          <div className={"output-wrap" + (outCollapsed ? " collapsed" : "")}>
            <div className="output-area">{busy ? <div className="output-text">⋯</div> : output}</div>
            {outCollapsed && <div className="collapse-stub" onClick={(e)=>{e.stopPropagation(); onCollapseOut();}}>Output collapsed — click to expand</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function MdCell({ id, children, selected, onSelect, onDelete }) {
  return (
    <div id={id} className={"cell md-cell-row" + (selected ? " selected" : "")} onClick={onSelect}>
      <div className="cell-actions">
        <button className="cell-action danger" title="Delete cell" onClick={(e)=>{e.stopPropagation(); onDelete();}}>{I.trash}</button>
      </div>
      <div className="cell-row">
        <div className="md-cell">{children}</div>
      </div>
    </div>
  );
}

/* === Confetti === */
function fireConfetti() {
  const layer = document.createElement("div");
  layer.className = "confetti";
  document.body.appendChild(layer);
  const colors = ["#F37726", "#303f9f", "#4caf50", "#ba2121", "#ffc107", "#00bcd4"];
  for (let i = 0; i < 80; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = -Math.random() * 20 + "vh";
    s.style.background = colors[Math.floor(Math.random() * colors.length)];
    s.style.animationDelay = Math.random() * 0.4 + "s";
    s.style.animationDuration = (1.6 + Math.random() * 1.2) + "s";
    s.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(s);
  }
  setTimeout(() => layer.remove(), 3500);
}
window.__confetti = fireConfetti;

/* === Command Palette === */
function CommandPalette({ onClose, commands }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const filt = commands.filter(c => c.label.toLowerCase().includes(q.toLowerCase()) || c.desc.toLowerCase().includes(q.toLowerCase()));
  const onKey = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s+1, filt.length-1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filt[sel]) { filt[sel].run(); onClose(); } }
  };
  return (
    <>
      <div className="cmd-backdrop" onClick={onClose}/>
      <div className="cmd-palette">
        <input autoFocus value={q} onChange={e=>{setQ(e.target.value); setSel(0);}} onKeyDown={onKey} placeholder="Search commands..."/>
        <ul>
          {filt.map((c, i) => (
            <li key={c.label} className={i===sel?"sel":""} onClick={()=>{c.run(); onClose();}} onMouseEnter={()=>setSel(i)}>
              <span>{c.label}</span><span className="desc">{c.desc}</span>
            </li>
          ))}
          {filt.length === 0 && <li style={{color:"var(--ink-mute)"}}>no matches</li>}
        </ul>
      </div>
    </>
  );
}

/* === App === */
const INIT_CELL_ORDER = [
  { id: "title",       kind: "md" },
  { id: "about_md",    kind: "md" },
  { id: "about",       kind: "code" },
  { id: "news_md",     kind: "md" },
  { id: "news",        kind: "code" },
  { id: "exp_md",      kind: "md" },
  { id: "exp",         kind: "code" },
  { id: "pubs_md",     kind: "md" },
  { id: "pubs",        kind: "code" },
  { id: "skills_md",   kind: "md" },
  { id: "skills",      kind: "code" },
  { id: "contact_md",  kind: "md" },
  { id: "contact",     kind: "code" },
  { id: "egg_md",      kind: "md" },
  { id: "egg",         kind: "egg" },
];

const INIT_PROMPTS = { about:1, news:2, exp:3, pubs:4, skills:5, contact:6 };

function App() {
  // history stack for undo/redo
  const [history, setHistory] = useState([{ order: INIT_CELL_ORDER.map(c => c.id), prompts: {...INIT_PROMPTS}, deleted: {} }]);
  const [hIdx, setHIdx] = useState(0);
  const state = history[hIdx];
  const orderIds = state.order;

  const cellById = useMemo(() => Object.fromEntries(INIT_CELL_ORDER.map(c => [c.id, c])), []);
  const codeIds = orderIds.filter(id => cellById[id]?.kind === "code");

  const [busy, setBusy] = useState({});       // {id: bool}
  const [executed, setExecuted] = useState({about:true,news:true,exp:true,pubs:true,skills:true,contact:true});
  const [inCollapsed, setInCollapsed] = useState({});
  const [outCollapsed, setOutCollapsed] = useState({});
  const [selected, setSelected] = useState("about");
  const [editMode, setEditMode] = useState(false);
  const [kernelBusy, setKernelBusy] = useState(false);
  const [skillsAnim, setSkillsAnim] = useState(true);
  const [showPalette, setShowPalette] = useState(false);
  const [hint, setHint] = useState(null);
  const lastDD = useRef(0);
  const konami = useRef([]);
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

  const showHint = useCallback((msg) => {
    setHint(msg);
    setTimeout(() => setHint(null), 2800);
  }, []);

  const pushHistory = (next) => {
    const newHistory = [...history.slice(0, hIdx + 1), next];
    setHistory(newHistory);
    setHIdx(newHistory.length - 1);
  };

  const runCell = useCallback((id) => {
    const c = cellById[id];
    if (!c || c.kind !== "code") return;
    setBusy(b => ({ ...b, [id]: true }));
    setExecuted(e => ({ ...e, [id]: true }));
    setKernelBusy(true);
    if (id === "skills") setSkillsAnim(false);
    setTimeout(() => {
      const maxP = Math.max(0, ...Object.values(state.prompts).filter(v => typeof v === "number"));
      const nextPrompts = { ...state.prompts, [id]: maxP + 1 };
      pushHistory({ ...state, prompts: nextPrompts });
      setBusy(b => ({ ...b, [id]: false }));
      setKernelBusy(false);
      if (id === "skills") setTimeout(() => setSkillsAnim(true), 50);
    }, 380 + Math.random() * 320);
  }, [state, hIdx, history]);

  // bridge: per-cell run button via custom event
  useEffect(() => {
    const h = (e) => {
      const id = (e.detail || "").replace(/^cell-/, "");
      runCell(id);
    };
    window.addEventListener("run-cell", h);
    return () => window.removeEventListener("run-cell", h);
  }, [runCell]);

  const advanceTo = (id, runAfter) => {
    // Find the section header (preceding md cell) for the CURRENT cell being run
    const i = orderIds.indexOf(id);
    let scrollTargetId = id;
    for (let j = i - 1; j >= 0; j--) {
      if (cellById[orderIds[j]]?.kind === "md") { scrollTargetId = orderIds[j]; break; }
      if (cellById[orderIds[j]]?.kind === "code") break; // stop at previous code cell
    }
    // Scroll the section header to the top ONCE, then run.
    const el = document.getElementById("cell-" + scrollTargetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - 110;
      if (Math.abs(window.scrollY - targetY) > 20) {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
    if (runAfter) runAfter();
    // After run animation finishes, move selection to next code cell (no scroll).
    let nextId = null;
    for (let j = i + 1; j < orderIds.length; j++) {
      if (cellById[orderIds[j]]?.kind === "code") { nextId = orderIds[j]; break; }
    }
    if (nextId) {
      setTimeout(() => setSelected(nextId), 800);
    }
  };

  const runAll = () => {
    codeIds.forEach((k, i) => setTimeout(() => runCell(k), i * 200));
  };

  const restartKernel = () => {
    setExecuted({});
    setBusy({});
    setSkillsAnim(false);
    pushHistory({ ...state, prompts: {} });
    showHint("Kernel restarted. All variables cleared.");
  };

  const deleteCell = (id) => {
    const i = orderIds.indexOf(id);
    if (i < 0) return;
    const nextOrder = orderIds.filter(x => x !== id);
    const nextDel = { ...state.deleted, [id]: { atIndex: i } };
    pushHistory({ ...state, order: nextOrder, deleted: nextDel });
    if (selected === id) setSelected(nextOrder[Math.max(0, i - 1)] || nextOrder[0]);
    showHint(`Deleted cell. ${MOD}+Z to undo.`);
  };

  const undo = () => {
    if (hIdx > 0) { setHIdx(hIdx - 1); showHint("Undo"); }
    else showHint("Nothing to undo");
  };
  const redo = () => {
    if (hIdx < history.length - 1) { setHIdx(hIdx + 1); showHint("Redo"); }
    else showHint("Nothing to redo");
  };

  const toggleCollapseOut = (id) => setOutCollapsed(c => ({...c, [id]: !c[id]}));
  const toggleCollapseIn = (id) => setInCollapsed(c => ({...c, [id]: !c[id]}));

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      // command palette
      if (isMod && e.shiftKey && (e.key === "P" || e.key === "p")) {
        e.preventDefault();
        setShowPalette(true);
        return;
      }
      // undo / redo (work even in inputs only when explicit)
      if (isMod && !e.shiftKey && (e.key === "z" || e.key === "Z")) {
        const tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
        e.preventDefault(); undo(); return;
      }
      if (isMod && ((e.shiftKey && (e.key === "Z" || e.key === "z")) || e.key === "y")) {
        const tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
        e.preventDefault(); redo(); return;
      }

      const tag = (e.target.tagName || "").toLowerCase();
      const isEditing = tag === "input" || tag === "textarea" || e.target.isContentEditable;
      if (isEditing && !(e.shiftKey && e.key === "Enter") && !(isMod && e.key === "Enter")) return;

      if (e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        const sel = selected;
        // Scroll to next section first, then run the current cell so the
        // output-render animation happens AFTER the scroll has settled
        advanceTo(sel, () => { if (sel) runCell(sel); });
        setEditMode(false);
        return;
      }
      if (isMod && e.key === "Enter") {
        e.preventDefault();
        if (selected) runCell(selected);
        return;
      }
      if (e.key === "Enter" && !editMode && !isEditing) {
        e.preventDefault();
        if (cellById[selected]?.kind === "code") setEditMode(true);
        return;
      }
      if (e.key === "Escape") { setEditMode(false); return; }
      if (editMode || isEditing) return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        const i = orderIds.indexOf(selected);
        if (i < orderIds.length - 1) setSelected(orderIds[i+1]);
      }
      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        const i = orderIds.indexOf(selected);
        if (i > 0) setSelected(orderIds[i-1]);
      }
      if (e.key === "o" && !isMod) {
        e.preventDefault();
        if (selected) toggleCollapseOut(selected);
      }
      // dd to delete (Jupyter classic shortcut)
      if (e.key === "d" && !isMod) {
        const now = Date.now();
        if (now - lastDD.current < 500) {
          e.preventDefault();
          deleteCell(selected);
          lastDD.current = 0;
        } else {
          lastDD.current = now;
        }
      }
      // konami
      konami.current = [...konami.current, e.key].slice(-10);
      if (konami.current.join(",") === KONAMI.join(",")) {
        konami.current = [];
        fireConfetti();
        showHint("🎮 Konami code unlocked! Try the > REPL cell at the bottom.");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, editMode, runCell, hIdx, history, orderIds, state]);

  // first-time hint
  useEffect(() => {
    const seen = sessionStorage.getItem("nb-hinted-v2");
    if (!seen) {
      const tip = IS_MAC
        ? "⇧↵ run+advance · ↵ edit · O collapse · DD delete · ⌘Z undo · ⌘⇧P palette"
        : "Shift+Enter run · Enter edit · O collapse · DD delete · Ctrl+Z undo · Ctrl+Shift+P palette";
      setTimeout(() => showHint("Tip: " + tip), 1200);
      sessionStorage.setItem("nb-hinted-v2", "1");
    }
  }, []);

  const KW = ({c}) => <span className="cm-kw">{c}</span>;
  const FN = ({c}) => <span className="cm-fn">{c}</span>;
  const ST = ({c}) => <span className="cm-str">{c}</span>;
  const NM = ({c}) => <span className="cm-num">{c}</span>;
  const CM = ({c}) => <span className="cm-com">{c}</span>;
  const OP = ({c}) => <span className="cm-op">{c}</span>;
  const PR = ({c}) => <span className="cm-prop">{c}</span>;

  const codeFor = {
    about: <>
      <KW c="from"/> <span>portfolio</span> <KW c="import"/> <FN c="Profile"/>{"\n"}
      <CM c="# Load identity, affiliation, photo"/>{"\n"}
      <span>me</span> <OP c="="/> <FN c="Profile"/>(<ST c="'Rohit Lal'"/>)<OP c="."/><FN c="load"/>(){"\n"}
      <span>me</span><OP c="."/><FN c="render"/>(<PR c="photo"/><OP c="="/><ST c="'img/rohit.png'"/>)
    </>,
    news: <>
      <KW c="import"/> <span>pandas</span> <KW c="as"/> <span>pd</span>{"\n"}
      <span>news</span> <OP c="="/> <span>pd</span><OP c="."/><FN c="read_yaml"/>(<ST c="'data/news.yml'"/>){"\n"}
      <span>news</span><OP c="."/><FN c="sort_values"/>(<ST c="'date'"/>, <PR c="ascending"/><OP c="="/><KW c="False"/>)
    </>,
    exp: <>
      <KW c="for"/> <span>e</span> <KW c="in"/> <span>me</span><OP c="."/><span>experience</span>:{"\n"}
      {"    "}<FN c="print"/>(<KW c="f"/><ST c={'"{e.title} @ {e.company} ({e.date})"'}/>)
    </>,
    pubs: <><span>me</span><OP c="."/><span>publications</span><OP c="."/><FN c="bibtex"/>(<PR c="sort"/><OP c="="/><ST c="'year-desc'"/>)</>,
    skills: <>
      <span>fig</span>, <span>ax</span> <OP c="="/> <span>plt</span><OP c="."/><FN c="subplots"/>(<PR c="figsize"/><OP c="="/>(<NM c="8"/>,<NM c="4"/>)){"\n"}
      <span>ax</span><OP c="."/><FN c="barh"/>(<span>skills</span><OP c="."/><span>name</span>, <span>skills</span><OP c="."/><span>level</span>)
    </>,
    contact: <><span>me</span><OP c="."/><FN c="contact"/>()</>,
  };

  const outputFor = {
    about: <HeroOut/>,
    news: <NewsOut/>,
    exp: <ExperienceOut/>,
    pubs: <PublicationsOut/>,
    skills: <SkillsOut animate={skillsAnim}/>,
    contact: <ContactOut/>,
  };

  const mdFor = {
    title: <>
      <h1>rohit_lal_portfolio.ipynb</h1>
      <p style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--ink-mute)"}}>Last checkpoint: 2026-04-28 18:32 · Python 3 · {codeIds.length} cells</p>
      <p>A computational notebook describing <strong>Rohit Lal</strong> — Computer Scientist at NASA IMPACT.{" "}
        <span style={{display:"inline-block"}}>
          <span className="kbd">⇧ Enter</span> run+advance · <span className="kbd">Enter</span> edit · <span className="kbd">O</span> collapse output · <span className="kbd">DD</span> delete · <span className="kbd">{IS_MAC ? "⌘" : "Ctrl"} Z</span> undo · <span className="kbd">{IS_MAC ? "⌘⇧P" : "Ctrl⇧P"}</span> palette
        </span>
      </p>
    </>,
    about_md:   <h2>1 · Profile</h2>,
    news_md:    <><h2>2 · News &amp; milestones</h2><p>Recent activity. Filter or click headers to sort. Scroll the table for older entries.</p></>,
    exp_md:     <h2>3 · Experience</h2>,
    pubs_md:    <><h2>4 · Publications</h2><p><code>*</code> equal contribution. <span className="author-me">Rohit Lal</span> highlighted.</p></>,
    skills_md:  <h2>5 · Tools &amp; skills</h2>,
    contact_md: <h2>6 · Contact</h2>,
    egg_md:     <><h2>7 · &gt; <span style={{color:"var(--prompt-in)"}}>secret REPL</span></h2><p>An interactive Python-ish prompt. Try <code>help</code>, <code>import this</code>, <code>matrix()</code>, <code>confetti()</code>, <code>me.fun_fact()</code>, <code>2 + 2</code>, <code>about_me</code>.</p></>,
  };

  const commands = [
    { label: "Run All Cells", desc: "▶▶", run: runAll },
    { label: "Restart Kernel", desc: "clear state", run: restartKernel },
    { label: "Restart & Run All", desc: "fresh execute", run: () => { restartKernel(); setTimeout(runAll, 250); } },
    { label: "Undo", desc: `${MOD}+Z`, run: undo },
    { label: "Redo", desc: `${MOD}+${IS_MAC ? "⇧" : "Y"}+Z`, run: redo },
    { label: "Delete Cell", desc: "DD", run: () => deleteCell(selected) },
    { label: "Toggle Matrix Mode", desc: "easter egg", run: () => document.body.classList.toggle("matrix") },
    { label: "Confetti", desc: "🎉", run: fireConfetti },
    { label: "Go to: Profile", desc: "scroll", run: () => { setSelected("about"); document.getElementById("cell-about")?.scrollIntoView({behavior:"smooth", block:"center"}); } },
    { label: "Go to: News", desc: "scroll", run: () => { setSelected("news"); document.getElementById("cell-news")?.scrollIntoView({behavior:"smooth", block:"center"}); } },
    { label: "Go to: Experience", desc: "scroll", run: () => { setSelected("exp"); document.getElementById("cell-exp")?.scrollIntoView({behavior:"smooth", block:"center"}); } },
    { label: "Go to: Publications", desc: "scroll", run: () => { setSelected("pubs"); document.getElementById("cell-pubs")?.scrollIntoView({behavior:"smooth", block:"center"}); } },
    { label: "Go to: Skills", desc: "scroll", run: () => { setSelected("skills"); document.getElementById("cell-skills")?.scrollIntoView({behavior:"smooth", block:"center"}); } },
    { label: "Go to: REPL", desc: "easter egg", run: () => { setSelected("egg"); document.getElementById("cell-egg")?.scrollIntoView({behavior:"smooth", block:"center"}); } },
    { label: "Email Rohit", desc: "mailto:", run: () => window.location.href = "mailto:take2rohit@gmail.com" },
    { label: "Open GitHub", desc: "github.com/take2rohit", run: () => window.open("https://github.com/take2rohit/", "_blank") },
  ];

  // group consecutive deleted ghosts
  const renderGhost = (id) => {
    const at = state.deleted[id]?.atIndex ?? 0;
    return (
      <div className="cell-ghost" key={"ghost-"+id}>
        <span style={{flex:1}}>// cell '{id}' deleted at index {at}</span>
        <button onClick={undo}>{I.undo}<span style={{marginLeft:4}}>undo</span></button>
      </div>
    );
  };
  const deletedIds = Object.keys(state.deleted).filter(id => !orderIds.includes(id));

  return (
    <div>
      {/* Header */}
      <div className="nb-header">
        <div className="nb-logo"><Logo onClick={fireConfetti}/></div>
        <span className="nb-title">rohit_lal_portfolio</span>
        <span className="nb-saved">(autosaved)</span>
        <div className="nb-header-right">
          <span style={{fontSize:12.5,color:"#666",cursor:"pointer"}} onClick={()=>showHint("Logged in as guest")}>Logout</span>
          <span style={{color:"#ccc"}}>|</span>
          <span style={{fontSize:12.5,color:"#666"}}>Trusted</span>
          <span style={{color:"#ccc"}}>|</span>
          <div className={"kernel-pill" + (kernelBusy ? " busy" : "")}>
            <span>Python 3</span>
            <div className="ring"/>
          </div>
        </div>
      </div>

      {/* Menubar */}
      <div className="nb-menubar">
        <div className="menu-item" onClick={()=>showHint("File > Download as .ipynb (coming soon)")}>File</div>
        <div className="menu-item" onClick={undo}>Edit</div>
        <div className="menu-item" onClick={()=>showHint("View options")}>View</div>
        <div className="menu-item" onClick={()=>showHint("Cells: code, markdown, raw")}>Insert</div>
        <div className="menu-item" onClick={()=>runCell(selected)}>Cell</div>
        <div className="menu-item" onClick={restartKernel}>Kernel</div>
        <div className="menu-item" onClick={()=>showHint("Widgets: not enabled")}>Widgets</div>
        <div className="menu-item" onClick={()=>setShowPalette(true)}>Help</div>
      </div>

      {/* Toolbar */}
      <div className="nb-toolbar">
        <div className="tb-group">
          <button className="tb-btn" title="Save" onClick={()=>showHint("✓ Saved")}>{I.save}</button>
          <button className="tb-btn" title="Insert below" onClick={()=>showHint("Cell inserted (read-only demo)")}>{I.plus}</button>
        </div>
        <div className="tb-group">
          <button className="tb-btn" title={`Undo (${MOD}+Z)`} onClick={undo}>{I.undo}</button>
          <button className="tb-btn" title={`Redo (${MOD}+${IS_MAC?"⇧":"Y"}+Z)`} onClick={redo}>{I.redo}</button>
        </div>
        <div className="tb-group">
          <button className="tb-btn" title="Cut">{I.cut}</button>
          <button className="tb-btn" title="Copy">{I.copy}</button>
          <button className="tb-btn" title="Paste">{I.paste}</button>
        </div>
        <div className="tb-group">
          <button className="tb-btn" title="Move up">{I.up}</button>
          <button className="tb-btn" title="Move down">{I.down}</button>
        </div>
        <div className="tb-group">
          <button className="tb-btn run" title="Run (Shift+Enter)" onClick={() => { const s = selected; advanceTo(s, () => runCell(s)); }}>{I.run}<span>Run</span></button>
          <button className="tb-btn" title="Interrupt" onClick={()=>setKernelBusy(false)}>{I.stop}</button>
          <button className="tb-btn" title="Restart" onClick={restartKernel}>{I.restart}</button>
          <button className="tb-btn" title="Restart & Run All" onClick={() => { restartKernel(); setTimeout(runAll, 200); }}>{I.fast}</button>
        </div>
        <div className="tb-group">
          <button className="tb-btn" title="Delete cell (DD)" onClick={()=>deleteCell(selected)}>{I.trash}</button>
        </div>
        <select className="tb-select" defaultValue="Code"><option>Code</option><option>Markdown</option><option>Raw NBConvert</option></select>
        <div className="tb-spacer" />
        <div className="tb-status">Python 3 · {kernelBusy ? "busy" : "idle"} {editMode && "· EDIT"}</div>
      </div>

      {/* Notebook */}
      <div className="nb-page">
        <div className="nb-inner">
          {orderIds.map(id => {
            const meta = cellById[id];
            if (!meta) return null;
            const props = { selected: selected===id, onSelect: () => setSelected(id), onDelete: () => deleteCell(id) };
            if (meta.kind === "md") return <MdCell key={id} id={"cell-"+id} {...props}>{mdFor[id]}</MdCell>;
            if (meta.kind === "egg") return <EggCell key={id} id={"cell-"+id} {...props}/>;
            const promptN = state.prompts[id];
            return (
              <CodeCell key={id} id={"cell-"+id}
                {...props}
                editMode={editMode && selected===id}
                inCollapsed={!!inCollapsed[id]}
                outCollapsed={!!outCollapsed[id]}
                running={!!busy[id]}
                prompt={promptN ?? " "}
                busy={!!busy[id]}
                executed={!!executed[id]}
                onCollapseIn={() => toggleCollapseIn(id)}
                onCollapseOut={() => toggleCollapseOut(id)}
                code={codeFor[id]}
                output={outputFor[id]} />
            );
          })}
          {/* deleted ghosts at end so they don't fragment layout */}
          {deletedIds.map(renderGhost)}
        </div>
      </div>

      {/* Status / shortcut bar */}
      <div className="shortcuts-bar">
        <span><span className="kbd">⇧↵</span> run+advance</span>
        <span><span className="kbd">↵</span> edit</span>
        <span><span className="kbd">esc</span> exit</span>
        <span><span className="kbd">o</span> collapse</span>
        <span><span className="kbd">↑↓</span> nav</span>
        <span><span className="kbd">dd</span> delete</span>
        <span><span className="kbd">{IS_MAC?"⌘":"^"}Z</span> undo</span>
        <span><span className="kbd">{IS_MAC?"⌘⇧P":"^⇧P"}</span> palette</span>
        <span className="grow"/>
        <button className="help-toggle" onClick={()=>setShowPalette(true)}>command palette</button>
      </div>

      {/* mobile run FAB */}
      <button className="mobile-run-fab" title="Run" onClick={() => { const s = selected; advanceTo(s, () => runCell(s)); }}>{I.run}</button>

      {showPalette && <CommandPalette onClose={()=>setShowPalette(false)} commands={commands}/>}
      {hint && <div className="secret-hint">{hint}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
