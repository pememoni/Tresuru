"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Users,
  BarChart3,
  FileText,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LogoMark, LogoFull } from "@/components/ui/Logo";

const FEATURES = [
  {
    icon: Wallet,
    title: "Multi-Account Treasury",
    description:
      "Manage operating, reserve, payroll, and investment accounts, all denominated in trUSD on Tempo.",
  },
  {
    icon: Users,
    title: "Multi-Sig Approvals",
    description:
      "Configurable approval workflows with role-based access. Low, medium, and high-value thresholds.",
  },
  {
    icon: FileText,
    title: "Native Reconciliation",
    description:
      "On-chain memos via Tempo's TIP-20 standard. Invoice numbers and cost centers without off-chain mapping.",
  },
  {
    icon: Shield,
    title: "TIP-403 Compliance",
    description:
      "Built-in policy registry compliance. Every transaction passes through Tempo's regulatory framework.",
  },
  {
    icon: Zap,
    title: "Sub-Cent Fees",
    description:
      "Fixed fees targeting less than $0.001 per transaction. Pay fees in stablecoins with no volatile gas tokens.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Cash flow analysis, spending breakdowns, and approval metrics, all powered by on-chain data.",
  },
];

const PARTNERS = [
  "Anthropic",
  "Deutsche Bank",
  "Visa",
  "Mastercard",
  "Shopify",
  "Revolut",
  "Stripe",
  "UBS",
];

export default function LandingPage() {
  const { ready, authenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="min-h-screen landing-bg">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07070e]/70 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoFull />
            <span className="text-[10px] text-white/20 bg-white/[0.04] px-2.5 py-0.5 rounded-full font-mono">
              Testnet
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/docs"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Docs
            </Link>
            <Button onClick={login} disabled={!ready} size="sm">
              Launch App
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/8 border border-indigo-400/15 mb-10">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-xs font-medium text-indigo-300/80">
              Live on Tempo Moderato Testnet
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            Corporate Treasury,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          <p className="text-lg text-white/35 mt-7 max-w-xl mx-auto leading-relaxed">
            Enterprise-grade treasury management on Tempo Network.
            Multi-sig approvals, real-time settlement, and native reconciliation
            powered by trUSD.
          </p>

          <div className="flex items-center justify-center gap-3 mt-10">
            <Button onClick={login} disabled={!ready} size="lg">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/dashboard")}
            >
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-20">
            {[
              { value: "$18M+", label: "Demo Treasury AUM" },
              { value: "<$0.001", label: "Per Transaction" },
              { value: "2.4s", label: "Avg Settlement" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                <p className="text-xs text-white/25 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-14 border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-[10px] text-white/15 uppercase tracking-[0.2em] mb-6">
            Tempo Network Design Partners
          </p>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            {PARTNERS.map((partner) => (
              <span key={partner} className="text-sm text-white/15 font-medium">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Everything a Treasury Team Needs
            </h2>
            <p className="text-sm text-white/30 mt-3 max-w-md mx-auto">
              Purpose-built for corporations managing stablecoin treasuries on Tempo Network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.04] hover:border-indigo-500/15 hover:bg-white/[0.035] transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/8 flex items-center justify-center mb-5 group-hover:bg-indigo-500/12 transition-colors duration-300">
                    <Icon className="w-[18px] h-[18px] text-indigo-400/80" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white/90 mb-2">{feature.title}</h3>
                  <p className="text-[13px] text-white/30 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Tempo */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white tracking-tight">Why Tempo Network?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Zap,
                title: "Payment-Native Architecture",
                text: "Dedicated payment lanes for TIP-20 stablecoin transfers. No noisy-neighbor contention from other on-chain activity.",
              },
              {
                icon: Globe,
                title: "Stablecoin-First Design",
                text: "Transaction fees paid in USD stablecoins. No volatile gas tokens, just predictable costs for enterprise accounting.",
              },
              {
                icon: FileText,
                title: "Built-In Reconciliation",
                text: "On-transfer memos with commitment patterns for off-chain PII. Invoice numbers and cost centers stored natively on-chain.",
              },
              {
                icon: Shield,
                title: "Enterprise Compliance",
                text: "TIP-403 Policy Registry provides built-in compliance. Regulatory requirements met at the protocol level.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/8 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-[18px] h-[18px] text-indigo-400/80" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white/90 mb-1">{item.title}</h3>
                    <p className="text-[13px] text-white/30 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Ready to Explore?</h2>
          <p className="text-sm text-white/30 mt-3">
            Connect your wallet or sign in with email to access the full treasury dashboard.
            Running on Tempo Moderato Testnet with trUSD.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button onClick={login} disabled={!ready} size="lg">
              Launch Tresuru
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark size={20} />
            <span className="text-xs text-white/20">
              Tresuru · Built on Tempo Network
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://tempo.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/15 hover:text-white/35 transition-colors"
            >
              tempo.xyz
            </a>
            <Link
              href="/docs"
              className="text-xs text-white/15 hover:text-white/35 transition-colors"
            >
              Documentation
            </Link>
            <span className="text-xs text-white/10 font-mono">Chain 42431</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
