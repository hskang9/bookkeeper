import { getDatum, recordDatum } from "./bookKeeper"

const BOOK = process.env.PROPERTY_BOOK || 'property-book.json'

export async function getProperty(contract, chain, isTest = "") {
    const JSON = isTest !== "test" ? BOOK : `${BOOK.substring(0, BOOK.length - 5)}-test.json`
    await getDatum(contract, chain, undefined, JSON)
}

export async function recordProperty(name, chain, property, isTest = "") {
    const JSON = isTest !== "test" ? BOOK : `${BOOK.substring(0, BOOK.length - 5)}-test.json`
    await recordDatum(name, chain, property, undefined, JSON, true)
}



