"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";

const TABS = [
  {
    id: "command-center",
    label: "Command Center",
    title: "Executive Dashboard",
    subtitle: "Carbon, water, and thermal routing efficiency",
  },
  {
    id: "router-studio",
    label: "Router Studio",
    title: "Router Studio",
    subtitle: "Choose where and when workloads should run",
  },
  {
    id: "audit-ledger",
    label: "Audit Ledger",
    title: "Compliance Audit Trail",
    subtitle: "Traceable records for sustainability reporting",
  },
];

const NAV_ICONS = {
  "command-center": (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  "router-studio": (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  "audit-ledger": (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
};

const STREAM_ROWS = [
  { id: "#R-9042", name: "Llama-3-70B-BF16", desc: "Batch inference · 500k tokens/sec", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-74.1%", water: "120 L/hr", status: "Dispatched", statusColor: "emerald" },
  { id: "#R-9041", name: "Mistral-Large-Embed", desc: "Vector database embeddings", dest: "US-West-2 (Oregon)", destColor: "blue", carbon: "-58.4%", water: "85 L/hr", status: "Completed", statusColor: "slate" },
  { id: "#R-9040", name: "StableDiffusion-XL-FineTune", desc: "3D rendering / diffusion", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-72.8%", water: "110 L/hr", status: "Completed", statusColor: "slate" },
];

const LEDGER_ROWS = [
  { id: "#JOB-8841", time: "Just now", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-74.1%", carbonSaved: "38.2 kg saved", water: "-120 L", rationale: "Low carbon intensity; waste heat exported to the city grid." },
  { id: "#JOB-8840", time: "12m ago", dest: "US-West-2 (Oregon)", destColor: "blue", carbon: "-58.4%", carbonSaved: "21.5 kg saved", water: "-85 L", rationale: "Hydro power used during the selected green-energy window." },
  { id: "#JOB-8839", time: "45m ago", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-72.8%", carbonSaved: "44.0 kg saved", water: "-110 L", rationale: "Residency constraint applied; zero-carbon grid selected." },
];

const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

function DestBadge({ dest, color }) {
  const styles = color === "blue"
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const dot = color === "blue" ? "bg-blue-500" : "bg-emerald-500";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-medium ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {dest}
    </span>
  );
}

function StatusBadge({ status, color }) {
  const styles = color === "emerald"
    ? "bg-emerald-50 text-emerald-700"
    : "bg-slate-100 text-slate-600";

  return <span className={`inline-flex rounded px-2.5 py-1 text-xs font-semibold ${styles}`}>{status}</span>;
}

function MetricCard({ label, value, suffix, detail, icon, tone = "blue", children }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <motion.div variants={fadeInUp} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <span className="max-w-[170px] text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</div>
      </div>
      <div className="mt-5 text-[30px] font-bold tracking-tight text-slate-950">
        {children || <>{value}{suffix}</>}
      </div>
      <div className={`mt-1.5 text-sm font-medium ${tone === "amber" ? "text-amber-600" : tone === "green" ? "text-emerald-600" : "text-slate-600"}`}>
        {detail}
      </div>
    </motion.div>
  );
}

function RegionNode({ name, subtitle, hasData, selected, populated }) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`rounded-xl border p-5 transition-colors ${selected ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200 bg-slate-50/40"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${hasData ? populated.dotColor : "bg-slate-400"}`} />
            <div>
              <h3 className="text-lg font-bold leading-tight text-slate-950">{name}</h3>
              <p className="mt-1 text-sm leading-5 text-slate-600">{subtitle}</p>
            </div>
          </div>
        </div>
        {hasData ? (
          <span className={`shrink-0 rounded-md border px-2.5 py-1 text-xs font-semibold ${populated.badgeBg}`}>{populated.badgeText}</span>
        ) : (
          <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">Standby</span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-slate-200/80 pt-4 text-sm">
        <div>
          <span className="block text-xs text-slate-500">Carbon intensity</span>
          <span className="font-semibold text-slate-800">{hasData ? populated.carbon : "-- gCO2e/kWh"}</span>
        </div>
        <div>
          <span className="block text-xs text-slate-500">Water stress</span>
          <span className="font-semibold text-slate-800">{hasData ? populated.wsi : "--"}</span>
        </div>
        <div>
          <span className="block text-xs text-slate-500">Thermal loop</span>
          <span className="font-semibold text-slate-800">{hasData ? populated.thermal : "--"}</span>
        </div>
        <div>
          <span className="block text-xs text-slate-500">Latency SLA</span>
          <span className="font-semibold text-slate-800">{hasData ? populated.latency : "-- ms"}</span>
        </div>
      </div>
    </motion.div>
  );
}

function EnvironmentalMap() {
  const regions = [
    {
      name: "Oregon",
      code: "US-West",
      carbon: "142 gCO2e/kWh",
      water: "4.2 · Critical",
      heat: "N/A",
      latency: "24 ms",
      pos: "left-[25%] top-[39%]",
      card: "left-[8%] top-[48%]",
      dot: "bg-red-500",
      badge: "High water stress",
      badgeClass: "border-red-200 bg-red-50 text-red-700",
    },
    {
      name: "Stockholm",
      code: "EU-North-1",
      carbon: "14 gCO2e/kWh",
      water: "0.12 · Ultra low",
      heat: "82°C active",
      latency: "38 ms",
      pos: "left-[56%] top-[27%]",
      card: "left-[59%] top-[9%]",
      dot: "bg-emerald-500",
      badge: "Recommended",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      selected: true,
    },
    {
      name: "Mumbai",
      code: "AP-South",
      carbon: "380 gCO2e/kWh",
      water: "2.1 · Moderate",
      heat: "Solar sync",
      latency: "112 ms",
      pos: "left-[75%] top-[63%]",
      card: "left-[65%] top-[67%]",
      dot: "bg-amber-500",
      badge: "Thermal constraint",
      badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="relative mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <div className="absolute left-4 top-3 z-10 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Global compute network
      </div>

      <div className="relative h-[360px] sm:h-[390px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 520" aria-hidden="true">
          <defs>
            <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
              <path d="M46 0H0V46" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            </pattern>
            <linearGradient id="route" x1="0" x2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="7" result="blur" />
            </filter>
          </defs>

          <rect width="1000" height="520" fill="url(#grid)" opacity="0.58" />

          <g fill="#dbe5ef" opacity="0.92">
            <path d="M85 144l35-35 40 7 27 25-16 31-23 12-18 34-33 2-19-27z" />
            <path d="M188 204l36-19 44 8 22 24-18 24-8 42-27 36-29-9-9-39-28-20z" />
            <path d="M306 131l34-19 52 4 30 24-7 32-24 18-5 34-32 19-27-18-17-35-22-10z" />
            <path d="M401 197l35-11 41 12 29 25-7 31-28 17-36-3-26-21z" />
            <path d="M533 170l41-24 49 7 35 25-8 29-34 13-18 31-39-7-23-32z" />
            <path d="M583 265l32-17 35 12 19 28-14 27-32 10-24-18z" />
            <path d="M718 304l37-20 35 6 26 26-13 27-34 9-32-11z" />
            <path d="M805 170l34-18 38 4 25 21-9 28-34 15-31-18z" />
          </g>

          <g stroke="url(#route)" strokeWidth="5" strokeDasharray="12 12" fill="none" strokeLinecap="round">
            <path d="M254 206 C355 125 460 114 560 143" />
            <path d="M754 335 C690 258 622 207 560 143" />
          </g>

          <circle cx="560" cy="143" r="20" fill="#10b981" opacity="0.16" filter="url(#glow)" />
          <circle cx="560" cy="143" r="11" fill="#10b981" stroke="#fff" strokeWidth="4" />
          <circle cx="254" cy="206" r="9" fill="#ef4444" stroke="#fff" strokeWidth="4" />
          <circle cx="754" cy="335" r="9" fill="#f59e0b" stroke="#fff" strokeWidth="4" />

          <text x="34" y="490" fill="#94a3b8" fontSize="13" fontFamily="inherit">West</text>
          <text x="916" y="490" fill="#94a3b8" fontSize="13" fontFamily="inherit">East</text>
        </svg>

        {regions.map((region) => (
          <div key={region.name}>
            <span className={`absolute ${region.pos} z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm ${region.dot}`} />
            <div className={`absolute ${region.card} z-20 w-[205px] rounded-xl border bg-white p-3.5 shadow-lg ${region.selected ? "border-emerald-300 ring-4 ring-emerald-100/60" : "border-slate-200"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${region.dot}`} />
                    <span className="text-sm font-bold text-slate-950">{region.name}</span>
                  </div>
                  <div className="mt-0.5 text-[10px] font-medium text-slate-400">{region.code}</div>
                </div>
                <span className={`shrink-0 rounded border px-1.5 py-1 text-[9px] font-semibold ${region.badgeClass}`}>{region.badge}</span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-100 pt-3 text-[10px]">
                <div><span className="block text-slate-400">Carbon</span><span className="font-semibold text-slate-800">{region.carbon}</span></div>
                <div><span className="block text-slate-400">Water stress</span><span className="font-semibold text-slate-800">{region.water}</span></div>
                <div><span className="block text-slate-400">Heat loop</span><span className="font-semibold text-slate-800">{region.heat}</span></div>
                <div><span className="block text-slate-400">Latency</span><span className="font-semibold text-slate-800">{region.latency}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-bold text-emerald-900">Recommended target · EU-North-1 (Stockholm)</div>
            <div className="mt-1 text-xs leading-5 text-emerald-700">74.1% lower carbon emissions · 120 L/hr water savings · district heat available</div>
          </div>
          <span className="inline-flex w-fit items-center rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">Selected route</span>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, description, compact = false }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 text-center ${compact ? "min-h-52 p-8" : "min-h-64 p-10"}`}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-5 text-slate-500">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("command-center");
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deadlineVal, setDeadlineVal] = useState(12);
  const [geoFence, setGeoFence] = useState(true);
  const [countKey, setCountKey] = useState(0);

  const switchTab = useCallback((tabId) => setActiveTab(tabId), []);

  const toggleAppState = useCallback(() => {
    setHasData((prev) => {
      if (!prev) setCountKey((key) => key + 1);
      return !prev;
    });
  }, []);

  const runPlacementAnalysis = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasData(true);
      setCountKey((key) => key + 1);
      setActiveTab("command-center");
    }, 1600);
  }, [isLoading]);

  const currentTab = TABS.find((tab) => tab.id === activeTab) || TABS[0];

  const metricIcons = {
    water: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>,
    carbon: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>,
    heat: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>,
    compliance: <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>,
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white md:flex md:flex-col md:justify-between">
        <div>
          <Brand />
          <Navigation activeTab={activeTab} switchTab={switchTab} />
        </div>
        <UserFooter />
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Brand compact />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected
          </span>
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto pb-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${activeTab === tab.id ? "bg-blue-50 text-blue-600" : "text-slate-600"}`}
            >
              {NAV_ICONS[tab.id]}{tab.label}
            </button>
          ))}
        </nav>
      </div>

      <main className="min-h-screen px-4 py-5 md:ml-64 md:px-8 md:py-7 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">{currentTab.title}</h1>
            <p className="mt-1 text-sm text-slate-600">{currentTab.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${hasData ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${hasData ? "bg-emerald-500" : "bg-slate-400"}`} />
              {hasData ? "Telemetry active" : "Standby"}
            </div>
            <button
              onClick={toggleAppState}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <svg className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              Demo state
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "command-center" && (
            <motion.div key="command" className="space-y-6 pt-6" initial="initial" animate="animate" variants={stagger}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Water conserved" tone="blue" detail={hasData ? "+18.4% vs baseline" : "No placement run yet"} icon={metricIcons.water}>
                  {hasData ? <span key={countKey}><CountUp end={41850} duration={1.5} separator="," /> L</span> : "0 L"}
                </MetricCard>
                <MetricCard label="Emissions avoided" tone="green" detail={hasData ? "-68.2% vs default routing" : "No placement run yet"} icon={metricIcons.carbon}>
                  {hasData ? <span key={countKey}><CountUp end={1420.8} decimals={1} duration={1.5} separator="," /> kg</span> : "0 kg"}
                </MetricCard>
                <MetricCard label="Heat energy reused" tone="amber" detail={hasData ? "Stockholm district loop" : "Loop idle"} icon={metricIcons.heat}>
                  {hasData ? <span key={countKey}><CountUp end={8.4} decimals={1} duration={1.5} /> MWh</span> : "0 MWh"}
                </MetricCard>
                <MetricCard label="Compliance status" tone={hasData ? "green" : "slate"} detail="CSRD Scope 2/3" icon={metricIcons.compliance}>
                  {hasData ? <span key={countKey}><CountUp end={99.4} decimals={1} duration={1.5} />%</span> : "Standby"}
                </MetricCard>
              </div>

              <motion.section variants={fadeInUp} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">Global data center network</h2>
                    <p className="mt-1 text-sm text-slate-500">{hasData ? "Current operating conditions by region" : "Available compute regions"}</p>
                  </div>
                  {hasData && <span className="text-xs font-medium text-slate-500">3 regions evaluated</span>}
                </div>

                <motion.div className="grid grid-cols-1 gap-4 xl:grid-cols-3" variants={stagger}>
                  <RegionNode name="US-West (Oregon)" subtitle="Hydroelectric & Wind Basin" hasData={hasData} selected={false} populated={{ dotColor: "bg-red-500", badgeBg: "bg-red-50 text-red-700 border-red-200", badgeText: "High water stress", carbon: "142 gCO2e/kWh", wsi: "4.2 · Critical", thermal: "N/A", latency: "24 ms" }} />
                  <RegionNode name="EU-North (Stockholm)" subtitle="Fossil-free grid + district heat" hasData={hasData} selected={hasData} populated={{ dotColor: "bg-emerald-500", badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200", badgeText: "Recommended target", carbon: "14 gCO2e/kWh", wsi: "0.12 · Ultra low", thermal: "82°C active", latency: "38 ms" }} />
                  <RegionNode name="AP-South (Mumbai)" subtitle="Solar curtailment corridor" hasData={hasData} selected={false} populated={{ dotColor: "bg-amber-500", badgeBg: "bg-amber-50 text-amber-700 border-amber-200", badgeText: "Thermal constraint", carbon: "380 gCO2e/kWh", wsi: "2.1 · Moderate", thermal: "Solar sync", latency: "112 ms" }} />
                </motion.div>

                {hasData && (
                  <div className="mt-5 flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-emerald-900">Current route · EU-North-1 (Stockholm)</div>
                      <div className="mt-1 text-sm text-emerald-700">74.1% lower carbon · 120 L/hr water savings · district heat available</div>
                    </div>
                    <span className="shrink-0 rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800">Recommended</span>
                  </div>
                )}
              </motion.section>

              <motion.section variants={fadeInUp} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-slate-950">Live activity</h2>
                  <p className="mt-1 text-sm text-slate-500">Recent workloads and routing outcomes</p>
                </div>
                {!hasData ? (
                  <EmptyState compact title="No routing events" description="Run a placement analysis in Router Studio to populate this stream." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          <th className="px-3 py-3">Dispatch</th>
                          <th className="px-3 py-3">Workload</th>
                          <th className="px-3 py-3">Destination</th>
                          <th className="px-3 py-3">Carbon</th>
                          <th className="px-3 py-3">Water</th>
                          <th className="px-3 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {STREAM_ROWS.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50">
                            <td className="px-3 py-4 font-semibold text-slate-900">{row.id}</td>
                            <td className="px-3 py-4"><div className="font-semibold text-slate-900">{row.name}</div><div className="mt-0.5 text-xs text-slate-500">{row.desc}</div></td>
                            <td className="px-3 py-4"><DestBadge dest={row.dest} color={row.destColor} /></td>
                            <td className="px-3 py-4 font-semibold text-emerald-600">{row.carbon}</td>
                            <td className="px-3 py-4 font-semibold text-blue-600">{row.water}</td>
                            <td className="px-3 py-4"><StatusBadge status={row.status} color={row.statusColor} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.section>
            </motion.div>
          )}

          {activeTab === "router-studio" && (
            <motion.div key="router" className="pt-6" initial="initial" animate="animate" variants={stagger}>
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                <motion.section variants={fadeInUp} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-5">
                  <div className="border-b border-slate-100 pb-5">
                    <h2 className="text-lg font-bold text-slate-950">Workload constraints</h2>
                    <p className="mt-1 text-sm text-slate-500">Set workload requirements and deadline flexibility.</p>
                  </div>

                  <div className="space-y-5 pt-5">
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Workload name / job identifier</span>
                      <input defaultValue="Llama-3 Fine-Tuning (70B-Instruct)" className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Workload category</span>
                      <select defaultValue="llm" className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                        <option value="llm">LLM Batch Inference · High Throughput</option>
                        <option value="embedding">Vector Embeddings</option>
                        <option value="diffusion">Diffusion / Rendering</option>
                      </select>
                    </label>

                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-700">Execution window</span>
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{deadlineVal} hours</span>
                      </div>
                      <input type="range" min="0" max="48" step="12" value={deadlineVal} onChange={(e) => setDeadlineVal(Number(e.target.value))} className="mt-4 w-full accent-blue-600" />
                      <div className="mt-1 flex justify-between text-xs text-slate-500">
                        <span>0h · Instant</span><span>24h · Standard</span><span>48h · Max shift</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">Strict data residency</div>
                        <div className="mt-0.5 max-w-sm text-xs leading-5 text-slate-500">Restrict compute to EU-GDPR compliant regions.</div>
                      </div>
                      <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                        <input type="checkbox" checked={geoFence} onChange={(e) => setGeoFence(e.target.checked)} className="peer sr-only" />
                        <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" />
                      </label>
                    </div>

                    <button onClick={runPlacementAnalysis} disabled={isLoading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-80">
                      {isLoading ? <><svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Running placement analysis…</> : <><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>Run placement analysis</>}
                    </button>
                  </div>
                </motion.section>

                <motion.section variants={fadeInUp} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-7">
                  {!hasData ? (
                    <div className="flex h-full min-h-[430px] flex-col justify-center">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-slate-950">Environmental impact</h2>
                          <p className="mt-1 text-sm text-slate-500">Compare carbon and water trade-offs across regions.</p>
                        </div>
                      </div>
                      <EmptyState title="Analysis ready" description="Set the workload constraints and run the placement analysis." />
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-slate-950">Environmental impact</h2>
                          <p className="mt-1 text-sm text-slate-500">Carbon intensity vs. water usage</p>
                        </div>
                        <span className="text-xs font-medium text-emerald-700">Analysis complete</span>
                      </div>

                      <EnvironmentalMap />

/div>


                    </div>
                  )}
                </motion.section>
              </div>
            </motion.div>
          )}

          {activeTab === "audit-ledger" && (
            <motion.div key="audit" className="space-y-5 pt-6" initial="initial" animate="animate" variants={stagger}>
              <motion.div variants={fadeInUp} className="flex justify-end">
                <button onClick={() => alert("Exporting CSRD Scope 2/3 Compliance Report (PDF)...")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  Export CSRD report
                </button>
              </motion.div>

              <motion.section variants={fadeInUp} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {!hasData ? (
                  <div className="p-6 sm:p-8"><EmptyState title="No routing decisions logged" description="Run a placement analysis in Router Studio to generate an audited record." /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          <th className="px-4 py-3.5">Job ID</th><th className="px-4 py-3.5">Timestamp</th><th className="px-4 py-3.5">Target region</th><th className="px-4 py-3.5">Carbon delta</th><th className="px-4 py-3.5">Water delta</th><th className="px-4 py-3.5">Rationale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {LEDGER_ROWS.map((row) => (
                          <tr key={row.id} className="transition hover:bg-slate-50">
                            <td className="px-4 py-4 font-semibold text-slate-900">{row.id}</td>
                            <td className="whitespace-nowrap px-4 py-4 text-slate-600">{row.time}</td>
                            <td className="px-4 py-4"><DestBadge dest={row.dest} color={row.destColor} /></td>
                            <td className="px-4 py-4 font-semibold text-emerald-600">{row.carbon}<span className="ml-1 text-xs font-normal text-slate-500">({row.carbonSaved})</span></td>
                            <td className="px-4 py-4 font-semibold text-blue-600">{row.water}</td>
                            <td className="max-w-md px-4 py-4 leading-5 text-slate-600">{row.rationale}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function GlobeMark({ size = "md" }) {
  const sizes = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const icon = size === "sm" ? "h-6 w-6" : "h-6 w-6";

  return (
    <span className={`relative flex shrink-0 items-center justify-center ${sizes} text-blue-600`}>
      <svg className={`${icon} overflow-visible`} viewBox="0 0 36 36" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="18" cy="18" r="15.2" strokeWidth="2" />
        <path d="M2.8 18h30.4M18 2.8c4.4 4 6.8 9.1 6.8 15.2S22.4 29.2 18 33.2C13.6 29.2 11.2 24.1 11.2 18S13.6 6.8 18 2.8Z" strokeWidth="1.65" />
        <path d="M5.5 10.5c3.8 2.2 8 3.3 12.5 3.3s8.7-1.1 12.5-3.3M5.5 25.5c3.8-2.2 8-3.3 12.5-3.3s8.7 1.1 12.5 3.3" strokeWidth="1.35" />
      </svg>
      <span className="absolute right-0.5 top-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
    </span>
  );
}

function Brand({ compact = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${compact ? "" : "border-b border-slate-100 px-6 py-4"}`}>
      <GlobeMark />
      <div className="min-w-0">
        <div className="text-[22px] font-bold tracking-tight text-slate-950">
          Omni<span className="text-blue-600">Router</span>
        </div>
        {!compact && <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">Compute sustainability</div>}
      </div>
    </div>
  );
}

function Navigation({ activeTab, switchTab }) {
  return (
    <div className="p-3">
      <div className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Navigation</div>
      <nav className="space-y-1">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => switchTab(tab.id)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${activeTab === tab.id ? "bg-blue-50 font-semibold text-blue-600" : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
            {NAV_ICONS[tab.id]}{tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function UserFooter() {
  return (
    <div className="border-t border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-900 text-xs font-semibold text-white">AC</div>
        <div>
          <div className="text-xs font-semibold text-slate-900">Admin · ACME Cloud</div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Connected</div>
        </div>
      </div>
    </div>
  );
}
