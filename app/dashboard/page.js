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

function AnalysisTimeline({ stage, complete }) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Routing pipeline</div>
          <div className="mt-1 text-sm font-semibold text-slate-700">
            {complete ? "Decision ready for dispatch" : stage > 0 ? "Evaluating workload against live constraints" : "Ready to run"}
          </div>
        </div>
        <span className={complete ? "rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700" : stage > 0 ? "rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700" : "rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500"}>
          {complete ? "Complete" : stage > 0 ? "In progress" : "Idle"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {ROUTING_STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const done = complete || stage > stepNumber;
          const active = !complete && stage === stepNumber;
          return (
            <div key={label} className={done ? "rounded-lg border border-emerald-200 bg-white p-3" : active ? "rounded-lg border border-blue-200 bg-white p-3 shadow-sm" : "rounded-lg border border-slate-200 bg-white p-3"}>
              <div className="flex items-center gap-2">
                <span className={done ? "flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700" : active ? "flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700" : "flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400"}>
                  {done ? "✓" : stepNumber}
                </span>
                <span className="text-[11px] font-semibold leading-4 text-slate-700">{label}</span>
              </div>
              <div className={done ? "mt-2 text-[10px] font-medium text-emerald-600" : active ? "mt-2 text-[10px] font-medium text-blue-600" : "mt-2 text-[10px] font-medium text-slate-400"}>
                {done ? "Passed" : active ? "Evaluating…" : "Waiting"}
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
  const width = 720;
  const height = 300;
  const pad = { left: 58, right: 28, top: 26, bottom: 48 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const maxCarbon = 420;
  const maxWater = 5;
  const x = (value) => pad.left + (value / maxCarbon) * plotW;
  const y = (value) => pad.top + (1 - value / maxWater) * plotH;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-950">Pareto environmental analysis</h3>
          <p className="mt-1 text-xs text-slate-500">Lower carbon and lower water stress move toward the preferred operating corner.</p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">2-variable view</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/50">
        <svg className="h-[290px] w-full" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Carbon intensity versus water stress chart">
          <defs>
            <linearGradient id="pareto-area" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#d1fae5" />
            </linearGradient>
          </defs>

          <rect x={pad.left} y={pad.top} width={plotW} height={plotH} fill="url(#pareto-area)" opacity="0.32" rx="10" />
          {[0, 1, 2, 3, 4, 5].map((tick) => (
            <g key={tick}>
              <line x1={pad.left} x2={pad.left + plotW} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth="1" />
              <text x={pad.left - 10} y={y(tick) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{tick}</text>
            </g>
          ))}
          {[0, 100, 200, 300, 400].map((tick) => (
            <g key={tick}>
              <line x1={x(tick)} x2={x(tick)} y1={pad.top} y2={pad.top + plotH} stroke="#eef2f7" strokeWidth="1" />
              <text x={x(tick)} y={height - 22} textAnchor="middle" fontSize="10" fill="#94a3b8">{tick}</text>
            </g>
          ))}

          {ROUTER_REGIONS.map((region) => {
            const cx = x(region.carbon);
            const cy = y(region.waterStress);
            const selected = region.id === selectedRegionId;
            return (
              <g key={region.id}>
                {selected && <circle cx={cx} cy={cy} r="19" fill="#10b981" opacity="0.12" />}
                <circle cx={cx} cy={cy} r={selected ? 9 : 7} fill={selected ? "#10b981" : region.tone === "risk" ? "#ef4444" : "#f59e0b"} stroke="#ffffff" strokeWidth="3" />
                <text x={cx} y={cy - 15} textAnchor="middle" fontSize="10" fontWeight="600" fill="#334155">{region.name}</text>
              </g>
            );
          })}

          <text x={pad.left + plotW / 2} y={height - 6} textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Carbon intensity · gCO₂e/kWh</text>
          <text x="14" y={pad.top + plotH / 2} transform={`rotate(-90 14 ${pad.top + plotH / 2})`} textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Water stress index</text>
        </svg>
      </div>

      <div className="mt-3 flex flex-col gap-2 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Selected route</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" />Water constraint</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />Thermal constraint</span>
        </div>
        <span className="font-semibold text-slate-400">Stockholm is non-dominated in this scenario</span>
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
            {dispatched ? "Workload dispatched successfully" : `Ready to dispatch to ${ROUTE_DECISION.regionId === "stockholm" ? "EU-North-1 · Stockholm" : ROUTE_DECISION.regionId}`}
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {dispatched ? "Route decision recorded. The Audit Ledger has received the environmental rationale." : ROUTE_DECISION.rationale}
          </p>
        </div>

        {dispatched ? (
          <div className="shrink-0 rounded-lg border border-emerald-200 bg-white px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-600">Dispatch status</div>
            <div className="mt-1 text-sm font-bold text-emerald-900">Dispatched · EU-North-1</div>
          </div>
        ) : (
          <button onClick={onDispatch} disabled={isDispatching} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-80">
            {isDispatching ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Dispatching…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                Dispatch workload
              </>
            )}
          </button>
        )}
      </div>

      <details className="mt-4 rounded-lg border border-slate-200 bg-white">
        <summary className="cursor-pointer list-none px-4 py-3 text-xs font-semibold text-slate-700">View dispatch payload</summary>
        <div className="border-t border-slate-100 bg-slate-950 p-4">
          <pre className="overflow-x-auto text-[10px] leading-5 text-slate-200">{JSON.stringify(createDispatchPayload({
            workloadName,
            workloadCategory,
            deadlineHours,
            geoFence,
            targetRegion: "EU-North-1",
          }), null, 2)}</pre>
        </div>
      </details>
    </section>
  );
}

function MapMarker({ region, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(region.id)}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      aria-label={`Select ${region.name}`}
    >
      <span className="group flex flex-col items-center">
        <span className={selected ? "relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg ring-4 ring-emerald-100" : "relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-700 shadow-md transition group-hover:scale-105"}>
          {selected && <span className="absolute inset-1 rounded-full bg-white/90" />}
          <span className={selected ? "relative h-2.5 w-2.5 rounded-full bg-emerald-500" : "relative h-2 w-2 rounded-full bg-white"} />
        </span>
        <span className="mt-1 whitespace-nowrap rounded-md border border-slate-200 bg-white/95 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur">{region.name}</span>
      </span>
    </button>
  );
}

function RegionDetailCard({ region, selected, onSelect }) {
  const accent = region.tone === "risk" ? "red" : region.tone === "constraint" ? "amber" : "emerald";
  const dot = accent === "red" ? "bg-red-500" : accent === "amber" ? "bg-amber-500" : "bg-emerald-500";
  const badge = accent === "red"
    ? "border-red-200 bg-red-50 text-red-700"
    : accent === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";

  return (
    <button type="button" onClick={() => onSelect(region.id)} className={`w-full text-left ${selected ? "rounded-xl border border-emerald-300 bg-emerald-50/40 p-4 ring-1 ring-emerald-100" : "rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            <h3 className="text-sm font-bold text-slate-950">{region.name}</h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">{region.code} · {region.descriptor}</p>
        </div>
        <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-semibold ${selected ? "border-emerald-200 bg-white text-emerald-700" : badge}`}>{selected ? "Selected" : region.badge}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Carbon</div>
          <div className="mt-0.5 text-sm font-semibold text-slate-900">{region.carbon} gCO2e/kWh</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Water stress</div>
          <div className="mt-0.5 text-sm font-semibold text-slate-900">{region.waterStress} · {region.waterLabel}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Heat loop</div>
          <div className="mt-0.5 text-sm font-semibold text-slate-900">{region.heat}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Latency</div>
          <div className="mt-0.5 text-sm font-semibold text-slate-900">{region.latency} ms</div>
        </div>
      </div>
    </button>
  );
}

function EnvironmentalMap({ selectedRegionId, onSelectRegion }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div className="text-sm font-bold text-slate-950">Global routing map</div>
          <div className="mt-1 text-xs text-slate-500">Candidate regions and live environmental inputs</div>
        </div>
        <span className="text-xs font-semibold text-slate-400">{ROUTER_REGIONS.length} candidates evaluated</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
        <div className="relative min-h-[390px] border-b border-slate-100 bg-slate-50 xl:border-b-0 xl:border-r">
          <div className="absolute left-4 top-4 z-10 rounded-md border border-slate-200 bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 shadow-sm">
            Global compute network
          </div>

          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <pattern id="map-grid-v2" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M50 0H0V50" fill="none" stroke="#dfe7ef" strokeWidth="1" />
              </pattern>
              <linearGradient id="route-gradient-v2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="route-glow-v2" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="7" result="blur" />
              </filter>
            </defs>

            <rect width="1000" height="520" fill="url(#map-grid-v2)" opacity="0.5" />

            <g fill="#d8e2ec" stroke="#c0cedc" strokeWidth="1.1">
              <path d="M62 124 92 94 140 99 177 124 174 151 156 165 146 189 112 203 88 192 67 201 45 177 50 149Z" />
              <path d="m174 202 31-17 45 4 31 20 20 30-17 18-12 31-27 13-18 43-27-4-12-31-28-25 8-34Z" />
              <path d="m299 128 27-31 49-12 63 7 40 27 10 40-23 28-8 37-31 22-34-15-16-31-38-15-25-25Z" />
              <path d="m405 198 29-15 43 8 30 23 4 31-21 23-34 12-35-11-23-22Z" />
              <path d="m506 224 25-46 42-28 53-5 57 21 46 35 5 34-28 19-8 38-35 22-49-10-29-20-43-14Z" />
              <path d="m541 299 24-13 32 8 21 26-10 27-28 19-30-9-18-26Z" />
              <path d="m664 356 33-23 52 4 41 24 17 31-18 26-43 15-41-13-30-27Z" />
              <path d="m837 215 24-19 38 3 31 20-3 21-31 21-35-6-19-21Z" />
              <path d="m849 390 37-6 36 12 13 23-18 17-35-1-28-17Z" />
              <path d="m753 429 17-8 21 5 12 15-8 10-23-2-18-9Z" />
            </g>

            <g fill="none" stroke="#b8c6d5" strokeWidth="0.9" opacity="0.85">
              <path d="M86 142 116 129 151 132 166 148" />
              <path d="M101 178 139 162 171 168" />
              <path d="M205 214 242 207 274 219" />
              <path d="M321 119 352 147 390 145 418 159" />
              <path d="M530 214 566 193 612 199 659 218 696 244" />
              <path d="M677 368 717 359 754 370 783 387" />
            </g>

            <g fill="none" stroke="url(#route-gradient-v2)" strokeLinecap="round">
              <path d="M235 205 C318 150 414 118 528 159" strokeWidth="7" opacity="0.12" filter="url(#route-glow-v2)" />
              <path d="M235 205 C318 150 414 118 528 159" strokeWidth="4.5" strokeDasharray="11 11" />
              <path d="M702 307 C657 250 604 202 528 159" strokeWidth="7" opacity="0.12" filter="url(#route-glow-v2)" />
              <path d="M702 307 C657 250 604 202 528 159" strokeWidth="4.5" strokeDasharray="11 11" />
            </g>
          </svg>

          {ROUTER_REGIONS.map((region) => (
            <div key={region.id} className="absolute" style={{ left: region.map.x, top: region.map.y }}>
              <MapMarker region={region} selected={region.id === selectedRegionId} onSelect={onSelectRegion} />
            </div>
          ))}

          <div className="absolute bottom-4 left-4 rounded-md border border-slate-200 bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-slate-500 shadow-sm">
            Select a region to inspect its routing inputs.
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Region detail</div>
              <div className="mt-1 text-xs text-slate-500">Each candidate is rendered from the same data model.</div>
            </div>
            <span className="text-xs font-semibold text-slate-400">{ROUTER_REGIONS.length} evaluated</span>
          </div>
          <div className="space-y-3">
            {ROUTER_REGIONS.map((region) => (
              <RegionDetailCard key={region.id} region={region} selected={region.id === selectedRegionId} onSelect={onSelectRegion} />
            ))}
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
  const [telemetryRefreshing, setTelemetryRefreshing] = useState(false);
  const [reportStatus, setReportStatus] = useState("idle");
  const [workloadName, setWorkloadName] = useState(DEFAULT_WORKLOAD.name);
  const [workloadCategory, setWorkloadCategory] = useState(DEFAULT_WORKLOAD.category);
  const [deadlineVal, setDeadlineVal] = useState(DEFAULT_WORKLOAD.deadlineHours);
  const [geoFence, setGeoFence] = useState(true);
  const [countKey, setCountKey] = useState(0);

  const switchTab = useCallback((tabId) => setActiveTab(tabId), []);

  const refreshTelemetry = useCallback(() => {
    if (telemetryRefreshing) return;
    setTelemetryRefreshing(true);
    setTimeout(() => setTelemetryRefreshing(false), 900);
  }, [telemetryRefreshing]);

  const generateReport = useCallback(() => {
    if (reportStatus === "generating") return;
    setReportStatus("generating");
    setTimeout(() => setReportStatus("ready"), 1100);
  }, [reportStatus]);

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
    }, 950);
  }, [hasData, isDispatching, isDispatched]);

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
            <div className={telemetryRefreshing ? "inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700" : "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"}>
              <span className={telemetryRefreshing ? "h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" : "h-1.5 w-1.5 rounded-full bg-emerald-500"} />
              {telemetryRefreshing ? "Refreshing telemetry…" : "Telemetry active"}
            </div>
            <button
              onClick={refreshTelemetry}
              disabled={telemetryRefreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <svg className={`h-3.5 w-3.5 text-slate-500 ${telemetryRefreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              Refresh telemetry
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "command-center" && (
            <motion.div key="command" className="space-y-6 pt-6" initial="initial" animate="animate" variants={stagger}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Water conserved" tone="blue" detail={isDispatched ? "+18.4% vs baseline" : "Awaiting dispatch"} icon={metricIcons.water}>
                  {isDispatched ? <span key={countKey}><CountUp end={41850} duration={1.5} separator="," /> L</span> : "0 L"}
                </MetricCard>
                <MetricCard label="Emissions avoided" tone="green" detail={isDispatched ? "-68.2% vs default routing" : "Awaiting dispatch"} icon={metricIcons.carbon}>
                  {isDispatched ? <span key={countKey}><CountUp end={1420.8} decimals={1} duration={1.5} separator="," /> kg</span> : "0 kg"}
                </MetricCard>
                <MetricCard label="Heat energy reused" tone="amber" detail={isDispatched ? "Stockholm district loop" : "Loop idle"} icon={metricIcons.heat}>
                  {isDispatched ? <span key={countKey}><CountUp end={8.4} decimals={1} duration={1.5} /> MWh</span> : "0 MWh"}
                </MetricCard>
                <MetricCard label="Compliance status" tone={hasData ? "green" : "slate"} detail="CSRD Scope 2/3" icon={metricIcons.compliance}>
                  {isDispatched ? <span key={countKey}><CountUp end={99.4} decimals={1} duration={1.5} />%</span> : "Standby"}
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

                {isDispatched && (
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
                {!isDispatched ? (
                  <EmptyState compact title="No routing events" description="Dispatch a routed workload from Router Studio to populate this stream." />
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
                  <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">Environmental impact</h2>
                      <p className="mt-1 text-sm text-slate-500">Feasibility, environmental trade-offs, and route selection</p>
                    </div>
                    <span className={hasData ? "text-xs font-medium text-emerald-700" : isLoading ? "text-xs font-medium text-blue-600" : "text-xs font-medium text-slate-400"}>{hasData ? "Analysis complete" : isLoading ? "Analysis running…" : "Ready"}</span>
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
                        <EnvironmentalMap selectedRegionId={selectedRegionId} onSelectRegion={setSelectedRegionId} />
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
              <motion.div variants={fadeInUp} className="flex items-center justify-end gap-3">
                {reportStatus === "ready" && <span className="text-xs font-medium text-emerald-700">CSRD report generated · PDF ready</span>}
                <button onClick={generateReport} disabled={reportStatus === "generating"} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70">
                  <svg className={`h-4 w-4 text-slate-500 ${reportStatus === "generating" ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24">
                    {reportStatus === "generating" ? <><circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" /><path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" /></> : <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />}
                  </svg>
                  {reportStatus === "generating" ? "Generating report…" : reportStatus === "ready" ? "Regenerate CSRD report" : "Generate CSRD report"}
                </button>
              </motion.div>

              <motion.section variants={fadeInUp} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {!isDispatched ? (
                  <div className="p-6 sm:p-8"><EmptyState title="No routing decisions logged" description="Dispatch a routed workload in Router Studio to create an audited record." /></div>
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
