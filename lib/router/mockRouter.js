export const ROUTER_REGIONS = [
  {
    id: "oregon",
    name: "Oregon",
    code: "US-West-2",
    descriptor: "Hydroelectric & wind basin",
    carbon: 142,
    waterStress: 4.2,
    waterLabel: "Critical",
    heat: "No recovery loop",
    latency: 24,
    heatScore: 0.15,
    map: { x: "24%", y: "39%" },
    tone: "risk",
    badge: "Water constraint",
  },
  {
    id: "stockholm",
    name: "Stockholm",
    code: "EU-North-1",
    descriptor: "Fossil-free grid + district heat",
    carbon: 14,
    waterStress: 0.12,
    waterLabel: "Ultra low",
    heat: "82°C district loop",
    latency: 38,
    heatScore: 1,
    map: { x: "53%", y: "30%" },
    tone: "selected",
    badge: "Recommended",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    code: "AP-South-1",
    descriptor: "Solar curtailment corridor",
    carbon: 380,
    waterStress: 2.1,
    waterLabel: "Moderate",
    heat: "Solar sync",
    latency: 112,
    heatScore: 0.4,
    map: { x: "70%", y: "59%" },
    tone: "constraint",
    badge: "Thermal constraint",
  },
];

export const FEASIBILITY_CHECKS = [
  { label: "Data residency policy", detail: "Geo-fence loaded", status: "Pass" },
  { label: "Scheduling flexibility", detail: "12h start delay available", status: "Pass" },
  { label: "Workload class", detail: "LLM batch inference", status: "Pass" },
  { label: "Candidate capacity", detail: "3 regions available", status: "Pass" },
];

export const ROUTING_STEPS = [
  "Feasibility filter",
  "Environmental telemetry",
  "Pareto optimization",
  "Route decision",
];

export const STREAM_ROWS = [
  { id: "#R-9042", time: "22m ago", name: "Llama-3-70B-BF16", desc: "Batch inference · 500k tokens/sec", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-74.1%", water: "120 L/hr", status: "Dispatched", statusColor: "emerald" },
  { id: "#R-9041", time: "1h 37m ago", name: "Mistral-Large-Embed", desc: "Vector database embeddings", dest: "US-West-2 (Oregon)", destColor: "blue", carbon: "-58.4%", water: "85 L/hr", status: "Completed", statusColor: "slate" },
  { id: "#R-9040", time: "4h 2m ago", name: "StableDiffusion-XL-FineTune", desc: "3D rendering / diffusion", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-72.8%", water: "110 L/hr", status: "Completed", statusColor: "slate" },
];

export const LEDGER_ROWS = [
  { id: "#JOB-8841", time: "Just now", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-74.1%", carbonSaved: "38.2 kg saved", water: "-120 L", rationale: "Low carbon intensity; waste heat exported to the city grid." },
  { id: "#JOB-8840", time: "12m ago", dest: "US-West-2 (Oregon)", destColor: "blue", carbon: "-58.4%", carbonSaved: "21.5 kg saved", water: "-85 L", rationale: "Hydro power used during the selected green-energy window." },
  { id: "#JOB-8839", time: "45m ago", dest: "EU-North-1 (Stockholm)", destColor: "emerald", carbon: "-72.8%", carbonSaved: "44.0 kg saved", water: "-110 L", rationale: "Residency constraint applied; zero-carbon grid selected." },
];

export const BASELINE_IMPACT = {
  water: 37650,
  emissions: 1182.6,
  heat: 6.9,
  compliance: 99.3,
  sessionDispatch: {
    water: 4200,
    emissions: 238.2,
    heat: 1.5,
    compliance: 0.1,
  },
};

export const ROUTE_DECISION = {
  regionId: "stockholm",
  targetCode: "EU-North-1",
  targetLabel: "EU-North-1 · Stockholm",
  rationale: "Lowest combined environmental burden within the workload constraints.",
  carbonDelta: "-74.1%",
  waterDelta: "120 L/hr saved",
  heatReuse: "District heat available",
  latency: "38 ms",
  residency: "Policy compliant",
};

export const DEFAULT_WORKLOAD = {
  name: "Llama-3 Fine-Tuning (70B-Instruct)",
  category: "LLM Batch Inference · High Throughput",
  deadlineHours: 12,
};

export function createDispatchPayload({ workloadName, workloadCategory, deadlineHours, geoFence, targetRegion = "EU-North-1" }) {
  return {
    workload: workloadName,
    category: workloadCategory,
    max_start_delay_hours: deadlineHours,
    runtime_limit_hours: null,
    data_residency: geoFence ? "EU-GDPR" : "Flexible",
    target_region: targetRegion,
    routing_policy: "carbon + water + heat",
  };
}
