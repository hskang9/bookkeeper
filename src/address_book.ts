import { getDatum, recordDatum } from "./bookKeeper"

const BOOK = process.env.ADDRESS_BOOK || 'property-book.json'

export async function getAddress(contract, chain, isTest ="") {
    const JSON = isTest !== "test" ? BOOK : `${BOOK.substring(0, BOOK.length - 5)}-test.json`
    await getDatum(contract, chain, undefined, JSON)
}

export async function recordAddress(name, chain, address, isTest = "") {
    const JSON = isTest !== "test" ? BOOK : `${BOOK.substring(0, BOOK.length - 5)}-test.json`
    await recordDatum(name, chain, address, undefined, JSON, false)
}