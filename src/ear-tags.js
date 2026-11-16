/*
 * The shapes an official cattle ear tag number takes, and which of them a
 * number is. They come from the formats the Cattle Tracing System (CTS)
 * holds, and from the tags of cattle imported to Great Britain, which keep
 * the number of the country they were born in.
 *
 * A number is read as typed, in any case, with any run of spaces as one. In
 * the numeric UK and XI shapes spaces only group the digits, so they are
 * ignored. In every other shape a space divides the herd mark from the
 * animal number, and two animals can differ only in where it falls, so it
 * is kept.
 */

/** UK and twelve digits: every calf born in Great Britain since July 2000. */
export const UK_NUMERIC = 'ukNumeric'
/** XI and twelve digits: calves born in Northern Ireland since June 2025. */
export const XI_NUMERIC = 'xiNumeric'
/**
 * UK, a herd mark of letters then digits, and an animal number: cattle born
 * from April 1995 to 1999 (Barimo, to CTS), and some from the Isle of Man.
 */
export const UK_ALPHANUMERIC = 'ukAlphanumeric'
/** UK, digits and a closing check letter: older Northern Ireland tags. */
export const UK_CHECK_LETTER = 'ukCheckLetter'
/**
 * A country code and up to twelve digits, as European law has it: imported
 * cattle, and Northern Ireland's numeric tags of fewer than twelve digits.
 * Ireland's tags carry 372 for IE.
 */
export const COUNTRY_NUMERIC = 'countryNumeric'
/**
 * A herd mark and an animal number with no country code: cattle born before
 * April 1995 (Pre-Barimo, to CTS).
 */
export const NO_COUNTRY_CODE = 'noCountryCode'

/** Every shape, for an animal that may be of any age or from anywhere. */
export const ANY_EAR_TAG_FORMAT = Object.freeze([
  UK_NUMERIC,
  XI_NUMERIC,
  UK_ALPHANUMERIC,
  UK_CHECK_LETTER,
  COUNTRY_NUMERIC,
  NO_COUNTRY_CODE
])

const MIN_COUNTRY_DIGITS = 6
const MAX_COUNTRY_DIGITS = 12

const UK_NUMERIC_PATTERN = /^UK\d{12}$/
const XI_NUMERIC_PATTERN = /^XI\d{12}$/
const UK_ALPHANUMERIC_PATTERN = /^UK ?[A-Z]{1,2}\d{3,4} ?\d{5}$/
const UK_CHECK_LETTER_PATTERN = /^UK ?\d{3,6} \d{1,4}[A-Z]$/
const COUNTRY_NUMERIC_PATTERN = /^(?:[A-Z]{2}|372)[\d ]+$/
const NO_COUNTRY_CODE_PATTERN = /^[A-Z]{1,2}\d{3,4} \d{1,5}[A-Z]?$/

/**
 * @param {string} spaced - a number with single spaces
 * @returns {boolean} true for a country code followed by digits, of a count
 *   a tag can have
 */
function isCountryNumeric(spaced) {
  if (!COUNTRY_NUMERIC_PATTERN.test(spaced)) {
    return false
  }
  const digits = spaced.replace(/^372/, '').replaceAll(/\D/g, '').length
  return digits >= MIN_COUNTRY_DIGITS && digits <= MAX_COUNTRY_DIGITS
}

/**
 * Which shape an ear tag number is. The numeric UK and XI shapes are looked
 * for first, as the most exact. Two letters then digits is read as a
 * country code, so it is a country's number before it is one with no
 * country code.
 * @param {string} earTagNumber - as typed
 * @returns {string | undefined} the shape, or undefined when it is not an
 *   ear tag number
 */
export function earTagFormat(earTagNumber) {
  const spaced = earTagNumber.trim().toUpperCase().replaceAll(/\s+/g, ' ')
  const unspaced = spaced.replaceAll(' ', '')

  if (UK_NUMERIC_PATTERN.test(unspaced)) {
    return UK_NUMERIC
  }
  if (XI_NUMERIC_PATTERN.test(unspaced)) {
    return XI_NUMERIC
  }
  if (UK_ALPHANUMERIC_PATTERN.test(spaced)) {
    return UK_ALPHANUMERIC
  }
  if (UK_CHECK_LETTER_PATTERN.test(spaced)) {
    return UK_CHECK_LETTER
  }
  if (isCountryNumeric(spaced)) {
    return COUNTRY_NUMERIC
  }
  if (NO_COUNTRY_CODE_PATTERN.test(spaced)) {
    return NO_COUNTRY_CODE
  }
  return undefined
}

/** The shapes in which a space only groups the characters. */
const SPACES_IGNORED = [UK_NUMERIC, XI_NUMERIC, UK_ALPHANUMERIC]

/**
 * @param {string} earTagNumber - as typed
 * @returns {string} the number in one case and spacing, to compare it by
 */
function comparable(earTagNumber) {
  const spaced = earTagNumber.trim().toUpperCase().replaceAll(/\s+/g, ' ')
  return SPACES_IGNORED.includes(earTagFormat(spaced) ?? '')
    ? spaced.replaceAll(' ', '')
    : spaced
}

/**
 * @param {string} one - an ear tag number as typed
 * @param {string} other - another
 * @returns {boolean} true when they are the same number, however each was
 *   cased, and however each was spaced where spaces only group the
 *   characters. Where a space divides the herd mark from the animal number,
 *   numbers that differ in where it falls are different animals.
 */
export function isSameEarTag(one, other) {
  return comparable(one) === comparable(other)
}
