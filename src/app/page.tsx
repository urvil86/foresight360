'use client';

import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  LayoutDashboard, Zap, GitBranch, Activity, Radar,
  BarChart2, FileText, Bot, Settings, Bell, ChevronRight,
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Sliders,
} from 'lucide-react';

// ---------- Chart Data ----------
// Historical actuals: Jan–Mar 2026 (no CI band — values are known)
// Forecast: Apr–Dec 2026 with CI that widens as σ·√t
//
// σ_base = 5M (1-month-ahead standard error of adjusted forecast)
// At t months ahead: half-width = 1.96 · 5 · √t
//
// This produces the correct "cone of uncertainty": narrow near-term, wide long-term.
// Historical months carry ciLow = ciHigh = adjusted (zero-width band → invisible).

const RAW_FORECAST = [
  { month: 'Jan', actual: 195, baseline: 195, adjusted: 195 },
  { month: 'Feb', actual: 198, baseline: 198, adjusted: 198 },
  { month: 'Mar', actual: 202, baseline: 202, adjusted: 202 },
  { month: 'Apr', baseline: 205, adjusted: 206 },
  { month: 'May', baseline: 207, adjusted: 210 },
  { month: 'Jun', baseline: 209, adjusted: 213 },
  { month: 'Jul', baseline: 211, adjusted: 216 },
  { month: 'Aug', baseline: 213, adjusted: 218 },
  { month: 'Sep', baseline: 215, adjusted: 221 },
  { month: 'Oct', baseline: 216, adjusted: 223 },
  { month: 'Nov', baseline: 218, adjusted: 225 },
  { month: 'Dec', baseline: 220, adjusted: 228 },
];

const SIGMA_BASE = 5; // $M per √month

const chartData = RAW_FORECAST.map((d, i) => {
  const monthsAhead = i - 2; // positive only for Apr (i=3) onward
  if (monthsAhead <= 0) {
    // Actuals: no CI band (zero-width so the white mask fully hides the red area)
    return { ...d, ciLow: d.adjusted, ciHigh: d.adjusted };
  }
  const halfWidth = 1.96 * SIGMA_BASE * Math.sqrt(monthsAhead);
  return {
    ...d,
    ciLow: Math.round(d.adjusted - halfWidth),
    ciHigh: Math.round(d.adjusted + halfWidth),
  };
});

// ---------- Hit Probability ----------
// "Probability to hit forecast" = P(FY actual ≥ annual plan of $2.41B)
// given the adjusted forecast distribution.
//
// Annual adjusted mean  = sum of monthly adjusted values = $2,457M ≈ $2.46B
// Annual σ (aggregated) = σ_base · √(∑ t) where t = months ahead = √(1+2+…+9) = √45 ≈ 6.7
//   → annual σ = 5 · 6.7 = 33.5M  → 95% CI on annual = ±1.96·33.5 ≈ ±$66M
//
// P(X ≥ $2,410M) where X ~ N(2457, 33.5²)
//   z = (2410 − 2457) / 33.5 = −1.40  → P ≈ 92%
//
// We display 92% as "probability of meeting annual plan" in the KPI card.
const HIT_PROBABILITY = 92; // %

// ---------- Nav Items ----------
const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true, href: '/' },
  { icon: Activity, label: 'Actuals vs Forecast', href: '/performance-pulse' },
  { icon: Zap, label: 'Event Modeler', href: '#' },
  { icon: GitBranch, label: 'Scenario Planner', href: '#' },
  { icon: Sliders, label: 'Sensitivity Engine', href: '#' },
  { icon: Radar, label: 'CI Intelligence', href: '#' },
  { icon: BarChart2, label: 'Consolidator', href: '#' },
  { icon: FileText, label: 'Reports', href: '#' },
  { icon: Bot, label: 'AI Assistant', href: '#' },
];

// ---------- Market Snapshot ----------
const MARKET_ROWS = [
  { brand: 'Biktarvy', base: '$2.41B', adjusted: '$2.51B', delta: '+$100M', confidence: 92, color: '#28A745' },
  { brand: 'Descovy',  base: '$780M',  adjusted: '$795M',  delta: '+$15M',  confidence: 78, color: '#FFC107' },
  { brand: 'Veklury',  base: '$610M',  adjusted: '$588M',  delta: '-$22M',  confidence: 65, color: '#C80037' },
  { brand: 'Trodelvy', base: '$430M',  adjusted: '$448M',  delta: '+$18M',  confidence: 71, color: '#FFC107' },
  { brand: 'Yescarta', base: '$290M',  adjusted: '$302M',  delta: '+$12M',  confidence: 84, color: '#28A745' },
];

// ---------- Custom Tooltip ----------
function CITooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const isForecast = d?.actual === undefined;
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label} 2026</div>
      {d?.actual !== undefined && (
        <div style={{ color: '#646569' }}>Actual: <strong>${d.actual}M</strong></div>
      )}
      {d?.baseline && <div style={{ color: '#646569' }}>Baseline: <strong>${d.baseline}M</strong></div>}
      {isForecast && d?.adjusted && (
        <>
          <div style={{ color: '#C80037' }}>Adjusted: <strong>${d.adjusted}M</strong></div>
          <div style={{ color: '#9ca3af', marginTop: 4, fontSize: 12 }}>
            95% CI: ${d.ciLow}M – ${d.ciHigh}M
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Circular Progress ----------
function CircleProgress({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const filled = circ * (value / 100);
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="#C80037" strokeWidth={6}
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside style={{ width: 240, background: '#1A1A2E', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: 1.5 }}>FORESIGHT 360</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 }}>by Chryselys</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {NAV.map(({ icon: Icon, label, active, href }) => (
            <a
              key={label}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px',
                borderLeft: active ? '3px solid #C80037' : '3px solid transparent',
                background: active ? 'rgba(200,0,55,0.12)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                fontSize: 13.5, fontWeight: active ? 600 : 400,
                cursor: 'pointer', textDecoration: 'none',
              }}
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#C80037', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>US</div>
          <div>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Urvil Shah</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>Gilead | US Market</div>
          </div>
          <Settings size={14} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }} />
        </div>
      </aside>

      {/* ── Main ───────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'auto', background: '#F5F5F5' }}>

        {/* Top Bar */}
        <div style={{ background: '#fff', padding: '14px 28px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#646569' }}>
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span>Biktarvy</span>
            <ChevronRight size={14} />
            <span style={{ color: '#2D2D2D', fontWeight: 600 }}>United States</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#F5F5F5', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#646569' }}>Jan 2026 – Dec 2026</div>
            <Bell size={18} style={{ color: '#646569', cursor: 'pointer' }} />
          </div>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── KPI Cards ─────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {/* Base Forecast */}
            <div style={cardStyle}>
              <div style={cardLabel}>Base Forecast</div>
              <div style={cardValue}>$2.41B</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <TrendingUp size={13} style={{ color: '#28A745' }} />
                <span style={{ fontSize: 12, color: '#28A745', fontWeight: 500 }}>+3.2% vs prior</span>
              </div>
            </div>

            {/* Adjusted Forecast */}
            <div style={cardStyle}>
              <div style={cardLabel}>Adjusted Forecast</div>
              <div style={cardValue}>$2.51B</div>
              <div style={{ marginTop: 4 }}>
                <span style={{ fontSize: 11, background: 'rgba(200,0,55,0.1)', color: '#C80037', borderRadius: 4, padding: '2px 7px', fontWeight: 500 }}>3 events applied</span>
              </div>
            </div>

            {/* Active Scenarios */}
            <div style={cardStyle}>
              <div style={cardLabel}>Active Scenarios</div>
              <div style={cardValue}>4</div>
              <div style={{ fontSize: 12, color: '#FFC107', marginTop: 4, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertCircle size={13} /> 2 pending review
              </div>
            </div>

            {/* Hit Probability — replaces "Forecast Confidence" */}
            <div style={{ ...cardStyle, borderTop: '3px solid #C80037' }}>
              <div style={cardLabel}>Hit Probability</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <CircleProgress value={HIT_PROBABILITY} />
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#2D2D2D', lineHeight: 1 }}>{HIT_PROBABILITY}%</div>
                  <div style={{ fontSize: 11, color: '#646569', marginTop: 3 }}>to hit annual plan</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#646569', marginTop: 8, lineHeight: 1.5 }}>
                P(FY actuals ≥ $2.41B plan) based on 95% CI distribution
              </div>
            </div>
          </div>

          {/* ── Row 2: Chart + Events ──────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '60% 40%', gap: 16 }}>

            {/* Trendline Chart */}
            <div style={cardStyle}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#2D2D2D' }}>Forecast Trend — Biktarvy (US)</div>
                <div style={{ fontSize: 12, color: '#646569', marginTop: 2 }}>
                  Shaded band = 95% CI widening as σ·√t from last actual (Mar 2026)
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#646569' }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[160, 270]}
                    tick={{ fontSize: 11, fill: '#646569' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}M`}
                  />
                  <Tooltip content={<CITooltip />} />
                  <Legend
                    formatter={(value) => <span style={{ fontSize: 12, color: '#646569' }}>{value}</span>}
                    wrapperStyle={{ paddingTop: 8 }}
                  />

                  {/* CI band: upper fill (light red), then lower fill (white mask) */}
                  {/* Net result: only the band between ciLow and ciHigh is shaded */}
                  <Area
                    type="monotone"
                    dataKey="ciHigh"
                    stroke="none"
                    fill="rgba(200,0,55,0.10)"
                    legendType="none"
                    name="95% CI"
                    dot={false}
                    activeDot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="ciLow"
                    stroke="none"
                    fill="#ffffff"
                    legendType="none"
                    dot={false}
                    activeDot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#646569"
                    strokeWidth={2}
                    dot={false}
                    name="Baseline"
                    strokeDasharray="5 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="adjusted"
                    stroke="#C80037"
                    strokeWidth={2.5}
                    dot={false}
                    name="Adjusted Forecast"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#2D2D2D"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#2D2D2D' }}
                    name="Actuals"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              {/* CI legend note */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <div style={{ width: 28, height: 12, background: 'rgba(200,0,55,0.12)', border: '1px dashed rgba(200,0,55,0.3)', borderRadius: 2 }} />
                <span style={{ fontSize: 11, color: '#646569' }}>95% Confidence Interval (forecast only)</span>
              </div>
            </div>

            {/* Recent Events */}
            <div style={cardStyle}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#2D2D2D', marginBottom: 20 }}>Recent Events Applied</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  {
                    color: '#C80037', label: 'Competitor Launch — Sunlenca GenEq',
                    impact: '-2.1%', date: 'Apr 10', dir: 'down', tag: 'Competitor',
                  },
                  {
                    color: '#28A745', label: 'Formulary Win — Aetna',
                    impact: '+1.4%', date: 'Apr 8', dir: 'up', tag: 'Market Access',
                  },
                  {
                    color: '#FFC107', label: 'Pricing Adjustment Q2',
                    impact: '+0.8%', date: 'Apr 5', dir: 'up', tag: 'Pricing',
                  },
                ].map((ev, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, position: 'relative', paddingBottom: i < 2 ? 24 : 0 }}>
                    {/* Timeline line */}
                    {i < 2 && <div style={{ position: 'absolute', left: 7, top: 18, width: 2, height: '100%', background: '#e5e7eb' }} />}
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: ev.color, flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2D2D2D', lineHeight: 1.3 }}>{ev.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 11, background: '#F5F5F5', color: '#646569', borderRadius: 4, padding: '2px 6px' }}>{ev.tag}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: ev.dir === 'up' ? '#28A745' : '#C80037', display: 'flex', alignItems: 'center', gap: 2 }}>
                          {ev.dir === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {ev.impact}
                        </span>
                        <span style={{ fontSize: 11, color: '#646569', marginLeft: 'auto' }}>{ev.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Probability breakdown note */}
              <div style={{ marginTop: 24, background: '#F5F5F5', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#2D2D2D', marginBottom: 8 }}>Probability Breakdown</div>
                {[
                  { label: 'Beat plan (>$2.41B)', p: 92, color: '#28A745' },
                  { label: 'Hit adj. forecast ($2.51B ±2%)', p: 53, color: '#646569' },
                  { label: 'Miss plan (<$2.41B)', p: 8, color: '#C80037' },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ fontSize: 11, color: '#646569', width: 170, flexShrink: 0 }}>{row.label}</div>
                    <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${row.p}%`, height: '100%', background: row.color, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: row.color, width: 32, textAlign: 'right' }}>{row.p}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Market Snapshot Table ──────────────── */}
          <div style={cardStyle}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#2D2D2D', marginBottom: 16 }}>Market Snapshot</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {['Brand', 'Base Forecast', 'Adjusted Forecast', 'Delta', 'Hit Probability', 'Last Updated'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#646569', fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MARKET_ROWS.map((row, i) => (
                  <tr key={row.brand} style={{ borderBottom: i < MARKET_ROWS.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#2D2D2D' }}>{row.brand}</td>
                    <td style={{ padding: '10px 12px', color: '#646569' }}>{row.base}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{row.adjusted}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: row.delta.startsWith('+') ? '#28A745' : '#C80037', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {row.delta.startsWith('+') ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {row.delta}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden', maxWidth: 80 }}>
                          <div style={{ width: `${row.confidence}%`, height: '100%', background: row.color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: row.color }}>{row.confidence}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#646569', fontSize: 12 }}>Apr 14, 2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  padding: '18px 20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const cardLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#646569',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const cardValue: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: '#2D2D2D',
  marginTop: 6,
  lineHeight: 1,
};
