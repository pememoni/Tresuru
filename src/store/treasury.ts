import { create } from "zustand";
import { Role, TransactionCategory } from "@/lib/constants";
import { isLiveMode, TREASURY_ADDRESS } from "@/lib/contracts";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  address: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  addedAt: string;
}

export interface Transaction {
  id: string;
  type: "outbound" | "inbound" | "internal";
  status: "pending_approval" | "approved" | "executed" | "rejected" | "cancelled";
  from: string;
  to: string;
  toLabel?: string;
  amount: number;
  token: string;
  category: TransactionCategory;
  memo: string;
  description: string;
  createdBy: string;
  createdAt: string;
  executedAt?: string;
  txHash?: string;
  approvals: Approval[];
  requiredApprovals: number;
}

export interface Approval {
  id: string;
  approver: string;
  approverName: string;
  status: "approved" | "rejected" | "pending";
  timestamp: string;
  comment?: string;
}

export interface TreasuryPolicy {
  id: string;
  name: string;
  description: string;
  maxSingleTransaction: number;
  dailyLimit: number;
  monthlyLimit: number;
  requiredApprovers: number;
  allowedCategories: TransactionCategory[];
  isActive: boolean;
}

export interface TreasuryAccount {
  id: string;
  name: string;
  address: string;
  balance: number;
  type: "operating" | "reserve" | "payroll" | "investment";
  description: string;
}

// ─── Demo Data ──────────────────────────────────────────────────────────────

const DEMO_TEAM: TeamMember[] = [
  {
    id: "1",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28",
    name: "Alex",
    email: "alex@company.com",
    role: "admin",
    addedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    name: "Rodney",
    email: "rodney@company.com",
    role: "treasurer",
    addedAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "3",
    address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    name: "Peyman",
    email: "peyman@company.com",
    role: "approver",
    addedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "4",
    address: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
    name: "Harrison",
    email: "harrison@company.com",
    role: "approver",
    addedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "5",
    address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    name: "Borna",
    email: "borna@company.com",
    role: "viewer",
    addedAt: "2025-03-01T10:00:00Z",
  },
];

const DEMO_ACCOUNTS: TreasuryAccount[] = [
  {
    id: "acc-1",
    name: "Operating Account",
    address: "0xABCD000000000000000000000000000000000001",
    balance: 2_450_000,
    type: "operating",
    description: "Day-to-day operating expenses",
  },
  {
    id: "acc-2",
    name: "Reserve Fund",
    address: "0xABCD000000000000000000000000000000000002",
    balance: 8_750_000,
    type: "reserve",
    description: "Strategic reserve and emergency fund",
  },
  {
    id: "acc-3",
    name: "Payroll Account",
    address: "0xABCD000000000000000000000000000000000003",
    balance: 1_200_000,
    type: "payroll",
    description: "Monthly payroll distributions",
  },
  {
    id: "acc-4",
    name: "Investment Account",
    address: "0xABCD000000000000000000000000000000000004",
    balance: 5_600_000,
    type: "investment",
    description: "Yield-bearing and investment allocations",
  },
];

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    type: "outbound",
    status: "executed",
    from: "0xABCD000000000000000000000000000000000001",
    to: "0x1111222233334444555566667777888899990000",
    toLabel: "AWS Cloud Services",
    amount: 47_500,
    token: "trUSD",
    category: "Operating Expense",
    memo: "INV-2025-0042",
    description: "Monthly cloud infrastructure - February 2025",
    createdBy: "Rodney",
    createdAt: "2025-02-08T14:30:00Z",
    executedAt: "2025-02-08T15:02:00Z",
    txHash: "0xabc123def456789...",
    approvals: [
      { id: "a1", approver: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28", approverName: "Alex", status: "approved", timestamp: "2025-02-08T14:45:00Z" },
    ],
    requiredApprovals: 1,
  },
  {
    id: "tx-002",
    type: "outbound",
    status: "pending_approval",
    from: "0xABCD000000000000000000000000000000000003",
    to: "0x2222333344445555666677778888999900001111",
    toLabel: "Payroll - Engineering Team",
    amount: 285_000,
    token: "trUSD",
    category: "Payroll",
    memo: "PAYROLL-2025-FEB-ENG",
    description: "February 2025 engineering team payroll (42 employees)",
    createdBy: "Rodney",
    createdAt: "2025-02-10T09:00:00Z",
    approvals: [
      { id: "a2", approver: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28", approverName: "Alex", status: "approved", timestamp: "2025-02-10T09:15:00Z" },
      { id: "a3", approver: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", approverName: "Peyman", status: "pending", timestamp: "" },
    ],
    requiredApprovals: 2,
  },
  {
    id: "tx-003",
    type: "outbound",
    status: "pending_approval",
    from: "0xABCD000000000000000000000000000000000001",
    to: "0x3333444455556666777788889999000011112222",
    toLabel: "Deloitte & Touche LLP",
    amount: 125_000,
    token: "trUSD",
    category: "Operating Expense",
    memo: "AUDIT-Q4-2024",
    description: "Q4 2024 external audit services",
    createdBy: "Alex",
    createdAt: "2025-02-09T16:00:00Z",
    approvals: [
      { id: "a4", approver: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", approverName: "Rodney", status: "pending", timestamp: "" },
      { id: "a5", approver: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", approverName: "Peyman", status: "pending", timestamp: "" },
    ],
    requiredApprovals: 2,
  },
  {
    id: "tx-004",
    type: "inbound",
    status: "executed",
    from: "0x4444555566667777888899990000111122223333",
    to: "0xABCD000000000000000000000000000000000001",
    toLabel: "Operating Account",
    amount: 500_000,
    token: "trUSD",
    category: "Other",
    memo: "CLIENT-PAY-2025-0089",
    description: "Client payment - Enterprise license Q1 2025",
    createdBy: "System",
    createdAt: "2025-02-07T11:20:00Z",
    executedAt: "2025-02-07T11:20:00Z",
    txHash: "0xdef789abc123456...",
    approvals: [],
    requiredApprovals: 0,
  },
  {
    id: "tx-005",
    type: "internal",
    status: "executed",
    from: "0xABCD000000000000000000000000000000000002",
    to: "0xABCD000000000000000000000000000000000001",
    toLabel: "Operating Account",
    amount: 750_000,
    token: "trUSD",
    category: "Intercompany Transfer",
    memo: "RESERVE-TO-OPS-FEB",
    description: "Monthly reserve replenishment to operating account",
    createdBy: "Rodney",
    createdAt: "2025-02-05T08:00:00Z",
    executedAt: "2025-02-05T08:30:00Z",
    txHash: "0x456789abc123def...",
    approvals: [
      { id: "a6", approver: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28", approverName: "Alex", status: "approved", timestamp: "2025-02-05T08:15:00Z" },
      { id: "a7", approver: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", approverName: "Peyman", status: "approved", timestamp: "2025-02-05T08:20:00Z" },
    ],
    requiredApprovals: 2,
  },
  {
    id: "tx-006",
    type: "outbound",
    status: "rejected",
    from: "0xABCD000000000000000000000000000000000004",
    to: "0x5555666677778888999900001111222233334444",
    toLabel: "Unknown Vendor",
    amount: 2_000_000,
    token: "trUSD",
    category: "Investment",
    memo: "INV-PROPOSAL-X",
    description: "Proposed investment allocation - flagged for review",
    createdBy: "Rodney",
    createdAt: "2025-02-03T13:00:00Z",
    approvals: [
      { id: "a8", approver: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28", approverName: "Alex", status: "rejected", timestamp: "2025-02-03T14:00:00Z", comment: "Insufficient due diligence on counterparty" },
    ],
    requiredApprovals: 3,
  },
  {
    id: "tx-007",
    type: "outbound",
    status: "executed",
    from: "0xABCD000000000000000000000000000000000001",
    to: "0x6666777788889999000011112222333344445555",
    toLabel: "IRS - Federal Tax",
    amount: 340_000,
    token: "trUSD",
    category: "Tax Payment",
    memo: "TAX-Q4-2024-FED",
    description: "Q4 2024 federal tax payment",
    createdBy: "Alex",
    createdAt: "2025-01-28T10:00:00Z",
    executedAt: "2025-01-28T11:00:00Z",
    txHash: "0x789abc123def456...",
    approvals: [
      { id: "a9", approver: "0x8ba1f109551bD432803012645Ac136ddd64DBA72", approverName: "Rodney", status: "approved", timestamp: "2025-01-28T10:20:00Z" },
      { id: "a10", approver: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", approverName: "Peyman", status: "approved", timestamp: "2025-01-28T10:30:00Z" },
      { id: "a11", approver: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", approverName: "Harrison", status: "approved", timestamp: "2025-01-28T10:40:00Z" },
    ],
    requiredApprovals: 3,
  },
];

const DEMO_POLICIES: TreasuryPolicy[] = [
  {
    id: "pol-1",
    name: "Standard Operating",
    description: "Default policy for operating expenses under $50K",
    maxSingleTransaction: 50_000,
    dailyLimit: 200_000,
    monthlyLimit: 2_000_000,
    requiredApprovers: 1,
    allowedCategories: ["Operating Expense", "Vendor Payment"],
    isActive: true,
  },
  {
    id: "pol-2",
    name: "Payroll Processing",
    description: "Policy for payroll disbursements requiring dual approval",
    maxSingleTransaction: 500_000,
    dailyLimit: 500_000,
    monthlyLimit: 2_000_000,
    requiredApprovers: 2,
    allowedCategories: ["Payroll"],
    isActive: true,
  },
  {
    id: "pol-3",
    name: "High Value Transfers",
    description: "Transfers exceeding $100K require three approvals",
    maxSingleTransaction: 5_000_000,
    dailyLimit: 5_000_000,
    monthlyLimit: 20_000_000,
    requiredApprovers: 3,
    allowedCategories: ["Investment", "Intercompany Transfer", "Capital Expenditure"],
    isActive: true,
  },
];

// ─── Store ──────────────────────────────────────────────────────────────────

interface TreasuryStore {
  // State
  team: TeamMember[];
  transactions: Transaction[];
  accounts: TreasuryAccount[];
  policies: TreasuryPolicy[];
  currentUser: TeamMember | null;
  isLoading: boolean;

  // Computed
  totalBalance: () => number;
  pendingTransactions: () => Transaction[];
  recentTransactions: () => Transaction[];

  // Actions
  setCurrentUser: (user: TeamMember | null) => void;
  addTransaction: (tx: Omit<Transaction, "id" | "createdAt" | "approvals">) => void;
  approveTransaction: (txId: string, approverName: string) => void;
  rejectTransaction: (txId: string, approverName: string, comment: string) => void;
  addTeamMember: (member: Omit<TeamMember, "id" | "addedAt">) => void;
  removeTeamMember: (id: string) => void;
}

const _live = isLiveMode();

const LIVE_ACCOUNTS: TreasuryAccount[] = [
  {
    id: "acc-treasury",
    name: "Treasury",
    address: TREASURY_ADDRESS || "0x",
    balance: 0,
    type: "operating",
    description: "On-chain multi-sig treasury",
  },
];

export const useTreasuryStore = create<TreasuryStore>((set, get) => ({
  team: _live ? [] : DEMO_TEAM,
  transactions: _live ? [] : DEMO_TRANSACTIONS,
  accounts: _live ? LIVE_ACCOUNTS : DEMO_ACCOUNTS,
  policies: _live ? [] : DEMO_POLICIES,
  currentUser: _live ? null : DEMO_TEAM[0],
  isLoading: false,

  totalBalance: () => get().accounts.reduce((sum, acc) => sum + acc.balance, 0),

  pendingTransactions: () =>
    get().transactions.filter((tx) => tx.status === "pending_approval"),

  recentTransactions: () =>
    [...get().transactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10),

  setCurrentUser: (user) => set({ currentUser: user }),

  addTransaction: (tx) => {
    const id = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...tx,
      id,
      createdAt: new Date().toISOString(),
      approvals: [],
    };
    set((state) => ({ transactions: [newTx, ...state.transactions] }));
  },

  approveTransaction: (txId, approverName) => {
    set((state) => ({
      transactions: state.transactions.map((tx) => {
        if (tx.id !== txId) return tx;

        const updatedApprovals = tx.approvals.map((a) =>
          a.approverName === approverName
            ? { ...a, status: "approved" as const, timestamp: new Date().toISOString() }
            : a
        );

        const approvedCount = updatedApprovals.filter((a) => a.status === "approved").length;
        const newStatus = approvedCount >= tx.requiredApprovals ? "approved" : tx.status;

        return {
          ...tx,
          approvals: updatedApprovals,
          status: newStatus === "approved" ? "executed" : tx.status,
          executedAt: newStatus === "approved" ? new Date().toISOString() : undefined,
          txHash: newStatus === "approved" ? `0x${Date.now().toString(16)}...` : undefined,
        };
      }),
    }));
  },

  rejectTransaction: (txId, approverName, comment) => {
    set((state) => ({
      transactions: state.transactions.map((tx) => {
        if (tx.id !== txId) return tx;
        return {
          ...tx,
          status: "rejected" as const,
          approvals: tx.approvals.map((a) =>
            a.approverName === approverName
              ? { ...a, status: "rejected" as const, timestamp: new Date().toISOString(), comment }
              : a
          ),
        };
      }),
    }));
  },

  addTeamMember: (member) => {
    set((state) => ({
      team: [
        ...state.team,
        { ...member, id: `mem-${Date.now()}`, addedAt: new Date().toISOString() },
      ],
    }));
  },

  removeTeamMember: (id) => {
    set((state) => ({
      team: state.team.filter((m) => m.id !== id),
    }));
  },
}));
