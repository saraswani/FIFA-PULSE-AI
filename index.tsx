import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard, Radar, LineChart as LineIcon, MapPin, Sparkles, FlaskConical,
  Bell, FileBarChart, Users, Bus, Leaf, Settings, Moon, Sun, Globe, Cloud,
  Megaphone, DoorOpen, UserPlus, HeartPulse, Car, FileText,
  Users2, AlertTriangle, Gauge, Clock, ShieldCheck, Activity, Send, Bot,
  ChevronRight, Zap, Droplets, Recycle, TreePine, ParkingCircle, TrainFront, X, Check, Loader2,
} from "lucide-react";
import heroStadium from "@/assets/hero-stadium.jpg";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "FIFA Pulse AI — Command Center" },
      { name: "description", content: "Predict, prevent, perform. Real-time crowd digital twin for FIFA World Cup 2026." },
    ],
  }),
});

const seeded = (s: number) => { let x = s || 1; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };
const fmt = (n: number) => n.toLocaleString();

type NavKey = "dashboard" | "twin" | "predictions" | "stadium" | "insights" | "simulator" | "alerts" | "reports" | "volunteers" | "transport" | "sustainability" | "settings";
const NAV: { key: NavKey; icon: typeof LayoutDashboard; label: string; badge?: number; section: string }[] = [
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard", section: "top" },
  { key: "twin", icon: Radar, label: "Digital Twin", section: "twin" },
  { key: "predictions", icon: LineIcon, label: "Predictions", section: "predictions" },
  { key: "stadium", icon: MapPin, label: "Live Stadium", section: "twin" },
  { key: "insights", icon: Sparkles, label: "AI Insights", section: "ai" },
  { key: "simulator", icon: FlaskConical, label: "Simulator", section: "predictions" },
  { key: "alerts", icon: Bell, label: "Alerts", badge: 12, section: "rail" },
  { key: "reports", icon: FileBarChart, label: "Reports", section: "bottom" },
  { key: "volunteers", icon: Users, label: "Volunteers", section: "ai" },
  { key: "transport", icon: Bus, label: "Transport", section: "bottom" },
  { key: "sustainability", icon: Leaf, label: "Sustainability", section: "bottom" },
  { key: "settings", icon: Settings, label: "Settings", section: "top" },
];

type Gate = { id: string; capacity: number; current: number; predicted: number; risk: string; color: string; pos: string };
const BASE_GATES: Gate[] = [
  { id: "A", capacity: 8900, current: 7842, predicted: 9120, risk: "HIGH", color: "text-fifa-red", pos: "top-4 left-4" },
  { id: "B", capacity: 9200, current: 6103, predicted: 7650, risk: "MEDIUM", color: "text-fifa-gold", pos: "top-4 right-4" },
  { id: "C", capacity: 8700, current: 8215, predicted: 9430, risk: "CRITICAL", color: "text-fifa-red", pos: "bottom-4 right-4" },
  { id: "D", capacity: 7800, current: 4321, predicted: 5100, risk: "LOW", color: "text-fifa-green", pos: "bottom-4 left-4" },
];

type Alert = { id: string; icon: typeof AlertTriangle; tint: string; bg: string; title: string; sub: string; tag: string; tagColor: string; ack?: boolean };
const BASE_ALERTS: Alert[] = [
  { id: "a1", icon: AlertTriangle, tint: "text-fifa-red", bg: "bg-fifa-red/15", title: "High congestion predicted", sub: "Gate C in 18 min", tag: "CRITICAL", tagColor: "text-fifa-red bg-fifa-red/15" },
  { id: "a2", icon: TrainFront, tint: "text-fifa-gold", bg: "bg-fifa-gold/15", title: "Metro delay detected", sub: "7 min delay on Blue Line", tag: "ELEVATED", tagColor: "text-fifa-gold bg-fifa-gold/15" },
  { id: "a3", icon: HeartPulse, tint: "text-fifa-gold", bg: "bg-fifa-gold/15", title: "Medical assistance required", sub: "Zone D, Section 120", tag: "WATCH", tagColor: "text-fifa-gold bg-fifa-gold/15" },
];

/* ---------------- Sidebar ---------------- */
function Sidebar({ active, onSelect, dark, setDark }: { active: NavKey; onSelect: (k: NavKey) => void; dark: boolean; setDark: (v: boolean) => void }) {
  return (
    <aside className="w-[240px] shrink-0 border-r border-white/8 bg-navy-deep/60 backdrop-blur-xl flex flex-col">
      <div className="p-5 flex items-center gap-3 border-b border-white/8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fifa-blue via-fifa-red to-fifa-gold grid place-items-center text-white font-black shadow-lg shadow-fifa-red/30">F</div>
        <div>
          <div className="text-[15px] font-bold tracking-tight">FIFA PULSE AI</div>
          <div className="text-[10px] text-muted-foreground tracking-wider uppercase">Predict. Prevent. Perform.</div>
        </div>
      </div>
      <nav aria-label="Primary" className="p-3 flex-1 space-y-1 overflow-auto">
        {NAV.map((n) => {
          const isActive = active === n.key;
          return (
            <button
              key={n.key}
              type="button"
              onClick={() => onSelect(n.key)}
              aria-current={isActive ? "page" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-blue ${isActive ? "bg-fifa-blue text-white shadow-lg shadow-fifa-blue/30" : "text-muted-foreground hover:bg-white/5 hover:text-white"}`}
            >
              <n.icon aria-hidden="true" className="w-[18px] h-[18px]" />
              <span className="flex-1 text-left">{n.label}</span>
              {n.badge && <span aria-label={`${n.badge} new`} className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-fifa-red text-white">{n.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/8">
        <button
          type="button"
          onClick={() => setDark(!dark)}
          role="switch"
          aria-checked={dark}
          aria-label="Toggle dark mode"
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-fifa-blue transition"
        >
          <span className="flex items-center gap-2 text-sm">{dark ? <Moon className="w-4 h-4" aria-hidden="true" /> : <Sun className="w-4 h-4" aria-hidden="true" />} Dark Mode</span>
          <span aria-hidden="true" className={`w-9 h-5 rounded-full relative transition ${dark ? "bg-fifa-blue" : "bg-white/20"}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${dark ? "right-0.5" : "left-0.5"}`} />
          </span>
        </button>
      </div>
      <div className="m-3 mt-1 rounded-xl overflow-hidden relative aspect-[4/5] bg-gradient-to-br from-fifa-red via-fifa-blue to-fifa-green">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 flex flex-col items-center justify-between p-4 text-center">
          <div className="text-4xl animate-float">🏆</div>
          <div>
            <div className="text-[11px] tracking-[0.2em] opacity-90">FIFA WORLD CUP</div>
            <div className="text-3xl font-black tracking-tight">2026</div>
            <div className="text-[9px] tracking-[0.25em] opacity-80 mt-1">UNITED BY FOOTBALL</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- TopBar ---------------- */
function TopBar({ minute, notifOpen, setNotifOpen, notifications, clearNotifs }: { minute: number; notifOpen: boolean; setNotifOpen: (v: boolean) => void; notifications: string[]; clearNotifs: () => void }) {
  const mm = String(Math.floor(minute)).padStart(2, "0");
  const ss = String(Math.floor((minute % 1) * 60)).padStart(2, "0");
  return (
    <header className="h-16 shrink-0 border-b border-white/8 bg-navy-deep/60 backdrop-blur-xl flex items-center gap-4 px-6 relative z-30">
      <div className="flex items-center gap-2">
        <span className="text-[11px] tracking-[0.2em] text-muted-foreground">FIFA WORLD CUP</span>
        <span className="text-lg font-black text-gradient-fifa">2026</span>
      </div>
      <div className="flex-1 flex justify-center">
        <div className="flex items-center gap-4 px-5 py-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-fifa-gold text-navy-deep animate-pulse">LIVE MATCH</span>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Brazil</span> <span>🇧🇷</span>
            <span className="text-fifa-gold font-black mx-1">2 - 1</span>
            <span>🇫🇷</span> <span className="font-semibold">France</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-fifa-blue/20 text-fifa-blue font-mono tabular-nums">{mm}:{ss}</span>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-sm"><Cloud className="w-4 h-4 text-fifa-blue" /><div><div className="font-semibold leading-none">24°C</div><div className="text-[10px] text-muted-foreground">Overcast</div></div></div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label={`Notifications, ${notifications.length} unread`}
            aria-haspopup="dialog"
            aria-expanded={notifOpen}
            className="relative hover:text-fifa-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-blue rounded transition"
          >
            <Bell className="w-5 h-5" aria-hidden="true" />
            {notifications.length > 0 && <span aria-hidden="true" className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-fifa-red text-[9px] font-bold grid place-items-center">{notifications.length}</span>}
          </button>
          {notifOpen && (
            <div role="dialog" aria-label="Notifications" className="absolute right-0 top-8 w-80 rounded-xl bg-navy-deep border border-white/10 shadow-2xl p-3 z-40">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-bold tracking-wider">NOTIFICATIONS</div>
                <button type="button" onClick={clearNotifs} className="text-[10px] text-fifa-blue hover:underline">Clear all</button>
              </div>
              <div aria-live="polite" className="space-y-1 max-h-72 overflow-auto">
                {notifications.length === 0 ? <div className="text-xs text-muted-foreground py-4 text-center">All caught up</div> :
                  notifications.map((n, i) => (
                    <div key={i} className="text-xs px-2 py-2 rounded bg-white/5 flex gap-2"><span aria-hidden="true" className="w-1 shrink-0 rounded-full bg-fifa-blue" /><span>{n}</span></div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <button className="flex items-center gap-1 text-sm hover:text-fifa-blue transition"><Globe className="w-4 h-4" /> EN</button>
        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fifa-blue to-fifa-red grid place-items-center text-xs font-bold">OA</div>
          <div><div className="text-sm font-semibold leading-none">Ops Admin</div><div className="text-[10px] text-muted-foreground">Command Center</div></div>
        </div>
      </div>
    </header>
  );
}

function Card({ title, right, children, className = "", id }: { title?: string; right?: React.ReactNode; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <div id={id} className={`rounded-2xl bg-navy-deep/70 border border-white/8 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] scroll-mt-24 ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
          <div className="text-[11px] font-bold tracking-[0.18em] text-white/90 uppercase">{title}</div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------------- KPIs (live) ---------------- */
function KpiRow({ attendance, wait, incidents }: { attendance: number; wait: number; incidents: number }) {
  const items = [
    { icon: Users2, label: "Total Attendance", value: fmt(attendance), sub: `${Math.min(100, Math.round(attendance / 88000 * 100))}% Capacity`, tint: "text-fifa-blue", bg: "bg-fifa-blue/15" },
    { icon: AlertTriangle, label: "Predicted Peak", value: fmt(92600), sub: "in 24 min", tint: "text-fifa-gold", bg: "bg-fifa-gold/15" },
    { icon: Gauge, label: "Crowd Risk Index", value: "MEDIUM", sub: "67 / 100", tint: "text-fifa-gold", bg: "bg-fifa-gold/15" },
    { icon: Clock, label: "Avg. Wait Time", value: `${wait} min`, sub: "-12% vs last match", tint: "text-fifa-green", bg: "bg-fifa-green/15" },
    { icon: ShieldCheck, label: "Volunteers Active", value: "1,248", sub: "98% Deployed", tint: "text-fifa-blue", bg: "bg-fifa-blue/15" },
    { icon: Activity, label: "Incidents Today", value: String(incidents), sub: "-40% vs yesterday", tint: "text-[oklch(0.7_0.18_300)]", bg: "bg-[oklch(0.7_0.18_300)]/15" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {items.map((k) => (
        <div key={k.label} className="rounded-xl bg-navy-deep/70 border border-white/8 backdrop-blur-xl p-3 flex items-start gap-2.5 hover:border-white/20 hover:-translate-y-0.5 transition-all min-w-0">
          <div className={`w-9 h-9 rounded-lg ${k.bg} grid place-items-center shrink-0`}><k.icon className={`w-4.5 h-4.5 ${k.tint}`} /></div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] tracking-wider uppercase text-muted-foreground truncate">{k.label}</div>
            <div className="text-lg xl:text-base 2xl:text-lg font-black mt-0.5 leading-tight tabular-nums break-words">{k.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{k.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Stadium Twin ---------------- */
function StadiumTwin({ gates, onGate, heatOn, setHeatOn }: { gates: Gate[]; onGate: (g: Gate) => void; heatOn: boolean; setHeatOn: (v: boolean) => void }) {
  return (
    <Card
      id="twin"
      title="Digital Twin – Metlife Stadium"
      right={
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-fifa-green"><span className="w-1.5 h-1.5 rounded-full bg-fifa-green animate-pulse" /> Live</span>
          <button className="text-xs text-muted-foreground flex items-center gap-1 hover:text-white">Layers <ChevronRight className="w-3 h-3 rotate-90" /></button>
        </div>
      }
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-b-2xl">
        <img src={heroStadium} alt="Metlife Stadium aerial view" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/40 via-transparent to-navy-deep/70" />
        <div className="absolute inset-[8%] rounded-[50%] border-2 border-fifa-red/60 shadow-[0_0_40px_rgba(239,68,68,0.4)] pointer-events-none" />
        <div className="absolute inset-[14%] rounded-[50%] border border-fifa-blue/50 pointer-events-none" />
        <div className="absolute inset-[22%] rounded-[50%] border border-fifa-green/40 pointer-events-none" />

        {gates.map((g) => (
          <button key={g.id} onClick={() => onGate(g)} className={`absolute ${g.pos} w-[190px] text-left rounded-lg bg-navy-deep/85 border border-white/10 backdrop-blur-md p-3 text-[11px] hover:border-fifa-blue transition-all hover:-translate-y-0.5`}>
            <div className={`font-bold text-sm mb-1.5 ${g.color}`}>GATE {g.id}</div>
            <div className="space-y-1 text-white/80">
              <div className="flex justify-between"><span className="text-muted-foreground">Capacity</span><span className="font-mono tabular-nums">{fmt(g.capacity)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Current</span><span className="font-mono tabular-nums">{fmt(g.current)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Predicted</span><span className="font-mono tabular-nums">{fmt(g.predicted)}</span></div>
              <div className="flex justify-between items-center pt-1 border-t border-white/5"><span className="text-muted-foreground">Risk</span><span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${g.color} bg-white/5`}>{g.risk}</span></div>
            </div>
          </button>
        ))}

        {heatOn && (
          <>
            <div className="absolute inset-[8%] rounded-[50%] bg-[radial-gradient(circle_at_30%_30%,oklch(0.62_0.22_27/0.5),transparent_50%),radial-gradient(circle_at_75%_65%,oklch(0.58_0.22_27/0.6),transparent_45%)] pointer-events-none mix-blend-screen" />
          </>
        )}

        <div className="absolute top-[36%] right-[26%] w-9 h-9 rounded-full bg-fifa-red animate-pulse-ring grid place-items-center"><Bot className="w-4 h-4 text-white" /></div>

        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px]">
          <div className="flex gap-4">
            {[["Safe", "bg-fifa-green"], ["Watch", "bg-fifa-gold"], ["Elevated", "bg-[oklch(0.7_0.2_50)]"], ["Critical", "bg-fifa-red"]].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${c}`} />{l}</span>
            ))}
          </div>
          <button onClick={() => setHeatOn(!heatOn)} className="flex items-center gap-2">
            <span className="text-muted-foreground">Heat Map</span>
            <span className={`w-9 h-5 rounded-full relative transition ${heatOn ? "bg-fifa-blue" : "bg-white/20"}`}><span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${heatOn ? "right-0.5" : "left-0.5"}`} /></span>
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Prediction Timeline ---------------- */
function PredictionTimeline({ gateId, setGateId }: { gateId: string; setGateId: (s: string) => void }) {
  const rnd = useMemo(() => seeded(gateId.charCodeAt(0)), [gateId]);
  const pts = useMemo(() => Array.from({ length: 32 }, (_, i) => ({ i, cur: 5000 + i * 180 + rnd() * 400, pred: 4800 + i * 240 + rnd() * 500 })), [rnd]);
  const max = 12000; const w = 340, h = 150;
  const path = (key: "cur" | "pred") => pts.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${h - (p[key] / max) * h}`).join(" ");
  const peak = Math.round(pts.at(-1)!.pred);
  return (
    <Card id="predictions" title="Prediction Timeline" right={
      <select value={gateId} onChange={(e) => setGateId(e.target.value)} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 outline-none">
        {["A", "B", "C", "D"].map((g) => <option key={g} value={g}>Gate {g}</option>)}
      </select>
    }>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2 text-[11px]">
          <div className="flex gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-fifa-blue" />Current</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 border-t border-dashed border-fifa-red" />Predicted</span>
          </div>
          <div className="text-right">
            <div className="font-black text-lg leading-none text-fifa-red tabular-nums">{fmt(peak)}</div>
            <div className="text-[9px] text-muted-foreground">Predicted Peak<br />in 46 min</div>
          </div>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[150px]">
          <defs>
            <linearGradient id="curG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="oklch(0.48 0.17 250)" stopOpacity="0.4" /><stop offset="1" stopColor="oklch(0.48 0.17 250)" stopOpacity="0" /></linearGradient>
          </defs>
          <path d={`${path("cur")} L ${w} ${h} L 0 ${h} Z`} fill="url(#curG)" />
          <path d={path("cur")} stroke="oklch(0.55 0.17 250)" strokeWidth="2" fill="none" />
          <path d={path("pred")} stroke="oklch(0.58 0.22 27)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        </svg>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>Now</span><span>15m</span><span>30m</span><span>45m</span><span>60m</span></div>
      </div>
    </Card>
  );
}

/* ---------------- What-If ---------------- */
const SCENARIOS: Record<string, { crowd: number; exit: number; vol: number; risk: string; riskColor: string; conf: number }> = {
  "Heavy Rain": { crowd: 12, exit: 18, vol: 32, risk: "High", riskColor: "text-fifa-red", conf: 92 },
  "Power Failure": { crowd: 25, exit: 42, vol: 78, risk: "Critical", riskColor: "text-fifa-red", conf: 88 },
  "Extra Time": { crowd: 8, exit: 11, vol: 14, risk: "Medium", riskColor: "text-fifa-gold", conf: 95 },
  "Metro Shutdown": { crowd: 18, exit: 33, vol: 55, risk: "High", riskColor: "text-fifa-red", conf: 90 },
  "Peak Attendance": { crowd: 6, exit: 9, vol: 22, risk: "Medium", riskColor: "text-fifa-gold", conf: 96 },
};
function WhatIf({ addNotif }: { addNotif: (s: string) => void }) {
  const [scenario, setScenario] = useState("Heavy Rain");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(SCENARIOS["Heavy Rain"]);
  const run = () => {
    setRunning(true);
    setTimeout(() => {
      setResult(SCENARIOS[scenario]);
      setRunning(false);
      toast.success(`Simulation complete: ${scenario}`, { description: `${SCENARIOS[scenario].conf}% AI confidence` });
      addNotif(`Simulation "${scenario}" completed — risk ${SCENARIOS[scenario].risk}`);
    }, 900);
  };
  const rows = [
    { icon: Users2, label: "Crowd Increase", val: `+${result.crowd}%`, color: "text-fifa-gold" },
    { icon: Clock, label: "Avg. Exit Time", val: `+${result.exit} min`, color: "text-fifa-gold" },
    { icon: Users, label: "Volunteer Need", val: `+${result.vol}`, color: "text-fifa-red" },
    { icon: AlertTriangle, label: "Incident Risk", val: result.risk, color: result.riskColor },
  ];
  return (
    <Card title="What-If Simulator">
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <select value={scenario} onChange={(e) => setScenario(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-md text-sm px-2.5 py-2 text-white outline-none focus:border-fifa-blue">
            {Object.keys(SCENARIOS).map((s) => <option key={s}>{s}</option>)}
          </select>
          <button onClick={run} disabled={running} className="px-3 py-2 rounded-md bg-fifa-blue text-white text-xs font-semibold shadow-lg shadow-fifa-blue/30 hover:brightness-110 disabled:opacity-60 flex items-center gap-1.5">
            {running && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {running ? "Running…" : "Run Simulation"}
          </button>
        </div>
        <div>
          <div className="text-[10px] text-muted-foreground mb-2">Simulation Result (Next 60 min)</div>
          <div className="space-y-1.5">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-xs py-1">
                <span className="flex items-center gap-2 text-white/80"><r.icon className="w-3.5 h-3.5" />{r.label}</span>
                <span className={`font-bold ${r.color}`}>{r.val}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-white/80">AI Confidence</span>
              <span className="font-bold">{result.conf}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-fifa-blue to-fifa-green transition-all duration-700" style={{ width: `${result.conf}%` }} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- AI Chat ---------------- */
type ChatMsg = { role: "user" | "assistant"; content: string };
function AiChat({ inputRef }: { inputRef: React.RefObject<HTMLInputElement | null> }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "assistant", content: "Hello Ops Admin,\nHow can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" }); }, [messages, loading]);

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setMessages([...next, { role: "assistant", content: data.content || "(no response)" }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      toast.error("AI unavailable", { description: msg });
      setMessages([...next, { role: "assistant", content: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["What will happen in next 20 minutes?", "Where should we deploy more volunteers?"];

  return (
    <Card id="ai" title="AI Command Center" right={<span className="text-[10px] text-muted-foreground">⌘K</span>}>
      <div className="p-4 space-y-3">
        <div ref={scrollRef} className="space-y-3 max-h-[220px] overflow-auto pr-1">
          {messages.map((m, i) => (
            m.role === "assistant" ? (
              <div key={i} className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fifa-blue to-fifa-red grid place-items-center shrink-0"><Bot className="w-4 h-4" /></div>
                <div className="rounded-lg bg-white/5 px-3 py-2 text-xs whitespace-pre-wrap leading-relaxed">{m.content}</div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="rounded-lg bg-fifa-blue/25 border border-fifa-blue/30 px-3 py-2 text-xs max-w-[85%]">{m.content}</div>
              </div>
            )
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fifa-blue to-fifa-red grid place-items-center shrink-0"><Bot className="w-4 h-4" /></div>
              <div className="rounded-lg bg-white/5 px-3 py-2 text-xs flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-fifa-blue animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-fifa-blue animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-fifa-blue animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}
        </div>
        {messages.length <= 1 && (
          <div className="flex flex-col items-end gap-2">
            {suggestions.map((t) => (
              <button key={t} onClick={() => send(t)} className="text-xs px-3 py-2 rounded-lg bg-fifa-blue/20 border border-fifa-blue/30 text-white/90 hover:bg-fifa-blue/30 transition text-left">{t}</button>
            ))}
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2 pt-1" aria-label="Ask FIFA Pulse AI">
          <label htmlFor="ai-chat-input" className="sr-only">Message FIFA Pulse AI</label>
          <input id="ai-chat-input" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything…" maxLength={2000} autoComplete="off" className="flex-1 bg-white/5 border border-white/10 rounded-md text-xs px-3 py-2 outline-none focus:border-fifa-blue focus-visible:ring-2 focus-visible:ring-fifa-blue" />
          <button type="submit" disabled={loading || !input.trim()} aria-label="Send message" className="w-9 h-9 rounded-md bg-fifa-blue grid place-items-center disabled:opacity-50 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-blue transition"><Send className="w-4 h-4" aria-hidden="true" /></button>
        </form>
      </div>
    </Card>
  );
}

/* ---------------- Right rail ---------------- */
function Heatmap() {
  const rnd = useMemo(() => seeded(7), []);
  const [t, setT] = useState(0);
  const cells = useMemo(() => Array.from({ length: 200 }, () => rnd()), [rnd]);
  const times = ["Now", "+15m", "+30m", "+45m", "+60m"];
  return (
    <Card title="Live Crowd Heatmap">
      <div className="p-4">
        <div className="text-[10px] text-muted-foreground mb-2">Real-time Density</div>
        <div className="relative aspect-square rounded-xl overflow-hidden bg-navy border border-white/5">
          <div className="absolute inset-4 rounded-[50%] overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-[repeat(20,1fr)]">
              {cells.map((c, i) => {
                const intensity = Math.min(1, c + t * 0.3 + Math.sin(i * 0.3 + t) * 0.15);
                const hue = 250 - intensity * 230;
                return <div key={i} style={{ background: `oklch(${0.5 + intensity * 0.2} ${0.2 + intensity * 0.1} ${hue} / ${0.3 + intensity * 0.7})` }} />;
              })}
            </div>
          </div>
          <div className="absolute inset-[28%] rounded-md bg-fifa-green/70 border border-white/30" />
        </div>
        <div className="flex justify-between mt-3 gap-1">
          {times.map((tl, i) => (
            <button key={tl} onClick={() => setT(i / 4)} className={`flex-1 text-[10px] py-1 rounded transition ${i === Math.round(t * 4) ? "bg-fifa-blue text-white" : "text-muted-foreground hover:bg-white/5"}`}>{tl}</button>
          ))}
        </div>
      </div>
    </Card>
  );
}

function AiRec({ onDeploy }: { onDeploy: () => void }) {
  return (
    <Card title="AI Recommendation">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fifa-blue to-fifa-red grid place-items-center"><Bot className="w-4 h-4" /></div>
            <div className="text-xs font-bold">FIFA PULSE AI</div>
          </div>
          <span className="text-[10px] text-muted-foreground">Just now</span>
        </div>
        <p className="text-xs leading-relaxed text-white/85">Gate C is likely to overflow in <span className="text-fifa-gold font-bold">18 minutes</span>. AI suggests opening <span className="text-fifa-blue font-bold">Gate D2</span> and deploying <span className="text-fifa-green font-bold">15 volunteers</span> to Zone C.</p>
        <button onClick={onDeploy} className="w-full mt-3 py-2 rounded-md bg-fifa-blue text-white text-xs font-semibold shadow-lg shadow-fifa-blue/30 hover:brightness-110 active:scale-[0.98] transition">Deploy Now</button>
      </div>
    </Card>
  );
}

function TopAlerts({ alerts, onAck }: { alerts: Alert[]; onAck: (id: string) => void }) {
  return (
    <Card title="Top Alerts" right={<button className="text-[10px] text-fifa-blue hover:underline">View all</button>}>
      <div className="p-2">
        {alerts.length === 0 && <div className="text-xs text-muted-foreground text-center py-6">No active alerts</div>}
        {alerts.map((a) => (
          <div key={a.id} className={`group flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition ${a.ack ? "opacity-50" : ""}`}>
            <div className={`w-8 h-8 rounded-md ${a.bg} grid place-items-center shrink-0`}><a.icon className={`w-4 h-4 ${a.tint}`} /></div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{a.title}</div>
              <div className="text-[10px] text-muted-foreground truncate">{a.sub}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${a.tagColor}`}>{a.tag}</span>
              {!a.ack && <button onClick={() => onAck(a.id)} className="opacity-0 group-hover:opacity-100 text-[9px] text-fifa-green hover:underline flex items-center gap-0.5"><Check className="w-2.5 h-2.5" />ACK</button>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function QuickActions({ onAction, onClose }: { onAction: (label: string) => void; onClose: () => void }) {
  const actions = [
    { icon: Megaphone, label: "Announcement", tint: "text-fifa-gold" },
    { icon: DoorOpen, label: "Open Gate", tint: "text-fifa-blue" },
    { icon: UserPlus, label: "Deploy Volunteer", tint: "text-fifa-green" },
    { icon: HeartPulse, label: "Medical Alert", tint: "text-fifa-red" },
    { icon: Car, label: "Traffic Update", tint: "text-fifa-blue" },
    { icon: FileText, label: "Generate Report", tint: "text-fifa-gold" },
  ];
  return (
    <Card title="Quick Actions" right={<button onClick={onClose} className="text-muted-foreground hover:text-white"><X className="w-3.5 h-3.5" /></button>}>
      <div className="p-3 grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <button key={a.label} onClick={() => onAction(a.label)} className="rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 p-3 flex flex-col items-center gap-1.5 transition-all hover:-translate-y-0.5 active:scale-95">
            <a.icon className={`w-5 h-5 ${a.tint}`} />
            <span className="text-[10px] text-white/80 text-center leading-tight">{a.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ---------------- Bottom ---------------- */
function Transport() {
  const items = [
    { icon: ParkingCircle, label: "Parking", val: "92% Full", tint: "text-fifa-blue", bg: "bg-fifa-blue/15" },
    { icon: TrainFront, label: "Metro", val: "Good", tint: "text-fifa-green", bg: "bg-fifa-green/15" },
    { icon: Bus, label: "Buses", val: "On Time", tint: "text-fifa-red", bg: "bg-fifa-red/15" },
    { icon: Car, label: "Taxis", val: "High Demand", tint: "text-fifa-gold", bg: "bg-fifa-gold/15" },
  ];
  return (
    <Card title="Transport Overview">
      <div className="p-4 grid grid-cols-4 gap-3">
        {items.map((i) => (
          <div key={i.label} className="flex flex-col items-center gap-1.5">
            <div className={`w-11 h-11 rounded-full ${i.bg} grid place-items-center`}><i.icon className={`w-5 h-5 ${i.tint}`} /></div>
            <div className="text-[11px] font-semibold">{i.label}</div>
            <div className="text-[10px] text-muted-foreground text-center">{i.val}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Sustainability() {
  const items = [
    { icon: Zap, label: "Energy Saved", val: "18,420 kWh", tint: "text-fifa-gold" },
    { icon: Droplets, label: "Water Saved", val: "42,300 L", tint: "text-fifa-blue" },
    { icon: Recycle, label: "Waste Diverted", val: "68%", tint: "text-fifa-green" },
    { icon: TreePine, label: "CO₂ Reduced", val: "24.6 t", tint: "text-fifa-green" },
  ];
  return (
    <Card id="bottom" title="Sustainability Tracker">
      <div className="p-4 grid grid-cols-4 gap-3">
        {items.map((i) => (
          <div key={i.label} className="flex flex-col items-center gap-1.5">
            <div className="w-11 h-11 rounded-full bg-white/5 grid place-items-center"><i.icon className={`w-5 h-5 ${i.tint}`} /></div>
            <div className="text-[11px] font-semibold text-center leading-tight">{i.label}</div>
            <div className="text-[10px] text-muted-foreground">{i.val}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Momentum() {
  const w = 320, h = 90;
  const gen = (s: number) => { const r = seeded(s); return Array.from({ length: 40 }, (_, i) => 45 + Math.sin(i * 0.4) * 10 + r() * 15); };
  const bra = useMemo(() => gen(1), []);
  const fra = useMemo(() => gen(2), []);
  const path = (arr: number[]) => arr.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (arr.length - 1)) * w} ${h - v}`).join(" ");
  return (
    <Card title="Match Momentum" right={<ChevronRight className="w-4 h-4 text-muted-foreground" />}>
      <div className="p-4">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[90px]">
          <path d={path(bra)} stroke="oklch(0.62 0.17 148)" strokeWidth="1.8" fill="none" />
          <path d={path(fra)} stroke="oklch(0.55 0.17 250)" strokeWidth="1.8" fill="none" />
        </svg>
        <div className="flex justify-between text-[10px] mt-2">
          <span className="text-fifa-green font-bold">BRA <span className="text-white">68%</span></span>
          <span className="text-fifa-blue font-bold">FRA <span className="text-white">32%</span></span>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- Gate detail modal ---------------- */
function GateModal({ gate, onClose }: { gate: Gate | null; onClose: () => void }) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!gate) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [gate, onClose]);

  if (!gate) return null;
  const pct = Math.round((gate.current / gate.capacity) * 100);
  const predPct = Math.round((gate.predicted / gate.capacity) * 100);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-modal-title"
      className="fixed inset-0 z-50 grid place-items-center bg-navy-deep/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-navy-deep border border-white/10 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] tracking-widest text-muted-foreground">GATE DETAIL</div>
            <div id="gate-modal-title" className={`text-3xl font-black ${gate.color}`}>GATE {gate.id}</div>
          </div>
          <button ref={closeBtnRef} type="button" onClick={onClose} aria-label="Close gate detail" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 grid place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-blue"><X className="w-4 h-4" aria-hidden="true" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Current occupancy</span><span className="font-bold tabular-nums">{fmt(gate.current)} / {fmt(gate.capacity)} · {pct}%</span></div>
            <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Current occupancy" className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-fifa-blue" style={{ width: `${pct}%` }} /></div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Predicted peak (60 min)</span><span className="font-bold tabular-nums">{fmt(gate.predicted)} · {predPct}%</span></div>
            <div role="progressbar" aria-valuenow={Math.min(100, predPct)} aria-valuemin={0} aria-valuemax={100} aria-label="Predicted peak" className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-fifa-red" style={{ width: `${Math.min(100, predPct)}%` }} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/5 p-3"><div className="text-muted-foreground text-[10px] uppercase tracking-wider">Risk</div><div className={`font-bold ${gate.color}`}>{gate.risk}</div></div>
            <div className="rounded-lg bg-white/5 p-3"><div className="text-muted-foreground text-[10px] uppercase tracking-wider">ETA to peak</div><div className="font-bold">46 min</div></div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => { toast.success(`Volunteers dispatched to Gate ${gate.id}`); onClose(); }} className="flex-1 py-2 rounded-md bg-fifa-blue text-white text-xs font-semibold hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-blue">Deploy Team</button>
            <button type="button" onClick={() => { toast(`Gate ${gate.id} announcement broadcast`); onClose(); }} className="flex-1 py-2 rounded-md bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-blue">Announce</button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------------- Dashboard ---------------- */
function Dashboard() {
  const [dark, setDark] = useState(true);
  const [nav, setNav] = useState<NavKey>("dashboard");
  const [heatOn, setHeatOn] = useState(true);
  const [gates, setGates] = useState(BASE_GATES);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [alerts, setAlerts] = useState(BASE_ALERTS);
  const [predGate, setPredGate] = useState("C");
  const [notifs, setNotifs] = useState<string[]>(["Metro Blue Line delayed 7 min", "Gate C occupancy 94%"]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(true);
  const [minute, setMinute] = useState(78.6);
  const [attendance, setAttendance] = useState(82405);
  const [wait, setWait] = useState(18);
  const [incidents] = useState(3);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Theme toggle
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  }, [dark]);

  // Live ticker
  useEffect(() => {
    const id = setInterval(() => {
      setMinute((m) => (m + 1 / 60) % 90);
      setAttendance((a) => Math.min(88000, a + Math.floor(Math.random() * 8 - 2)));
      setWait((w) => Math.max(12, Math.min(24, w + (Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? 1 : -1))));
      setGates((gs) => gs.map((g) => ({ ...g, current: Math.max(0, Math.min(g.capacity, g.current + Math.floor(Math.random() * 20 - 8))) })));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // ⌘K focus chat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); chatInputRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleNav = (k: NavKey) => {
    setNav(k);
    const item = NAV.find((n) => n.key === k)!;
    document.getElementById(item.section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (k === "alerts") setNotifOpen(false);
  };

  const addNotif = (s: string) => setNotifs((n) => [s, ...n].slice(0, 10));

  const doAction = (label: string) => {
    toast.success(`${label} triggered`, { description: "Operation logged to command center." });
    addNotif(`${label} action executed by Ops Admin`);
  };

  const deployNow = () => {
    toast.success("Deployment initiated", { description: "Opening Gate D2 · dispatching 15 volunteers to Zone C" });
    setGates((gs) => gs.map((g) => g.id === "C" ? { ...g, predicted: Math.max(g.current, g.predicted - 600), risk: "HIGH", color: "text-fifa-red" } : g));
    addNotif("Deployed 15 volunteers to Zone C · Gate D2 opened");
  };

  const ackAlert = (id: string) => {
    setAlerts((as) => as.map((a) => a.id === id ? { ...a, ack: true } : a));
    toast.success("Alert acknowledged");
  };

  return (
    <div id="top" className="min-h-dvh text-foreground flex">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:rounded-md focus:bg-fifa-blue focus:text-white">Skip to main content</a>
      <Sidebar active={nav} onSelect={handleNav} dark={dark} setDark={setDark} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar minute={minute} notifOpen={notifOpen} setNotifOpen={setNotifOpen} notifications={notifs} clearNotifs={() => setNotifs([])} />
        <main id="main-content" aria-label="Command center" className="flex-1 overflow-auto p-5">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
            <div className="space-y-5 min-w-0">
              <KpiRow attendance={attendance} wait={wait} incidents={incidents} />
              <StadiumTwin gates={gates} onGate={setSelectedGate} heatOn={heatOn} setHeatOn={setHeatOn} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <PredictionTimeline gateId={predGate} setGateId={setPredGate} />
                <WhatIf addNotif={addNotif} />
                <AiChat inputRef={chatInputRef} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Transport />
                <Sustainability />
                <Momentum />
              </div>
            </div>

            <div id="rail" className="space-y-5">
              <Heatmap />
              <AiRec onDeploy={deployNow} />
              <TopAlerts alerts={alerts} onAck={ackAlert} />
              {quickOpen && <QuickActions onAction={doAction} onClose={() => setQuickOpen(false)} />}
              {!quickOpen && (
                <button onClick={() => setQuickOpen(true)} className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-muted-foreground">Show Quick Actions</button>
              )}
            </div>
          </div>
        </main>
      </div>
      <GateModal gate={selectedGate} onClose={() => setSelectedGate(null)} />
    </div>
  );
}
