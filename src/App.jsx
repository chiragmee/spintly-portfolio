import { useState, useEffect } from "react";

const ADMIN_EMAIL = "chirag.mewara.18@gmail.com";
const ADMIN_PASSWORD = "Spintly@Builder25";
const SESSION_KEY = "spf_session";

const C = {
  navy: "#0B2D6B",
  navyDark: "#081E4A",
  navyMid: "#1A3E8C",
  blue: "#1A56DB",
  orange: "#F97316",
  white: "#FFFFFF",
  altBg: "#F8FAFC",
  blueTint: "#EFF6FF",
  dark: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  shadowSm: "0 1px 3px rgba(0,0,0,0.08)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.08)",
};

const F = {
  sans: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
  mono: "'IBM Plex Mono','Courier New',monospace",
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

const Sec = ({ id, children, bg, style = {} }) => (
  <section id={id} style={{ background: bg || C.white, padding: "88px 0", ...style }}>
    <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px" }}>{children}</div>
  </section>
);

const Eyebrow = ({ children, color }) => (
  <div style={{
    fontFamily: F.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
    color: color || C.blue, marginBottom: 16, fontWeight: 500,
  }}>{children}</div>
);

const Tag = ({ children, color, bg }) => (
  <span style={{
    fontFamily: F.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase",
    color: color || C.blue, background: bg || C.blueTint,
    padding: "4px 10px", borderRadius: 4, display: "inline-block", marginBottom: 12,
  }}>{children}</span>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.white, borderRadius: 12, boxShadow: C.shadowSm,
    border: `1px solid ${C.border}`, ...style,
  }}>{children}</div>
);

const Bullet = ({ children, color }) => (
  <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
    <span style={{ color: color || C.blue, flexShrink: 0, marginTop: 3, fontSize: 11 }}>→</span>
    <span style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, fontFamily: F.sans }}>{children}</span>
  </div>
);

function Login({ onLogin }) {
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function attempt() {
    if (!em.trim() || !pw) { setErr("Please enter your email and password."); return; }
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em.trim(), password: pw }),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ role: data.role, email: em.trim() }));
        onLogin(data.role);
      } else {
        setErr(data.msg || "Invalid credentials.");
        setBusy(false);
      }
    } catch (_) {
      // Local-dev fallback: no API available
      if (em.trim() === ADMIN_EMAIL && pw === ADMIN_PASSWORD) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ role: "admin", email: em.trim() }));
        onLogin("admin");
      } else {
        setErr("Invalid credentials. Contact chirag.mewara.18@gmail.com for access.");
        setBusy(false);
      }
    }
  }

  const inp = {
    display: "block", width: "100%", padding: "13px 16px", marginBottom: 12,
    fontSize: 14, background: C.white, border: `1px solid ${C.border}`,
    borderRadius: 8, color: C.dark, fontFamily: F.sans, boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "60px 24px", fontFamily: F.sans,
    }}>
      <div style={{ fontFamily: F.mono, fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 24, textAlign: "center" }}>
        Restricted access — built exclusively for Spintly's leadership team
      </div>
      <div style={{ fontSize: "clamp(36px,7vw,64px)", fontWeight: 800, color: C.white, textAlign: "center", marginBottom: 10, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        Chirag Mewara
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 48, letterSpacing: "0.1em" }}>
        Product Strategy · Integration Leadership · Domain Expertise
      </div>

      <Card style={{ width: "100%", maxWidth: 360, padding: 32 }}>
        <input
          type="email" placeholder="Email address" value={em}
          onChange={e => setEm(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()}
          style={inp} autoComplete="email"
        />
        <input
          type="password" placeholder="Password" value={pw}
          onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && attempt()}
          style={inp} autoComplete="current-password"
        />
        {err && (
          <div style={{
            fontSize: 13, color: "#DC2626", padding: "10px 14px",
            background: "#FEF2F2", border: "1px solid #FECACA",
            borderRadius: 8, marginBottom: 12, lineHeight: 1.5,
          }}>{err}</div>
        )}
        <button
          onClick={attempt} disabled={busy}
          style={{
            display: "block", width: "100%", padding: "13px 0",
            background: busy ? C.muted : C.navy, color: C.white,
            border: "none", borderRadius: 8, fontFamily: F.mono,
            fontSize: 12, fontWeight: 600, letterSpacing: "0.16em",
            textTransform: "uppercase", cursor: busy ? "not-allowed" : "pointer",
          }}>
          {busy ? "Verifying…" : "Enter"}
        </button>
      </Card>

      <div style={{ marginTop: 32, fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: F.mono }}>
        No access? chirag.mewara.18@gmail.com
      </div>
    </div>
  );
}

function Nav({ isAdmin }) {
  const w = useW(); const mob = w < 680;
  const links = [
    ["snapshot","Snapshot"],["gaps","Gaps"],["vision","AI Vision"],
    ["numbers","Impact"],["journey","Background"],["proposition","Proposal"],
  ];
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100, background: C.navy,
      padding: mob ? "12px 20px" : "14px 40px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    }}>
      <span style={{ fontFamily: F.mono, fontSize: 12, color: C.white, fontWeight: 600, letterSpacing: "0.12em" }}>
        CM × SPINTLY
      </span>
      {!mob && (
        <div style={{ display: "flex", gap: 6 }}>
          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.65)",
                fontSize: 13, cursor: "pointer", fontFamily: F.sans, padding: "6px 10px",
                borderRadius: 6, transition: "color 0.15s",
              }}
              onMouseEnter={e => e.target.style.color = C.white}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.65)"}
            >{label}</button>
          ))}
        </div>
      )}
      {isAdmin
        ? <span style={{
            fontFamily: F.mono, fontSize: 10, color: C.orange,
            background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: 4, padding: "4px 10px", letterSpacing: "0.1em",
          }}>Author</span>
        : <div style={{ width: 60 }} />}
    </div>
  );
}

function Hero({ mob }) {
  return (
    <section id="hero" style={{
      background: `linear-gradient(160deg, ${C.navy} 0%, #0D3580 50%, ${C.navyMid} 100%)`,
      padding: mob ? "72px 24px 64px" : "108px 0 96px",
    }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: mob ? "0" : "0 24px" }}>
        <div style={{
          display: "inline-block", fontFamily: F.mono, fontSize: 10, color: C.orange,
          background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)",
          padding: "5px 14px", borderRadius: 4, letterSpacing: "0.2em", marginBottom: 28,
        }}>STRATEGIC PROPOSAL · 2025</div>

        <div style={{
          fontSize: mob ? "clamp(46px,12vw,64px)" : "clamp(56px,7vw,96px)",
          fontWeight: 800, color: C.white, lineHeight: 1.0, letterSpacing: "-0.03em",
          marginBottom: 16,
        }}>Chirag Mewara</div>

        <div style={{ fontFamily: F.mono, fontSize: mob ? 13 : 15, color: "rgba(255,255,255,0.6)", marginBottom: 28, letterSpacing: "0.06em" }}>
          Product Manager · Integration Leader · Access Control Expert
        </div>

        <p style={{ maxWidth: 680, fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.82, marginBottom: 40 }}>
          Over 2.5 years of deploying Spintly's platform across 15 enterprise office parks has produced something rare: an expert who understands the product from the outside in.{" "}
          <span style={{ color: C.white }}>This proposal maps that depth directly to Spintly's next chapter — AI product leadership, high-value integration ownership, and vertical market expansion.</span>
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 56 }}>
          <button
            onClick={() => document.getElementById("snapshot")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: C.blue, color: C.white, border: "none",
              borderRadius: 8, padding: "14px 28px", fontSize: 14, fontWeight: 600,
              fontFamily: F.sans, cursor: "pointer",
            }}>
            View Full Proposal ↓
          </button>
          <a href="mailto:chirag.mewara.18@gmail.com" style={{
            background: "transparent", color: C.white,
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 8, padding: "14px 28px", fontSize: 14,
            fontFamily: F.sans, textDecoration: "none", fontWeight: 500,
          }}>
            chirag.mewara.18@gmail.com
          </a>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 28,
          display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)", gap: mob ? 20 : 0,
        }}>
          {[
            ["~115 team", "People building Spintly"],
            ["Accel-backed × 2", "Seed round + Series A"],
            ["$8M Series A", "Series B next"],
            ["3 active markets", "India · US · Middle East"],
          ].map(([n, l], i) => (
            <div key={i} style={{ padding: mob ? "0" : "0 24px", borderRight: (!mob && i < 3) ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
              <div style={{ fontFamily: F.mono, fontSize: mob ? 18 : 22, fontWeight: 600, color: C.white, marginBottom: 6 }}>{n}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Snapshot({ mob }) {
  const markets = [
    {
      title: "India", tag: "Full solution market",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
      items: [
        "Hardware + software + cloud sold as one complete solution",
        "Cloud-first access control — one of few in a rapidly growing market",
        "White-label: Brigade, KRT, IBC, Embassy REIT",
        "HR integrations live — Darwinbox and others",
        "Camera module launched — video on access-denied events",
      ],
    },
    {
      title: "United States", tag: "Hardware-first expansion",
      img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=600&q=80",
      items: [
        "Selling readers only — not the full solution stack",
        "Replacing legacy wired systems with wireless mesh",
        "Channel partner model via resellers",
        "No wiring = the hardware advantage — one gateway, palm-sized",
        "Apple Wallet live — first in India, expanding globally",
      ],
    },
    {
      title: "Middle East", tag: "High-value on-prem",
      img: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=600&q=80",
      items: [
        "99% of clients require on-prem data sovereignty",
        "3-year upfront contracts — highest value segment",
        "On-prem deployment in development — critical market unlock",
        "Oil & gas, banking, regulated industries",
        "New regional hire placed to develop this market",
      ],
    },
  ];

  return (
    <Sec id="snapshot" bg={C.white}>
      <Eyebrow>01 / Where Spintly Stands Today</Eyebrow>
      <h2 style={{ fontSize: mob ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,48px)", fontWeight: 800, color: C.dark, marginBottom: 20, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
        A company at its most consequential inflection point
      </h2>
      <p style={{ maxWidth: 680, fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 52 }}>
        Backed twice by Accel and operating simultaneously across India, the US, and the Middle East, Spintly is building toward Series B with a product and market position that few access control companies have achieved.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 24, marginBottom: 40 }}>
        {markets.map((m, i) => (
          <Card key={i} style={{ overflow: "hidden" }}>
            <img src={m.img} alt={m.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
            <div style={{ padding: 24 }}>
              <Tag>{m.tag}</Tag>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 16 }}>{m.title}</div>
              {m.items.map((t, j) => <Bullet key={j}>{t}</Bullet>)}
            </div>
          </Card>
        ))}
      </div>

      <div style={{
        background: C.navy, borderRadius: 12, padding: mob ? "24px 20px" : "28px 40px",
        display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4,1fr)", gap: mob ? 20 : 0,
      }}>
        {[
          ["~115 people", "Across India · US · Middle East"],
          ["Accel seed + series", "Two rounds of conviction"],
          ["$8M Series A", "Series B trajectory"],
          ["7–8 sales hires", "Active hiring in progress"],
        ].map(([n, l], i) => (
          <div key={i} style={{ padding: mob ? "0" : "0 24px", borderRight: (!mob && i < 3) ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
            <div style={{ fontFamily: F.mono, fontSize: mob ? 16 : 20, fontWeight: 600, color: C.white, marginBottom: 6 }}>{n}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{l}</div>
          </div>
        ))}
      </div>
    </Sec>
  );
}

function Gaps({ mob }) {
  const gaps = [
    {
      tag: "Revenue Ceiling",
      title: "The integration bottleneck is blocking Spintly's highest-value deals",
      body: "Every high-value integration — NSI, banks, EV charging companies — requires 2–3 months of dedicated product and engineering attention. The product leadership and engineering team carry this entirely. Each integration delays the next. With multiple high-value clients in the pipeline, this bottleneck is quietly capping Spintly's revenue ceiling.",
      fix: "End-to-end integration ownership — from requirement discovery to delivery, rollout, and post-launch loop. No handoffs. No bottlenecks. Multiple integrations running in parallel.",
    },
    {
      tag: "Retention Risk",
      title: "After onboarding, clients go into a feedback desert",
      body: "Once a client is onboarded, there is no structured loop bringing their ground-level experience back into the product roadmap. The client success team attends meetings and translates requirements, but there is no systematic process for converting that into prioritised product decisions.",
      fix: "A feedback-to-product loop — structured collection, RICE-scored prioritisation, and a quarterly client product council that feeds directly into the roadmap.",
    },
    {
      tag: "Untapped TAM",
      title: "Spintly's platform solves 5 verticals. It is actively selling to 2.",
      body: "The same BLE mesh technology and cloud platform that works for commercial real estate works for colleges, schools, hospitals, co-working chains, and EV charging stations. No dedicated product work translates Spintly's existing capabilities into vertical-specific feature sets, pricing, or go-to-market briefs. This is 3–5× the current addressable market.",
      fix: "One new vertical mapped per quarter — product delta identified, feature gaps logged, sales enablement brief built. Starting with institutions and co-working, where the pipeline already exists.",
    },
    {
      tag: "Competitive Urgency",
      title: "AI is Spintly's biggest differentiator. It is still on the roadmap.",
      body: "Banks are already asking Spintly for anomaly detection. Competitors have shipped it. NLP search launched in the industry in 2025. Spintly's NLP bar and anomaly detection are in development. The camera module just launched — that is the foundation. But the intelligence layer on top is what regulated-industry clients pay a premium for, and every quarter it stays on the roadmap is a quarter competitors pull ahead.",
      fix: "Define and drive the full AI product layer — anomaly engine, NLP command bar, client intelligence summaries — from spec to production using Spintly's existing access data.",
    },
  ];

  return (
    <Sec id="gaps" bg={C.blueTint}>
      <Eyebrow>02 / The Strategic Opportunity</Eyebrow>
      <h2 style={{ fontSize: mob ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,48px)", fontWeight: 800, color: C.dark, marginBottom: 20, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
        Four problems quietly capping Spintly's next step
      </h2>
      <p style={{ maxWidth: 680, fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 52 }}>
        2.5 years of owning the Anacity–Spintly integration across 15 office parks produced a perspective most observers don't have: what the product actually looks like when it hits real clients, real buildings, and real failure modes.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 24 }}>
        {gaps.map((g, i) => (
          <Card key={i} style={{ padding: mob ? 24 : 32 }}>
            <Tag color={C.orange} bg="rgba(249,115,22,0.1)">{g.tag}</Tag>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 12, lineHeight: 1.35 }}>{g.title}</h3>
            <p style={{ color: C.muted, lineHeight: 1.78, fontSize: 14, marginBottom: 20 }}>{g.body}</p>
            <div style={{
              borderLeft: `3px solid ${C.blue}`, paddingLeft: 16,
              color: C.navy, fontSize: 13, fontFamily: F.sans, lineHeight: 1.65, fontWeight: 500,
            }}>{g.fix}</div>
          </Card>
        ))}
      </div>
    </Sec>
  );
}

function AIVision({ mob }) {
  const features = [
    { icon: "⚡", title: "Anomaly Engine", body: "Flags unusual patterns — restricted zone access outside schedule, repeated card-denial events at 2AM, device ping patterns suggesting hardware failure before it fails. Banks are already requesting this. It is not a roadmap item — it is a live procurement requirement from paying clients." },
    { icon: "🧠", title: "Client Intelligence Layer", body: "AI-generated weekly summaries per client dashboard. \"3 doors had repeated access denials between 2–4AM this week. 2 users accessed restricted zones outside assigned schedules.\" Turns Spintly from a passive tool into a proactive security partner — and the primary upsell mechanism." },
    { icon: "💬", title: "NLP Command Bar", body: "\"Show everyone who accessed Floor 3 in the last 48 hours.\" No query builder. No report wizard. No training required. The NLP bar Spintly is already building — driven from idea to production-grade feature that clients use daily." },
    { icon: "🔧", title: "Predictive Maintenance", body: "Device health + access-denial patterns + firmware states → predict hardware failures before they become client escalations. A reader that fails at 9AM Monday is a client crisis. One flagged 3 days earlier is a scheduled field visit. Enterprise clients will pay a premium for this reliability layer." },
    { icon: "🚀", title: "Integration Copilot", body: "AI-assisted requirement capture reduces discovery from 3 weeks to 3 days. Structured templates, auto-generated spec drafts, feasibility flags from historical integration data. Every integration starts faster and finishes cleaner." },
    { icon: "📊", title: "Space Intelligence", body: "Access data + GPS check-in + footfall + headcount → space utilisation insights for REITs, co-working chains, and enterprise clients. The feature that moves Spintly into the BMS conversation — a market 10× bigger than access control alone." },
  ];

  return (
    <section id="vision" style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`, padding: mob ? "72px 24px" : "88px 0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: mob ? "0" : "0 24px" }}>
        <Eyebrow color={C.orange}>03 / The Intelligence Layer</Eyebrow>
        <h2 style={{ fontSize: mob ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,48px)", fontWeight: 800, color: C.white, marginBottom: 20, lineHeight: 1.12, letterSpacing: "-0.02em", maxWidth: 760 }}>
          Spintly's platform generates millions of access events daily. That data isn't yet thinking.
        </h2>
        <p style={{ maxWidth: 680, fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 52 }}>
          Every access event, device state, GPS check-in, footfall flow, and anomaly signal is captured. Right now it is stored and displayed. Here is what it looks like when it starts to reason — built on infrastructure Spintly already has.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
          {features.map((f, i) => (
            <Card key={i} style={{ padding: mob ? 20 : 28 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.dark, marginBottom: 10 }}>{f.title}</div>
              <p style={{ color: C.muted, lineHeight: 1.72, fontSize: 14, margin: 0 }}>{f.body}</p>
            </Card>
          ))}
        </div>

        <div style={{
          border: `2px solid ${C.blue}`, borderRadius: 12,
          padding: mob ? 22 : "28px 40px", background: "rgba(26,86,219,0.08)",
        }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 10 }}>This is not a 3-year roadmap.</div>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 1.78, maxWidth: 780, margin: 0 }}>
            Each of these features is buildable on Spintly's existing Kubernetes + AWS infrastructure in 6–12 weeks with the right product definition. Chirag has shipped AI as a production operating layer before — not a demo or a pilot, but intelligence that replaced a 3-person support function entirely.
          </p>
        </div>
      </div>
    </section>
  );
}

function RoleModel({ mob }) {
  const lanes = [
    {
      accentColor: C.blue, title: "Integration Ownership",
      items: [
        "End-to-end lifecycle of all high-value client integrations",
        "Single point of contact between client, engineering, and product leadership",
        "Discovery → feasibility → build coordination → rollout → post-launch loop",
        "Multiple integrations in parallel without blocking the core roadmap",
        "Target: 2 major integration closures per quarter",
      ],
    },
    {
      accentColor: C.navy, title: "Product Evolution",
      items: [
        "Client pain, market signals, and field insights → prioritised product roadmap",
        "Alignment with the US Head of Product on global roadmap",
        "Drive the AI Studio features — anomaly detection, NLP bar, client intelligence — from spec to production",
        "Own the client feedback → product loop: RICE prioritisation, quarterly product council",
        "Contributor and thought partner to India product + UX team",
      ],
    },
    {
      accentColor: C.orange, title: "Vertical Expansion",
      items: [
        "2 new verticals mapped per quarter — colleges, hospitals, co-working, regulated banking",
        "Define the product delta for each vertical — feature requirements, compliance, UX",
        "Build go-to-market product briefs so the sales team can sell into the vertical with confidence",
        "Feed vertical learnings back into the core roadmap for generalised solutions",
      ],
    },
  ];

  return (
    <Sec id="role" bg={C.white}>
      <Eyebrow>04 / The Operating Model</Eyebrow>
      <h2 style={{ fontSize: mob ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,48px)", fontWeight: 800, color: C.dark, marginBottom: 20, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
        Three swim lanes. One product leader.
      </h2>
      <p style={{ maxWidth: 680, fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 52 }}>
        The role sits between integration delivery, product evolution, and market expansion — three workstreams that currently have no single owner. Here is how each lane runs.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 24 }}>
        {lanes.map((lane, i) => (
          <Card key={i} style={{ overflow: "hidden" }}>
            <div style={{ height: 4, background: lane.accentColor }} />
            <div style={{ padding: mob ? 22 : 28 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 18 }}>{lane.title}</div>
              {lane.items.map((item, j) => <Bullet key={j} color={lane.accentColor}>{item}</Bullet>)}
            </div>
          </Card>
        ))}
      </div>
    </Sec>
  );
}

function Benchmark({ mob }) {
  const competitors = [
    {
      name: "Brivo (USA)",
      sub: "Merged with Eagle Eye Networks Dec 2025 · World's largest AI-native physical security company · 1 billion sq ft · 80 countries · 20M users",
      items: [
        "AI anomaly detection — in production, not roadmap",
        "Eeva: AI video agent with natural language queries across footage",
        "Brivo Genius: NLP smart filters across events, users, and devices",
        "Unified video + access + visitor management + intrusion in one dashboard",
        "300+ integration marketplace with HR, property management, IT identity providers",
        "SOC2, GDPR, HIPAA certified — table stakes for US banking and healthcare",
        "Visitor management: self-serve kiosks, watchlist screening, compliance tracking",
      ],
    },
    {
      name: "Avigilon Alta (Motorola Solutions)",
      sub: "100% serverless cloud · AI-powered · Enterprise and regulated industries globally",
      items: [
        "ML-based behavioral anomaly detection — self-learning, not rule-based",
        "Alta Aware: native AI video analytics running in real-time on cloud",
        "Wave-to-unlock: hands-free entry detection, no app needed",
        "AI intercom with voice recognition and automatic visitor routing",
        "Triple Unlock: Wi-Fi + cellular + BLE simultaneously — 99.9% uptime reliability",
        "OTA hardware diagnostics and troubleshooting via mobile without being on-site",
        "Open API with a full developer portal and partner ecosystem",
      ],
    },
    {
      name: "Kisi (USA)",
      sub: "Most-deployed cloud access control for offices globally · Transparent SaaS pricing",
      items: [
        "Published pricing tiers: $50–80/door/month — self-serve buying, not just sales-led",
        "Tailgating detection: alerts when someone follows an authorized user through a door",
        "20+ native integrations: Okta, Google Calendar, Slack, JumpCloud, Cisco Meraki",
        "SOC2 compliance audit trail export in CSV for regulatory requirements",
        "Full offline mode: credentials cached on reader and phone — works without internet",
        "Per-door granular audit logs exportable for compliance and investigations",
      ],
    },
    {
      name: "ZKTeco / ESSL / Matrix (India)",
      sub: "Legacy hardware-first players dominating Indian mid-market and government",
      items: [
        "Biometric access (fingerprint + facial recognition) — embedded standard in Indian enterprise",
        "Sub-₹5,000/device price points — mass market penetration",
        "Offline-first operation — works reliably in low-connectivity environments",
        "Established distributor networks across tier 2 and tier 3 Indian cities",
        "STQC and BIS government certifications — unlocks public sector contracts",
      ],
    },
  ];

  const tableRows = [
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
  ];

  return (
    <Sec id="competitors" bg={C.altBg}>
      <Eyebrow>05 / The Competitive Landscape</Eyebrow>
      <h2 style={{ fontSize: mob ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,48px)", fontWeight: 800, color: C.dark, marginBottom: 20, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
        Where global competitors stand — and where Spintly's gaps create urgency
      </h2>
      <p style={{ maxWidth: 680, fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 52 }}>
        The access control industry is consolidating around unified video + access + AI platforms. Here is the honest picture.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 24, marginBottom: 44 }}>
        {competitors.map((c, i) => (
          <Card key={i} style={{ padding: mob ? 22 : 28 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 8 }}>{c.name}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>{c.sub}</div>
            {c.items.map((h, j) => (
              <div key={j} style={{ display: "flex", gap: 10, marginBottom: 9, alignItems: "flex-start" }}>
                <span style={{ color: "#16A34A", flexShrink: 0, fontSize: 11, marginTop: 2 }}>✓</span>
                <span style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, fontFamily: F.sans }}>{h}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>

      <div style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 20 }}>The Gap Table</div>
      <div style={{ overflowX: "auto", marginBottom: 36, borderRadius: 12, boxShadow: C.shadowSm, border: `1px solid ${C.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 580, background: C.white }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}`, background: C.altBg }}>
              {["Capability", "Brivo", "Avigilon", "Kisi", "ZKTeco", "Spintly"].map((h, i) => (
                <th key={i} style={{
                  padding: "12px 16px", textAlign: i === 0 ? "left" : "center",
                  fontFamily: F.mono, fontSize: 10, color: i === 5 ? C.blue : C.muted,
                  letterSpacing: "0.1em", fontWeight: 600, whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map(([cap, ...vals], i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.white : C.altBg }}>
                <td style={{ padding: "10px 16px", color: C.dark, fontSize: 13 }}>{cap}</td>
                {vals.map((v, j) => (
                  <td key={j} style={{
                    padding: "10px 16px", textAlign: "center", fontFamily: F.mono, fontSize: 11,
                    color: j === 4
                      ? (v.startsWith("✅") ? C.blue : v.startsWith("⚠️") ? C.orange : "#DC2626")
                      : (v.startsWith("✅") ? "#16A34A" : v.startsWith("⚠️") ? "#D97706" : "#9CA3AF"),
                  }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card style={{ padding: mob ? 22 : "28px 36px" }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.dark, marginBottom: 12 }}>Spintly's patented BLE Mesh and Apple Wallet first-in-India are genuinely world-class — no competitor matches these.</div>
        <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.8, maxWidth: 780, margin: 0 }}>
          The gaps in this table are not technology problems.{" "}
          <span style={{ color: C.dark, fontWeight: 500 }}>They are product prioritisation and execution problems. Every gap is a product decision.</span>
        </p>
      </Card>
    </Sec>
  );
}

function Numbers({ mob }) {
  const metrics = [
    { n: "80K+", label: "Active Users", sub: "6 months from zero — Anacity commercial platform" },
    { n: "100M+", label: "Sq Ft Deployed", sub: "Across premium office parks India-wide" },
    { n: "65%", label: "Faster Check-in", sub: "8 min → 2.8 min across 15 office parks, 1,000+ daily entries" },
    { n: "4", label: "Marquee Enterprise Clients", sub: "Embassy REIT · KRT REIT · Brigade · MOSS Coworking" },
    { n: "2.5yr", label: "Spintly Integration Depth", sub: "15 office parks — from architecture to production" },
  ];

  return (
    <section id="numbers" style={{ background: `linear-gradient(135deg, ${C.navy} 0%, #1A3E8C 100%)`, padding: mob ? "72px 24px" : "88px 0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: mob ? "0" : "0 24px" }}>
        <Eyebrow color={C.orange}>06 / Outcomes at Scale</Eyebrow>
        <h2 style={{ fontSize: mob ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,48px)", fontWeight: 800, color: C.white, marginBottom: 52, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
          Numbers that translate directly to Spintly's pipeline
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5,1fr)", gap: mob ? 20 : 16 }}>
          {metrics.map((m, i) => (
            <Card key={i} style={{ padding: mob ? 20 : 24, textAlign: "center" }}>
              <div style={{ fontFamily: F.mono, fontSize: mob ? 28 : "clamp(28px,3vw,40px)", fontWeight: 700, color: C.navy, marginBottom: 8, lineHeight: 1 }}>{m.n}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{m.sub}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Background({ mob }) {
  const chapters = [
    {
      n: "01", tag: "The Systems Thinker",
      period: "Suzlon Energy · Sep 2021 – Jul 2023 · Pune",
      body: "At Suzlon Energy, Chirag built Python pipelines that saved the analytics team 15+ hours of manual work per week, redesigned data management across 4 project sites achieving 90% improvement in reporting accuracy, and shipped an internal resource planning MVP in 6 weeks — with 40+ field engineers in UAT across a 200MW renewable energy portfolio. The work was operational and data-heavy, but the discipline was product: defining requirements, bridging data and non-technical stakeholders, reducing friction at enterprise scale.",
      hl: "80% reduction in manual reporting. 200-person engineering organisation. 6-week MVP shipped.",
    },
    {
      n: "02", tag: "The Builder",
      period: "ANACITY by ANAROCK · Aug 2023 – Present · Bengaluru",
      body: "When Chirag joined Anacity, the commercial product did not exist. Chirag ran 25+ enterprise discovery interviews, defined the full platform roadmap, coordinated engineering and design, and shipped a product that reached 80K active users across 100M sq ft of premium office space within 6 months of launch. Chirag then led enterprise customisation for 4 marquee clients — Embassy REIT, KRT REIT, Brigade, and MOSS Coworking — managing bespoke feature requirements, enterprise SLAs, and C-suite stakeholder alignment across all four simultaneously.",
      hl: "0 → 80K active users. 0 → 100M sq ft. 4 marquee clients. 6 months.",
    },
    {
      n: "03", tag: "The Bridge",
      period: "The Spintly Integration · 2023 – Present",
      body: "Concurrently with building Anacity's commercial platform, Chirag owned the complete Spintly integration across 15 office parks — from understanding the BLE mesh architecture and device edge cases to production deployment and client escalation management. Chirag fielded every access-denial anomaly, every missed unlock, every custom client requirement, every firmware update that broke an existing flow. That 2.5 years of outside-in depth — knowing precisely where the product excels and where it breaks — is what this proposal brings inside.",
      hl: "The only person at Anacity who truly understood how Spintly behaved in production at scale.",
    },
  ];

  return (
    <Sec id="journey" bg={C.white}>
      <Eyebrow>07 / Professional Background</Eyebrow>
      <h2 style={{ fontSize: mob ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,48px)", fontWeight: 800, color: C.dark, marginBottom: 52, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
        Three chapters that built this perspective
      </h2>

      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: mob ? 0 : 24, top: 8, bottom: 8, width: 3, background: `linear-gradient(to bottom, ${C.blue}, ${C.navy})`, borderRadius: 2 }} />
        {chapters.map((c, i) => (
          <div key={i} style={{
            paddingLeft: mob ? 24 : 72, marginBottom: 56, paddingBottom: 56,
            borderBottom: i < chapters.length - 1 ? `1px solid ${C.border}` : "none",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", left: mob ? -5 : 15, top: 4,
              width: 16, height: 16, borderRadius: "50%",
              background: C.blue, border: `3px solid ${C.white}`,
              boxShadow: `0 0 0 2px ${C.blue}`,
            }} />
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, letterSpacing: "0.1em", marginBottom: 8 }}>{c.period}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.dark, marginBottom: 14 }}>{c.tag}</div>
            <p style={{ color: C.muted, lineHeight: 1.84, fontSize: 15, marginBottom: 16 }}>{c.body}</p>
            <div style={{
              padding: "12px 18px", background: C.blueTint,
              borderLeft: `3px solid ${C.blue}`, borderRadius: "0 8px 8px 0",
              color: C.navy, fontSize: 13, fontFamily: F.mono, lineHeight: 1.6, fontWeight: 500,
            }}>{c.hl}</div>
          </div>
        ))}
      </div>
    </Sec>
  );
}

function Principles({ mob }) {
  const items = [
    { t: "Asks why before asking what.", b: "Every feature request, integration requirement, and client ask gets interrogated before committing to build anything. The problem as stated is almost never the actual problem." },
    { t: "Finds friction in data before users report it.", b: "SQL and Python are not resume line items — they are how Chirag thinks. Anomaly detection was built into Anacity's own product workflow, finding broken onboarding flows before support tickets existed." },
    { t: "Communicates to reduce cognitive load, not add to it.", b: "PRDs, stakeholder updates, client briefs — everything is designed to make the next step obvious. A PM who creates confusion is the most expensive person in the room." },
    { t: "Protects engineering from noise.", b: "Good product managers create focus. Chirag filters, prioritises, and sequences so the engineering team can build without context-switching. Managing 4 simultaneous enterprise workstreams with no dedicated project manager required this as a daily discipline." },
    { t: "Thinks in outcomes, not outputs.", b: "The question is never 'did we ship it.' It is 'did it change anything.' 80K users, 65% faster check-in — those are outcomes. At Spintly, the outcomes in scope are anomaly detection in production, new verticals in pipeline, integrations closing faster, and Series B metrics moving." },
  ];

  return (
    <Sec id="principles" bg={C.altBg}>
      <Eyebrow>08 / Working Principles</Eyebrow>
      <h2 style={{ fontSize: mob ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,48px)", fontWeight: 800, color: C.dark, marginBottom: 52, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
        Five non-negotiables
      </h2>

      {items.map((item, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : "56px 1fr", gap: mob ? 8 : 28,
          padding: "28px 0", borderBottom: `1px solid ${C.border}`, alignItems: "start",
        }}>
          {!mob && (
            <div style={{ fontFamily: F.mono, fontSize: 20, fontWeight: 700, color: C.blue, paddingTop: 2 }}>
              {String(i + 1).padStart(2, "0")}.
            </div>
          )}
          <div>
            {mob && <div style={{ fontFamily: F.mono, fontSize: 13, color: C.blue, marginBottom: 6 }}>{String(i + 1).padStart(2, "0")}.</div>}
            <div style={{ fontSize: 18, fontWeight: 700, color: C.dark, marginBottom: 10, lineHeight: 1.35 }}>{item.t}</div>
            <p style={{ color: C.muted, lineHeight: 1.78, fontSize: 15, margin: 0 }}>{item.b}</p>
          </div>
        </div>
      ))}
    </Sec>
  );
}

function Proposition({ mob }) {
  const brings = [
    "2.5 years of Spintly-specific domain depth — API behaviour, BLE mesh edge cases, client pain, and product gaps — from 15 office parks in production",
    "0→1 enterprise product execution at 80K+ user scale across 100M sq ft — in 6 months with no dedicated PM framework",
    "AI shipped as a production operating layer — not a demo, not a pilot, but intelligence that replaced a 3-person support function",
    "Enterprise client management from Embassy REIT to Brigade — C-suite alignment to ground-level delivery",
    "Full-stack product sensibility: SQL, Python, Figma, JIRA, Mixpanel, Power BI",
    "Competitor benchmarking depth identifying exactly which gaps create the most revenue urgency",
  ];
  const requires = [
    "A product-first remit with real integration ownership — not coordination and status updates",
    "Reporting visibility to senior leadership — specifically not below Head of Product level",
    "Remote-first setup with cross-market exposure: India, US, and Middle East",
    "Room to define scope rather than inherit a fixed brief",
    "The Series A-to-B window — the best time to build something that outlasts the funding cycle",
    "A team that is genuinely building, not just growing",
  ];

  return (
    <section id="proposition" style={{ background: C.navy, padding: mob ? "72px 24px" : "88px 0" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: mob ? "0" : "0 24px" }}>
        <Eyebrow color={C.orange}>09 / The Proposition</Eyebrow>
        <h2 style={{ fontSize: mob ? "clamp(26px,6vw,36px)" : "clamp(30px,4vw,48px)", fontWeight: 800, color: C.white, marginBottom: 52, lineHeight: 1.12, letterSpacing: "-0.02em" }}>
          What this partnership looks like
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 32, marginBottom: 40 }}>
          <Card style={{ padding: mob ? 24 : 32 }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.blue, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>What Chirag Brings</div>
            {brings.map((t, i) => <Bullet key={i} color={C.blue}>{t}</Bullet>)}
          </Card>
          <Card style={{ padding: mob ? 24 : 32, background: C.altBg }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 20 }}>What the Role Requires</div>
            {requires.map((t, i) => <Bullet key={i} color={C.muted}>{t}</Bullet>)}
          </Card>
        </div>

        <Card style={{ padding: mob ? 24 : "32px 40px", marginBottom: 40 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.dark, marginBottom: 14 }}>Why This Moment</div>
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.84, maxWidth: 780, margin: 0 }}>
            Accel backed Spintly at seed and again at series. The Growth Officer recently placed is a founder with Accel backing of their own — a signal about the calibre of leadership being assembled at the top. The US channel partner motion is in its early stages. The Middle East is paying 3-year upfront contracts but needs on-prem to unlock fully. NSI and banks are in the integration pipeline.{" "}
            <span style={{ color: C.dark, fontWeight: 500 }}>The next Product hire is not a mid-level PM managing tickets — it is the person who owns the integrations, the AI layer, and the vertical expansion that gets Spintly to Series B. That is what this proposal is.</span>
          </p>
        </Card>

        <div style={{
          borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.05)", padding: mob ? "36px 24px" : "56px 60px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: mob ? 28 : "clamp(28px,4vw,44px)", fontWeight: 800, color: C.white, lineHeight: 1.12, marginBottom: 14, letterSpacing: "-0.02em" }}>
            Let's build something that actually matters.
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Reach out directly to start the conversation.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:chirag.mewara.18@gmail.com" style={{
              background: C.blue, color: C.white,
              padding: mob ? "12px 18px" : "14px 28px",
              fontFamily: F.mono, fontSize: 12, fontWeight: 600,
              letterSpacing: "0.06em", borderRadius: 8, textDecoration: "none",
            }}>chirag.mewara.18@gmail.com</a>
            <a href="tel:+919079981978" style={{
              background: "transparent", color: C.white,
              padding: mob ? "12px 18px" : "14px 28px",
              fontFamily: F.mono, fontSize: 12, letterSpacing: "0.06em",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, textDecoration: "none",
            }}>+91 90799 81978</a>
          </div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: F.mono, fontSize: 10, color: "rgba(255,255,255,0.25)" }}>CHIRAG MEWARA × SPINTLY · 2025</span>
          <span style={{ fontFamily: F.mono, fontSize: 10, color: "rgba(255,255,255,0.25)" }}>BUILT WITH INTENT.</span>
        </div>
      </div>
    </section>
  );
}

function Portfolio({ role }) {
  const w = useW(); const mob = w < 680;
  const isAdmin = role === "admin";

  return (
    <div style={{ background: C.white, fontFamily: F.sans, color: C.dark }}>
      <Nav isAdmin={isAdmin} />
      <Hero mob={mob} />
      <Snapshot mob={mob} />
      <Gaps mob={mob} />
      <AIVision mob={mob} />
      <RoleModel mob={mob} />
      <Benchmark mob={mob} />
      <Numbers mob={mob} />
      <Background mob={mob} />
      <Principles mob={mob} />
      <Proposition mob={mob} />
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [role, setRole] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.role) {
          setRole(session.role);
          setScreen("portfolio");
          return;
        }
      }
    } catch (_) {}
    setScreen("login");
  }, []);

  function handleLogin(userRole) {
    setRole(userRole);
    setScreen("portfolio");
  }

  if (screen === "loading") return (
    <div style={{ minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: F.mono, fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em" }}>LOADING…</div>
    </div>
  );

  if (screen === "login") return <Login onLogin={handleLogin} />;

  return <Portfolio role={role} />;
}
