import { isClassStaticBlockDeclaration } from "typescript";
import { getDatum, recordDatum } from "./bookKeeper";

const BOOK = process.env.ABI_BOOK || 'abi-book.json'

export async function getAbi(contract, chain, isTest = "") {
  const JSON =
    isTest !== "test"
      ? BOOK
      : `${BOOK.substring(
          0,
          BOOK.length - 5
        )}-test.json`;
  await getDatum(contract, chain, undefined, JSON);
}

export async function recordAbi(name, chain, abi, isTest = "") {
  const JSON =
    isTest !== "test"
      ? BOOK
      : `${BOOK.substring(
          0,
          BOOK.length - 5
        )}-test.json`;
  await recordDatum(name, chain, abi, undefined, JSON, true);
}
