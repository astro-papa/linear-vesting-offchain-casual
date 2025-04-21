export interface VestingDatum {
  beneficiary: string;
  assetClass: {
    symbol: string;
    name: string;
  };
  totalVestingQty: bigint;
  vestingPeriodStart: bigint;
  vestingPeriodEnd: bigint;
  firstUnlockPossibleAfter: bigint;
  totalInstallments: bigint;
}

export type VestingRedeemer = "FullUnlock" | "PartialUnlock";
