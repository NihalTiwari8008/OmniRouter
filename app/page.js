"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Impact", href: "#impact" },
  { label: "Docs", href: "#docs" },
];

const cx = (...classes) => classes.filter(Boolean).join(" ");

function GlobeMark({ size = "md", dark = false }) {
  const sizes = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-10 w-10" : "h-9 w-9";
  const icon = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <span className={cx("relative flex shrink-0 items-center justify-center", sizes, dark ? "text-white" : "text-blue-600")}>
      <svg className={cx(icon, "overflow-visible")} viewBox="0 0 36 36" fill="none" stroke="currentColor" aria-hidden="true">
        <circle cx="18" cy="18" r="15.2" strokeWidth="2" />
        <path d="M2.8 18h30.4M18 2.8c4.4 4 6.8 9.1 6.8 15.2S22.4 29.2 18 33.2C13.6 29.2 11.2 24.1 11.2 18S13.6 6.8 18 2.8Z" strokeWidth="1.65" />
        <path d="M5.5 10.5c3.8 2.2 8 3.3 12.5 3.3s8.7-1.1 12.5-3.3M5.5 25.5c3.8-2.2 8-3.3 12.5-3.3s8.7 1.1 12.5 3.3" strokeWidth="1.35" />
      </svg>
      <span className="absolute right-0.5 top-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
    </span>
  );
}

function Logo({ dark = false, size = "md" }) {
  return (
    <a href="/" className="flex items-center gap-2.5">
      <GlobeMark size={size} dark={dark} />
      <span className={cx("text-lg font-bold tracking-tight", dark ? "text-white" : "text-slate-950")}>
        Omni<span className="text-blue-600">Router</span>
      </span>
    </a>
  );
}

function Arrow() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function FeatureIcon({ type }) {
  const paths = {
    leaf: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z",
    drop: "M12 2.5S5.5 10 5.5 14.5a6.5 6.5 0 0013 0C18.5 10 12 2.5 12 2.5z",
    heat: "M12 21a7 7 0 007-7c0-4.5-4.1-6.1-5.3-10.5C11 5.3 8 7.4 8 10.7c0 1.7.8 2.9 1.6 3.8-.1-2.1 1-3.7 2.2-4.8.2 2.7 3.2 3.2 3.2 5.2A3.8 3.8 0 0112 18a3.8 3.8 0 01-3.8-3.8C8.2 10.1 12 7 12 7",
    shield: "M12 3l7 3v5c0 4.4-3 8.4-7 10-4-1.6-7-5.6-7-10V6l7-3zm-3.1 8.4 2 2 4.2-4.2",
  };

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-blue-600 ring-1 ring-slate-200">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d={paths[type]} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    </span>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div className="absolute -inset-5 rounded-[34px] bg-blue-100/50 blur-3xl" />
      <div className="relative rotate-[1.2deg] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/30">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <GlobeMark size="sm" />
            <span className="text-sm font-bold tracking-tight text-slate-950">
              Omni<span className="text-blue-600">Router</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Telemetry active
          </span>
        </div>

        <div className="grid grid-cols-[180px_1fr]">
          <aside className="border-r border-slate-200 bg-slate-50/70 p-3">
            <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Navigation</p>
            <div className="space-y-1">
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-600">Command Center</div>
              <div className="rounded-lg px-3 py-2 text-[11px] font-medium text-slate-500">Router Studio</div>
              <div className="rounded-lg px-3 py-2 text-[11px] font-medium text-slate-500">Audit Ledger</div>
            </div>
          </aside>

          <div className="bg-white p-4">
            <div className="flex items-end justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-950">Executive Dashboard</h3>
                <p className="mt-0.5 text-[10px] text-slate-500">Carbon, water, and thermal routing efficiency</p>
              </div>
              <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-semibold text-slate-600">Standby</span>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2.5">
              {[
                ["Water", "41,850 L", "18.4%"],
                ["Emissions", "1,420.8 kg", "68.2%"],
                ["Heat", "8.4 MWh", "Active"],
                ["Compliance", "99.4%", "Verified"],
              ].map((item) => (
                <div key={item[0]} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">{item[0]}</div>
                  <div className="mt-3 text-sm font-bold tracking-tight text-slate-950">{item[1]}</div>
                  <div className="mt-1 text-[9px] font-semibold text-emerald-600">{item[2]}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-950">Global data center network</div>
                  <div className="mt-0.5 text-[9px] text-slate-500">Current operating conditions</div>
                </div>
                <span className="text-[9px] font-medium text-slate-400">3 regions</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { name: "Oregon", detail: "142 gCO2e/kWh", badge: "High water stress", dot: "bg-red-500", badgeCls: "border-red-200 bg-red-50 text-red-700" },
                  { name: "Stockholm", detail: "14 gCO2e/kWh", badge: "Recommended target", dot: "bg-emerald-500", badgeCls: "border-emerald-200 bg-emerald-50 text-emerald-700" },
                  { name: "Mumbai", detail: "380 gCO2e/kWh", badge: "Thermal constraint", dot: "bg-amber-500", badgeCls: "border-amber-200 bg-amber-50 text-amber-700" },
                ].map((region) => (
                  <div key={region.name} className="rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={cx("h-1.5 w-1.5 rounded-full", region.dot)} />
                        <span className="text-[10px] font-bold text-slate-900">{region.name}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[8px] text-slate-500">{region.detail}</div>
                    <div className={cx("mt-2 inline-flex rounded px-1.5 py-1 text-[7px] font-semibold", region.badgeCls)}>{region.badge}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
              <div className="text-[10px] font-bold text-emerald-900">Current route · EU-North-1 (Stockholm)</div>
              <div className="mt-1 text-[9px] text-emerald-700">74.1% lower carbon · 120 L/hr water savings · district heat available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInModal({ open, onClose }) {
  const continueToDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Logo size="sm" />
              </div>
              <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-950">Sign in</h2>
              <p className="mt-1 text-sm text-slate-500">Continue to your workspace</p>
            </div>

            <div className="mt-6 space-y-2.5">
              {[
                { label: "Continue with Google", icon: "G" },
                { label: "Continue with GitHub", icon: "GH" },
                { label: "Continue with Microsoft", icon: "MS" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={continueToDashboard}
                  className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex w-6 justify-center text-xs font-bold text-slate-700">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              or
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              onClick={continueToDashboard}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v12H4zM4 8l8 5 8-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></svg>
              Continue with Email
            </button>

            <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
              By continuing, you agree to the Terms and Privacy Policy.
            </p>

            <button onClick={onClose} className="mt-4 block w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800">Close</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function LandingPage() {
  const [signInOpen, setSignInOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-950">{item.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setSignInOpen(true)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Sign in</button>
            <button onClick={() => setSignInOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Get started</button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-environment relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.84)_38%,rgba(255,255,255,0.28)_72%,rgba(255,255,255,0.08)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.22))]" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-18 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-24 lg:pt-20">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Sustainable compute routing
              </div>

              <h1 className="mt-6 max-w-xl text-4xl font-bold leading-[1.05] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
                Route AI workloads for a cleaner <span className="text-blue-600">planet.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                OmniRouter places AI workloads across data centers using carbon intensity, water stress, heat reuse, and operational constraints.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setSignInOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                  Get started <Arrow />
                </button>
                <button onClick={() => setSignInOpen(true)} className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Sign in
                </button>
              </div>

              <div className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2.5">
                  <FeatureIcon type="leaf" />
                  <div><div className="text-xs font-semibold text-slate-800">Lower emissions</div><div className="text-[11px] text-slate-500">Carbon-aware placement</div></div>
                </div>
                <div className="flex items-center gap-2.5">
                  <FeatureIcon type="drop" />
                  <div><div className="text-xs font-semibold text-slate-800">Conserve water</div><div className="text-[11px] text-slate-500">Water-aware routing</div></div>
                </div>
                <div className="flex items-center gap-2.5">
                  <FeatureIcon type="heat" />
                  <div><div className="text-xs font-semibold text-slate-800">Reuse heat</div><div className="text-[11px] text-slate-500">Thermal opportunities</div></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}>
              <DashboardPreview />
            </motion.div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50/70">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5 lg:px-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Built for modern compute operations</span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-semibold text-slate-400">
              <span>Cloud infrastructure</span>
              <span>AI platforms</span>
              <span>Enterprise IT</span>
              <span>Data centers</span>
            </div>
          </div>
        </section>

        <section id="product" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Product</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Routing decisions, from workload to audit trail.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">A focused workflow for choosing a destination, explaining the decision, and keeping a record of the outcome.</p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "leaf", title: "Placement engine", text: "Compare regions against workload, SLA, residency, carbon, and water constraints." },
                { icon: "drop", title: "Environmental view", text: "See the carbon and water trade-offs behind each candidate region." },
                { icon: "heat", title: "Thermal reuse", text: "Surface locations where compute heat can support district or industrial heat loops." },
                { icon: "shield", title: "Audit ledger", text: "Keep routing decisions, deltas, timestamps, and rationale in one traceable record." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <FeatureIcon type={item.icon} />
                  <h3 className="mt-5 text-base font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="use-cases" className="scroll-mt-20 border-y border-slate-200 bg-slate-50/70">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Use cases</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Where OmniRouter fits.</h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {[
                { eyebrow: "Batch workloads", title: "Shift flexible compute to better operating windows.", text: "Use execution windows to move jobs toward regions with lower environmental impact without changing the workload." },
                { eyebrow: "Inference & embeddings", title: "Route sustained AI traffic around local constraints.", text: "Balance environmental conditions with latency and data-residency requirements across regions." },
                { eyebrow: "Enterprise operations", title: "Turn routing decisions into reportable records.", text: "Keep an accountable record of why workloads moved, what changed, and which constraints were applied." },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600">{item.eyebrow}</div>
                  <h3 className="mt-3 text-xl font-bold leading-snug text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Impact</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Measure what changes when compute moves.</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">OmniRouter keeps environmental signals alongside routing outcomes, so the operational effect of each decision is visible.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Carbon", text: "Compare grid intensity and resulting emissions deltas between candidate regions." },
                  { title: "Water", text: "Account for regional water stress when choosing where workloads should run." },
                  { title: "Heat", text: "Identify compute locations with practical opportunities for heat recovery and reuse." },
                  { title: "Compliance", text: "Preserve decision history and rationale for internal reporting and audits." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-lg font-bold text-slate-950">{item.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="docs" className="scroll-mt-20 border-t border-slate-200 bg-slate-50/70">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Docs</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Understand the routing layer.</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">A compact documentation path for teams integrating OmniRouter into compute operations.</p>
              </div>
              <a href="/dashboard" className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 md:self-auto">Open workspace <Arrow /></a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Getting started", "Connect a workload and run your first placement analysis."],
                ["Routing inputs", "Workload type, SLA, residency, and environmental constraints."],
                ["Metrics & methodology", "Understand carbon, water, thermal, and routing deltas."],
                ["Audit & reporting", "Review routing history and export compliance records."],
              ].map(([title, text]) => (
                <a key={title} href="/dashboard" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="text-base font-bold text-slate-950">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-600">Open <Arrow /></div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-950">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div>
              <Logo dark />
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">Compute sustainability infrastructure for carbon-aware, water-aware, and heat-aware workload routing.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <a href="#product" className="hover:text-white">Product</a>
              <a href="#use-cases" className="hover:text-white">Use Cases</a>
              <a href="#impact" className="hover:text-white">Impact</a>
              <a href="#docs" className="hover:text-white">Docs</a>
            </div>
          </div>
        </section>
      </main>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  );
}
