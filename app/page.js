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
  const sizes = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-11 w-11";
  const icon = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-7 w-7" : "h-6 w-6";

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
      <span className={cx("text-[22px] font-bold tracking-tight", dark ? "text-white" : "text-slate-950")}>
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
    <div className="laptop-device relative mx-auto w-full max-w-[730px]">
      <div className="relative z-10 px-1 pt-1">
        <div className="laptop-screen premium-screen overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.18),0_0_0_4px_rgba(255,255,255,0.92)]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <GlobeMark size="sm" />
              <span className="text-base font-bold tracking-tight text-slate-950">
                Omni<span className="text-blue-600">Router</span>
              </span>
            </div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">Routing workspace</span>
          </div>

          <div className="grid grid-cols-[178px_1fr]">
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
                      <div className="flex items-center gap-1.5">
                        <span className={cx("h-1.5 w-1.5 rounded-full", region.dot)} />
                        <span className="text-[10px] font-bold text-slate-900">{region.name}</span>
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
      <header className="absolute inset-x-0 top-0 z-40 border-b border-white/40 bg-white/35 backdrop-blur-sm">
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
        <section className="hero-landing relative min-h-[700px] overflow-hidden">
          <div className="hero-scene pointer-events-none absolute inset-0 z-0" />
          <div className="hero-scene-fade pointer-events-none absolute inset-0 z-[1]" />

          <div className="relative z-10 mx-auto grid min-h-[700px] max-w-[1440px] items-center gap-4 px-6 pb-14 pt-24 lg:grid-cols-[0.84fr_1.16fr] lg:px-10 lg:pb-14 lg:pt-20">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="relative z-20">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Sustainable compute routing
              </div>

              <h1 className="mt-6 max-w-[570px] text-[44px] font-bold leading-[1.03] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[62px]">
                Route AI workloads for a cleaner <span className="text-blue-600">planet.</span>
              </h1>

              <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-slate-600 sm:text-[18px]">
                OmniRouter places AI workloads across data centers using carbon intensity, water stress, heat reuse, and operational constraints.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setSignInOpen(true)} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                  Get started <Arrow />
                </button>
                <button onClick={() => setSignInOpen(true)} className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Sign in
                </button>
              </div>

              <div className="mt-8 grid max-w-[560px] grid-cols-3 gap-0 border-t border-slate-200/90 pt-5">
                <div className="flex min-w-0 items-center gap-2.5 pr-4">
                  <FeatureIcon type="leaf" />
                  <div><div className="text-xs font-bold text-slate-900">Lower emissions</div><div className="text-[11px] text-slate-500">Carbon-aware</div></div>
                </div>
                <div className="flex min-w-0 items-center gap-2.5 border-l border-slate-200/80 px-4">
                  <FeatureIcon type="drop" />
                  <div><div className="text-xs font-bold text-slate-900">Conserve water</div><div className="text-[11px] text-slate-500">Water-aware</div></div>
                </div>
                <div className="flex min-w-0 items-center gap-2.5 border-l border-slate-200/80 pl-4">
                  <FeatureIcon type="heat" />
                  <div><div className="text-xs font-bold text-slate-900">Reuse heat</div><div className="text-[11px] text-slate-500">Thermal</div></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }} className="relative z-10">
              <div className="relative min-h-[590px]">
                <DashboardPreview />
              </div>
            </motion.div>
          </div>
        </section>
        <section className="border-y border-slate-200 bg-slate-50/70">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5 lg:px-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">One routing layer · four decision signals</span>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-semibold text-slate-500">
              <span>Carbon</span>
              <span>Water</span>
              <span>Heat reuse</span>
              <span>Operational constraints</span>
            </div>
          </div>
        </section>

                <section id="product" className="scroll-mt-20 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Product</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">A climate-conscious control plane for compute.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">OmniRouter sits between your workload pipeline and cloud infrastructure, turning workload requirements and environmental conditions into an auditable routing decision.</p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-4">
              {[
                { icon: "shield", step: "01", title: "Intercept", text: "Accept a workload through an SDK, API, or Kubernetes manifest with its scheduling and policy requirements." },
                { icon: "shield", step: "02", title: "Filter", text: "Remove regions that violate hard constraints such as data residency, SLA, or capacity requirements." },
                { icon: "leaf", step: "03", title: "Optimize", text: "Compare eligible regions across carbon intensity, water stress, heat reuse, and latency." },
                { icon: "drop", step: "04", title: "Dispatch & audit", text: "Send a lightweight route command and preserve the decision, environmental delta, and rationale." },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <FeatureIcon type={item.icon} />
                    <span className="text-[11px] font-semibold tracking-[0.14em] text-slate-300">{item.step}</span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 lg:p-7">
              <div className="grid gap-5 md:grid-cols-3 md:items-center">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Routing engine</div>
                  <div className="mt-1 text-lg font-bold text-slate-950">Multi-variable decisions, not carbon alone.</div>
                </div>
                <div className="text-sm leading-6 text-slate-600">Carbon and water can move in opposite directions. OmniRouter keeps both in the decision and surfaces locations where compute heat can be reused.</div>
                <div className="rounded-xl border border-emerald-200 bg-white p-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600">Decision output</div>
                  <div className="mt-1 text-sm font-bold text-slate-950">Eligible target + rationale + environmental delta</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="scroll-mt-20 border-y border-slate-200 bg-slate-50/70">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Use cases</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Designed around flexible compute.</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">Workloads with some scheduling flexibility give the router room to respond to environmental and operational changes.</p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {[
                { eyebrow: "Training & fine-tuning", title: "Find a better place or a better start window.", text: "Shift long-running GPU workloads toward eligible regions with lower combined environmental burden while keeping runtime independent from scheduling flexibility." },
                { eyebrow: "Inference & embeddings", title: "Balance sustained traffic with local constraints.", text: "Use carbon, water stress, latency, and residency together when selecting where recurring AI workloads should run." },
                { eyebrow: "HPC & rendering", title: "Route non-urgent compute around heat and water pressure.", text: "Use environmental conditions and recovery opportunities to place batch rendering, simulations, and other delay-tolerant workloads." },
              ].map((item) => (
                <div key={item.eyebrow} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-600">{item.eyebrow}</div>
                  <h3 className="mt-3 text-xl font-bold leading-snug text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Impact</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Measure the effect of every routing decision.</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">OmniRouter keeps the environmental delta alongside the route itself, making the operational outcome visible to engineering, sustainability, and compliance teams.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Carbon", metric: "Grid intensity", text: "Compare the emissions profile of eligible regions instead of routing on availability alone." },
                  { title: "Water", metric: "Regional stress", text: "Account for water scarcity so a lower-carbon destination does not create a blind water trade-off." },
                  { title: "Heat", metric: "Recovery potential", text: "Surface locations where data-center heat can connect to district or industrial heat demand." },
                  { title: "Compliance", metric: "Decision history", text: "Preserve timestamps, constraints, deltas, and rationale for traceable sustainability reporting." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-lg font-bold text-slate-950">{item.title}</div>
                      <span className="rounded-md bg-slate-50 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">{item.metric}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="docs" className="scroll-mt-20 border-t border-slate-200 bg-slate-50/70">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600">Docs</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Connect OmniRouter to the workloads you already run.</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">The routing layer is designed to sit beside your existing ML and compute workflows rather than replace them.</p>
              </div>
              <a href="/dashboard" className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 md:self-auto">Open workspace <Arrow /></a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["SDK / API", "Submit workload requirements, scheduling flexibility, and policy constraints."],
                ["Kubernetes", "Attach routing policy through a workload manifest before compute is dispatched."],
                ["Routing inputs", "Workload class, SLA flexibility, residency, environmental signals, and latency."],
                ["Audit output", "Store the route, environmental delta, timestamp, and decision rationale."],
              ].map(([title, text]) => (
                <a key={title} href="/dashboard" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="text-base font-bold text-slate-950">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-600">Explore <Arrow /></div>
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
