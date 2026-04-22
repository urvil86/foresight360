'use client';

import { useState } from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LabelList,
} from 'recharts';
import {
  LayoutDashboard, Zap, GitBranch, Sliders, Radar,
  BarChart2, FileText, Bot, Settings, Bell, ChevronRight,
  TrendingUp, TrendingDown, AlertCircle, Send, Activity,
} from 'lucide-react';

// ── Nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Activity, label: 'Actuals vs Forecast', active: true, href: '/performance-pulse' },
  { icon: Zap, label: 'Event Modeler', href: '#' },
  { icon: GitBranch, label: 'Scenario Planner', href: '#' },
  { icon: Sliders, label: 'Sensitivity Engine', href: '#' },
  { icon: Radar, label: 'CI Intelligence', href: '#' },
  { icon: BarChart2, label: 'Consolidator', href: '#' },
  { icon: FileText, label: 'Reports', href: '#' },
  { icon: Bot, label: 'AI Assistant', href: '#' },
];

// ── Recovery chart data (cumulative monthly revenue, $M) ─────────────────────
// Three lines:
//   plan       — straight-line trajectory to $2.41B annual target
//   actuals    — Q1 actual ($598M) + current run-rate projection ($2.34B)
//   recovery   — projected path after what-if actions close the gap
const RECOVERY_DATA = [
  { month: 'Jan', plan: 201,  actuals: 199 },
  { month: 'Feb', plan: 402,  actuals: 396 },
  { month: 'Mar', plan: 603,  actuals: 598,  recovery: 598  },
  { month: 'Apr', plan: 804,  actuals: 793,  recovery: 795  },
  { month: 'May', plan: 1005, actuals: 988,  recovery: 994  },
  { month: 'Jun', plan: 1206, actuals: 1183, recovery: 1197 },
  { month: 'Jul', plan: 1407, actuals: 1378, recovery: 1403 },
  { month: 'Aug', plan: 1608, actuals: 1573, recovery: 1612 },
  { month: 'Sep', plan: 1809, actuals: 1768, recovery: 1824 },
  { month: 'Oct', plan: 2010, actuals: 1963, recovery: 2031 },
  { month: 'Nov', plan: 2211, actuals: 2158, recovery: 2226 },
  { month: 'Dec', plan: 2410, actuals: 2340, recovery: 2408 },
];

// ── Waterfall data ────────────────────────────────────────────────────────────
// Each entry: spacer (transparent base) + bar (visible colored portion).
// Running total: 612 − 8 − 6 − 4 − 3 + 4 + 3 = 598 ✓
//
// Negative bars sit at the top of the running total (spacer = total_after_step).
// Positive bars sit at the bottom of their range (spacer = total_before_step).
const WATERFALL_DATA = [
  { name: 'Q1 Forecast', spacer: 0,   bar: 612, type: 'total',     label: '$612M' },
  { name: 'Rx Ramp',     spacer: 604, bar: 8,   type: 'negative',  label: '−$8M'  },
  { name: 'ES Tier',     spacer: 598, bar: 6,   type: 'negative',  label: '−$6M'  },
  { name: 'G2N',         spacer: 594, bar: 4,   type: 'negative',  label: '−$4M'  },
  { name: 'Stockout',    spacer: 591, bar: 3,   type: 'negative',  label: '−$3M'  },
  { name: 'Aetna Win',   spacer: 591, bar: 4,   type: 'positive',  label: '+$4M'  },
  { name: 'DTC Lift',    spacer: 595, bar: 3,   type: 'positive',  label: '+$3M'  },
  { name: 'Q1 Actuals',  spacer: 0,   bar: 598, type: 'total-end', label: '$598M' },
];

function waterfallColor(type: string) {
  if (type === 'positive') return '#28A745';
  if (type === 'negative') return '#C80037';
  if (type === 'total-end') return '#C80037';
  return '#646569';
}

// ── Driver cards ──────────────────────────────────────────────────────────────
const DRIVERS = [
  {
    title: 'Slower Rx Ramp — Treatment-Naive',
    tag: 'Marketing / Sales', tagColor: '#C80037',
    impact: '−$8M', impactDir: 'neg',
    pct: '−1.3%',
    cause: 'Q1 HCP detailing fell 12% below plan in 3 territories. NRx starts in treatment-naive patients tracking 6% below model assumption.',
    status: 'Action Planned', statusColor: '#FFC107',
  },
  {
    title: 'Express Scripts Tier Change',
    tag: 'Market Access', tagColor: '#C80037',
    impact: '−$6M', impactDir: 'neg',
    pct: '−1.0%',
    cause: 'Jan 1 formulary update moved Biktarvy from Tier 1 to Tier 2 for ESI commercial lives. Patient cost share increased $15, impacting new starts.',
    status: 'Identified', statusColor: '#646569',
  },
  {
    title: 'Higher Gross-to-Net Erosion',
    tag: 'Finance', tagColor: '#C80037',
    impact: '−$4M', impactDir: 'neg',
    pct: '−0.7%',
    cause: 'Rebate accruals came in 40bps higher than modeled due to payer mix shift toward Medicaid-managed care.',
    status: 'Identified', statusColor: '#646569',
  },
  {
    title: 'Southern Region Stockout (Feb)',
    tag: 'Supply Chain', tagColor: '#C80037',
    impact: '−$3M', impactDir: 'neg',
    pct: '−0.5%',
    cause: 'Distribution center shortage in Feb caused 8-day supply gap in TX/LA territories, resulting in lost scripts.',
    status: 'Mitigated', statusColor: '#28A745',
  },
  {
    title: 'Aetna Formulary Win',
    tag: 'Market Access', tagColor: '#28A745',
    impact: '+$4M', impactDir: 'pos',
    pct: '+0.7%',
    cause: 'Formulary placement secured 3 weeks ahead of modeled date. Covered lives onboarded faster than assumption.',
    status: 'Mitigated', statusColor: '#28A745',
  },
  {
    title: 'DTC Campaign Lift',
    tag: 'Marketing', tagColor: '#28A745',
    impact: '+$3M', impactDir: 'pos',
    pct: '+0.5%',
    cause: 'Q1 digital DTC campaign exceeded response rate targets by 18%. New-patient inquiry volume 14% above plan.',
    status: 'Mitigated', statusColor: '#28A745',
  },
];

// ── Prefab chat conversation ──────────────────────────────────────────────────
const CHAT = [
  {
    role: 'user',
    text: 'If we increase HCP detailing frequency by 20% in the underperforming Southern and Midwest territories for Q2–Q3, what happens to our full-year number?',
  },
  {
    role: 'ai',
    text: 'Increasing detailing frequency by 20% in Southern + Midwest territories is projected to recover 40–55% of the treatment-naive ramp gap.',
    bullets: [
      'Estimated recovery: +$3.2M to +$4.4M over Q2–Q3',
      'Revised FY run rate: $2.37B (vs $2.34B current, vs $2.41B plan)',
      'Remaining gap to forecast: $40M–$37M',
      'Confidence: Medium — assumes rep capacity is available and call quality holds.',
    ],
    note: "This alone won't close the gap. Combining with a co-pay card for ESI Tier 2 patients could add another $2M–$3M.",
    actions: ['Model This as Scenario', 'Add to Event Modeler', 'See Assumptions'],
  },
  {
    role: 'user',
    text: 'What if we also run a 90-day co-pay assistance program for patients on Express Scripts plans where Biktarvy moved to Tier 2?',
  },
  {
    role: 'ai',
    text: 'A 90-day co-pay card for ESI Tier 2 patients is modeled to offset 60–70% of the tier change impact by reducing patient abandonment at the pharmacy counter.',
    bullets: [
      'Estimated recovery: +$3.6M to +$4.2M over Q2–Q3',
      'Combined with detailing increase: revised FY run rate moves to $2.40B–$2.41B',
      'Gap to forecast: effectively closed at the midpoint estimate.',
    ],
    note: 'Key risk: Gross-to-net impact reduces net revenue by ~$1.1M. Finance should model the net-net.',
    actions: ['Build Combined Scenario', 'Route to Finance for G2N Review', 'Generate Action Brief'],
  },
];

const QUICK_WHATS = [
  'What if we win the CVS formulary slot in Q3?',
  'What if competitor launch is delayed 6 months?',
  'What if we increase WAC by 3% in July?',
  'What if Southern region stockout recurs in Q3?',
];

const ROLES = ['All', 'Marketing', 'Sales / Field', 'Market Access', 'Finance', 'Supply Chain'];

// ── Recovery tooltip ──────────────────────────────────────────────────────────
function RecoveryTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const fmt = (v: number) => `$${v.toLocaleString()}M`;
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label} 2026</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>{fmt(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

// ── Waterfall tooltip ─────────────────────────────────────────────────────────
function WaterfallTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const entry = WATERFALL_DATA.find(d => d.name === label);
  if (!entry) return null;
  const isTotal = entry.type === 'total' || entry.type === 'total-end';
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ color: isTotal ? '#646569' : entry.type === 'positive' ? '#28A745' : '#C80037', fontWeight: 700 }}>
        {entry.label}
      </div>
      {!isTotal && (
        <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>
          Running total: ${entry.spacer + entry.bar}M
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  padding: '18px 20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PerformancePulse() {
  const [selectedRole, setSelectedRole] = useState('All');
  const [chatInput, setChatInput] = useState('');

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Sidebar ───────────────────────────────── */}
      <aside style={{ width: 240, background: '#1A1A2E', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: 1.5 }}>FORESIGHT 360</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>by Chryselys</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV.map(({ icon: Icon, label, active, href }) => (
            <a key={label} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 20px',
              borderLeft: active ? '3px solid #C80037' : '3px solid transparent',
              background: active ? 'rgba(200,0,55,0.12)' : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.55)',
              fontSize: 13.5, fontWeight: active ? 600 : 400,
              cursor: 'pointer', textDecoration: 'none',
            }}>
              <Icon size={16} />{label}
            </a>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#C80037', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>US</div>
          <div>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Urvil Shah</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Gilead | US Market</div>
          </div>
          <Settings size={14} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)' }} />
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'auto', background: '#F5F5F5' }}>

        {/* Top bar */}
        <div style={{ background: '#fff', padding: '14px 28px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#646569' }}>
            <span>Dashboard</span><ChevronRight size={14} />
            <span>Biktarvy</span><ChevronRight size={14} />
            <span style={{ color: '#2D2D2D', fontWeight: 600 }}>Actuals vs Forecast</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#F5F5F5', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#646569' }}>Q1 2026 — Actuals through March</div>
            <Bell size={18} style={{ color: '#646569' }} />
          </div>
        </div>

        <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── Page header + filters ──────────────── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: '#2D2D2D', margin: 0 }}>Actuals vs Forecast — Variance Drivers</h1>
                <p style={{ fontSize: 13, color: '#646569', marginTop: 3 }}>Track performance gaps and simulate actions to close them</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#646569', background: '#F5F5F5', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 10px' }}>
                <span style={{ fontWeight: 600, color: '#2D2D2D' }}>Urvil Shah</span>
                <span>| Commercial Strategy</span>
              </div>
            </div>

            {/* Filters + role pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {['Biktarvy', 'United States', 'Q1 2026'].map(f => (
                <div key={f} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: '#646569', cursor: 'pointer' }}>{f} ▾</div>
              ))}
              <div style={{ width: 1, height: 20, background: '#e5e7eb', margin: '0 4px' }} />
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  style={{
                    background: selectedRole === r ? '#C80037' : '#fff',
                    color: selectedRole === r ? '#fff' : '#646569',
                    border: `1px solid ${selectedRole === r ? '#C80037' : '#e5e7eb'}`,
                    borderRadius: 16, padding: '4px 12px', fontSize: 12, fontWeight: selectedRole === r ? 600 : 400, cursor: 'pointer',
                  }}
                >{r}</button>
              ))}
            </div>
          </div>

          {/* ── KPI Cards ─────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
            <div style={cardStyle}>
              <div style={labelSt}>Actual Revenue (Q1)</div>
              <div style={valueSt}>$598M</div>
              <div style={{ fontSize: 11, color: '#646569', marginTop: 3 }}>through March 31</div>
            </div>
            <div style={cardStyle}>
              <div style={labelSt}>Forecasted Revenue (Q1)</div>
              <div style={valueSt}>$612M</div>
              <div style={{ fontSize: 11, color: '#646569', marginTop: 3 }}>original plan</div>
            </div>
            <div style={cardStyle}>
              <div style={labelSt}>Variance</div>
              <div style={{ ...valueSt, color: '#C80037', display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingDown size={20} />−$14M
              </div>
              <div style={{ fontSize: 11, color: '#C80037', marginTop: 3, fontWeight: 500 }}>−2.3% vs plan</div>
            </div>
            <div style={cardStyle}>
              <div style={labelSt}>Run Rate Forecast (FY)</div>
              <div style={{ ...valueSt, fontSize: 22 }}>$2.34B</div>
              <div style={{ fontSize: 11, color: '#FFC107', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <AlertCircle size={12} />vs $2.41B plan
              </div>
            </div>
            <div style={{ ...cardStyle, borderTop: '3px solid #C80037' }}>
              <div style={labelSt}>Gap to Close</div>
              <div style={{ ...valueSt, color: '#C80037' }}>$70M</div>
              <div style={{ fontSize: 11, color: '#646569', marginTop: 3 }}>to hit annual target</div>
            </div>
          </div>

          {/* ── TOP: Recovery chart (left) + What-If Simulator (right) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: 16 }}>

            {/* Path to Forecast Recovery */}
            <div style={cardStyle}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#2D2D2D' }}>Path to Forecast Recovery</div>
                <div style={{ fontSize: 12, color: '#646569', marginTop: 2 }}>Cumulative revenue through Dec 2026 — three paths</div>
              </div>
              <ResponsiveContainer width="100%" height={270}>
                <ComposedChart data={RECOVERY_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#646569' }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 2600]}
                    tick={{ fontSize: 11, fill: '#646569' }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => `$${(v / 1000).toFixed(1)}B`}
                  />
                  <Tooltip content={<RecoveryTooltip />} />
                  <Line type="monotone" dataKey="plan" stroke="#9ca3af" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Annual Plan" />
                  <Line type="monotone" dataKey="actuals" stroke="#C80037" strokeWidth={2.5} dot={(p) => p.index <= 2 ? <circle key={p.index} cx={p.cx} cy={p.cy} r={3} fill="#C80037" /> : <g key={p.index} />} name="Actuals / Trajectory" />
                  <Line type="monotone" dataKey="recovery" stroke="#28A745" strokeWidth={2.5} strokeDasharray="1 0" dot={false} name="Recovery Path" />
                </ComposedChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 18, marginTop: 10, flexWrap: 'wrap' }}>
                {[
                  { color: '#9ca3af', dash: true, label: 'Annual Plan ($2.41B)' },
                  { color: '#C80037', dash: false, label: 'Actuals / Trajectory' },
                  { color: '#28A745', dash: false, label: 'Recovery Path' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width={22} height={10}>
                      <line x1={0} y1={5} x2={22} y2={5} stroke={l.color} strokeWidth={2} strokeDasharray={l.dash ? '5 3' : undefined} />
                    </svg>
                    <span style={{ fontSize: 11, color: '#646569' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What-If Simulator */}
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#2D2D2D' }}>What-If Simulator</div>
                <div style={{ fontSize: 12, color: '#646569', marginTop: 2 }}>Explore which actions can recover the variance</div>
              </div>

              {/* Chat history */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 310, paddingRight: 4 }}>
                {CHAT.map((msg, i) => (
                  <div key={i} style={msg.role === 'user' ? {
                    alignSelf: 'flex-end',
                    background: '#F5F5F5',
                    borderRadius: 10,
                    padding: '8px 12px',
                    fontSize: 12,
                    color: '#2D2D2D',
                    maxWidth: '85%',
                  } : {
                    borderLeft: '3px solid #C80037',
                    background: '#fff',
                    borderRadius: '0 8px 8px 0',
                    padding: '10px 12px',
                    fontSize: 12,
                    color: '#2D2D2D',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}>
                    {msg.role === 'user' ? (
                      <span>{msg.text}</span>
                    ) : (
                      <>
                        <p style={{ margin: '0 0 6px', lineHeight: 1.5 }}>{msg.text}</p>
                        <ul style={{ margin: '0 0 6px', paddingLeft: 16 }}>
                          {msg.bullets?.map((b, j) => <li key={j} style={{ marginBottom: 2, lineHeight: 1.4 }}>{b}</li>)}
                        </ul>
                        {msg.note && <p style={{ margin: '4px 0 8px', color: '#646569', fontStyle: 'italic', lineHeight: 1.4 }}>{msg.note}</p>}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {msg.actions?.map(a => (
                            <button key={a} style={{ background: 'rgba(200,0,55,0.07)', color: '#C80037', border: '1px solid rgba(200,0,55,0.2)', borderRadius: 4, padding: '3px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{a}</button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick what-ifs */}
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {QUICK_WHATS.map(q => (
                  <button key={q} onClick={() => setChatInput(q)} style={{ background: '#F5F5F5', color: '#646569', border: '1px solid #e5e7eb', borderRadius: 14, padding: '4px 10px', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>{q}</button>
                ))}
              </div>

              {/* Input */}
              <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask: 'If we do X, where do we land?'"
                  style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 12, outline: 'none', color: '#2D2D2D' }}
                />
                <button style={{ background: '#C80037', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Send size={14} color="#fff" />
                </button>
              </div>
            </div>
          </div>

          {/* ── BOTTOM: Variance Waterfall (left) + Driver Cards (right) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: 16 }}>

            {/* Variance Waterfall */}
            <div style={cardStyle}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#2D2D2D' }}>Q1 Variance Walk: Forecast to Actuals — Biktarvy (US)</div>
                <div style={{ fontSize: 12, color: '#646569', marginTop: 2 }}>Bridge from Q1 plan to Q1 actuals ($M)</div>
              </div>
              <ResponsiveContainer width="100%" height={270}>
                {/*
                  Floating bar technique: each category has a transparent "spacer" bar
                  stacked below the visible colored bar, creating the waterfall effect.
                  Y-axis domain [585, 618] clips the invisible spacer portions.
                */}
                <BarChart data={WATERFALL_DATA} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#646569' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[585, 618]} tick={{ fontSize: 10, fill: '#646569' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                  <Tooltip content={<WaterfallTooltip />} />
                  {/* Invisible spacer — pushes visible bar to correct Y position */}
                  <Bar dataKey="spacer" stackId="a" fill="transparent" />
                  {/* Visible colored bar */}
                  <Bar dataKey="bar" stackId="a" radius={[3, 3, 0, 0]}>
                    {WATERFALL_DATA.map((entry, i) => (
                      <Cell key={i} fill={waterfallColor(entry.type)} />
                    ))}
                    <LabelList dataKey="label" position="top" style={{ fontSize: 10, fill: '#2D2D2D', fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                {[['#646569', 'Total'], ['#C80037', 'Negative driver'], ['#28A745', 'Positive offset']].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
                    <span style={{ fontSize: 11, color: '#646569' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Detail Cards */}
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#2D2D2D', marginBottom: 14 }}>Driver Detail</div>
              <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320 }}>
                {DRIVERS.map((d, i) => (
                  <div key={i} style={{
                    border: `1px solid ${d.impactDir === 'neg' ? 'rgba(200,0,55,0.15)' : 'rgba(40,167,69,0.15)'}`,
                    borderLeft: `3px solid ${d.impactDir === 'neg' ? '#C80037' : '#28A745'}`,
                    borderRadius: '0 8px 8px 0',
                    padding: '10px 12px',
                    background: '#fff',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2D2D2D', lineHeight: 1.3, flex: 1, marginRight: 8 }}>{d.title}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: d.impactDir === 'neg' ? '#C80037' : '#28A745', flexShrink: 0 }}>
                        {d.impact}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, background: `${d.tagColor}15`, color: d.tagColor, borderRadius: 4, padding: '2px 7px', fontWeight: 500 }}>{d.tag}</span>
                      <span style={{ fontSize: 11, background: `${d.statusColor}20`, color: d.statusColor, borderRadius: 4, padding: '2px 7px', fontWeight: 500 }}>{d.status}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#646569', lineHeight: 1.5, margin: '0 0 6px' }}>{d.cause}</p>
                    <button style={{ fontSize: 11, color: '#C80037', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                      {d.impactDir === 'neg' ? 'Create Corrective Scenario →' : 'View in Event Modeler →'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

const labelSt: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: '#646569',
  textTransform: 'uppercase', letterSpacing: 0.5,
};

const valueSt: React.CSSProperties = {
  fontSize: 26, fontWeight: 800, color: '#2D2D2D', marginTop: 5, lineHeight: 1,
};
