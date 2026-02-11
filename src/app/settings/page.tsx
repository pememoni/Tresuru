"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useTreasuryStore } from "@/store/treasury";
import { formatUSD, shortenAddress, formatDate } from "@/lib/format";
import {
  Users,
  Shield,
  Plus,
  Trash2,
  Settings2,
  FileText,
  Globe,
  Key,
  ExternalLink,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ROLES, Role } from "@/lib/constants";
import { PRIMARY_STABLECOIN, tempoTestnet } from "@/lib/chain";

export default function SettingsPage() {
  const { team, policies, addTeamMember, removeTeamMember } = useTreasuryStore();
  const [showAddMember, setShowAddMember] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    address: "",
    role: "viewer" as Role,
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.address) return;
    addTeamMember(newMember);
    setNewMember({ name: "", email: "", address: "", role: "viewer" });
    setShowAddMember(false);
  };

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">
          Manage team access, policies, and treasury configuration
        </p>
      </div>

      {/* Network Config */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-white/40" />
            <h3 className="text-sm font-semibold text-white">Network Configuration</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Network", value: tempoTestnet.name, id: "net" },
              { label: "Chain ID", value: tempoTestnet.id.toString(), id: "chain" },
              {
                label: "RPC Endpoint",
                value: tempoTestnet.rpcUrls.default.http[0],
                id: "rpc",
                mono: true,
              },
              {
                label: "Explorer",
                value: tempoTestnet.blockExplorers?.default.url || "",
                id: "explorer",
                mono: true,
              },
              {
                label: "Primary Stablecoin",
                value: `${PRIMARY_STABLECOIN.name} (${PRIMARY_STABLECOIN.symbol})`,
                id: "coin",
              },
              {
                label: "Token Address",
                value: PRIMARY_STABLECOIN.address,
                id: "token",
                mono: true,
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <div>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p
                    className={`text-sm text-white/70 mt-0.5 ${
                      item.mono ? "font-mono text-xs" : ""
                    }`}
                  >
                    {item.mono && item.value.length > 40
                      ? shortenAddress(item.value, 12)
                      : item.value}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(item.value, item.id)}
                  className="p-1.5 rounded-md hover:bg-white/[0.06] transition-colors"
                >
                  {copied === item.id ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-white/20" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-white/40" />
            <h3 className="text-sm font-semibold text-white">Team Members</h3>
            <Badge variant="outline">{team.length} members</Badge>
          </div>
          <Button
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowAddMember(true)}
          >
            Add Member
          </Button>
        </CardHeader>
        <div className="divide-y divide-white/[0.03]">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-600/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-indigo-400">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{member.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-white/30">{member.email}</p>
                    <span className="text-white/10">·</span>
                    <p className="text-xs text-white/20 font-mono">
                      {shortenAddress(member.address)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    member.role === "admin"
                      ? "error"
                      : member.role === "treasurer"
                      ? "info"
                      : member.role === "approver"
                      ? "warning"
                      : "outline"
                  }
                >
                  <Shield className="w-2.5 h-2.5 mr-1" />
                  {member.role}
                </Badge>
                <p className="text-xs text-white/20">Added {formatDate(member.addedAt)}</p>
                {member.role !== "admin" && (
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="p-1.5 rounded-md hover:bg-red-500/10 transition-colors group"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white/10 group-hover:text-red-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Policies */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-white/40" />
            <h3 className="text-sm font-semibold text-white">Treasury Policies</h3>
          </div>
        </CardHeader>
        <div className="divide-y divide-white/[0.03]">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="px-6 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{policy.name}</p>
                    <Badge variant={policy.isActive ? "success" : "outline"} dot>
                      {policy.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/40 mt-1">{policy.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-3">
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-white/25 uppercase">Max Single Tx</p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {formatUSD(policy.maxSingleTransaction, 0)}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-white/25 uppercase">Daily Limit</p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {formatUSD(policy.dailyLimit, 0)}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-white/25 uppercase">Monthly Limit</p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {formatUSD(policy.monthlyLimit, 0)}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02]">
                  <p className="text-[10px] text-white/25 uppercase">Required Approvers</p>
                  <p className="text-sm font-medium text-white mt-0.5">
                    {policy.requiredApprovers}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Add Member Modal */}
      <Modal
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
        title="Add Team Member"
        subtitle="Grant treasury access to a new team member"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Name</label>
            <input
              type="text"
              placeholder="Full name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Email</label>
            <input
              type="email"
              placeholder="email@company.com"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={newMember.address}
              onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Role</label>
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value as Role })}
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none"
            >
              {Object.values(ROLES).map((role) => (
                <option key={role} value={role} className="bg-[#0e0e16]">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAddMember(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} icon={<Plus className="w-4 h-4" />}>
              Add Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
