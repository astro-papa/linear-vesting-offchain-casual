import type { Address, Assets, OutRef } from "lucid-cardano";
import type { CborHex } from "../types.js";
import { fromHex } from "@lucid-cardano/utils";
import { Data } from "lucid-cardano";

export function toAddress(credential: Address, network: string): string {
  if (credential.startsWith("addr")) return credential;
  return network === "Mainnet"
    ? `addr1w${credential}`
    : `addr_test1w${credential}`;
}

export function divCeil(a: bigint, b: bigint): bigint {
  return (a + b - 1n) / b;
}

export function parseSafeDatum<T>(datum: string, schema: T): { type: "right"; value: any } | { type: "left"; value: string } {
  try {
    const value = Data.from(datum, schema);
    return { type: "right", value };
  } catch (e: any) {
    return { type: "left", value: e.message || "Failed to parse datum" };
  }
}

export async function parseUTxOsAtScript<T>(
  lucid: any,
  script: CborHex,
  schema: T
): Promise<Array<{
  txHash: string;
  outputIndex: number;
  datum: T;
  assets: Assets;
  outRef: OutRef;
}>> {
  const utxos = await lucid.utxosAt(
    lucid.utils.validatorToAddress({
      type: "PlutusV2",
      script,
    })
  );

  return utxos.map((utxo) => ({
    txHash: utxo.txHash,
    outputIndex: utxo.outputIndex,
    assets: utxo.assets,
    outRef: utxo.outRef,
    datum: Data.from(utxo.datum, schema),
  }));
}
