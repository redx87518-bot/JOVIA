import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  ChevronDown,
  Copy,
  Loader2,
  MessageCircle,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet as WalletIcon,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNaira, timeAgo } from "@/lib/utils";
import { NIGERIAN_BANKS, resolveAccountName, searchBanks } from "@/lib/banks";
import { cn } from "@/lib/utils";

type Step = "choose" | "generating" | "pay" | "success";

function ActivationSection({
  active,
  plan,
}: {
  active: boolean;
  plan: "none" | "silver" | "gold";
}) {
  const latest = useQuery(api.users.latestActivation, {});
  const beginActivation = useMutation(api.users.beginActivation);
  const confirmActivation = useMutation(api.users.confirmActivation);

  const [step, setStep] = useState<Step>("choose");
  const [selectedPlan, setSelectedPlan] = useState<"silver" | "gold">(
    plan === "gold" ? "gold" : "silver"
  );
  const [reference, setReference] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleBegin() {
    setBusy(true);
    setStep("generating");
    try {
      const res = await beginActivation({ plan: selectedPlan });
      setReference(res.reference);
      setAmount(res.amount);
      // Simulate the JOVIA payment-flow detail generation.
      await new Promise((r) => setTimeout(r, 1400));
      setStep("pay");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start activation");
      setStep("choose");
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm() {
    if (!reference) return;
    setBusy(true);
    try {
      await confirmActivation({ reference });
      setStep("success");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not confirm payment");
    } finally {
      setBusy(false);
    }
  }

  if (active) {
    return (
      <div className="rounded-3xl border border-[#2EFF00]/35 bg-[#2EFF00]/[0.06] p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2EFF00]/15 ring-1 ring-[#2EFF00]/40">
            <BadgeCheck className="h-5 w-5 text-[#2EFF00]" />
          </span>
          <div>
            <p className="font-display text-base font-bold text-white">Account activated</p>
            <p className="text-xs text-[#B9A6E8]">
              Jovia {plan === "gold" ? "Gold" : "Silver"} member · all activities unlocked
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#FFD700]/40 bg-[#16032f]/70 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
        Account Activation
      </p>
      <h3 className="mt-1.5 font-display text-xl font-bold text-white">
        Activate your account
      </h3>
      <p className="mt-1 text-sm text-[#B9A6E8]">
        Complete your account activation using the normal JOVIA payment flow.
      </p>

      {step === "choose" && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {(["silver", "gold"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPlan(p)}
                className={cn(
                  "rounded-2xl border p-3.5 text-left transition-all",
                  selectedPlan === p
                    ? "border-[#FFD700] bg-[#FFD700]/10"
                    : "border-[#6B4FA1]/35 bg-[#0F0515]/50 hover:border-[#FFD700]/40"
                )}
              >
                <p className="font-display text-sm font-bold text-white">
                  Jovia {p === "gold" ? "Gold" : "Silver"}
                </p>
                <p className="mt-0.5 font-display text-lg font-extrabold text-[#FFD700]">
                  {p === "gold" ? "₦15,000" : "₦9,000"}
                </p>
                <p className="mt-0.5 text-[10px] text-[#8f80b8]">
                  {p === "gold" ? "Bonus rewards + AI" : "Core activities"}
                </p>
              </button>
            ))}
          </div>
          <Button onClick={handleBegin} disabled={busy} className="w-full gap-2" size="lg">
            <ShieldCheck className="h-4 w-4" /> Continue to payment
          </Button>
        </div>
      )}

      {step === "generating" && (
        <div className="mt-6 flex flex-col items-center gap-3 pb-2 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#FFD700]" />
          <p className="text-sm font-medium text-[#E9E3F9]">
            Generating your payment details...
          </p>
          <div className="h-2 w-40 animate-pulse rounded-full bg-[#6B4FA1]/40" />
        </div>
      )}

      {step === "pay" && reference && amount !== null && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-2xl border border-[#6B4FA1]/35 bg-[#0F0515]/60 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f80b8]">
                Amount due
              </p>
              <span className="rounded-md bg-[#FFD700]/12 px-2 py-0.5 text-[10px] font-bold text-[#FFD700]">
                One-time
              </span>
            </div>
            <p className="mt-1 font-display text-3xl font-extrabold text-white">
              {formatNaira(amount)}
            </p>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-[#FFD700]/40 bg-[#FFD700]/[0.05] px-3 py-2.5">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8f80b8]">
                  Payment reference
                </p>
                <p className="font-mono text-sm font-bold text-[#FFD700]">{reference}</p>
              </div>
              <button
                type="button"
                aria-label="Copy payment reference"
                onClick={() => {
                  navigator.clipboard?.writeText(reference).then(
                    () => toast.success("Reference copied"),
                    () => toast.error("Could not copy")
                  );
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD700]/15 text-[#FFD700]"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-[#8f80b8]">
              Complete payment using the Jovia payment channel with the reference above.
              Your account activates immediately after confirmation.
            </p>
          </div>
          <Button onClick={handleConfirm} disabled={busy} className="w-full gap-2" size="lg">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            I have completed payment
          </Button>
        </div>
      )}

      {step === "success" && (
        <div className="mt-4 rounded-2xl border border-[#2EFF00]/40 bg-[#2EFF00]/[0.07] p-5 text-center">
          <BadgeCheck className="mx-auto h-10 w-10 text-[#2EFF00]" />
          <p className="mt-2 font-display text-lg font-bold text-white">
            Account activated 🎉
          </p>
          <p className="mt-1 text-xs text-[#B9A6E8]">
            Welcome to Jovia {selectedPlan === "gold" ? "Gold" : "Silver"}. Every activity
            is now unlocked.
          </p>
        </div>
      )}
    </div>
  );
}

function BankForm() {
  const me = useQuery(api.users.me, {});
  const saveBankDetails = useMutation(api.users.saveBankDetails);

  const [query, setQuery] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [bank, setBank] = useState(me?.bankDetails?.bankName ?? "");
  const [accountNumber, setAccountNumber] = useState(me?.bankDetails?.accountNumber ?? "");
  const [accountName, setAccountName] = useState(me?.bankDetails?.accountName ?? "");
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);

  const results = useMemo(() => searchBanks(query), [query]);
  const valid = bank !== "" && /^\d{10}$/.test(accountNumber) && accountName.trim().length > 2;

  async function handleVerify() {
    if (!/^\d{10}$/.test(accountNumber) || !bank) {
      toast.error("Enter a 10-digit account number and select a bank");
      return;
    }
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 900));
    setAccountName(resolveAccountName(accountNumber, bank));
    setVerifying(false);
    toast.success("Account verified");
  }

  async function handleSave() {
    if (!valid) {
      toast.error("Complete all bank fields before saving");
      return;
    }
    setSaving(true);
    try {
      await saveBankDetails({
        bankName: bank,
        accountNumber,
        accountName: accountName.trim(),
      });
      toast.success("Bank details saved ✓");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save bank details");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
        Bank Details
      </p>
      <h3 className="mt-1.5 font-display text-base font-bold text-white">
        Withdrawal account
      </h3>

      <div className="mt-4 flex flex-col gap-3.5">
        {/* Search bank */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bank-search">Search bank</Label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f80b8]" />
            <Input
              id="bank-search"
              className="pl-10"
              placeholder="Search Nigerian banks"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setListOpen(true);
              }}
              onFocus={() => setListOpen(true)}
            />
          </div>
        </div>

        {/* Select bank */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bank-select">Select bank</Label>
          <button
            type="button"
            id="bank-select"
            onClick={() => setListOpen((v) => !v)}
            className="flex h-11 w-full items-center justify-between rounded-2xl border border-[#6B4FA1]/40 bg-[#16032f]/70 px-4 text-sm text-white"
            aria-expanded={listOpen}
          >
            <span className={bank ? "" : "text-[#8f80b8]"}>
              {bank || "Select bank"}
            </span>
            <ChevronDown
              className={cn("h-4 w-4 text-[#8f80b8] transition-transform", listOpen && "rotate-180")}
            />
          </button>
          {listOpen && (
            <div className="no-scrollbar max-h-44 overflow-y-auto rounded-2xl border border-[#6B4FA1]/35 bg-[#0F0515]/95 p-1.5">
              {results.length === 0 && (
                <p className="p-3 text-xs text-[#8f80b8]">No banks match "{query}"</p>
              )}
              {results.map((b) => (
                <button
                  key={b.code}
                  type="button"
                  onClick={() => {
                    setBank(b.name);
                    setListOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-[#E9E3F9] transition-colors hover:bg-[#6B4FA1]/25"
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-md text-[9px] font-extrabold text-white"
                    style={{ background: b.color }}
                  >
                    {b.name.slice(0, 2).toUpperCase()}
                  </span>
                  {b.name}
                  {bank === b.name && <Check className="ml-auto h-3.5 w-3.5 text-[#2EFF00]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Account number + verify */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="account-number">Account number</Label>
          <div className="flex gap-2">
            <Input
              id="account-number"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleVerify}
              disabled={verifying}
              className="shrink-0 gap-1.5 bg-[#6B4FA1] text-white hover:bg-[#7d5fbd]"
            >
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Verify
            </Button>
          </div>
        </div>

        {/* Account name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="account-name">Account name</Label>
          <Input
            id="account-name"
            placeholder="Verified account name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} disabled={saving || !valid} className="w-full gap-2" size="lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Save bank details ✓
        </Button>
      </div>
    </div>
  );
}

function ConnectedAccount() {
  const me = useQuery(api.users.me, {});
  const connectWhatsApp = useMutation(api.users.connectWhatsApp);
  const connected = me?.whatsappConnected ?? false;

  return (
    <div className="rounded-3xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
        Connected Account
      </p>
      <div className="mt-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25D366]/15 ring-1 ring-[#25D366]/40">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">WhatsApp</p>
            <p className="text-xs text-[#8f80b8]">
              {connected ? "Connected · status sharing enabled" : "Not connected"}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant={connected ? "secondary" : "whatsapp"}
          onClick={() => connectWhatsApp({ connected: !connected })}
        >
          {connected ? "Disconnect" : "Connect"}
        </Button>
      </div>
    </div>
  );
}

function WithdrawBox() {
  const me = useQuery(api.users.me, {});
  const requestWithdrawal = useMutation(api.wallet.requestWithdrawal);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  const balance = me?.balance ?? 0;
  const active = me?.activationStatus === "active";
  const hasBank = !!me?.bankDetails;

  async function handleWithdraw() {
    const naira = Number(amount.replace(/,/g, ""));
    if (!naira || naira <= 0) {
      toast.error("Enter a withdrawal amount");
      return;
    }
    setBusy(true);
    try {
      await requestWithdrawal({ amount: Math.round(naira * 100) });
      toast.success("Withdrawal request submitted");
      setAmount("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not request withdrawal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#FFD700]/30 bg-gradient-to-br from-[#1c0b38]/85 to-[#16032f]/85 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD700]/12 ring-1 ring-[#FFD700]/35">
            <WalletIcon className="h-5 w-5 text-[#FFD700]" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f80b8]">
              Available balance
            </p>
            <p className="font-display text-2xl font-extrabold text-white">
              {formatNaira(balance)}
            </p>
          </div>
        </div>
        <Badge variant={active ? "success" : "warning"}>
          {active ? "Active" : "Not activated"}
        </Badge>
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          inputMode="decimal"
          placeholder="Amount to withdraw (₦)"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
          className="flex-1"
        />
        <Button onClick={handleWithdraw} disabled={busy} className="shrink-0 gap-1.5">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Banknote className="h-4 w-4" />}
          Withdraw
        </Button>
      </div>
      {!hasBank && (
        <p className="mt-2.5 text-[11px] text-[#FFB85C]">
          Save your bank details below to enable withdrawals.
        </p>
      )}
    </div>
  );
}

function History() {
  const transactions = useQuery(api.activities.myTransactions, {});
  const withdrawals = useQuery(api.wallet.myWithdrawals, {});

  return (
    <div className="rounded-3xl border border-[#6B4FA1]/30 bg-[#1c0b38]/60 p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#FFD700]">
        Transaction History
      </p>

      {transactions === undefined && (
        <div className="mt-4 flex flex-col gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-[#6B4FA1]/15" />
          ))}
        </div>
      )}

      {transactions && transactions.length === 0 && (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#6B4FA1]/30 py-8 text-center">
          <Building2 className="h-6 w-6 text-[#6B4FA1]" />
          <p className="text-xs text-[#8f80b8]">
            No transactions yet. Complete an activity to see earnings here.
          </p>
        </div>
      )}

      <div className="mt-3.5 flex flex-col gap-2">
        {(transactions ?? []).map((t) => {
          const credit = t.amount >= 0;
          return (
            <div
              key={t._id}
              className="flex items-center gap-3 rounded-xl border border-[#6B4FA1]/25 bg-[#0F0515]/50 p-3"
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  credit ? "bg-[#2EFF00]/12 text-[#2EFF00]" : "bg-[#FF5C5C]/12 text-[#FF8A8A]"
                )}
              >
                {credit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{t.title}</p>
                <p className="truncate text-[11px] text-[#8f80b8]">
                  {t.detail ? `${t.detail} · ` : ""}
                  {timeAgo(t.createdAt)}
                </p>
              </div>
              <p
                className={cn(
                  "shrink-0 text-sm font-bold",
                  credit ? "text-[#2EFF00]" : "text-[#FF8A8A]"
                )}
              >
                {credit ? "+" : "−"}
                {formatNaira(Math.abs(t.amount))}
              </p>
            </div>
          );
        })}
      </div>

      {(withdrawals ?? []).length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8f80b8]">
            Withdrawal requests
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {(withdrawals ?? []).map((w) => (
              <div
                key={w._id}
                className="flex items-center justify-between rounded-xl border border-[#6B4FA1]/25 bg-[#0F0515]/50 p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{formatNaira(w.amount)}</p>
                  <p className="text-[11px] text-[#8f80b8]">
                    {w.bankName} • {w.accountNumber} · {timeAgo(w.createdAt)}
                  </p>
                </div>
                <Badge variant={w.status === "paid" ? "success" : w.status === "failed" ? "danger" : "warning"}>
                  {w.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Wallet() {
  const me = useQuery(api.users.me, {});

  if (me === undefined || me === null) {
    return (
      <div className="flex flex-col gap-3 pt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-[#6B4FA1]/15" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pt-1">
      <h1 className="font-display text-xl font-bold text-white">Wallet</h1>
      <ActivationSection active={me.activationStatus === "active"} plan={me.plan} />
      <WithdrawBox />
      <BankForm />
      <ConnectedAccount />
      <History />
    </div>
  );
}
