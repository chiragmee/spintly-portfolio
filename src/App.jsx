import { useState, useEffect } from "react";

const ADMIN_EMAIL = "chirag.mewara.18@gmail.com";
const ADMIN_PASSWORD = "Spintly@Builder25";
const SK = "spintly_pf_v5";

let mem = [];
const db = {
  async load() {
    try { const r = localStorage.getItem(SK); if (r) mem = JSON.parse(r); } catch (_) {}
    return [...mem];
  },
  async save(u) {
    mem = u;
    try { localStorage.setItem(SK, JSON.stringify(u)); } catch (_) {}
  },
};

const genPw = () => {
  const c = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 12 }, () => c[Math.floor(Math.random() * c.length)]).join("");
};

const T = {
  bg: "#080808", bg2: "#0D0D0D",
  text: "#F0EBE0", dim: "#7A7060",
  gold: "#C8952A", goldd: "#E8B84B",
  bdr: "rgba(255,255,255,0.06)", bdrg: "rgba(200,149,42,0.2)",
};

function useW() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 800);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

const PD = ({ children, size, style = {} }) => (
  <span style={{ fontFamily: "Playfair Display,Georgia,serif", fontSize: size, ...style }}>{children}</span>
);
const MN = ({ children, style = {} }) => (
  <span style={{ fontFamily: "IBM Plex Mono,Courier New,monospace", ...style }}>{children}</span>
);
const Au = ({ children }) => <span style={{ color: T.gold, fontStyle: "italic" }}>{children}</span>;

const Sec = ({ id, children, bg, noBorder }) => (
  <section id={id} style={{ background: bg || T.bg, borderTop: noBorder ? "none" : `1px solid ${T.bdr}`, padding: "80px 0" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>{children}</div>
  </section>
);

const Label = ({ n, children }) => (
  <MN style={{ fontSize: 10, color: T.gold, letterSpacing: "0.28em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>
    {n && <span style={{ opacity: 0.4 }}>{n} / </span>}{children}
  </MN>
);

const ST = ({ children }) => (
  <PD size="clamp(30px,4.5vw,52px)" style={{ display: "block", fontWeight: 900, lineHeight: 1.07, marginBottom: 56, color: T.text }}>
    {children}
  </PD>
);

function Login({ onLogin }) {
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  function attempt() {
    if (!em.trim() || !pw) { setErr("Please enter your email and password."); return; }
    setBusy(true); setErr("");
    const res = onLogin(em.trim(), pw);
    if (!res.ok) { setErr(res.msg); setBusy(false); }
  }

  const inp = { display: "block", width: "100%", padding: "13px 16px", marginBottom: 12, fontSize: 14, background: "rgba(255,255,255,0.05)", border: `1px solid ${T.bdr}`, borderRadius: 6, color: T.text, fontFamily: "IBM Plex Sans,system-ui,sans-serif", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 50% -10%, rgba(200,149,42,0.07) 0%, ${T.bg} 50%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", fontFamily: "IBM Plex Sans,system-ui,sans-serif" }}>
      <MN style={{ fontSize: 10, color: T.gold, letterSpacing: "0.3em", textTransform: "uppercase", display: "block", textAlign: "center", marginBottom: 20 }}>Restricted · Built Exclusively for Spintly</MN>
      <PD size="clamp(38px,8vw,72px)" style={{ display: "block", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em", textAlign: "center", marginBottom: 10, color: T.text }}>Chirag Mewara</PD>
      <div style={{ fontSize: 13, color: "#B0A898", textAlign: "center", marginBottom: 48 }}>Product Manager · Integration Builder · Domain Expert</div>
      <div style={{ width: "100%", maxWidth: 320 }}>
        <input type="email" placeholder="Your email address" value={em} onChange={e => setEm(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()} style={inp} autoComplete="email" />
        <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()} style={inp} autoComplete="current-password" />
        {err && <div style={{ fontSize: 13, color: "#E07070", padding: "10px 14px", background: "rgba(224,112,112,0.07)", border: "1px solid rgba(224,112,112,0.15)", borderRadius: 6, marginBottom: 12 }}>{err}</div>}
        <button onClick={attempt} disabled={busy} style={{ display: "block", width: "100%", padding: "13px 0", background: busy ? "rgba(200,149,42,0.35)" : T.gold, color: "#080808", border: "none", borderRadius: 6, fontFamily: "IBM Plex Mono,monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
          {busy ? "Verifying…" : "Enter"}
        </button>
      </div>
      <div style={{ marginTop: 48, fontSize: 11, color: "#6A6050", fontFamily: "monospace" }}>No access? chirag.mewara.18@gmail.com</div>
    </div>
  );
}

function Admin({ users, onAdd, onRevoke, onClose }) {
  const [em, setEm] = useState(""); const [last, setLast] = useState(null); const [cp, setCp] = useState(false); const [cl, setCl] = useState(false);
  async function add() { if (!em.trim()) return; const r = await onAdd(em.trim()); setLast({ email: em.trim(), password: r.pw }); setEm(""); }
  function copy() { navigator.clipboard.writeText(`Portfolio\nEmail: ${last.email}\nPassword: ${last.password}`); setCp(true); setTimeout(() => setCp(false), 2000); }
  function copyLink() {
    const token = btoa(JSON.stringify({ e: last.email, p: last.password }));
    const link = `${window.location.origin}/#key=${token}`;
    navigator.clipboard.writeText(link); setCl(true); setTimeout(() => setCl(false), 2000);
  }
  const mn = { fontFamily: "IBM Plex Mono,monospace" };
  return (
    <div style={{ background: T.bg2, border: `1px solid ${T.bdr}`, borderRadius: 10, padding: 24, marginBottom: 32, fontFamily: "IBM Plex Sans,system-ui,sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div><MN style={{ fontSize: 10, color: T.gold, letterSpacing: "0.2em", display: "block", marginBottom: 4 }}>ADMIN PANEL</MN><div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>Access Control</div></div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.dim, fontSize: 22, cursor: "pointer" }}>×</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input type="email" placeholder="Email to grant access" value={em} onChange={e => setEm(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
          style={{ flex: 1, padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${T.bdr}`, borderRadius: 6, color: T.text, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />
        <button onClick={add} style={{ background: T.gold, color: "#080808", border: "none", borderRadius: 6, padding: "9px 16px", fontSize: 11, ...mn, fontWeight: 600, cursor: "pointer" }}>ADD</button>
      </div>
      {last && (
        <div style={{ background: "rgba(200,149,42,0.07)", border: `1px solid ${T.bdrg}`, borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <MN style={{ fontSize: 10, color: T.gold, display: "block", marginBottom: 8 }}>GENERATED CREDENTIALS</MN>
          <MN style={{ fontSize: 12, color: T.text, display: "block", marginBottom: 4 }}>{last.email}</MN>
          <MN style={{ fontSize: 16, color: T.goldd, fontWeight: 600, display: "block", marginBottom: 12 }}>{last.password}</MN>
          <button onClick={copy} style={{ width: "100%", padding: "8px 0", background: cp ? "rgba(80,200,100,0.1)" : "rgba(255,255,255,0.05)", border: `1px solid ${T.bdr}`, borderRadius: 6, color: cp ? "#70C880" : T.text, fontSize: 11, ...mn, cursor: "pointer", marginBottom: 6 }}>
            {cp ? "✓ Copied" : "Copy credentials"}
          </button>
          <button onClick={copyLink} style={{ width: "100%", padding: "8px 0", background: cl ? "rgba(200,149,42,0.15)" : "rgba(200,149,42,0.06)", border: `1px solid ${T.bdrg}`, borderRadius: 6, color: cl ? T.goldd : T.gold, fontSize: 11, ...mn, cursor: "pointer" }}>
            {cl ? "✓ Magic link copied" : "Copy magic link (share this)"}
          </button>
        </div>
      )}
      <div style={{ fontSize: 11, color: T.dim, marginBottom: 10 }}>ACTIVE USERS ({users.length})</div>
      {users.length === 0
        ? <div style={{ fontSize: 13, color: "#2A2520", textAlign: "center", padding: "16px 0" }}>No users yet</div>
        : users.map(u => (
          <div key={u.email} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.bdr}` }}>
            <div><div style={{ fontSize: 13, color: T.text }}>{u.email}</div>{u.last && <MN style={{ fontSize: 10, color: "#3A3028", display: "block" }}>Last: {new Date(u.last).toLocaleDateString()}</MN>}</div>
            <button onClick={() => onRevoke(u.email)} style={{ background: "none", border: `1px solid ${T.bdr}`, borderRadius: 4, color: T.dim, padding: "4px 10px", fontSize: 10, ...mn, cursor: "pointer" }}>Revoke</button>
          </div>
        ))}
    </div>
  );
}

function Nav({ isAdmin, onAdmin }) {
  const w = useW(); const mob = w < 700;
  const links = [["gaps","Gaps"],["vision","AI Vision"],["competitors","Benchmark"],["numbers","Impact"],["journey","Journey"],["proposition","The Ask"]];
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,8,8,0.97)", borderBottom: `1px solid ${T.bdr}`, padding: mob ? "12px 20px" : "14px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <MN style={{ fontSize: 11, color: T.gold, letterSpacing: "0.18em" }}>CM × SPINTLY</MN>
      {!mob && (
        <div style={{ display: "flex", gap: 22 }}>
          {links.map(([id, l]) => (
            <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "none", border: "none", color: T.dim, fontSize: 12, cursor: "pointer", fontFamily: "IBM Plex Sans,system-ui,sans-serif" }}
              onMouseEnter={e => e.target.style.color = T.text} onMouseLeave={e => e.target.style.color = T.dim}>{l}</button>
          ))}
        </div>
      )}
      {isAdmin
        ? <button onClick={onAdmin} style={{ background: "rgba(200,149,42,0.12)", border: `1px solid ${T.bdrg}`, borderRadius: 4, color: T.gold, padding: "5px 12px", fontSize: 10, fontFamily: "monospace", cursor: "pointer" }}>ADMIN</button>
        : <div />}
    </div>
  );
}

function Portfolio({ isAdmin, showAdmin, onAdmin, onCloseAdmin, users, onAdd, onRevoke }) {
  const w = useW(); const mob = w < 680;

  const two = (a, b) => (
    <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 28 : 52 }}>{a}{b}</div>
  );

  const arrow = (items, color) => items.map((t, i) => (
    <div key={i} style={{ display: "flex", gap: 11, marginBottom: 12, alignItems: "flex-start" }}>
      <span style={{ color: color || T.gold, flexShrink: 0, marginTop: 2, fontSize: 11 }}>→</span>
      <span style={{ color: T.dim, fontSize: 14, lineHeight: 1.64 }}>{t}</span>
    </div>
  ));

  return (
    <div style={{ background: T.bg, fontFamily: "IBM Plex Sans,system-ui,sans-serif", color: T.text }}>
      <Nav isAdmin={isAdmin} onAdmin={onAdmin} />

      {showAdmin && isAdmin && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0" }}>
          <Admin users={users} onAdd={onAdd} onRevoke={onRevoke} onClose={onCloseAdmin} />
        </div>
      )}

      <Sec id="hero" noBorder>
        <MN style={{ fontSize: 10, color: T.gold, letterSpacing: "0.28em", textTransform: "uppercase", display: "block", marginBottom: 28 }}>Product Manager · Integration Builder · Domain Expert</MN>
        <PD size={mob ? "52px" : "clamp(60px,10vw,108px)"} style={{ display: "block", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-0.03em", marginBottom: 36, color: T.text }}>
          I didn't<br /><Au>apply.</Au><br />I chose.
        </PD>
        <p style={{ maxWidth: 600, fontSize: mob ? 15 : 17, color: T.dim, lineHeight: 1.82, marginBottom: 40 }}>
          Accel backed you twice — seed and series. You have a $8M runway, a US channel partner push underway, a Middle East market paying 3-year upfront contracts, and a pipeline of high-value integrations — NSI, banks, EV charging companies — that nobody inside your company currently has the bandwidth to own end-to-end.
          {" "}<span style={{ color: T.text }}>I've been inside your product from the outside for 2.5 years. I know your API, your BLE mesh edge cases, your client pain, and your product gaps. This isn't a resume. It's a proposal.</span>
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 1, width: 80, background: `linear-gradient(to right,${T.gold},transparent)` }} />
          <MN style={{ fontSize: 10, color: "#2E2820", letterSpacing: "0.12em" }}>CHIRAG MEWARA · 2025</MN>
        </div>
      </Sec>

      <Sec id="snapshot" bg={T.bg2}>
        <Label n="01">Where Spintly Is Right Now</Label>
        <ST>A company at the<br /><Au>best inflection point.</Au></ST>
        <p style={{ maxWidth: 660, fontSize: 15, color: T.dim, lineHeight: 1.8, marginBottom: 44 }}>
          I know this company from the inside-out — not from a pitch deck, but from 2.5 years of building the integration that powered your product across 15 office parks. Here's what I know about where you are.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 2, marginBottom: 36 }}>
          {[
            { market: "India", tag: "Full solution market",
              items: ["Hardware + software + cloud — sold as one complete solution", "Rapidly growing access control market — you're one of the few cloud-first players", "White label deployments: Brigade, KRT, IBC, Embassy REIT", "HR integrations live: Darwinbox and others", "Camera module just launched — video capture on access-denied events"] },
            { market: "US", tag: "Hardware-first expansion",
              items: ["Selling readers only — not the full solution", "Replacing legacy wired access control readers with your wireless mesh", "Channel partner model: events in Bangalore to onboard US resellers", "No wiring = the unfair advantage — one gateway, size of your palm", "Apple Wallet live — first in India, expanding globally"] },
            { market: "Middle East", tag: "High-value on-prem contracts",
              items: ["99% of clients require on-prem — data cannot leave their servers", "3-year upfront contracts — highest contract value segment", "On-prem deployment in development — critical unlock for this market", "Oil & gas, banking, regulated industries — Spintly's next big frontier", "New hire just placed in Middle East to start understanding this market"] },
          ].map((m, i) => (
            <div key={i} style={{ padding: mob ? 22 : 32, background: "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}` }}>
              <MN style={{ fontSize: 9, color: T.gold, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", background: "rgba(200,149,42,0.1)", padding: "4px 10px", borderRadius: 3, marginBottom: 12, width: "fit-content" }}>{m.tag}</MN>
              <PD size="22px" style={{ display: "block", fontWeight: 700, marginBottom: 18, color: T.text }}>{m.market}</PD>
              {m.items.map((t, j) => (
                <div key={j} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ color: T.gold, flexShrink: 0, fontSize: 11, marginTop: 2 }}>→</span>
                  <span style={{ color: T.dim, fontSize: 13, lineHeight: 1.62 }}>{t}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: mob ? 20 : "24px 36px", background: "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}`, borderRadius: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(4,1fr)", gap: mob ? 20 : 0 }}>
            {[
              ["~115", "People in the team"],
              ["Accel", "Backed twice — seed + series"],
              ["$8M", "Series A — Series B next"],
              ["7–8", "Sales hires in progress now"],
            ].map(([n, l], i) => (
              <div key={i} style={{ padding: "16px 24px", borderRight: (!mob && i < 3) ? `1px solid ${T.bdr}` : "none" }}>
                <MN style={{ fontSize: 28, fontWeight: 300, color: T.goldd, display: "block", lineHeight: 1, marginBottom: 8 }}>{n}</MN>
                <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      <Sec id="gaps" bg={T.bg}>
        <Label n="02">The Gaps I See</Label>
        <ST>Four problems slowing<br /><Au>Spintly's 10x.</Au></ST>
        <p style={{ maxWidth: 640, fontSize: 15, color: T.dim, lineHeight: 1.78, marginBottom: 48 }}>
          2.5 years of owning the Anacity-Spintly integration gave me a view most people inside Spintly don't have — what the product actually looks like when it hits real clients, real buildings, and real failure modes.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 2 }}>
          {[
            { n: "01", tag: "Revenue Ceiling", title: "The integration bottleneck is blocking your highest-value deals",
              body: "Every high-value integration — NSI, banks, EV charging companies — requires 2–3 months of dedicated product and engineering attention. Right now this falls entirely on Shubhang and engineering simultaneously. Each integration blocks the next one. With a client like NSI closing tomorrow, and banks and more EV companies in the pipeline, this bottleneck is quietly capping your revenue ceiling.",
              fix: "I own every integration end-to-end — from requirement discovery and feasibility to delivery, rollout, and post-launch feedback loop. No handoffs. No bottlenecks. Multiple integrations running in parallel." },
            { n: "02", tag: "Client Retention Risk", title: "After onboarding, clients go into a feedback desert",
              body: "Once a client is onboarded, there's no structured loop bringing their ground-level experience back into the product roadmap. Dineer attends client meetings and translates requirements, but there's no systematic process for turning that into prioritised product decisions. Features end up being driven by whoever is loudest — US market, Middle East, or the latest sales escalation — while India enterprise clients sit on unresolved pain.",
              fix: "I will build the feedback-to-product loop — structured collection, RICE-scored prioritisation, and a quarterly client product council that feeds directly into the roadmap." },
            { n: "03", tag: "Untapped TAM", title: "Your platform solves 5 verticals. You're actively selling to 2.",
              body: "The same BLE mesh technology and cloud platform that works for commercial real estate works for colleges, schools, hospitals, co-working chains, and EV charging stations. But there's no dedicated product work translating Spintly's existing capabilities into vertical-specific feature sets, pricing, and go-to-market briefs. This is 3–5x your current addressable market sitting untouched.",
              fix: "One new vertical mapped per quarter — product delta identified, feature gaps logged, sales enablement brief built. Starting with institutions and co-working, where the pipeline already exists." },
            { n: "04", tag: "Competitive Urgency", title: "AI is your biggest differentiator. It's still on the roadmap.",
              body: "Banks are already asking Spintly for anomaly detection. Brivo shipped it. Avigilon Alta shipped it. Genetec launched NLP search in 2025. Meanwhile Spintly's NLP bar and anomaly detection are still in development. The camera module just launched — that's a foundation. But the intelligence layer on top of it is what clients in regulated industries will pay a premium for, and every quarter it stays on the roadmap is a quarter competitors pull ahead.",
              fix: "I will define the full AI product layer — anomaly engine, NLP command bar, client intelligence summaries — and drive each from spec to production using Spintly's existing access data." },
          ].map((g, i) => (
            <div key={i} style={{ padding: mob ? 22 : 36, background: "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <MN style={{ fontSize: 9, color: T.gold, letterSpacing: "0.18em", textTransform: "uppercase", background: "rgba(200,149,42,0.1)", padding: "4px 10px", borderRadius: 3 }}>{g.tag}</MN>
                <MN style={{ fontSize: 28, fontWeight: 300, color: "rgba(255,255,255,0.04)", lineHeight: 1 }}>{g.n}</MN>
              </div>
              <PD size="16px" style={{ display: "block", fontWeight: 700, marginBottom: 12, color: T.text, lineHeight: 1.35 }}>{g.title}</PD>
              <p style={{ color: T.dim, lineHeight: 1.76, fontSize: 14, marginBottom: 16 }}>{g.body}</p>
              <div style={{ borderLeft: `2px solid ${T.gold}`, paddingLeft: 14, color: T.goldd, fontSize: 13, fontFamily: "IBM Plex Mono,monospace", lineHeight: 1.6 }}>{g.fix}</div>
            </div>
          ))}
        </div>
      </Sec>

      <Sec id="vision" bg={T.bg2}>
        <Label n="03">The AI Studio Vision</Label>
        <ST>Your platform has the data.<br /><Au>I'll make it think.</Au></ST>
        <p style={{ maxWidth: 680, fontSize: 15, color: T.dim, lineHeight: 1.8, marginBottom: 48 }}>
          Spintly's platform captures millions of access events, device states, user patterns, GPS check-ins, footfall flows, and anomaly signals every day. Right now that data is stored and displayed. It isn't thinking. Here's what Year 1 looks like when it does — built on infrastructure you already have.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 2, marginBottom: 40 }}>
          {[
            { icon: "⚡", title: "Anomaly Engine", body: "Flags unusual access patterns automatically — someone accessing a restricted zone outside their schedule, repeated card-denial events at 2AM, device ping patterns suggesting hardware failure before it fails. Banks are already asking Spintly for exactly this. It's not a roadmap item. It's a live requirement from paying clients." },
            { icon: "🧠", title: "Client Intelligence Layer", body: "Each client dashboard gets an AI-generated weekly summary: 'This week, 3 doors had repeated access denials between 2–4AM. 2 users accessed restricted zones outside their assigned schedules.' Turns Spintly from a passive access control tool into a proactive security partner. This is the retention lever — and the upsell." },
            { icon: "💬", title: "NLP Command Bar", body: "'Show me everyone who accessed Floor 3 in the last 48 hours.' 'Create a temporary access pass for all visitors tomorrow.' No query. No report. No training required. The search bar Shubhang is already building — I'll drive it from idea to production-grade feature that clients actually use daily." },
            { icon: "🔧", title: "Predictive Maintenance", body: "Device health + repeated access-denial patterns + firmware states → predict hardware issues before they become client escalations. A reader that fails at 9AM Monday is a client crisis. One flagged 3 days earlier is a scheduled field visit. Enterprise clients — especially banks and oil & gas — will pay a premium for this reliability layer." },
            { icon: "🚀", title: "Integration Copilot", body: "When onboarding a new client integration — NSI, a bank, an EV charging company — AI-assisted requirement capture reduces discovery from 3 weeks to 3 days. Structured interview templates, auto-generated spec drafts, feasibility flags pulled from historical integration data. Every integration starts faster and ends cleaner." },
            { icon: "📊", title: "Space Intelligence", body: "Access data + GPS check-in + footfall + head count analytics → space utilisation insights for REITs, co-working chains, and enterprise clients. This is the feature that gets Spintly into the BMS conversation — a market 10x bigger than access control alone. Shubhang mentioned HVAC and building management as an area being explored. This is the product foundation for it." },
          ].map((f, i) => (
            <div key={i} style={{ padding: mob ? 20 : 28, background: i % 2 === 0 ? "rgba(200,149,42,0.03)" : "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}` }}>
              <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
              <PD size="16px" style={{ display: "block", fontWeight: 700, marginBottom: 10, color: T.text }}>{f.title}</PD>
              <p style={{ color: T.dim, lineHeight: 1.72, fontSize: 14 }}>{f.body}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: mob ? 22 : "28px 40px", background: "rgba(200,149,42,0.04)", border: `1px solid ${T.bdrg}`, borderRadius: 8 }}>
          <PD size="17px" style={{ display: "block", fontWeight: 700, color: T.goldd, marginBottom: 10 }}>This is not a 3-year roadmap.</PD>
          <p style={{ color: T.dim, fontSize: 15, lineHeight: 1.78, maxWidth: 740 }}>
            Each of these features is buildable on your existing Kubernetes + AWS infrastructure in 6–12 weeks with the right product definition driving it. I've shipped AI as a core execution layer before — not a demo, not a pilot, but production-grade intelligence that automated a 3-member support function entirely. I'll do it again, with far more domain context and richer access data this time.
          </p>
        </div>
      </Sec>

      <Sec id="orchestrator" bg={T.bg}>
        <Label n="04">How I'll Operate Inside Spintly</Label>
        <ST>Three swim lanes.<br /><Au>One orchestrator.</Au></ST>
        <p style={{ maxWidth: 640, fontSize: 15, color: T.dim, lineHeight: 1.8, marginBottom: 44 }}>
          The role Shubhang described — and the role that doesn't exist yet, created specifically for this conversation — is larger than product management. It sits between integration delivery, product evolution, and market expansion. Here's how I see it working.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 2, marginBottom: 36 }}>
          {[
            { n: "01", lane: "Integration Ownership Lane", color: T.gold,
              items: ["Own end-to-end lifecycle of all high-value client integrations — NSI, banks, EV charging stations", "Single point of contact between client, Shubhang, and the engineering lead — no daily dev management, but full project visibility", "Discovery → feasibility scoping → build coordination → rollout → post-launch feedback loop", "Run multiple integrations in parallel without blocking the core product roadmap", "Target: 2 major integration closures per quarter"] },
            { n: "02", lane: "Product Evolution Lane", color: T.goldd,
              items: ["Translate client pain, market signals, and Dineer's field insights into a prioritised product roadmap", "Collaborate with Waibah (Head of Product, US) on global roadmap alignment", "Drive the AI Studio features — anomaly detection, NLP bar, client intelligence — from spec to production", "Own the client feedback → product loop: structured collection, RICE prioritisation, quarterly product council", "Work alongside the product + UX team in India as both contributor and thought partner"] },
            { n: "03", lane: "Vertical Expansion Lane", color: "#D4C080",
              items: ["Map 2 new verticals per quarter — colleges, hospitals, co-working chains, regulated banking", "Define what the product needs to look like for each vertical — feature delta, compliance requirements, UX considerations", "Build go-to-market product brief for the sales team so they can sell into the vertical with confidence", "Identify which existing features translate directly and which need to be built from scratch", "Feed vertical learnings back into the core product roadmap for generalised solutions"] },
          ].map((l, i) => (
            <div key={i} style={{ padding: mob ? 22 : 32, background: "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}` }}>
              <MN style={{ fontSize: 26, fontWeight: 300, color: "rgba(255,255,255,0.04)", display: "block", lineHeight: 1, marginBottom: 12 }}>{l.n}</MN>
              <div style={{ width: 28, height: 2, background: l.color, marginBottom: 14 }} />
              <PD size="17px" style={{ display: "block", fontWeight: 700, marginBottom: 18, color: T.text }}>{l.lane}</PD>
              {l.items.map((item, j) => (
                <div key={j} style={{ display: "flex", gap: 10, marginBottom: 11, alignItems: "flex-start" }}>
                  <span style={{ color: l.color, flexShrink: 0, marginTop: 2, fontSize: 11 }}>→</span>
                  <span style={{ color: T.dim, fontSize: 13, lineHeight: 1.62 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: mob ? 20 : "26px 36px", background: "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}`, borderRadius: 8 }}>
          <PD size="14px" style={{ color: T.dim, fontStyle: "italic", lineHeight: 1.84, maxWidth: 740, display: "block" }}>
            "All three lanes feed into each other — and that's the point. A client integration at NSI surfaces a product gap. That product gap maps to a hospital or banking vertical. That vertical becomes a new roadmap item that Waibah's team can plan globally. I'm the person who sees all three simultaneously and makes sure none of them operate in isolation. That's what Shubhang described. That's what this role is."
          </PD>
        </div>
      </Sec>

      <Sec id="competitors" bg={T.bg2}>
        <Label n="05">The Benchmark</Label>
        <ST>Where the world is.<br /><Au>Where Spintly stands.</Au></ST>
        <p style={{ maxWidth: 680, fontSize: 15, color: T.dim, lineHeight: 1.8, marginBottom: 44 }}>
          The access control industry is consolidating fast. Global players are merging video + access + AI into unified platforms and shipping features that were 3-year roadmaps just 24 months ago. Here's the honest picture — and where Spintly's gaps create urgency.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 2, marginBottom: 44 }}>
          {[
            { name: "Brivo (USA)", sub: "Merged with Eagle Eye Networks Dec 2025 · World's largest AI-native physical security company · 1 billion sq ft · 80 countries · 20M users",
              items: ["AI anomaly detection — in production, not roadmap", "Eeva: AI video agent with natural language queries across footage", "Brivo Genius: NLP smart filters across events, users, and devices", "Unified video + access + visitor management + intrusion in one dashboard", "300+ integration marketplace with HR, property management, IT identity providers", "SOC2, GDPR, HIPAA certified — table stakes for US banking and healthcare", "Visitor management: self-serve kiosks, watchlist screening, compliance tracking"] },
            { name: "Avigilon Alta / Openpath (Motorola Solutions)", sub: "100% serverless cloud · AI-powered · Enterprise and regulated industries globally",
              items: ["ML-based behavioral anomaly detection — self-learning, not rule-based", "Alta Aware: native AI video analytics running in real-time on cloud", "Wave-to-unlock: hands-free entry detection, no app needed", "AI intercom with voice recognition and automatic visitor routing", "Triple Unlock: Wi-Fi + cellular + BLE simultaneously — 99.9% uptime reliability", "OTA hardware diagnostics and troubleshooting via mobile without being on-site", "Open API with a full developer portal and partner ecosystem"] },
            { name: "Kisi (USA)", sub: "Most-deployed cloud access control for offices globally · Transparent SaaS pricing",
              items: ["Published pricing tiers: $50–80/door/month — self-serve buying, not just sales-led", "Tailgating detection: alerts when someone follows an authorized user through a door", "20+ native integrations: Okta, Google Calendar, Slack, JumpCloud, Cisco Meraki", "SOC2 compliance audit trail export in CSV for regulatory requirements", "Full offline mode: credentials cached on reader and phone — works without internet", "Per-door granular audit logs exportable for compliance and investigations"] },
            { name: "ZKTeco / ESSL / Matrix (India)", sub: "Legacy hardware-first players dominating Indian mid-market and government",
              items: ["Biometric access (fingerprint + facial recognition) — embedded standard in Indian enterprise, banking, and government", "Sub-₹5,000/device price points — mass market penetration Spintly hasn't reached", "Offline-first operation — works reliably in low-connectivity environments", "Established distributor networks across tier 2 and tier 3 Indian cities", "STQC and BIS government certifications — unlocks public sector contracts Spintly currently cannot bid on"] },
          ].map((c, i) => (
            <div key={i} style={{ padding: mob ? 22 : 32, background: "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}` }}>
              <PD size="17px" style={{ display: "block", fontWeight: 700, color: T.text, marginBottom: 8 }}>{c.name}</PD>
              <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.6, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${T.bdr}` }}>{c.sub}</div>
              {c.items.map((h, j) => (
                <div key={j} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
                  <span style={{ color: "#5A9E6A", flexShrink: 0, fontSize: 11, marginTop: 2 }}>✓</span>
                  <span style={{ color: T.dim, fontSize: 13, lineHeight: 1.6 }}>{h}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <PD size="20px" style={{ display: "block", fontWeight: 700, marginBottom: 20, color: T.text }}>The Gap Table</PD>
        <div style={{ overflowX: "auto", marginBottom: 36 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 580 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.bdr}` }}>
                {["Capability", "Brivo", "Avigilon", "Kisi", "ZKTeco", "Spintly"].map((h, i) => (
                  <th key={i} style={{ padding: "11px 14px", textAlign: i === 0 ? "left" : "center", fontFamily: "IBM Plex Mono,monospace", fontSize: 10, color: i === 5 ? T.gold : T.dim, letterSpacing: "0.1em", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["AI anomaly detection","✅ Live","✅ Live","❌","❌","⚠️ Roadmap"],
                ["Unified video + access","✅ Native","✅ Native","❌","❌","⚠️ Partnered"],
                ["NLP natural language","✅ Eeva","❌","❌","❌","⚠️ In dev"],
                ["Full visitor management","✅ Envoy","✅","✅ Basic","❌","⚠️ QR only"],
                ["SOC2 / GDPR certified","✅","✅","✅","❌","❌"],
                ["Integration marketplace","✅ 300+","✅ Open","✅ 20+","❌","⚠️ Limited"],
                ["Biometric / facial","✅ Video AI","✅ At door","❌","✅ Core","❌"],
                ["Transparent pricing","✅","❌","✅","✅","❌"],
                ["Full offline mode","✅","✅","✅","✅","⚠️ Limited"],
                ["On-prem for regulated","✅","✅","❌","✅","⚠️ In dev"],
                ["Tailgating detection","✅","✅","✅","✅","❌"],
                ["BLE Mesh / no wiring","❌","❌","❌","❌","✅ Patented"],
                ["Apple / Google Wallet","✅","✅","✅","❌","✅ 1st India"],
                ["Gov certifications (India)","❌","❌","❌","✅","❌"],
              ].map(([cap, ...vals], i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${T.bdr}`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                  <td style={{ padding: "10px 14px", color: T.dim, fontSize: 13 }}>{cap}</td>
                  {vals.map((v, j) => (
                    <td key={j} style={{ padding: "10px 14px", textAlign: "center", fontFamily: "IBM Plex Mono,monospace", fontSize: 11,
                      color: j === 4
                        ? (v.startsWith("✅") ? T.goldd : v.startsWith("⚠️") ? "#C8A040" : "#804040")
                        : (v.startsWith("✅") ? "#5A9E6A" : v.startsWith("⚠️") ? "#987830" : "#4A4040") }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: mob ? 20 : "26px 36px", background: "rgba(200,149,42,0.04)", border: `1px solid ${T.bdrg}`, borderRadius: 8 }}>
          <PD size="17px" style={{ display: "block", fontWeight: 700, color: T.gold, marginBottom: 10 }}>The headline.</PD>
          <p style={{ color: T.dim, fontSize: 15, lineHeight: 1.8, maxWidth: 780 }}>
            Spintly's patented BLE Mesh and Apple Wallet first in India are genuinely world-class — no competitor has these. The product works and it works well. But the gaps in this table are not technology problems.
            {" "}<span style={{ color: T.text }}>They are product prioritisation and execution problems. SOC2 is table stakes for US banking contracts. Anomaly detection is now a client procurement requirement, not a differentiator. Government certifications unlock the entire public sector in India. Every gap in this table is a product decision. That's exactly what I'm here to solve.</span>
          </p>
        </div>
      </Sec>

      <Sec id="numbers" bg={T.bg}>
        <Label n="06">Impact in Numbers</Label>
        <ST>Outcomes, <Au>not outputs.</Au></ST>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3,1fr)", gap: mob ? "28px 18px" : "44px 40px", marginBottom: 48 }}>
          {[
            ["80K+","Active users","6 months from zero — Anacity commercial platform"],
            ["100M+","Sq ft deployed","Across premium office parks India-wide"],
            ["65%","Faster check-in","8 min → 2.8 min, 15 office parks, 1000+ daily entries"],
            ["₹6Cr+","Revenue impact","Incremental contract value across 4 marquee clients"],
            ["4","Marquee enterprise clients","Embassy REIT · KRT REIT · Brigade · MOSS Coworking"],
            ["2.5yr","Spintly integration depth","15 office parks — owned from architecture to production"],
          ].map(([n, l, s], i) => (
            <div key={i}>
              <MN style={{ fontSize: mob ? "clamp(32px,7vw,48px)" : "clamp(36px,4.5vw,58px)", fontWeight: 300, color: T.goldd, lineHeight: 1, display: "block", marginBottom: 10 }}>{n}</MN>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 5 }}>{l}</div>
              <div style={{ fontSize: 12, color: "#4A4030", lineHeight: 1.5 }}>{s}</div>
            </div>
          ))}
        </div>
        {two(
          <div style={{ padding: mob ? 20 : 28, background: "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}`, borderRadius: 8 }}>
            <PD size="16px" style={{ display: "block", fontWeight: 700, marginBottom: 12, color: T.text }}>What these mean at Spintly specifically</PD>
            <p style={{ color: T.dim, fontSize: 14, lineHeight: 1.78 }}>
              80K users in 6 months maps to your 18-month growth target in half the time. The 0→1 execution playbook I ran for Anacity's commercial vertical is exactly what Spintly needs for colleges, hospitals, and regulated industries. The ₹6 Cr across 4 enterprise clients mirrors your NSI and bank pipeline profile exactly. And the 65% check-in improvement — that came from the same Spintly integration I own.
            </p>
          </div>,
          <div style={{ padding: mob ? 20 : 28, background: "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}`, borderRadius: 8 }}>
            <PD size="16px" style={{ display: "block", fontWeight: 700, marginBottom: 12, color: T.text }}>Tools I bring on day one</PD>
            {["SQL + Python — I find friction in data before users report it", "Mixpanel, Power BI, Google Analytics — daily, not quarterly", "Figma, JIRA, Confluence — execution without ceremony", "RICE, MoSCoW, OKR — outcomes-driven prioritisation frameworks", "API and SDK integration ownership — technical feasibility is part of my brief, not separate from it"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <span style={{ color: T.gold, fontSize: 11, marginTop: 3 }}>→</span>
                <span style={{ color: T.dim, fontSize: 13, lineHeight: 1.6 }}>{t}</span>
              </div>
            ))}
          </div>
        )}
      </Sec>

      <Sec id="journey" bg={T.bg2}>
        <Label n="07">The Journey</Label>
        <ST>Not a resume.<br /><Au>Three chapters.</Au></ST>
        {[
          { n: "01", title: "The Systems Thinker", period: "Suzlon Energy · Sep 2021 – Jul 2023 · Pune",
            body: "Civil engineering teaches one thing above all else: systems fail at the edges. At Suzlon I built Python pipelines that saved the analytics team 15+ hours of manual work per week, redesigned data management across 4 project sites achieving 90% improvement in reporting accuracy, and shipped an internal resource planning MVP in just 6 weeks — with 40+ field engineers in UAT across a 200MW renewable energy portfolio. I wasn't called a PM. But defining requirements, bridging data and non-technical stakeholders, reducing operational friction at enterprise scale — that was exactly the job I was doing.",
            hl: "80% reduction in manual reporting. 200-person engineering org. 6-week MVP shipped." },
          { n: "02", title: "The Builder", period: "ANACITY by ANAROCK · Aug 2023 – Present · Bengaluru",
            body: "When I joined Anacity, the commercial product didn't exist. I ran 25+ enterprise discovery interviews, defined the full platform roadmap, coordinated engineering and design, and shipped a product that hit 80K active users across 100M sq ft of premium office space within 6 months of launch. I then led enterprise customisation for 4 marquee clients — Embassy REIT, KRT REIT, Brigade, and MOSS Coworking — managing bespoke feature requirements, enterprise SLAs, and C-suite stakeholder alignment across all four simultaneously. No dedicated project manager. No mature PM framework. Four workstreams in parallel. ₹6 Cr in incremental contract value. Best Performer FY 24–25.",
            hl: "0 → 80K active users. 0 → 100M sq ft. ₹6 Cr. 4 marquee clients. 6 months." },
          { n: "03", title: "The Bridge", period: "The Spintly Chapter · 2023 – Present",
            body: "Concurrently with building Anacity's commercial platform, I owned the complete Spintly integration across 15 office parks — from architecture understanding and BLE mesh device edge cases to production deployment and client escalation management. Nobody at Anacity understood how Spintly worked, except Ganesh and me. I fielded every access-denial anomaly, every missed unlock, every custom client requirement, every time a device firmware update broke an existing flow. That 2.5 years of outside-in depth — knowing where your product shines and exactly where it breaks — is what I'm bringing inside.",
            hl: "The only person at Anacity who truly understood how Spintly behaved in production at scale." },
        ].map((c, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "72px 1fr", gap: mob ? 0 : 40, marginBottom: 60, paddingBottom: 60, borderBottom: i < 2 ? `1px solid ${T.bdr}` : "none" }}>
            {!mob && <PD size="64px" style={{ color: "rgba(255,255,255,0.04)", fontWeight: 900, fontStyle: "italic", lineHeight: 1 }}>{c.n}</PD>}
            <div>
              {mob && <MN style={{ fontSize: 22, fontWeight: 300, color: "rgba(255,255,255,0.05)", display: "block", marginBottom: 10 }}>{c.n}</MN>}
              <MN style={{ fontSize: 10, color: "#3A3028", letterSpacing: "0.14em", display: "block", marginBottom: 10 }}>{c.period}</MN>
              <PD size="22px" style={{ display: "block", fontWeight: 700, marginBottom: 14, color: T.text }}>{c.title}</PD>
              <p style={{ color: T.dim, lineHeight: 1.84, fontSize: 15, marginBottom: 16 }}>{c.body}</p>
              <div style={{ padding: "11px 16px", background: "rgba(200,149,42,0.06)", borderLeft: `2px solid ${T.gold}`, color: T.goldd, fontSize: 13, fontFamily: "IBM Plex Mono,monospace", lineHeight: 1.6 }}>{c.hl}</div>
            </div>
          </div>
        ))}
      </Sec>

      <Sec id="workstyle" bg={T.bg}>
        <Label n="08">How I Work</Label>
        <ST>Five principles.<br /><Au>Non-negotiable.</Au></ST>
        {[
          { t: "I ask why before I ask what.", b: "Every feature request, every integration requirement, every client ask gets interrogated before I commit to building anything. The problem as stated is almost never the actual problem. Shubhang saw this clearly — and it's exactly why this conversation started." },
          { t: "I find friction in data before users report it.", b: "SQL and Python aren't resume line items — they're how I think. I built anomaly detection into my own product workflow at Anacity, finding broken onboarding flows before support tickets existed. At Spintly, I'll do the same thing with richer access data and more domain context." },
          { t: "I communicate to reduce cognitive load, not add to it.", b: "PRDs, stakeholder updates, client briefs — everything I write is designed to make the next step obvious. A PM who creates confusion is the most expensive person in the room. Managing C-suite stakeholders at Embassy REIT and Brigade taught me that clarity is the product, not a soft skill on top of it." },
          { t: "I protect engineering from noise.", b: "Good product managers create focus. I filter, prioritise, and sequence so the engineering team can build without context-switching. Managing 4 simultaneous enterprise workstreams with no dedicated project manager taught me this isn't something that happens automatically — it's a daily discipline." },
          { t: "I think in outcomes, not outputs.", b: "The question is never 'did we ship it.' It's 'did it change anything.' 80K users, 65% faster check-in, ₹6 Cr revenue impact — those are outcomes. At Spintly, the outcomes I'm after are anomaly detection in production, new verticals in pipeline, integrations closing faster, and Series B metrics moving." },
        ].map((item, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "40px 1fr", gap: mob ? 8 : 28, padding: "30px 0", borderBottom: `1px solid ${T.bdr}`, alignItems: "start" }}>
            {!mob && <MN style={{ fontSize: 13, color: T.gold, paddingTop: 3 }}>{String(i + 1).padStart(2, "0")}.</MN>}
            <div>
              <PD size="18px" style={{ display: "block", fontWeight: 700, fontStyle: "italic", marginBottom: 10, color: T.text }}>{item.t}</PD>
              <p style={{ color: T.dim, lineHeight: 1.78, fontSize: 15 }}>{item.b}</p>
            </div>
          </div>
        ))}
      </Sec>

      <Sec id="proposition" bg={T.bg2}>
        <Label n="09">The Proposition</Label>
        <ST>What I bring.<br /><Au>What I need.</Au></ST>
        {two(
          <div>
            <MN style={{ fontSize: 10, color: T.gold, letterSpacing: "0.22em", textTransform: "uppercase", display: "block", marginBottom: 22 }}>What I'm bringing in</MN>
            {arrow([
              "2.5 years of Spintly-specific domain depth — your API, BLE mesh edge cases, client pain, and product gaps — from 15 office parks",
              "0→1 enterprise product execution at 80K+ user scale across 100M sq ft — in 6 months with no dedicated framework",
              "AI-native product thinking shipped into production as a real operating layer, not a prototype or roadmap item",
              "Enterprise client management from Embassy REIT to Brigade to KRT — C-suite alignment to ground-level delivery",
              "Full-stack product sensibility: SQL, Python, Figma, JIRA, Mixpanel, Power BI — tools, not decorations",
              "Competitor benchmarking depth showing exactly which gaps create the most urgency and which create the most revenue",
              "The instinct to ask why, the patience to hear the real answer, and the speed to execute without waiting to be told",
            ])}
          </div>,
          <div>
            <MN style={{ fontSize: 10, color: T.dim, letterSpacing: "0.22em", textTransform: "uppercase", display: "block", marginBottom: 22 }}>What I'm looking for</MN>
            {arrow([
              "A product-first role with real integration ownership — not just coordination and status updates",
              "Visibility at the top: CEO, CTO, Growth Officer — the role Shubhang described was specifically not below the Head of Product",
              "Remote-first setup with cross-market exposure: India, US, and Middle East",
              "Room to define what I own, not inherit someone else's fixed brief",
              "A company in the Series A to B window — the best time in a company's life to build something that outlasts the funding cycle",
              "People who are genuinely building, not just growing — Spintly's team energy is exactly what I was looking for",
            ], "#3A3028")}
          </div>
        )}

        <div style={{ marginTop: 40, padding: mob ? 22 : "28px 40px", background: "rgba(255,255,255,0.02)", border: `1px solid ${T.bdr}`, borderRadius: 8, marginBottom: 28 }}>
          <PD size="17px" style={{ display: "block", fontWeight: 700, color: T.text, marginBottom: 14 }}>Why now. Why Spintly.</PD>
          <p style={{ color: T.dim, fontSize: 15, lineHeight: 1.84, maxWidth: 780 }}>
            Accel backed Spintly twice — seed round and series. They back companies like Flipkart and Swiggy. That's not a routine cheque — that's conviction in the team and the trajectory. The Growth Officer who just joined is a founder himself, with a previous company that also had Accel's backing. That says something about the calibre of people being brought in at the top.
            {" "}The US channel partner network is just getting started — the Bangalore partner event was a first step, not a mature motion. The Middle East is paying 3-year upfront contracts but needs on-prem to unlock it fully. And NSI is closing tomorrow with banks and EV charging companies behind it.
            {" "}<span style={{ color: T.text }}>Shubhang didn't call me because there was an open role. He called me because he knows what I can do. I've seen Spintly's product from the outside for 2.5 years. I know what it can become. I'm done watching from the outside.</span>
          </p>
        </div>

        <div style={{ padding: mob ? "32px 20px" : "52px 60px", border: `1px solid ${T.bdrg}`, background: "rgba(200,149,42,0.03)", borderRadius: 8, textAlign: "center" }}>
          <PD size={mob ? "26px" : "clamp(26px,3.5vw,44px)"} style={{ display: "block", fontWeight: 900, lineHeight: 1.12, marginBottom: 14, color: T.text }}>
            Let's build something<br /><Au>that actually matters.</Au>
          </PD>
          <p style={{ color: T.dim, fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
            The next step is a conversation with the CEO, CTO, and the Growth Officer.<br />I'm ready when Spintly is.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:chirag.mewara.18@gmail.com" style={{ background: T.gold, color: "#080808", padding: mob ? "12px 18px" : "13px 26px", fontFamily: "IBM Plex Mono,monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.07em", borderRadius: 6, textDecoration: "none" }}>
              chirag.mewara.18@gmail.com
            </a>
            <a href="tel:+919079981978" style={{ background: "transparent", color: T.text, padding: mob ? "12px 18px" : "13px 26px", fontFamily: "IBM Plex Mono,monospace", fontSize: 12, letterSpacing: "0.07em", border: `1px solid ${T.bdr}`, borderRadius: 6, textDecoration: "none" }}>
              +91 90799 81978
            </a>
          </div>
        </div>

        <div style={{ marginTop: 44, paddingTop: 24, borderTop: `1px solid ${T.bdr}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <MN style={{ fontSize: 10, color: "#20201A" }}>CHIRAG MEWARA × SPINTLY · 2025</MN>
          <MN style={{ fontSize: 10, color: "#20201A" }}>BUILT WITH INTENT. NOT JUST INTEREST.</MN>
        </div>
      </Sec>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("login");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let magic = null;
    const hash = window.location.hash;
    if (hash.startsWith("#key=")) {
      try { magic = JSON.parse(atob(hash.slice(5))); } catch (_) {}
      window.history.replaceState(null, "", window.location.pathname);
    }
    db.load().then(loaded => {
      setUsers(loaded);
      if (!magic) return;
      const { e, p } = magic;
      if (e === ADMIN_EMAIL && p === ADMIN_PASSWORD) {
        setIsAdmin(true); setScreen("portfolio"); return;
      }
      let target = loaded.find(u => u.email === e && u.password === p);
      if (!target) {
        const up = [...loaded.filter(u => u.email !== e), { email: e, password: p, created: new Date().toISOString(), last: null }];
        db.save(up); setUsers(up);
      }
      setIsAdmin(false); setScreen("portfolio");
    });
  }, []);

  function handleLogin(email, password) {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true); setScreen("portfolio"); return { ok: true };
    }
    const found = mem.find(u => u.email === email && u.password === password);
    if (found) {
      const up = mem.map(u => u.email === email ? { ...u, last: new Date().toISOString() } : u);
      db.save(up); setUsers([...up]);
      setIsAdmin(false); setScreen("portfolio"); return { ok: true };
    }
    return { ok: false, msg: "Invalid credentials. Contact Chirag for access." };
  }

  async function handleAdd(email) {
    const pw = genPw();
    const up = [...mem.filter(u => u.email !== email), { email, password: pw, created: new Date().toISOString(), last: null }];
    await db.save(up); setUsers([...up]); return { pw };
  }

  async function handleRevoke(email) {
    const up = mem.filter(u => u.email !== email);
    await db.save(up); setUsers([...up]);
  }

  if (screen === "login") return <Login onLogin={handleLogin} />;

  return (
    <Portfolio
      isAdmin={isAdmin} showAdmin={showAdmin}
      onAdmin={() => setShowAdmin(true)} onCloseAdmin={() => setShowAdmin(false)}
      users={users} onAdd={handleAdd} onRevoke={handleRevoke}
    />
  );
}
