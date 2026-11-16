import { describe, expect, test } from 'vitest'

import {
  COUNTRY_NUMERIC,
  NO_COUNTRY_CODE,
  UK_ALPHANUMERIC,
  UK_CHECK_LETTER,
  UK_NUMERIC,
  XI_NUMERIC,
  earTagFormat,
  isSameEarTag
} from '../src/ear-tags.js'

describe('earTagFormat()', () => {
  test('it reads UK and twelve digits as ukNumeric', () => {
    // Arrange
    const numbers = ['UK123456789012', 'uk 230011 200123']

    // Act
    const formats = numbers.map((number) => earTagFormat(number))

    // Assert
    expect(formats).toEqual([UK_NUMERIC, UK_NUMERIC])
  })

  test('it reads XI and twelve digits as xiNumeric', () => {
    // Arrange
    const numbers = ['XI012345678901', 'xi 012345 678901']

    // Act
    const formats = numbers.map((number) => earTagFormat(number))

    // Assert
    expect(formats).toEqual([XI_NUMERIC, XI_NUMERIC])
  })

  test('it reads a herd mark of letters then digits as ukAlphanumeric', () => {
    // Arrange
    const numbers = ['UKAB1234 00001', 'UK Z4321 00001', 'UKMN123 00145']

    // Act
    const formats = numbers.map((number) => earTagFormat(number))

    // Assert
    expect(formats).toEqual([UK_ALPHANUMERIC, UK_ALPHANUMERIC, UK_ALPHANUMERIC])
  })

  test('it reads digits closed by a check letter as ukCheckLetter', () => {
    // Arrange
    const numbers = ['UK123456 78A', 'UK 12345 6789B']

    // Act
    const formats = numbers.map((number) => earTagFormat(number))

    // Assert
    expect(formats).toEqual([UK_CHECK_LETTER, UK_CHECK_LETTER])
  })

  test('it reads a country code and digits as countryNumeric', () => {
    // Arrange
    const numbers = [
      'AT12 3456 789',
      'CZ972 141069',
      'IE123456789012',
      '372123456789012',
      'FR12345 67890',
      'BE1234 5678',
      'UK91234 56789',
      'AB1234 567'
    ]

    // Act
    const formats = numbers.map((number) => earTagFormat(number))

    // Assert
    expect(formats).toEqual(numbers.map(() => COUNTRY_NUMERIC))
  })

  test('it reads a herd mark and animal number alone as noCountryCode', () => {
    // Arrange
    const numbers = ['Z4321 321', 'D123 123C']

    // Act
    const formats = numbers.map((number) => earTagFormat(number))

    // Assert
    expect(formats).toEqual([NO_COUNTRY_CODE, NO_COUNTRY_CODE])
  })

  test('it reads no format in what is not an ear tag number', () => {
    // Arrange
    const values = ['BOB THE BULL', 'DAISY', 'COW 2', 'NOT A TAG !', '']

    // Act
    const formats = values.map((value) => earTagFormat(value))

    // Assert
    expect(formats).toEqual(values.map(() => undefined))
  })

  test('it reads no format in a number with too few or too many digits', () => {
    // Arrange
    const values = ['UK12345', 'UK1234567890123', 'FR1234567890123']

    // Act
    const formats = values.map((value) => earTagFormat(value))

    // Assert
    expect(formats).toEqual(values.map(() => undefined))
  })

  test('it tolerates runs of spaces and lower case', () => {
    // Arrange
    const number = '  ukab1234    00001  '

    // Act
    const format = earTagFormat(number)

    // Assert
    expect(format).toBe(UK_ALPHANUMERIC)
  })
})

describe('isSameEarTag()', () => {
  test('it is true for the same number spaced and cased differently', () => {
    // Arrange
    const one = 'UK123456789012'
    const other = ' uk 123456  789012 '

    // Act
    const same = isSameEarTag(one, other)

    // Assert
    expect(same).toBe(true)
  })

  test('it is false for different numbers', () => {
    // Arrange
    const one = 'UK123456789012'
    const other = 'UK123456789013'

    // Act
    const same = isSameEarTag(one, other)

    // Assert
    expect(same).toBe(false)
  })

  test('it ignores spaces in a UK alphanumeric number', () => {
    // Arrange
    const one = 'UKAB1234 00001'
    const other = 'uk ab1234 00001'

    // Act
    const result = isSameEarTag(one, other)

    // Assert
    expect(result).toBe(true)
  })

  test('it tells apart numbers that differ only in where the space falls', () => {
    // Arrange
    const one = 'UK91234 56789'
    const other = 'UK912345 6789'

    // Act
    const result = isSameEarTag(one, other)

    // Assert
    expect(result).toBe(false)
  })

  test('it tells apart numbers with no country code that differ only in the space', () => {
    // Arrange
    const one = 'Z123 4567'
    const other = 'Z1234 567'

    // Act
    const result = isSameEarTag(one, other)

    // Assert
    expect(result).toBe(false)
  })

  test('it reads a run of spaces as one where the space is kept', () => {
    // Arrange
    const one = 'FR12345 67890'
    const other = ' fr12345   67890 '

    // Act
    const result = isSameEarTag(one, other)

    // Assert
    expect(result).toBe(true)
  })
})
