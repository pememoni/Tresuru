import Link from "next/link";
import {
  ArrowLeft,
  Target,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Layers,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";

const METRICS = [
  { value: "$124T", label: "Global corporate treasury market" },
  { value: "<1%", label: "Currently managed on-chain" },
  { value: "$180B+", label: "Stablecoin market cap and growing" },
  { value: "72%", label: "Of CFOs exploring digital assets" },
];

const PAIN_POINTS = [
  {
    problem: "3-5 day settlement",
    solution: "2.4s finality on Tempo",
  },
  {
    problem: "$25-45 per wire transfer",
    solution: "<$0.001 per on-chain transaction",
  },
  {
    problem: "Manual reconciliation across systems",
    solution: "Native on-chain memos with invoice and cost center data",
  },
  {
    problem: "Fragmented approval workflows",
    solution: "Configurable multi-sig with role-based thresholds",
  },
  {
    problem: "Limited visibility into cash positions",
    solution: "Real-time balance and flow analytics, 24/7",
  },
];

const DIFFERENTIATORS = [
  {
    icon: Layers,
    title: "Purpose-Built for Tempo",
    description:
      "Not a generic wallet with a dashboard. Tresuru is architected around Tempo's payment-native L1: TIP-20 tokens, TIP-403 compliance, and dedicated stablecoin payment lanes. We use the chain's unique capabilities instead of working around its limitations.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade from Day One",
    description:
      "Multi-sig approval workflows with configurable thresholds ($10K single-signer, $100K dual-approval, $1M+ committee). Role-based access control, full audit trail, and built for the compliance requirements that actual treasury teams face.",
  },
  {
    icon: Zap,
    title: "Stablecoin-Native UX",
    description:
      "No gas token management. No bridging. No volatile asset exposure. Every interaction is denominated in USD stablecoins. The entire experience is designed for teams that think in dollars, not ETH.",
  },
  {
    icon: Globe,
    title: "On-Chain Reconciliation",
    description:
      "Tempo's TIP-20 standard supports native transfer memos: invoice numbers, cost centers, and PO references stored immutably on-chain. No more maintaining off-chain mapping tables or reconciling across disparate systems.",
  },
];

const AUDIENCE_SEGMENTS = [
  {
    title: "Corporate Treasury Teams",
    description:
      "Mid-to-large enterprises holding or considering stablecoin reserves. CFOs and treasurers who need institutional-grade controls over digital asset holdings with the same rigor they apply to traditional banking.",
  },
  {
    title: "Crypto-Native Companies",
    description:
      "DAOs, protocols, and Web3 companies that already hold significant stablecoin treasuries but lack purpose-built tooling. Currently stitching together multisigs, spreadsheets, and block explorers.",
  },
  {
    title: "Financial Operations Teams",
    description:
      "AP/AR teams processing high-volume stablecoin payments: payroll, vendor disbursements, and cross-border settlements. Teams that need batch processing, approval workflows, and audit-ready reporting.",
  },
];

const ROADMAP = [
  {
    phase: "Now",
    title: "Foundation",
    items: [
      "Multi-account treasury dashboard",
      "Multi-sig approval workflows",
      "On-chain transaction memos",
      "Real-time analytics",
      "Role-based access control",
    ],
  },
  {
    phase: "Next",
    title: "Scale",
    items: [
      "Batch payment processing",
      "Recurring payment scheduling",
      "ERP integrations (SAP, NetSuite, QuickBooks)",
      "API for programmatic treasury operations",
      "Advanced reporting and export",
    ],
  },
  {
    phase: "Later",
    title: "Expand",
    items: [
      "Multi-chain treasury aggregation",
      "Yield optimization on idle reserves",
      "Fiat on/off-ramp partnerships",
      "SOC 2 Type II certification",
      "White-label enterprise deployments",
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen landing-bg text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07070e]/70 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <div className="flex items-center gap-2.5">
              <LogoMark size={24} />
              <span className="text-sm font-semibold text-white tracking-tight">Tresuru</span>
            </div>
          </Link>
          <span className="text-[10px] text-white/20 bg-white/[0.04] px-3 py-1 rounded-full">
            Documentation
          </span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24">
        {/* Header */}
        <div className="mb-24">
          <p className="text-sm font-medium text-indigo-400/80 mb-5">About Tresuru</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-6">
            The operating system for
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
              corporate stablecoin treasuries
            </span>
          </h1>
          <p className="text-lg text-white/35 leading-relaxed max-w-2xl">
            Tresuru is enterprise treasury management software built natively on Tempo Network.
            We give corporate finance teams the controls, visibility, and compliance tooling
            they need to manage stablecoin holdings with the same rigor as traditional banking,
            at a fraction of the cost and settlement time.
          </p>
        </div>

        {/* The Opportunity */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/8 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-indigo-400/80" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">The Opportunity</h2>
          </div>
          <p className="text-white/35 leading-relaxed mb-8">
            Stablecoins are the fastest-growing asset class in digital finance. Yet the
            infrastructure for managing them at the corporate level barely exists. Enterprises
            are forced to use consumer wallets, fragmented multisig tools, and manual
            spreadsheet reconciliation. The gap between stablecoin adoption and stablecoin
            management tooling represents a generational opportunity.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center"
              >
                <p className="text-xl font-bold text-indigo-400">{m.value}</p>
                <p className="text-[11px] text-white/25 mt-1.5">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The Problem We Solve */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/8 flex items-center justify-center">
              <Target className="w-4 h-4 text-indigo-400/80" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">The Problem We Solve</h2>
          </div>
          <p className="text-white/35 leading-relaxed mb-8">
            Corporate treasury operations today are slow, expensive, and opaque. Even companies
            that have adopted stablecoins face operational pain because the tooling wasn&apos;t
            built for them.
          </p>
          <div className="space-y-2.5">
            {PAIN_POINTS.map((p) => (
              <div
                key={p.problem}
                className="flex items-stretch rounded-2xl overflow-hidden border border-white/[0.04]"
              >
                <div className="flex-1 p-4 bg-red-500/[0.025]">
                  <p className="text-[10px] text-red-400/50 uppercase tracking-wider mb-1">Today</p>
                  <p className="text-sm text-white/50">{p.problem}</p>
                </div>
                <div className="w-px bg-white/[0.04]" />
                <div className="flex-1 p-4 bg-indigo-500/[0.025]">
                  <p className="text-[10px] text-indigo-400/50 uppercase tracking-wider mb-1">With Tresuru</p>
                  <p className="text-sm text-white/70">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What Makes Tresuru Different */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/8 flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-400/80" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">What Makes Tresuru Different</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DIFFERENTIATORS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.title}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/8 flex items-center justify-center mb-4">
                    <Icon className="w-[18px] h-[18px] text-indigo-400/80" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white/90 mb-2">{d.title}</h3>
                  <p className="text-[13px] text-white/30 leading-relaxed">{d.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Who It's For */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/8 flex items-center justify-center">
              <Users className="w-4 h-4 text-indigo-400/80" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Who It&apos;s For</h2>
          </div>
          <div className="space-y-3">
            {AUDIENCE_SEGMENTS.map((seg) => (
              <div
                key={seg.title}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
              >
                <h3 className="text-[15px] font-semibold text-white/90 mb-2">{seg.title}</h3>
                <p className="text-[13px] text-white/30 leading-relaxed">{seg.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/8 flex items-center justify-center">
              <Layers className="w-4 h-4 text-indigo-400/80" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Product Roadmap</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ROADMAP.map((phase) => (
              <div
                key={phase.phase}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {phase.phase}
                  </span>
                  <span className="text-sm font-semibold text-white/80">{phase.title}</span>
                </div>
                <ul className="space-y-2.5">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400/40 mt-0.5 flex-shrink-0" />
                      <span className="text-[13px] text-white/35">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Why Tempo */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/8 flex items-center justify-center">
              <Globe className="w-4 h-4 text-indigo-400/80" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Why We Build on Tempo</h2>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              Tempo is the only L1 blockchain designed specifically for payment workloads. While
              general-purpose chains optimize for smart contract execution and DeFi composability,
              Tempo optimizes for the exact primitives corporate treasuries need:
            </p>
            <ul className="space-y-3">
              {[
                "Dedicated stablecoin payment lanes with no contention from unrelated on-chain activity",
                "TIP-20 token standard with native transfer memos so reconciliation data lives on-chain",
                "TIP-403 Policy Registry with compliance rules enforced at the protocol level, not the application level",
                "Sub-cent fees paid in stablecoins with no volatile gas token exposure and predictable cost accounting",
                "2.4s average finality, fast enough for real-time treasury operations",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 mt-2 flex-shrink-0" />
                  <span className="text-sm text-white/35">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-14 px-6 rounded-3xl bg-white/[0.02] border border-white/[0.04]">
          <h2 className="text-2xl font-bold tracking-tight mb-3">See It in Action</h2>
          <p className="text-sm text-white/30 mb-8 max-w-md mx-auto">
            Tresuru is live on Tempo Moderato Testnet. Connect a wallet or explore the demo
            dashboard with no setup required.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-full transition-colors duration-200"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] text-white/50 text-sm font-medium rounded-full transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
