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
  const maxCarbon = Math.max(...ROUTER_REGIONS.map((region) => region.carbon));
  const maxWater = Math.max(...ROUTER_REGIONS.map((region) => region.waterStress));
  const selected = ROUTER_REGIONS.find((region) => region.id === selectedRegionId) || ROUTER_REGIONS[1];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-950">Environmental trade-off matrix</h3>
          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">A compact Pareto view of the same candidates across carbon, water stress, heat reuse, and latency.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Pareto-efficient</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-500">Lower is better</span>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <div className="hidden grid-cols-[170px_1fr_1fr_130px_88px] gap-4 bg-slate-50/80 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.11em] text-slate-400 md:grid">
          <div>Region</div>
          <div>Carbon intensity</div>
          <div>Water stress</div>
          <div>Heat recovery</div>
          <div className="text-right">Latency</div>
        </div>

        <div className="divide-y divide-slate-100">
          {ROUTER_REGIONS.map((region) => {
            const selectedRow = region.id === selectedRegionId;
            const isEfficient = region.id === "stockholm";
            const carbonWidth = Math.max(8, (region.carbon / maxCarbon) * 100);
            const waterWidth = Math.max(8, (region.waterStress / maxWater) * 100);
            const carbonTone = region.tone === "risk" ? "bg-red-400" : region.tone === "constraint" ? "bg-amber-400" : "bg-emerald-500";
            const waterTone = region.tone === "risk" ? "bg-red-300" : region.tone === "constraint" ? "bg-amber-300" : "bg-emerald-400";

            return (
              <div key={region.id} className={selectedRow ? "bg-emerald-50/45 px-4 py-4" : "bg-white px-4 py-4"}>
                <div className="grid gap-4 md:grid-cols-[170px_1fr_1fr_130px_88px] md:items-center">
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${region.tone === "risk" ? "bg-red-500" : region.tone === "constraint" ? "bg-amber-500" : "bg-emerald-500"}`} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{region.name}</span>
                        {selectedRow && <span className="rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[8px] font-semibold text-blue-700">Selected</span>}
                        {isEfficient && <span className="rounded border border-emerald-200 bg-white px-1.5 py-0.5 text-[8px] font-semibold text-emerald-700">Non-dominated</span>}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-500">{region.code}</div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-slate-500 md:hidden">Carbon intensity</span>
                      <span className="font-semibold text-slate-800">{region.carbon} gCO₂e/kWh</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${carbonTone}`} style={{ width: `${carbonWidth}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
                      <span className="text-slate-500 md:hidden">Water stress</span>
                      <span className="font-semibold text-slate-800">{region.waterStress} · {region.waterLabel}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${waterTone}`} style={{ width: `${waterWidth}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:block">
                    <span className="text-[10px] text-slate-500 md:hidden">Heat recovery</span>
                    <span className={region.id === "stockholm" ? "inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700" : "inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-600"}>
                      {region.id === "stockholm" ? "District heat" : region.heat}
                    </span>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-500 md:hidden">Latency · </span>
                    <span className="text-xs font-bold text-slate-900">{region.latency} ms</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-emerald-100">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-emerald-700">Current decision</div>
              <div className="mt-1 text-sm font-bold text-slate-900">{selected.name} · {selected.code}</div>
              <div className="mt-0.5 text-[10px] leading-4 text-slate-500">{ROUTE_DECISION.rationale}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-[300px]">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center">
            <div className="text-[9px] uppercase tracking-[0.08em] text-slate-400">Carbon</div>
            <div className="mt-1 text-sm font-bold text-emerald-700">{ROUTE_DECISION.carbonDelta}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center">
            <div className="text-[9px] uppercase tracking-[0.08em] text-slate-400">Water</div>
            <div className="mt-1 text-sm font-bold text-blue-700">-120 L/hr</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center">
            <div className="text-[9px] uppercase tracking-[0.08em] text-slate-400">Latency</div>
            <div className="mt-1 text-sm font-bold text-slate-900">{selected.latency} ms</div>
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
          <button
            onClick={onDispatch}
            disabled={isDispatching}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDispatching ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-20" cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" /><path d="M20 12a8 8 0 0 0-8-8" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" /></svg>
                Dispatching
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><path d="m5 12 14-7-4.5 14-3.2-5-6.3-2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>
                Dispatch workload
              </>
            )}
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
  const selected = ROUTER_REGIONS.find((region) => region.id === selectedRegionId) || ROUTER_REGIONS[1];

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <div className="text-base font-bold text-slate-950">Global routing map</div>
          <div className="mt-1 text-xs text-slate-500">Eligible compute regions, environmental conditions, and candidate routes.</div>
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
              <MapMarker region={region} selected={region.id === selectedRegionId} onSelect={onSelectRegion} />
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
              <span className="hidden text-slate-600 sm:inline">Map: simple-world-map</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Selected target</div>
                <div className="mt-1 text-lg font-bold text-slate-950">{selected.name}</div>
                <div className="mt-0.5 text-xs text-slate-500">{selected.code} · {selected.descriptor}</div>
              </div>
              <span className="rounded-md border border-emerald-200 bg-white px-2 py-1 text-[10px] font-semibold text-emerald-700">Route target</span>
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
                    <span className={`shrink-0 rounded border px-2 py-1 text-[9px] font-semibold ${active ? "border-blue-200 bg-white text-blue-700" : badge}`}>{active ? "Inspecting" : region.badge}</span>
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

function AuditOverview({ dispatched, reportStatus }) {
  const items = [
    { label: "Logged decisions", value: dispatched ? "4" : "3", detail: dispatched ? "+1 this session" : "Awaiting new dispatch", tone: dispatched ? "emerald" : "slate" },
    { label: "Policy checks", value: dispatched ? "4 / 4" : "Ready", detail: "Residency · SLA · capacity", tone: "blue" },
    { label: "Impact fields", value: "Carbon + water", detail: "Heat reuse tracked", tone: "amber" },
    { label: "Report status", value: reportStatus === "ready" ? "PDF ready" : "Available", detail: "CSRD export workflow", tone: reportStatus === "ready" ? "emerald" : "slate" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const valueTone = item.tone === "emerald" ? "text-emerald-700" : item.tone === "blue" ? "text-blue-700" : item.tone === "amber" ? "text-amber-700" : "text-slate-800";
        return (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{item.label}</div>
            <div className={`mt-2 text-sm font-bold ${valueTone}`}>{item.value}</div>
            <div className="mt-1 text-[10px] leading-4 text-slate-500">{item.detail}</div>
          </div>
        );
      })}
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
    }, 950);
  }, [hasData, isDispatching, isDispatched]);

  const currentTab = TABS.find((tab) => tab.id === activeTab) || TABS[0];

  const liveStreamRows = isDispatched
    ? [
        {
          id: "#R-9043",
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
                <MetricCard label="Water conserved" tone="blue" detail={isDispatched ? "+18.4% vs baseline" : "Awaiting dispatch"} icon={metricIcons.water}>
                  {isDispatched ? <span key={countKey}><CountUp end={41850} duration={1.5} separator="," /> L</span> : "0 L"}
                </MetricCard>
                <MetricCard label="Emissions avoided" tone="green" detail={isDispatched ? "-68.2% vs default routing" : "Awaiting dispatch"} icon={metricIcons.carbon}>
                  {isDispatched ? <span key={countKey}><CountUp end={1420.8} decimals={1} duration={1.5} separator="," /> kg</span> : "0 kg"}
                </MetricCard>
                <MetricCard label="Heat energy reused" tone="amber" detail={isDispatched ? "Stockholm district loop" : "Loop idle"} icon={metricIcons.heat}>
                  {isDispatched ? <span key={countKey}><CountUp end={8.4} decimals={1} duration={1.5} /> MWh</span> : "0 MWh"}
                </MetricCard>
                <MetricCard label="Compliance status" tone={isDispatched ? "green" : "slate"} detail="CSRD Scope 2/3" icon={metricIcons.compliance}>
                  {isDispatched ? <span key={countKey}><CountUp end={99.4} decimals={1} duration={1.5} />%</span> : "Standby"}
                </MetricCard>
              </div>

              <motion.section variants={fadeInUp} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-950">Global data center network</h2>
                      {isDispatched && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">Routing active</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{isDispatched ? "Current operating conditions and active route" : "Available compute regions"}</p>
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
                        {liveStreamRows.map((row) => (
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
                      className="flex h-11 w-full items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 text-left text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-semibold">
                        {isLoading ? (
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-20" cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" /><path d="M20 12a8 8 0 0 0-8-8" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" /></svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>
                        )}
                        {isLoading ? "Analyzing placement" : "Analyze placement"}
                      </span>
                      <svg className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>
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
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-end gap-3">
                <span className={isDispatched ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700" : "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500"}>
                  <span className={isDispatched ? "h-1.5 w-1.5 rounded-full bg-emerald-500" : "h-1.5 w-1.5 rounded-full bg-slate-400"} />
                  {isDispatched ? "Ledger synced · 1 new decision" : "Ledger ready for new decisions"}
                </span>
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
