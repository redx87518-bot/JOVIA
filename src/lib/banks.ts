export interface NigerianBank {
  name: string;
  code: string;
  color: string;
}

/** Common Nigerian banks for the wallet bank-lookup flow. */
export const NIGERIAN_BANKS: NigerianBank[] = [
  { name: "Access Bank", code: "044", color: "#7C2529" },
  { name: "Citibank Nigeria", code: "023", color: "#0B3C5D" },
  { name: "Ecobank Nigeria", code: "050", color: "#00688D" },
  { name: "Fidelity Bank", code: "070", color: "#5B2D82" },
  { name: "First Bank of Nigeria", code: "011", color: "#1B4E9B" },
  { name: "First City Monument Bank", code: "214", color: "#5C068C" },
  { name: "Guaranty Trust Bank", code: "058", color: "#F2600C" },
  { name: "Heritage Bank", code: "030", color: "#6B4FA1" },
  { name: "Keystone Bank", code: "082", color: "#00857D" },
  { name: "Kuda Microfinance Bank", code: "50211", color: "#40196D" },
  { name: "Moniepoint MFB", code: "50515", color: "#0B3C8D" },
  { name: "OPay Digital Services", code: "999992", color: "#1DC9A0" },
  { name: "PalmPay", code: "999991", color: "#25D366" },
  { name: "Polaris Bank", code: "076", color: "#0E4C92" },
  { name: "Providus Bank", code: "101", color: "#2E1968" },
  { name: "Stanbic IBTC Bank", code: "221", color: "#0033A0" },
  { name: "Standard Chartered", code: "068", color: "#0473EA" },
  { name: "Sterling Bank", code: "232", color: "#0B4EA2" },
  { name: "Union Bank of Nigeria", code: "032", color: "#0A3D91" },
  { name: "United Bank for Africa", code: "033", color: "#FF0000" },
  { name: "Unity Bank", code: "215", color: "#6B4FA1" },
  { name: "Wema Bank", code: "035", color: "#8B1874" },
  { name: "Zenith Bank", code: "057", color: "#C41230" },
];

export function searchBanks(query: string): NigerianBank[] {
  const q = query.trim().toLowerCase();
  if (!q) return NIGERIAN_BANKS;
  return NIGERIAN_BANKS.filter((b) => b.name.toLowerCase().includes(q));
}

/** Simulated account-name resolution (in production this calls a name-enquiry API). */
export function resolveAccountName(accountNumber: string, bankName: string): string {
  const suffix = accountNumber.slice(-3);
  return `${bankName.split(" ")[0]} Customer ${suffix}`;
}
