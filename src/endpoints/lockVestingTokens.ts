import {
  Lucid,
  SpendingValidator,
  Data,
  TxSignBuilder,
  toUnit,
  validatorToAddress,
} from "lucid-cardano";
import { fromAddress } from "../core/utils/utils.js";
import type { LockTokensConfig, Result } from "../core/types.js";
import { VestingDatum } from "../core/contract.types.js";
import { PROTOCOL_FEE } from "../core/constants.js";

export const lockTokens = async (
  lucid: Lucid,
  config: LockTokensConfig
): Promise<Result<TxSignBuilder>> => {
  const network = lucid.config().network ?? "Preview";

  const vestingValidator: SpendingValidator = {
    type: "PlutusV2",
    script: config.scripts.vesting,
  };
  const validatorAddress = validatorToAddress(network, vestingValidator);

  // ✅ Se elimina el cálculo de comisión
  const totalVestingQty = config.totalVestingQty;

  const datum = Data.to(
    {
      beneficiary: fromAddress(config.beneficiary),
      assetClass: {
        symbol: config.vestingAsset.policyId,
        name: config.vestingAsset.tokenName,
      },
      totalVestingQty: BigInt(totalVestingQty),
      vestingPeriodStart: BigInt(config.vestingPeriodStart),
      vestingPeriodEnd: BigInt(config.vestingPeriodEnd),
      firstUnlockPossibleAfter: BigInt(config.firstUnlockPossibleAfter),
      totalInstallments: BigInt(config.totalInstallments),
    },
    VestingDatum
  );

  const unit = config.vestingAsset.policyId
    ? toUnit(config.vestingAsset.policyId, config.vestingAsset.tokenName)
    : "lovelace";

  try {
    const walletUtxos = await lucid.wallet.getUtxos();
    if (!walletUtxos.length)
      return { type: "error", error: new Error("No UTxOs in wallet") };

    const tx = await lucid
      .newTx()
      .collectFrom(walletUtxos)
      .payToContract(
        validatorAddress,
        { kind: "inline", value: datum },
        {
          [unit]: BigInt(totalVestingQty),
        }
      )
      .complete();

    return { type: "ok", data: tx };
  } catch (error) {
    if (error instanceof Error) return { type: "error", error };
    return { type: "error", error: new Error(`${JSON.stringify(error)}`) };
  }
};
