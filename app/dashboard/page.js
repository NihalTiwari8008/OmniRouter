"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import {
  ROUTER_REGIONS,
  FEASIBILITY_CHECKS,
  ROUTING_STEPS,
  STREAM_ROWS,
  LEDGER_ROWS,
  ROUTE_DECISION,
  DEFAULT_WORKLOAD,
  BASELINE_IMPACT,
  createDispatchPayload,
} from "@/lib/router/mockRouter";
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
    subtitle: "Choose where workloads should run and how flexibly they can be scheduled",
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
function GlobalNetworkOverview({ dispatched }) {
  const recommended = ROUTER_REGIONS.find((region) => region.id === ROUTE_DECISION.regionId) || ROUTER_REGIONS[1];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Global data center network</h2>
          <p className="mt-1 text-sm text-slate-500">Regional conditions and current routing targets</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />{ROUTER_REGIONS.length} regions
          </span>
          <span className={dispatched ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700" : "inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700"}>
            <span className={dispatched ? "h-1.5 w-1.5 rounded-full bg-emerald-500" : "h-1.5 w-1.5 rounded-full bg-blue-500"} />
            {dispatched ? "Routing active" : "Route ready"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
        <div className="relative min-h-[370px] overflow-hidden border-b border-slate-100 bg-[#f4f8fc] xl:min-h-[410px] xl:border-b-0 xl:border-r">
          <img src="/world-map.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-100" draggable="false" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_36%,rgba(16,185,129,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.16),rgba(238,246,252,0.26))]" />

          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="overview-route" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="60%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="overview-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>

            <path d="M235 203 C338 140 425 122 530 164" fill="none" stroke="#60a5fa" strokeWidth="9" opacity="0.1" filter="url(#overview-glow)" />
            <path d="M235 203 C338 140 425 122 530 164" fill="none" stroke="url(#overview-route)" strokeWidth="3.5" strokeDasharray="10 10" strokeLinecap="round" />
            <path d="M700 307 C650 250 604 204 530 164" fill="none" stroke="url(#overview-route)" strokeWidth="3.5" strokeDasharray="10 10" strokeLinecap="round" opacity="0.95" />
          </svg>

          {ROUTER_REGIONS.map((region) => {
            const recommendedRegion = region.id === recommended.id;
            return (
              <div key={region.id} className="absolute" style={{ left: region.map.x, top: region.map.y }}>
                <span className="flex flex-col items-center">
                  <span className={recommendedRegion ? "relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg ring-4 ring-emerald-100" : "relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-700 shadow-md ring-2 ring-white"}>
                    {recommendedRegion && <span className="absolute inset-1 rounded-full bg-white/90" />}
                    <span className={recommendedRegion ? "relative h-2.5 w-2.5 rounded-full bg-emerald-500" : "relative h-2 w-2 rounded-full bg-white"} />
                  </span>
                  <span className="mt-1 rounded-md border border-slate-200 bg-white/95 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                    {region.name}
                  </span>
                </span>
              </div>
            );
          })}

          <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-[10px] text-slate-600 shadow-sm">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Candidate route</span>
            <span className="h-3 w-px bg-slate-200" />
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />{dispatched ? "Active route" : "Recommended route"}</span>
          </div>
        </div>

        <div className="bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Region comparison</div>
            <div className="mt-1 text-sm text-slate-500">Carbon · water · latency</div>
          </div>

          <div className="divide-y divide-slate-100">
            {ROUTER_REGIONS.map((region) => {
              const route = region.id === recommended.id;
              const tone = region.tone === "risk" ? "red" : region.tone === "constraint" ? "amber" : "emerald";
              const dot = tone === "red" ? "bg-red-500" : tone === "amber" ? "bg-amber-500" : "bg-emerald-500";
              return (
                <div key={region.id} className={route ? "bg-emerald-50/45 px-5 py-4" : "px-5 py-4"}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-slate-900">{region.name}</span>
                          {route && <span className="rounded border border-emerald-200 bg-white px-1.5 py-0.5 text-[8px] font-semibold text-emerald-700">{dispatched ? "Active route" : "Recommended"}</span>}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{region.code}</div>
                      </div>
                    </div>
                    <span className={route ? "shrink-0 text-sm font-bold text-emerald-700" : "shrink-0 text-sm font-bold text-slate-800"}>{region.latency} ms</span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Carbon</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">{region.carbon} gCO2e/kWh</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Water</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">{region.waterStress} · {region.waterLabel}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Heat</div>
                      <div className="mt-1 truncate text-sm font-semibold text-slate-800">{region.id === "stockholm" ? "District heat" : region.heat}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Route target</div>
            <div className="mt-1 text-base font-bold text-slate-900">{recommended.name} · {recommended.code}</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">{ROUTE_DECISION.rationale}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalysisTimeline({ stage, complete }) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Routing pipeline</div>
        <span className={complete ? "text-[10px] font-semibold text-emerald-700" : stage > 0 ? "text-[10px] font-semibold text-blue-700" : "text-[10px] font-semibold text-slate-400"}>
          {complete ? "Complete" : stage > 0 ? "In progress" : "Ready"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {ROUTING_STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const done = complete || stage > stepNumber;
          const active = !complete && stage === stepNumber;
          return (
            <div key={label} className="relative flex items-start gap-2.5 sm:block">
              {index < ROUTING_STEPS.length - 1 && (
                <span className={done ? "absolute left-[13px] top-6 hidden h-px w-[calc(100%+12px)] bg-emerald-200 sm:block" : "absolute left-[13px] top-6 hidden h-px w-[calc(100%+12px)] bg-slate-200 sm:block"} />
              )}
              <span className={done ? "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700 ring-4 ring-white" : active ? "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700 ring-4 ring-white" : "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-400 ring-4 ring-white"}>
                {done ? "✓" : stepNumber}
              </span>
              <div className="pt-0.5 sm:mt-2 sm:pt-0">
                <div className="text-[11px] font-semibold leading-4 text-slate-700">{label}</div>
                <div className={done ? "mt-1 text-[9px] font-medium text-emerald-600" : active ? "mt-1 text-[9px] font-medium text-blue-600" : "mt-1 text-[9px] font-medium text-slate-400"}>
                  {done ? "Passed" : active ? "Evaluating" : "Waiting"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeasibilityPanel({ complete = false, running = false }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-950">Feasibility filter</h3>
          <p className="mt-1 text-xs text-slate-500">Hard workload and policy checks run before environmental ranking.</p>
        </div>
        <span className={complete ? "shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700" : running ? "shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700" : "shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500"}>{complete ? "4 / 4 passed" : running ? "Checking…" : "Ready"}</span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {FEASIBILITY_CHECKS.map((check) => (
          <div key={check.label} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">✓</span>
                <span className="text-xs font-semibold text-slate-700">{check.label}</span>
              </div>
              <span className={complete ? "text-[10px] font-semibold text-emerald-600" : running ? "text-[10px] font-semibold text-blue-600" : "text-[10px] font-semibold text-slate-400"}>{complete ? check.status : running ? "Checking" : "Pending"}</span>
            </div>
            <div className="ml-7 mt-1 text-[10px] text-slate-500">{check.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
function ParetoChart({ selectedRegionId = "stockholm" }) {
  const selected = ROUTER_REGIONS.find((region) => region.id === selectedRegionId) || ROUTER_REGIONS[1];
  const routeTarget = ROUTER_REGIONS.find((region) => region.id === ROUTE_DECISION.regionId) || ROUTER_REGIONS[1];
  const maxCarbon = Math.max(...ROUTER_REGIONS.map((region) => region.carbon));
  const maxWater = Math.max(...ROUTER_REGIONS.map((region) => region.waterStress));
  const maxLatency = Math.max(...ROUTER_REGIONS.map((region) => region.latency));

  const center = 180;
  const radius = 102;
  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

  const normalize = (region) => [
    1 - region.carbon / maxCarbon,
    1 - region.waterStress / maxWater,
    region.heatScore ?? 0,
    1 - region.latency / maxLatency,
  ];

  const pointAt = (index, value) => ({
    x: center + Math.cos(angles[index]) * radius * value,
    y: center + Math.sin(angles[index]) * radius * value,
  });

  const polygonPoints = (region) => normalize(region).map((value, index) => {
    const point = pointAt(index, Math.max(0, Math.min(1, value)));
    return `${point.x},${point.y}`;
  }).join(" ");

  const metricLabels = [
    { label: "Carbon", value: `${selected.carbon} gCO₂e/kWh`, score: Math.round(normalize(selected)[0] * 100), angle: -Math.PI / 2, x: center, y: 28, anchor: "middle" },
    { label: "Water", value: `${selected.waterStress} · ${selected.waterLabel}`, score: Math.round(normalize(selected)[1] * 100), angle: 0, x: 330, y: center + 3, anchor: "start" },
    { label: "Heat recovery", value: selected.heat, score: Math.round(normalize(selected)[2] * 100), angle: Math.PI / 2, x: center, y: 346, anchor: "middle" },
    { label: "Latency", value: `${selected.latency} ms`, score: Math.round(normalize(selected)[3] * 100), angle: Math.PI, x: 30, y: center + 3, anchor: "end" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-950">Environmental trade-off matrix</h3>
          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">Candidate profiles normalized to the same four routing signals.</p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Route target highlighted</span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(320px,1fr)_280px] lg:items-center">
        <div className="rounded-xl border border-slate-200 bg-slate-50/45 p-2 sm:p-3">
          <svg viewBox="0 0 360 360" className="mx-auto h-[315px] w-full max-w-[430px]" role="img" aria-label="Normalized environmental profile">
            {[0.25, 0.5, 0.75, 1].map((scale) => (
              <circle key={scale} cx={center} cy={center} r={radius * scale} fill="none" stroke="#dbe5ef" strokeWidth="1" />
            ))}

            {angles.map((angle, index) => {
              const end = pointAt(index, 1);
              return <line key={index} x1={center} y1={center} x2={end.x} y2={end.y} stroke="#dbe5ef" strokeWidth="1" />;
            })}

            {ROUTER_REGIONS.filter((region) => region.id !== selected.id).map((region) => (
              <polygon key={region.id} points={polygonPoints(region)} fill="none" stroke={region.id === "oregon" ? "#f43f5e" : "#f59e0b"} strokeWidth="1.4" strokeDasharray="5 6" opacity="0.38" strokeLinejoin="round" />
            ))}

            <polygon points={polygonPoints(selected)} fill="#10b981" fillOpacity="0.12" stroke="#059669" strokeWidth="3" strokeLinejoin="round" />

            {normalize(selected).map((value, index) => {
              const point = pointAt(index, Math.max(0, Math.min(1, value)));
              return <circle key={index} cx={point.x} cy={point.y} r="5" fill="#059669" stroke="#ffffff" strokeWidth="2" />;
            })}

            <circle cx={center} cy={center} r="30" fill="#ffffff" stroke="#d5e2ec" strokeWidth="1.2" />
            <text x={center} y="174" textAnchor="middle" fontSize="8" fontFamily="inherit" fill="#94a3b8" letterSpacing="1.15">SELECTED</text>
            <text x={center} y="194" textAnchor="middle" fontSize="15" fontFamily="inherit" fontWeight="700" fill="#0f172a">{selected.name}</text>

            {metricLabels.map((metric) => (
              <g key={metric.label}>
                <text x={metric.x} y={metric.y} textAnchor={metric.anchor} fontSize="8.5" fontFamily="inherit" fontWeight="600" fill="#64748b">{metric.label}</text>
              </g>
            ))}
          </svg>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pb-1 text-[10px]">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />{selected.name}</span>
            {ROUTER_REGIONS.filter((region) => region.id !== selected.id).map((region) => (
              <span key={region.id} className="inline-flex items-center gap-1.5 text-slate-500">
                <span className={`h-2 w-2 rounded-full ${region.id === "oregon" ? "bg-red-400" : "bg-amber-400"}`} />{region.name}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {metricLabels.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{metric.label}</div>
                  <div className="mt-1 text-xs font-bold text-slate-900">{metric.value}</div>
                </div>
                <div className="text-sm font-bold text-emerald-700">{metric.score}</div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${metric.score}%` }} />
              </div>
            </div>
          ))}

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-700">Route target</div>
            <div className="mt-1 text-sm font-bold text-slate-900">{selected.name} · {selected.code}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DispatchPanel({ dispatched, isDispatching, onDispatch, workloadName, workloadCategory, deadlineHours, geoFence }) {
  return (
    <section className={dispatched ? "rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 sm:p-6" : "rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Dispatch control</div>
          <h3 className="mt-1 text-base font-bold text-slate-950">
            {dispatched ? "Workload dispatched successfully" : `Ready to dispatch to ${ROUTE_DECISION.targetLabel}`}
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {dispatched ? "Route decision recorded. The Audit Ledger has received the environmental rationale." : ROUTE_DECISION.rationale}
          </p>
        </div>
        {dispatched ? (
          <div className="shrink-0 rounded-lg border border-emerald-200 bg-white px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-600">Dispatch status</div>
            <div className="mt-1 text-sm font-bold text-emerald-900">Dispatched · {ROUTE_DECISION.targetCode}</div>
          </div>
        ) : (
          <button
            onClick={onDispatch}
            disabled={isDispatching}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDispatching ? "Dispatching…" : "Dispatch workload"}
          </button>
        )}
      </div>
      <details className="mt-3 group">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-[11px] font-semibold text-slate-500 transition hover:text-slate-800">
          <svg className="h-3.5 w-3.5 text-slate-400 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>
          View payload
        </summary>
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-950 p-4">
          <pre className="overflow-x-auto text-[10px] leading-5 text-slate-200">{JSON.stringify(createDispatchPayload({
            workloadName,
            workloadCategory,
            deadlineHours,
            geoFence,
            targetRegion: ROUTE_DECISION.targetCode,
          }), null, 2)}</pre>
        </div>
      </details>
    </section>
  );
}
function MapMarker({ region, selected, recommended, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(region.id)}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      aria-label={`Select ${region.name}`}
    >
      <span className="group flex flex-col items-center">
        <span className={recommended ? "relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg ring-4 ring-emerald-100" : selected ? "relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-blue-500 shadow-md ring-4 ring-blue-100 transition group-hover:scale-105" : "relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-700 shadow-md transition group-hover:scale-105"}>
          {recommended && <span className="absolute inset-1 rounded-full bg-white/90" />}
          <span className={recommended ? "relative h-2.5 w-2.5 rounded-full bg-emerald-500" : "relative h-2 w-2 rounded-full bg-white"} />
        </span>
        <span className="mt-1 whitespace-nowrap rounded-md border border-slate-200 bg-white/95 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur">{region.name}</span>
      </span>
    </button>
  );
}
function EnvironmentalMap({ selectedRegionId, recommendedRegionId, onSelectRegion }) {
  const selected = ROUTER_REGIONS.find((region) => region.id === selectedRegionId) || ROUTER_REGIONS[1];
  const recommended = ROUTER_REGIONS.find((region) => region.id === recommendedRegionId) || ROUTER_REGIONS[1];
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div className="text-base font-bold text-slate-950">Global routing map</div>
          <div className="mt-1 text-xs text-slate-500">Eligible compute regions and candidate routes.</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />3 candidates
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Route selected
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(315px,0.75fr)]">
        <div className="relative min-h-[370px] overflow-hidden bg-[#0b1420] xl:min-h-[400px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_36%,rgba(16,185,129,0.10),transparent_34%),radial-gradient(circle_at_20%_68%,rgba(59,130,246,0.10),transparent_38%)]" />
          <div className="absolute inset-0 overflow-hidden bg-[#0b1420]">
            <img
              src="/world-map.svg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-100"
              draggable="false"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(240,246,252,0.34))]" />
          </div>
          {ROUTER_REGIONS.map((region) => (
            <div key={region.id} className="absolute" style={{ left: region.map.x, top: region.map.y }}>
              <MapMarker region={region} selected={region.id === selectedRegionId} recommended={region.id === recommendedRegionId} onSelect={onSelectRegion} />
            </div>
          ))}
          <div className="absolute left-4 top-4 rounded-md border border-slate-200/90 bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm backdrop-blur">
            Global compute network
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200/90 bg-white/92 px-3 py-2 text-[10px] text-slate-600 shadow-sm backdrop-blur">
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-400" />Candidate route</span>
              <span className="h-3 w-px bg-slate-200" />
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Selected route</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-200/90 bg-white/92 px-3 py-2 text-[10px] font-medium text-slate-500 shadow-sm backdrop-blur">
              <span>Click a node to inspect</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Inspected region</div>
                <div className="mt-1 text-lg font-bold text-slate-950">{selected.name}</div>
                <div className="mt-0.5 text-xs text-slate-500">{selected.code} · {selected.descriptor}</div>
              </div>
              <span className={selected.id === recommendedRegionId ? "rounded-md border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-700" : "rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700"}>
                {selected.id === recommendedRegionId ? "Recommended" : "Inspecting"}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-emerald-100 pt-3">
              <div><div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Carbon</div><div className="mt-1 text-sm font-bold text-emerald-700">{selected.carbon} gCO2e/kWh</div></div>
              <div><div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Water stress</div><div className="mt-1 text-sm font-bold text-slate-900">{selected.waterStress} · {selected.waterLabel}</div></div>
              <div><div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Heat loop</div><div className="mt-1 text-sm font-bold text-slate-900">{selected.heat}</div></div>
              <div><div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Latency</div><div className="mt-1 text-sm font-bold text-slate-900">{selected.latency} ms</div></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Candidate regions</div>
              
            </div>
            <div className="space-y-2">
              {ROUTER_REGIONS.map((region) => {
                const active = region.id === selectedRegionId;
                const tone = region.tone === "risk" ? "red" : region.tone === "constraint" ? "amber" : "emerald";
                const dot = tone === "red" ? "bg-red-500" : tone === "amber" ? "bg-amber-500" : "bg-emerald-500";
                const badge = tone === "red" ? "border-red-200 bg-red-50 text-red-700" : tone === "amber" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700";
                return (
                  <button key={region.id} type="button" onClick={() => onSelectRegion(region.id)} className={active ? "flex w-full items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-2.5 text-left" : "flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left transition hover:border-slate-300 hover:bg-slate-50"}>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-900">{region.name}</div>
                        <div className="mt-0.5 text-[10px] text-slate-500">{region.carbon} gCO2e/kWh · {region.latency} ms</div>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded border px-2 py-1 text-[9px] font-semibold ${active ? "border-blue-200 bg-blue-50 text-blue-700" : badge}`}>{active ? "Inspecting" : region.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-4 sm:px-5">
        <div className="grid gap-3 sm:grid-cols-4">
          <div><div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Carbon delta</div><div className="mt-1 text-sm font-bold text-emerald-700">{ROUTE_DECISION.carbonDelta}</div></div>
          <div><div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Water impact</div><div className="mt-1 text-sm font-bold text-blue-700">{ROUTE_DECISION.waterDelta}</div></div>
          <div><div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Heat reuse</div><div className="mt-1 text-sm font-bold text-amber-700">{ROUTE_DECISION.heatReuse}</div></div>
          <div><div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Residency</div><div className="mt-1 text-sm font-bold text-slate-800">{ROUTE_DECISION.residency}</div></div>
        </div>
      </div>
    </section>
  );
}
function LiveActivityTimeline({ rows, isDispatched }) {
  return (
    <motion.section variants={fadeInUp} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Live activity</h2>
          <p className="mt-1 text-sm text-slate-500">Recent workloads and routing outcomes</p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{rows.length} records</span>
      </div>

      <div className="mt-5">
        {rows.map((row, index) => {
          const isNew = isDispatched && row.id === "#R-9043";
          const dot = row.destColor === "blue" ? "bg-blue-500" : "bg-emerald-500";
          return (
            <div key={row.id} className="grid grid-cols-[68px_18px_minmax(0,1fr)] gap-3 sm:grid-cols-[86px_18px_minmax(0,1fr)] sm:gap-4">
              <div className="pt-2 text-[10px] text-slate-400">{isNew ? "Just now" : row.time}</div>
              <div className="relative flex justify-center">
                {index < rows.length - 1 && <span className="absolute top-4 bottom-0 w-px bg-slate-200" />}
                <span className={`relative z-10 mt-2 h-2.5 w-2.5 rounded-full ${isNew ? "bg-emerald-500 ring-4 ring-emerald-50" : dot}`} />
              </div>
              <div className={isNew ? "mb-3 rounded-xl border border-emerald-200 bg-emerald-50/45 p-4" : "mb-3 rounded-xl border border-slate-200 bg-white p-4"}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400">{row.id}</span>
                      <span className="text-sm font-bold text-slate-900">{row.name}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{row.desc}</div>
                  </div>
                  <StatusBadge status={row.status} color={row.statusColor} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-[10px]">
                  <span className="inline-flex items-center gap-1.5 text-slate-600"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{row.dest}</span>
                  <span className="font-semibold text-emerald-600">{row.carbon}</span>
                  <span className="font-semibold text-blue-600">{row.water}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

function AuditOverview({ dispatched, reportStatus }) {
  const items = [
    { label: "Logged decisions", value: dispatched ? "4" : "3", detail: dispatched ? "+1 this session" : "Current history" },
    { label: "Policy checks", value: dispatched ? "4 / 4" : "Ready", detail: "Residency · SLA · capacity" },
    { label: "Impact fields", value: "Carbon + water", detail: "Heat reuse tracked" },
    { label: "Report", value: reportStatus === "ready" ? "PDF ready" : "Available", detail: "CSRD workflow" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <div key={item.label} className={index > 0 ? "border-t border-slate-100 p-4 sm:border-l sm:border-t-0" : "p-4"}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{item.label}</div>
            <div className="mt-1.5 text-sm font-bold text-slate-900">{item.value}</div>
            <div className="mt-1 text-[10px] leading-4 text-slate-500">{item.detail}</div>
          </div>
        ))}
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
  const [analysisStage, setAnalysisStage] = useState(0);
  const [isDispatched, setIsDispatched] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState("stockholm");
  const [reportStatus, setReportStatus] = useState("idle");
  const [workloadName, setWorkloadName] = useState(DEFAULT_WORKLOAD.name);
  const [workloadCategory, setWorkloadCategory] = useState(DEFAULT_WORKLOAD.category);
  const [deadlineVal, setDeadlineVal] = useState(DEFAULT_WORKLOAD.deadlineHours);
  const [geoFence, setGeoFence] = useState(true);
  const [countKey, setCountKey] = useState(0);
  const switchTab = useCallback((tabId) => setActiveTab(tabId), []);
  const generateReport = useCallback(() => {
    if (!isDispatched || reportStatus === "generating") return;
    setReportStatus("generating");
    setTimeout(() => setReportStatus("ready"), 1100);
  }, [isDispatched, reportStatus]);
  const runPlacementAnalysis = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    setHasData(false);
    setIsDispatched(false);
    setAnalysisStage(1);
    setTimeout(() => setAnalysisStage(2), 420);
    setTimeout(() => setAnalysisStage(3), 840);
    setTimeout(() => setAnalysisStage(4), 1260);
    setTimeout(() => {
      setIsLoading(false);
      setHasData(true);
      setAnalysisStage(4);
      setSelectedRegionId("stockholm");
      setCountKey((key) => key + 1);
    }, 1680);
  }, [isLoading]);
  const dispatchWorkload = useCallback(() => {
    if (isDispatching || isDispatched || !hasData) return;
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setIsDispatched(true);
      setCountKey((key) => key + 1);
      setActiveTab("command-center");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 950);
  }, [hasData, isDispatching, isDispatched]);
  const currentTab = TABS.find((tab) => tab.id === activeTab) || TABS[0];
  const liveStreamRows = isDispatched
    ? [
        {
          id: "#R-9043",
          time: "Just now",
          name: workloadName,
          desc: `${workloadCategory} · routed by OmniRouter`,
          dest: "EU-North-1 (Stockholm)",
          destColor: "emerald",
          carbon: "-74.1%",
          water: "120 L/hr",
          status: "Dispatched",
          statusColor: "emerald",
        },
        ...STREAM_ROWS,
      ]
    : STREAM_ROWS;
  const liveLedgerRows = isDispatched
    ? [
        {
          id: "#JOB-8842",
          time: "Just now",
          dest: "EU-North-1 (Stockholm)",
          destColor: "emerald",
          carbon: "-74.1%",
          carbonSaved: "38.2 kg saved",
          water: "-120 L",
          rationale: `${workloadName} routed to the lowest combined environmental burden within policy constraints.`,
        },
        ...LEDGER_ROWS,
      ]
    : LEDGER_ROWS;
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
        </header>
        <AnimatePresence mode="wait">
          {activeTab === "command-center" && (
            <motion.div key="command" className="space-y-6 pt-6" initial="initial" animate="animate" variants={stagger}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Water conserved" tone="blue" detail={isDispatched ? "+4,200 L from this dispatch" : "Cumulative routed impact"} icon={metricIcons.water}>
                  <span key={countKey}><CountUp start={isDispatched ? BASELINE_IMPACT.water : 0} end={isDispatched ? BASELINE_IMPACT.water + 4200 : BASELINE_IMPACT.water} duration={1.5} separator="," /> L</span>
                </MetricCard>
                <MetricCard label="Emissions avoided" tone="green" detail={isDispatched ? "+238.2 kg from this dispatch" : "Cumulative routed impact"} icon={metricIcons.carbon}>
                  <span key={countKey}><CountUp start={isDispatched ? BASELINE_IMPACT.emissions : 0} end={isDispatched ? BASELINE_IMPACT.emissions + 238.2 : BASELINE_IMPACT.emissions} decimals={1} duration={1.5} separator="," /> kg</span>
                </MetricCard>
                <MetricCard label="Heat energy reused" tone="amber" detail={isDispatched ? "+1.5 MWh from this dispatch" : "Cumulative routed impact"} icon={metricIcons.heat}>
                  <span key={countKey}><CountUp start={isDispatched ? BASELINE_IMPACT.heat : 0} end={isDispatched ? BASELINE_IMPACT.heat + 1.5 : BASELINE_IMPACT.heat} decimals={1} duration={1.5} /> MWh</span>
                </MetricCard>
                <MetricCard label="Compliance status" tone="green" detail={isDispatched ? "Policy check applied" : "CSRD Scope 2/3"} icon={metricIcons.compliance}>
                  <span key={countKey}><CountUp start={isDispatched ? BASELINE_IMPACT.compliance : 0} end={isDispatched ? 99.4 : BASELINE_IMPACT.compliance} decimals={1} duration={1.5} />%</span>
                </MetricCard>
              </div>
                            <motion.div variants={fadeInUp}>
                <GlobalNetworkOverview dispatched={isDispatched} />
              </motion.div>
              <LiveActivityTimeline rows={liveStreamRows} isDispatched={isDispatched} />
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
                      <input value={workloadName} onChange={(e) => setWorkloadName(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Workload category</span>
                      <select value={workloadCategory} onChange={(e) => setWorkloadCategory(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                        <option value="LLM Batch Inference · High Throughput">LLM Batch Inference · High Throughput</option>
                        <option value="Vector Embeddings">Vector Embeddings</option>
                        <option value="Diffusion / Rendering">Diffusion / Rendering</option>
                      </select>
                    </label>
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-700">Start-time flexibility</span>
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{deadlineVal}h delay</span>
                      </div>
                      <input type="range" min="0" max="48" step="12" value={deadlineVal} onChange={(e) => setDeadlineVal(Number(e.target.value))} className="mt-4 w-full accent-blue-600" />
                      <div className="mt-1 flex justify-between text-xs text-slate-500">
                        <span>0h · Start now</span><span>24h · Flexible</span><span>48h · Max shift</span>
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
                    <button
                      onClick={runPlacementAnalysis}
                      disabled={isLoading}
                      className="flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:border-blue-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoading ? "Analyzing placement…" : "Analyze placement"}
                    </button>
                  </div>
                </motion.section>
                <motion.section variants={fadeInUp} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-7">
                  <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">Environmental impact</h2>
                    </div>
                  </div>
                  <div className="pt-5">
                    <AnalysisTimeline stage={analysisStage} complete={hasData} />
                    {isLoading ? (
                      <div className="grid gap-4 xl:grid-cols-2">
                        <FeasibilityPanel running />
                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-20" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
                                <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">Building route decision</div>
                              <div className="mt-1 text-xs text-slate-500">Combining carbon, water, heat reuse, and latency signals.</div>
                            </div>
                          </div>
                          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-500" />
                          </div>
                        </section>
                      </div>
                    ) : !hasData ? (
                      <div className="grid gap-4 xl:grid-cols-2">
                        <FeasibilityPanel />
                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-base font-bold text-slate-950">Optimization target</h3>
                              <p className="mt-1 text-xs text-slate-500">Run placement analysis to rank eligible candidates.</p>
                            </div>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">Waiting</span>
                          </div>
                          <div className="mt-7 rounded-lg border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center">
                            <div className="text-sm font-semibold text-slate-700">Ready for analysis</div>
                            <div className="mt-1 text-xs text-slate-500">The router will evaluate the current workload against environmental conditions and operational constraints.</div>
                          </div>
                        </section>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <EnvironmentalMap selectedRegionId={selectedRegionId} recommendedRegionId={ROUTE_DECISION.regionId} onSelectRegion={setSelectedRegionId} />
                        <div className="grid gap-4 xl:grid-cols-2">
                          <ParetoChart selectedRegionId={selectedRegionId} />
                          <FeasibilityPanel complete />
                        </div>
                        <DispatchPanel
                          dispatched={isDispatched}
                          isDispatching={isDispatching}
                          onDispatch={dispatchWorkload}
                          workloadName={workloadName}
                          workloadCategory={workloadCategory}
                          deadlineHours={deadlineVal}
                          geoFence={geoFence}
                        />
                      </div>
                    )}
                  </div>
                </motion.section>
              </div>
            </motion.div>
          )}
          {activeTab === "audit-ledger" && (
            <motion.div key="audit" className="space-y-5 pt-6" initial="initial" animate="animate" variants={stagger}>
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-end gap-3">
                {reportStatus === "ready" && <span className="text-xs font-medium text-emerald-700">CSRD report generated · PDF ready</span>}
                <button onClick={generateReport} disabled={!isDispatched || reportStatus === "generating"} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
                  <svg className={`h-4 w-4 text-slate-500 ${reportStatus === "generating" ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24">
                    {reportStatus === "generating" ? <><circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" /><path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" /></> : <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
                  </svg>
                  {reportStatus === "generating" ? "Generating report…" : reportStatus === "ready" ? "Regenerate CSRD report" : isDispatched ? "Generate CSRD report" : "Dispatch a workload first"}
                </button>
              </motion.div>
              <AuditOverview dispatched={isDispatched} reportStatus={reportStatus} />
              <motion.section variants={fadeInUp} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{isDispatched ? "Newest decision appears at the top." : "Most recent routing decisions"}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{liveLedgerRows.length} records</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          <th className="px-4 py-3.5">Job ID</th><th className="px-4 py-3.5">Timestamp</th><th className="px-4 py-3.5">Target region</th><th className="px-4 py-3.5">Carbon delta</th><th className="px-4 py-3.5">Water delta</th><th className="px-4 py-3.5">Rationale</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {liveLedgerRows.map((row, index) => (
                          <tr key={row.id} className={index === 0 && isDispatched ? "bg-emerald-50/35 transition hover:bg-emerald-50/60" : "transition hover:bg-slate-50"}>
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
      <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">AC</div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Workspace</div>
            <div className="mt-0.5 truncate text-xs font-semibold text-slate-800">ACME Cloud</div>
          </div>
        </div>
      </div>
    </div>
  );
}




