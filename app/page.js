"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";

// ──────────────────────────────────────────────
// STATIC DATA
// ──────────────────────────────────────────────
const TABS = [
  { id: "command-center", label: "Command Center", title: "Executive Dashboard", subtitle: "Real-time carbon, water, and thermal routing efficiency" },
  { id: "router-studio", label: "Router Studio", title: "Router Studio", subtitle: "Multi-objective Pareto optimization for carbon-aware workload scheduling" },
  { id: "audit-ledger", label: "Audit Ledger", title: "Compliance Audit Trail", subtitle: "Tamper-evident log of distributed compute routing decisions" },
];

const NAV_ICONS = {
  "command-center": (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  "router-studio": (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
  "audit-ledger": (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  ),
};

const STREAM_ROWS = [
  { id: "#R-9042", name: "Llama-3-70B-BF16", desc: "Batch Inference (500k tokens/sec)", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-74.1%", water: "120 L/hr", status: "Dispatched", statusColor: "emerald" },
  { id: "#R-9041", name: "Mistral-Large-Embed", desc: "Vector DB Embeddings Generation", dest: "US-West-2 (Oregon)", destColor: "blue", carbon: "-58.4%", water: "85 L/hr", status: "Completed", statusColor: "slate" },
  { id: "#R-9040", name: "StableDiffusion-XL-FineTune", desc: "3D Rendering / Diffusion Pipeline", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-72.8%", water: "110 L/hr", status: "Completed", statusColor: "slate" },
];

const LEDGER_ROWS = [
  { id: "#JOB-8841", time: "Just now", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-74.1%", carbonSaved: "38.2 kg saved", water: "-120 L", rationale: "Minimal carbon intensity (14g) + active district heating export heat sink." },
  { id: "#JOB-8840", time: "12m ago", dest: "US-West-2 (Oregon)", destColor: "blue", carbon: "-58.4%", carbonSaved: "21.5 kg saved", water: "-85 L", rationale: "Hydro curtailment window utilized; data residency EU-geo-fence waived." },
  { id: "#JOB-8839", time: "45m ago", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-72.8%", carbonSaved: "44.0 kg saved", water: "-110 L", rationale: "Strict GDPR constraint applied; selected zero-carbon nuclear/hydro grid." },
];

// ──────────────────────────────────────────────
// ANIMATION VARIANTS
// ──────────────────────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ──────────────────────────────────────────────
// SUBCOMPONENTS
// ──────────────────────────────────────────────

function DestBadge({ dest, color }) {
  const colorMap = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  };
  const c = colorMap[color] || colorMap.emerald;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md ${c.bg} ${c.text} font-medium border ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {dest}
    </span>
  );
}

function StatusBadge({ status, color }) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${colorMap[color] || colorMap.slate}`}>
      {status}
    </span>
  );
}

// ──────────────────────────────────────────────
// MAIN PAGE
// ──────────────────────────────────────────────

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("command-center");
  const [hasData, setHasData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deadlineVal, setDeadlineVal] = useState(12);
  const [geoFence, setGeoFence] = useState(true);
  // countUp key increments to re-trigger countup animation
  const [countKey, setCountKey] = useState(0);

  const switchTab = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const toggleAppState = useCallback(() => {
    setHasData((prev) => {
      if (!prev) setCountKey((k) => k + 1);
      return !prev;
    });
  }, []);

  const runPlacementAnalysis = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setHasData(true);
      setCountKey((k) => k + 1);
      setActiveTab("command-center");
    }, 2500);
  }, [isLoading]);

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="bg-slate-50 font-sans text-slate-800 antialiased min-h-screen">
      {/* ─── Fixed Left Sidebar ─── */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between z-30 shadow-xs">
        <div className="flex flex-col">
          {/* App Brand */}
          <div className="h-16 px-6 border-b border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                OmniRouter
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider pl-10 -mt-0.5">
              Compute Sustainability
            </span>
          </div>

          {/* Navigation Menu */}
          <div className="p-3 space-y-1">
            <div className="px-3 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === tab.id
                    ? "font-semibold bg-blue-50 text-blue-600"
                    : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {NAV_ICONS[tab.id]}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-xs text-slate-700">
                AC
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-900">Admin - ACME Cloud</span>
                <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <main className="ml-64 bg-slate-50 min-h-screen p-8 space-y-8">
        {/* Top Utility Bar */}
        <header className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200/80 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{currentTab.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{currentTab.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Telemetry Status Pill */}
            {hasData ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Telemetry (Populated)</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-200/70 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Standby (Empty)</span>
              </div>
            )}
            {/* Toggle State Button */}
            <button
              onClick={toggleAppState}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              Toggle Demo State
            </button>
          </div>
        </header>

        {/* ─── VIEW 1: COMMAND CENTER ─── */}
        {activeTab === "command-center" && (
          <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
            {/* 4 Impact Cards */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={staggerContainer}>
              {/* Water Conserved */}
              <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Conserved</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {hasData ? (
                      <span key={countKey}><CountUp end={41850} duration={2} separator="," /> L</span>
                    ) : (
                      "0 L"
                    )}
                  </div>
                  <div className={`mt-2 text-xs font-medium ${hasData ? "text-emerald-600" : "text-slate-400"}`}>
                    {hasData ? "+18.4% vs baseline" : "Awaiting placement run"}
                  </div>
                </div>
              </motion.div>

              {/* Carbon Diverted */}
              <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Carbon Diverted</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {hasData ? (
                      <span key={countKey}><CountUp end={1420.8} decimals={1} duration={2} separator="," /> kg</span>
                    ) : (
                      "0 kg"
                    )}
                  </div>
                  <div className={`mt-2 text-xs font-medium ${hasData ? "text-emerald-600" : "text-slate-400"}`}>
                    {hasData ? "-68.2% marginal" : "Awaiting placement run"}
                  </div>
                </div>
              </motion.div>

              {/* Heat Energy Reused */}
              <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Heat Energy Reused</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {hasData ? (
                      <span key={countKey}><CountUp end={8.4} decimals={1} duration={2} /> MWh</span>
                    ) : (
                      "0 MWh"
                    )}
                  </div>
                  <div className={`mt-2 text-xs font-medium ${hasData ? "text-amber-600" : "text-slate-400"}`}>
                    {hasData ? "Stockholm District Loop" : "Loop idle"}
                  </div>
                </div>
              </motion.div>

              {/* Compliance Status */}
              <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance Status</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasData ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {hasData ? (
                      <span key={countKey}><CountUp end={99.4} decimals={1} duration={2} />% Compliant</span>
                    ) : (
                      "Standby"
                    )}
                  </div>
                  <div className={`mt-2 text-xs font-medium ${hasData ? "text-slate-600" : "text-slate-400"}`}>
                    CSRD Scope 2/3 verified
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Regional Fabric Topology */}
            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Global Compute Fabric Topology</h2>
                <p className="text-xs text-slate-500 mt-0.5">Autonomous multi-region dispatch paths based on marginal emissions and water stress.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Node 1: US-West (Oregon) */}
                <RegionNode
                  name="US-West (Oregon)"
                  subtitle="Hydroelectric & Wind Basin"
                  hasData={hasData}
                  populated={{
                    dotColor: "bg-red-500",
                    badgeBg: "bg-red-50 text-red-700 border-red-200",
                    badgeText: "High Water Stress Warning",
                    carbon: "142 gCO2e/kWh",
                    wsi: "4.2 (Critical)",
                    thermal: "N/A",
                    latency: "24 ms",
                  }}
                />
                {/* Node 2: EU-North (Stockholm) */}
                <RegionNode
                  name="EU-North (Stockholm)"
                  subtitle="Fossil-Free + District Heat"
                  hasData={hasData}
                  populated={{
                    dotColor: "bg-emerald-500",
                    dotPulse: true,
                    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    badgeText: "Optimal Target - Low WSI & District Heat",
                    carbon: "14 gCO2e/kWh",
                    wsi: "0.12 (Ultra Low)",
                    thermal: "82°C Active",
                    latency: "38 ms",
                  }}
                />
                {/* Node 3: AP-South (Mumbai) */}
                <RegionNode
                  name="AP-South (Mumbai)"
                  subtitle="Solar Curtailment Corridor"
                  hasData={hasData}
                  populated={{
                    dotColor: "bg-amber-500",
                    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
                    badgeText: "Moderate Thermal / Solar Curtailment",
                    carbon: "380 gCO2e/kWh",
                    wsi: "2.1 (Moderate)",
                    thermal: "Solar Sync",
                    latency: "112 ms",
                  }}
                />
              </div>
            </motion.div>

            {/* Live Activity Stream */}
            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Live Activity Stream</h2>
                <p className="text-xs text-slate-500 mt-0.5">Deterministic dispatch decisions committed to verifiable logs.</p>
              </div>
              <AnimatePresence mode="wait">
                {!hasData ? (
                  <motion.div key="stream-empty" {...fadeIn} className="py-14 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">No live routing events</span>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">Submit a placement run in Router Studio to activate stream.</p>
                  </motion.div>
                ) : (
                  <motion.div key="stream-table" {...fadeIn} className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                          <th className="py-3 px-3">DISPATCH ID</th>
                          <th className="py-3 px-3">WORKLOAD DESCRIPTOR</th>
                          <th className="py-3 px-3">DESTINATION</th>
                          <th className="py-3 px-3 text-right">CARBON DELTA</th>
                          <th className="py-3 px-3 text-right">WATER SAVINGS</th>
                          <th className="py-3 px-3 text-right">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {STREAM_ROWS.map((row, i) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.12, duration: 0.4 }}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-3.5 px-3 font-mono font-semibold text-slate-900">{row.id}</td>
                            <td className="py-3.5 px-3">
                              <div className="text-slate-900 font-semibold">{row.name}</div>
                              <div className="text-[11px] text-slate-400 font-normal">{row.desc}</div>
                            </td>
                            <td className="py-3.5 px-3"><DestBadge dest={row.dest} color={row.destColor} /></td>
                            <td className="py-3.5 px-3 text-right font-mono font-semibold text-emerald-600">{row.carbon}</td>
                            <td className="py-3.5 px-3 text-right font-mono text-blue-600 font-semibold">{row.water}</td>
                            <td className="py-3.5 px-3 text-right"><StatusBadge status={row.status} color={row.statusColor} /></td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {/* ─── VIEW 2: ROUTER STUDIO ─── */}
        {activeTab === "router-studio" && (
          <motion.div className="space-y-8" initial="initial" animate="animate" variants={staggerContainer}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (5 Cols) */}
              <motion.div variants={fadeInUp} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold text-slate-900">Workload Placement Constraints</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Configure model profile, temporal elasticity, and sovereignty parameters.</p>
                </div>
                {/* Workload Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Workload Name / Job Identifier</label>
                  <input
                    className="w-full text-xs font-medium rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 text-slate-800 border"
                    type="text"
                    defaultValue="Llama-3 Fine-Tuning (70B-Instruct)"
                  />
                </div>
                {/* Workload Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Workload Category</label>
                  <select className="w-full text-xs font-medium rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 px-3 py-2 text-slate-800 border">
                    <option>LLM Batch Inference (High Throughput)</option>
                    <option>Fine-Tuning / Checkpointing</option>
                    <option>Vector DB Embeddings Generation</option>
                    <option>3D Rendering / Diffusion Pipeline</option>
                  </select>
                </div>
                {/* Deadline Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700">Execution SLA Window</label>
                    <span className="font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {deadlineVal} Hours (Flexible window)
                    </span>
                  </div>
                  <input
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    type="range"
                    min="0"
                    max="48"
                    value={deadlineVal}
                    onChange={(e) => setDeadlineVal(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>0h (Instant)</span>
                    <span>24h (Standard)</span>
                    <span>48h (Max Shift)</span>
                  </div>
                </div>
                {/* Geo-Fence Toggle */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-800 block">Strict Data Residency (Geo-Fence)</span>
                    <span className="text-[11px] text-slate-500 block leading-tight">Restrict compute execution strictly to EU-GDPR compliant sovereign zones.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={geoFence}
                      onChange={() => setGeoFence((v) => !v)}
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
                {/* Action Button */}
                <button
                  onClick={runPlacementAnalysis}
                  disabled={isLoading}
                  className={`w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-medium text-sm py-3 rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all ${
                    isLoading ? "opacity-80 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  )}
                  <span>{isLoading ? "Calculating Pareto Frontier..." : "Run Placement Analysis"}</span>
                </button>
              </motion.div>

              {/* Right Column (7 Cols) */}
              <motion.div variants={fadeInUp} className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between min-h-[480px]">
                <AnimatePresence mode="wait">
                  {!hasData ? (
                    <motion.div key="pareto-empty" {...fadeIn} className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center flex-1 bg-slate-50/50">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Pareto Visualizer in Standby</h3>
                      <p className="text-xs text-slate-500 max-w-xs mt-1">Enter workload parameters to compute Pareto frontier trade-offs between water and marginal carbon.</p>
                    </motion.div>
                  ) : (
                    <motion.div key="pareto-populated" {...fadeIn} className="flex flex-col justify-between flex-1 space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">Multi-Objective Pareto Frontier</h3>
                            <span className="text-xs text-slate-500">Optimizing trade-off: Carbon Intensity vs. Water Footprint</span>
                          </div>
                          <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            Converged in 12ms
                          </span>
                        </div>
                        {/* Chart */}
                        <div className="relative w-full h-64 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between overflow-hidden">
                          {/* Grid Lines */}
                          <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-60">
                            <div className="border-b border-slate-200 w-full h-0" />
                            <div className="border-b border-slate-200 w-full h-0" />
                            <div className="border-b border-slate-200 w-full h-0" />
                            <div className="border-b border-slate-200 w-full h-0" />
                          </div>
                          {/* Labels */}
                          <div className="absolute left-3 top-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider">▲ Carbon Intensity (kg CO2e)</div>
                          <div className="absolute right-3 bottom-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider">Water Usage (Liters) ►</div>
                          {/* Pareto Curve */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 220">
                            <motion.path
                              d="M 60 40 Q 180 80 340 180"
                              fill="none"
                              stroke="#2563eb"
                              strokeDasharray="4,4"
                              strokeWidth="2"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1.2, ease: "easeInOut" }}
                            />
                          </svg>
                          {/* Point A: US-West-2 */}
                          <motion.div
                            className="absolute left-[65%] top-[40%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                          >
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-500 border-2 border-white shadow-xs" />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow-xs border border-slate-200 whitespace-nowrap text-[11px] font-medium text-slate-700">
                              Point A: US-West-2
                              <span className="block text-[10px] font-mono text-slate-400">Moderate Carbon • High Water</span>
                            </div>
                          </motion.div>
                          {/* Point B: AP-South-1 */}
                          <motion.div
                            className="absolute left-[82%] top-[72%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.4 }}
                          >
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-500 border-2 border-white shadow-xs" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded shadow-xs border border-slate-200 whitespace-nowrap text-[11px] font-medium text-slate-700">
                              Point B: AP-South-1
                              <span className="block text-[10px] font-mono text-slate-400">High Carbon • Moderate Water</span>
                            </div>
                          </motion.div>
                          {/* Point C: EU-North-1 (Optimal) */}
                          <motion.div
                            className="absolute left-[18%] top-[22%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.0, duration: 0.5, type: "spring" }}
                          >
                            <div className="relative flex items-center justify-center">
                              <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-emerald-400 opacity-75" />
                              <span className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-md" />
                            </div>
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 bg-white px-2.5 py-1.5 rounded-lg shadow-md border border-emerald-300 whitespace-nowrap text-[11px] font-semibold text-emerald-800">
                              Point C: EU-North-1 (Stockholm)
                              <span className="block text-[10px] font-mono text-emerald-600 font-normal">Lowest Carbon • Lowest Water (Optimal)</span>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                      {/* Recommendation Card */}
                      <motion.div
                        className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.4 }}
                      >
                        <div>
                          <div className="text-xs font-bold text-emerald-900">Selected Target: EU-North (Stockholm)</div>
                          <div className="text-xs text-emerald-700 mt-0.5">
                            Pareto rank 1.0 • 74.1% Carbon Reduction • 120 L/hr Water Savings • District Heating Export Enabled
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-xs font-semibold text-emerald-800 shadow-xs">
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                          </svg>
                          Optimal Dispatch Confirmed
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ─── VIEW 3: AUDIT LEDGER ─── */}
        {activeTab === "audit-ledger" && (
          <motion.div className="space-y-6" initial="initial" animate="animate" variants={staggerContainer}>
            {/* Top Actions */}
            <motion.div variants={fadeInUp} className="flex items-center justify-end">
              <button
                onClick={() => alert("Exporting CSRD Scope 2/3 Compliance Report (PDF)...")}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                Export CSRD Report (PDF)
              </button>
            </motion.div>

            {/* Main Table */}
            <motion.div variants={fadeInUp} className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <AnimatePresence mode="wait">
                {!hasData ? (
                  <motion.div key="ledger-empty" {...fadeIn} className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No routing decisions logged</h3>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">Run placement jobs in Router Studio to generate audited records.</p>
                  </motion.div>
                ) : (
                  <motion.div key="ledger-populated" {...fadeIn} className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider bg-slate-50/50">
                          <th className="py-3.5 px-4">JOB ID</th>
                          <th className="py-3.5 px-4">TIMESTAMP</th>
                          <th className="py-3.5 px-4">TARGET REGION</th>
                          <th className="py-3.5 px-4 text-right">CARBON DELTA</th>
                          <th className="py-3.5 px-4 text-right">WATER DELTA</th>
                          <th className="py-3.5 px-4">DECISION RATIONALE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {LEDGER_ROWS.map((row, i) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.12, duration: 0.4 }}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">{row.id}</td>
                            <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{row.time}</td>
                            <td className="py-3.5 px-4"><DestBadge dest={row.dest} color={row.destColor} /></td>
                            <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-600">
                              {row.carbon} <span className="text-[11px] text-slate-400 font-normal">({row.carbonSaved})</span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-blue-600 font-semibold">{row.water}</td>
                            <td className="py-3.5 px-4 text-slate-600">{row.rationale}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────
// Region Node Component
// ──────────────────────────────────────────────
function RegionNode({ name, subtitle, hasData, populated }) {
  return (
    <motion.div
      className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 flex flex-col justify-between space-y-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${hasData ? populated.dotColor : "bg-slate-400"} ${hasData && populated.dotPulse ? "animate-pulse" : ""}`} />
            <h3 className="text-sm font-bold text-slate-900">{name}</h3>
          </div>
          <span className="text-xs text-slate-500">{subtitle}</span>
        </div>
        {hasData ? (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${populated.badgeBg}`}>
            {populated.badgeText}
          </span>
        ) : (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Standby
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 text-xs">
        <div>
          <span className="text-slate-400 block">Carbon Intensity</span>
          <span className="font-mono font-medium text-slate-700">{hasData ? populated.carbon : "-- gCO2e/kWh"}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Water Stress (WSI)</span>
          <span className="font-mono font-medium text-slate-700">{hasData ? populated.wsi : "--"}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Thermal Loop</span>
          <span className="font-mono font-medium text-slate-700">{hasData ? populated.thermal : "--"}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Latency SLA</span>
          <span className="font-mono font-medium text-slate-700">{hasData ? populated.latency : "-- ms"}</span>
        </div>
      </div>
    </motion.div>
  );
}
