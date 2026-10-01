# OmniRouter

OmniRouter is a climate-conscious workload routing control plane for AI and other delay-tolerant compute.

## The problem

Cloud schedulers typically optimize around availability, cost, or latency. OmniRouter is designed to add environmental and operational signals to that decision:

- Carbon intensity
- Regional water stress
- Waste-heat reuse opportunities
- Latency and SLA constraints
- Data-residency policies

The product concept is to place workloads where the combined operational and environmental impact is lower, while preserving hard workload requirements.

## Product flow

```
Developer / ML pipeline
        |
        v
Workload constraints
        |
        v
Feasibility filter
        |
        v
Environmental telemetry
        |
        v
Multi-objective / Pareto analysis
        |
        v
Route decision
        |
        v
Dispatch
        |
        v
Audit Ledger
```

## Dashboard

### Command Center
Executive view of routing outcomes and aggregate impact:

- Water conserved
- Emissions avoided
- Heat energy reused
- Compliance status
- Regional operating conditions
- Recent routing activity

### Router Studio
Technical placement workflow:

1. Define workload requirements.
2. Set execution-window flexibility.
3. Apply data-residency constraints.
4. Run the feasibility and environmental analysis.
5. Inspect candidate regions on the map.
6. Compare carbon intensity against water stress.
7. Review the selected route and rationale.
8. Dispatch the workload.

### Audit Ledger
Traceable routing records containing the target region, environmental delta, water impact, timestamp, and routing rationale. The UI also includes a simulated CSRD report-generation flow.

## Prototype architecture

The current repository is intentionally **demo-first**. The interaction flow is simulated locally so the hackathon presentation can demonstrate the complete product journey without requiring production cloud integrations.

Mock routing data and the integration boundary live in:

```
lib/router/mockRouter.js
```

The dashboard consumes those data structures through components rather than embedding the routing workflow into the visual elements themselves.

That boundary is designed to make later integration straightforward: the mock analysis/dispatch layer can be replaced with API calls without rebuilding the dashboard UI.

## Current technical stack

- Next.js
- React
- Tailwind CSS
- Framer Motion
- React CountUp

## Demo sequence

```
Landing page
  -> Get Started
  -> Command Center
  -> Router Studio
  -> Configure workload
  -> Run placement analysis
  -> Watch staged routing pipeline
  -> Inspect regions
  -> Review Pareto analysis
  -> Dispatch workload
  -> Command Center updates
  -> Audit Ledger receives the decision
  -> Generate CSRD report
```

## Future implementation

The prototype can be extended with:

- Real telemetry providers such as grid and weather APIs
- A backend placement-analysis service
- Real feasibility and optimization logic
- Kubernetes / SDK workload interception
- Persistent audit storage
- Authentication and enterprise policy management
- Actual CSRD report generation and export
- Cloud-provider dispatch adapters

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Build for production:

```bash
npm run build
```