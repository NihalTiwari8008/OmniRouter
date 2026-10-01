"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function Pricing() {
  const tiers = [
    { name: "Developer", price: "Free", description: "For individuals and small experiments.", features: ["Up to 1,000 routing decisions/mo", "Community support", "Basic carbon metrics"], highlight: false },
    { name: "Pro", price: "$49/mo", description: "For growing teams.", features: ["Up to 50,000 decisions/mo", "Email support", "Water & heat metrics", "API access"], highlight: true },
    { name: "Enterprise", price: "Custom", description: "For large-scale infrastructure.", features: ["Unlimited routing", "24/7 dedicated support", "Custom compliance reports", "SLA guarantees"], highlight: false }
  ];
  return (
    <section id="pricing" className="scroll-mt-20 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">Pricing</div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">Start for free, upgrade when you need to route at scale.</p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:items-center">
          {tiers.map((tier) => (
            <div key={tier.name} className={`rounded-2xl border p-8 transition hover:shadow-md ${tier.highlight ? 'border-blue-400 bg-gradient-to-b from-blue-50/50 to-white shadow-lg lg:-translate-y-2 lg:scale-105 ring-1 ring-blue-400' : 'border-slate-200 bg-white shadow-sm'}`}>
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-bold ${tier.highlight ? 'text-blue-700' : 'text-slate-950'}`}>{tier.name}</h3>
                {tier.highlight && <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-blue-700">Most Popular</span>}
              </div>
              <div className="mt-4 text-4xl font-bold tracking-tight text-slate-900">{tier.price}</div>
              <p className="mt-2 text-sm text-slate-500 min-h-[40px]">{tier.description}</p>
              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                {tier.features.map(f => (
                  <li key={f} className="flex gap-3 text-sm text-slate-600">
                    <svg className="h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`mt-8 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition ${tier.highlight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50'}`}>Choose {tier.name}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SavingsCalculator() {
  const [hours, setHours] = useState(10000);
  const carbonSaved = (hours * 0.12).toFixed(1); // Mock math
  const waterSaved = (hours * 0.45).toFixed(0);
  const costSaved = (hours * 0.05).toFixed(0);

  return (
    <section id="calculator" className="scroll-mt-20 border-t border-slate-200 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl"></div>
      
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Interactive Demo</div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Calculate your impact.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Estimate the environmental and financial savings of routing your AI workloads dynamically with OmniRouter.</p>
            
            <div className="mt-10 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
              <label className="block text-sm font-semibold text-slate-900">Estimated Monthly GPU Hours</label>
              <div className="mt-6 flex items-center gap-4">
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000"
                  value={hours} 
                  onChange={(e) => setHours(e.target.value)} 
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 accent-emerald-600"
                />
                <span className="w-24 text-right font-mono text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">{Number(hours).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200/60 bg-white p-8 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-blue-500"></div>
            <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-500 mb-6">Projected Monthly Savings</h3>
            <div className="space-y-6">
              <div>
                <div className="text-4xl font-bold text-slate-900">{carbonSaved} kg</div>
                <div className="text-sm font-medium text-emerald-600 mt-1">CO2e Emissions Prevented</div>
              </div>
              <div className="h-px bg-slate-100"></div>
              <div>
                <div className="text-4xl font-bold text-slate-900">{waterSaved} L</div>
                <div className="text-sm font-medium text-blue-600 mt-1">Water Conserved</div>
              </div>
              <div className="h-px bg-slate-100"></div>
              <div>
                <div className="text-4xl font-bold text-slate-900">${costSaved}</div>
                <div className="text-sm font-medium text-amber-600 mt-1">Compute Cost Reduced</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SocialProof() {
  return (
    <section className="border-b border-slate-200 bg-blue-50/30 py-16">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 text-center">
        <p className="text-sm font-semibold text-slate-500 mb-8 uppercase tracking-wider">Trusted by forward-thinking engineering and sustainability teams</p>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 md:gap-16">
          <div className="text-2xl font-black text-slate-400">ACME<span className="text-blue-500/80">CORP</span></div>
          <div className="text-2xl font-bold tracking-tight text-slate-400">GLOBAL <span className="font-light">AI</span></div>
          <div className="text-xl font-bold italic text-slate-400">NexusHealth</div>
          <div className="text-2xl font-semibold text-slate-400 flex items-center gap-2"><svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>Starlight</div>
        </div>
        
        <div className="mt-16 rounded-2xl border border-blue-100 bg-white p-8 text-left md:p-10 max-w-4xl mx-auto shadow-lg shadow-blue-900/5 relative">
          <svg className="absolute top-6 left-6 h-12 w-12 text-blue-100" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/></svg>
          <div className="relative z-10 pl-8 md:pl-12">
            <p className="text-xl font-medium italic leading-relaxed text-slate-700">"OmniRouter completely changed how we think about compute. By routing our nightly model training based on grid intensity, we reduced our AI footprint by 40% without any impact on delivery times."</p>
            <div className="mt-8 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 p-0.5">
                <div className="h-full w-full rounded-full border-2 border-white bg-slate-200 object-cover flex items-center justify-center text-xs font-bold text-slate-500">SJ</div>
              </div>
              <div>
                <div className="font-bold text-slate-900">Sarah Jenkins</div>
                <div className="text-sm font-medium text-blue-600">VP of Engineering, Acme Corp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Integrations() {
  const integrations = [
    { name: "AWS", color: "hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50" },
    { name: "Google Cloud", color: "hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50" },
    { name: "Azure", color: "hover:border-cyan-300 hover:text-cyan-600 hover:bg-cyan-50" },
    { name: "CoreWeave", color: "hover:border-red-300 hover:text-red-600 hover:bg-red-50" },
    { name: "Kubernetes", color: "hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50" },
    { name: "Ray", color: "hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50" },
    { name: "Slurm", color: "hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50" },
    { name: "Airflow", color: "hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50" }
  ];
  return (
    <section className="border-t border-slate-200 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
         <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">Works with your existing stack</h2>
          <p className="mt-4 text-base text-slate-600">OmniRouter integrates directly with major cloud providers and orchestrators.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6 relative z-10">
          {integrations.map(item => (
            <div key={item.name} className={`flex h-24 items-center justify-center rounded-xl border border-slate-200 bg-white font-bold text-slate-400 transition-all duration-300 shadow-sm ${item.color}`}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const faqs = [
    { q: "Does OmniRouter add latency to my workloads?", a: "No. OmniRouter makes decisions asynchronously and caches environmental data to ensure routing logic takes less than 50ms." },
    { q: "How do you measure real-time carbon intensity?", a: "We ingest data from Electricity Maps, WattTime, and local grid operators to provide sub-hourly carbon intensity across 150+ regions." },
    { q: "What happens if a recommended region goes down?", a: "OmniRouter respects operational constraints first. If a region fails health checks, it is immediately removed from the eligible pool." }
  ];
  return (
    <section id="faq" className="border-t border-slate-200 bg-slate-50/70">
      <div className="mx-auto max-w-3xl px-5 py-20 lg:px-8 lg:py-24">
        <h2 className="text-3xl font-bold tracking-tight text-slate-950 text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-600">Q</span>
                {faq.q}
              </h3>
              <div className="mt-3 flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">A</span>
                <p className="text-slate-600 leading-relaxed pt-0.5">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-700">Our Mission</div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Building the sustainable compute layer.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">We believe that software should be conscious of its physical footprint. Our team of climate scientists and systems engineers came together to solve one problem: making it trivial to run workloads where the grid is clean and water is abundant.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-50 object-cover flex items-center justify-center text-indigo-400 font-medium border border-indigo-100/50">Climate Experts</div>
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 object-cover flex items-center justify-center text-emerald-500 font-medium translate-y-8 border border-emerald-100/50">Systems Engineers</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Resources() {
  const posts = [
    { title: "Navigating CSRD Compliance for AI", category: "Guide", color: "text-blue-600 bg-blue-50 border-blue-100" },
    { title: "The Hidden Water Cost of LLM Inference", category: "Research", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { title: "Green Software Engineering Principles", category: "Best Practices", color: "text-emerald-600 bg-emerald-50 border-emerald-100" }
  ];
  return (
    <section id="resources" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">Latest Resources</h2>
            <p className="mt-2 text-slate-600">Insights from the intersection of climate and compute.</p>
          </div>
          <a href="#" className="hidden sm:inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700 transition">View all articles &rarr;</a>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map(post => (
            <a key={post.title} href="#" className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-blue-200">
              <div className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${post.color}`}>{post.category}</div>
              <h3 className="mt-4 text-lg font-bold text-slate-950 group-hover:text-blue-600 transition">{post.title}</h3>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-blue-600 transition">Read article <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BookDemoCTA() {
  return (
    <section className="border-t border-blue-800 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[100%] rounded-full bg-blue-500/20 blur-3xl mix-blend-screen"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-emerald-400/10 blur-3xl mix-blend-screen"></div>
      </div>
      
      <div className="mx-auto max-w-4xl px-5 py-24 text-center lg:px-8 lg:py-28 relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl drop-shadow-sm">Ready to decarbonize your infrastructure?</h2>
        <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto font-medium">Talk to our experts to see how OmniRouter can fit into your existing stack and help you hit your sustainability goals.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="h-12 w-full sm:w-auto rounded-lg bg-white px-8 text-sm font-bold text-blue-700 shadow-lg shadow-blue-900/20 transition hover:bg-slate-50 hover:scale-105">Book a Demo</button>
          <button className="h-12 w-full sm:w-auto rounded-lg border border-blue-400/50 bg-blue-800/30 px-8 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-blue-800/50 hover:border-blue-300">View Documentation</button>
        </div>
      </div>
    </section>
  );
}





