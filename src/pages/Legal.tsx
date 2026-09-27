import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { JoviaLogo } from "@/components/JoviaLogo";

const CONTENT = {
  privacy: {
    title: "Privacy Policy",
    updated: "September 2026",
    sections: [
      {
        h: "Information we collect",
        p: "Jovia Network collects the information you provide when creating your account: your name, email address, username and — when you activate your wallet — your bank details (bank name, account number and account name) used solely to process withdrawals to you.",
      },
      {
        h: "How we use your information",
        p: "We use your information to operate your Jovia account, credit rewards earned from activities, process withdrawal requests, send service notifications about your account, and improve the platform. We do not sell your personal data.",
      },
      {
        h: "Activity and earnings data",
        p: "Records of the activities you complete (videos watched, game sessions, music listening and social tasks) are stored to calculate and verify your rewards and to maintain your transaction history.",
      },
      {
        h: "Data sharing",
        p: "We share data only with service providers necessary to run Jovia — payment processors for withdrawals and infrastructure providers for hosting the platform. Where sharing is required by Nigerian law, we comply with valid requests.",
      },
      {
        h: "Data retention and your rights",
        p: "You may request access to, correction of, or deletion of your personal data at any time by contacting support through the app. Account records needed for financial reconciliation are retained as required by law.",
      },
      {
        h: "Contact",
        p: "For privacy questions, message the Jovia team via the WhatsApp numbers listed in the app footer or on our website.",
      },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "September 2026",
    sections: [
      {
        h: "1. About Jovia Network",
        p: "Jovia Network is an entertainment monetization platform operated by a business registered with Nigeria's Corporate Affairs Commission (CAC). By registering, you agree to these terms.",
      },
      {
        h: "2. Membership and activation",
        p: "Access to earning activities requires a one-time activation fee: ₦9,000 (Jovia Silver) or ₦15,000 (Jovia Gold). Your plan determines the activities and features available to you, including Friday Bonus Rewards and Jovia AI access on Gold.",
      },
      {
        h: "3. Earning activities",
        p: "Rewards are credited when an activity's countdown completes as designed. Attempting to manipulate sessions, automate activity, or create multiple accounts to claim rewards is prohibited and may result in suspension and forfeiture of balances.",
      },
      {
        h: "4. Wallet and withdrawals",
        p: "Earnings accumulate in your Jovia wallet. Withdrawals require saved bank details and a minimum withdrawal amount. Withdrawal requests are processed to the bank account you specify; you are responsible for the accuracy of those details.",
      },
      {
        h: "5. Fair use",
        p: "Content made available through Jovia (including celebrity videos and partner music) is licensed for platform use. You may not download, redistribute or reuse such content outside the app.",
      },
      {
        h: "6. Changes to the service",
        p: "Jovia may update activities, rewards and features. Material changes to these terms will be communicated through the app. Continued use after changes constitutes acceptance.",
      },
      {
        h: "7. Contact",
        p: "Questions about these terms can be sent to the Jovia team via the WhatsApp business lines published on our website.",
      },
    ],
  },
} as const;

export default function Legal({ doc }: { doc: "privacy" | "terms" }) {
  const content = CONTENT[doc];
  return (
    <div className="min-h-screen">
      <header className="border-b border-[#6B4FA1]/25">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/">
            <JoviaLogo />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#6B4FA1]/40 px-4 py-2 text-sm text-[#E9E3F9] transition-colors hover:border-[#FFD700]/50 hover:text-[#FFD700]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>
      <main className="container max-w-3xl py-14">
        <p className="section-label mb-4">Legal</p>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {content.title}
        </h1>
        <p className="mt-2 text-sm text-[#8f80b8]">Last updated: {content.updated}</p>
        <div className="mt-10 flex flex-col gap-8">
          {content.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-lg font-bold text-[#FFD700]">{s.h}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#C9BEE8]">{s.p}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
