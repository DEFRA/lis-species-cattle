import { describe, expect, test } from 'vitest'

import {
  countryNumbers,
  getCountryLetters,
  getCountryNumber
} from '../src/countries.js'

describe('countries.js', () => {
  test('countryNumbers maps two upper-case letters to three digits', () => {
    // Arrange
    const letters = /^[A-Z]{2}$/
    const number = /^\d{3}$/

    // Act
    const entries = Object.entries(countryNumbers)

    // Assert
    expect(entries).toHaveLength(249)
    expect(entries.every(([key]) => letters.test(key))).toBe(true)
    expect(entries.every(([, value]) => number.test(value))).toBe(true)
  })

  test('countryNumbers gives every country a number of its own', () => {
    // Arrange
    const numbers = Object.values(countryNumbers)

    // Act
    const distinct = new Set(numbers)

    // Assert
    expect(distinct.size).toBe(numbers.length)
  })

  test('getCountryNumber returns the number for letters in any case', () => {
    // Arrange
    const codes = ['GB', 'ie', 'De']

    // Act
    const numbers = codes.map((code) => getCountryNumber(code))

    // Assert
    expect(numbers).toEqual(['826', '372', '276'])
  })

  test('getCountryNumber returns undefined for letters that are not a country', () => {
    // Arrange
    const codes = ['UK', 'ZZ', 'constructor', '']

    // Act
    const numbers = codes.map((code) => getCountryNumber(code))

    // Assert
    expect(numbers).toEqual([undefined, undefined, undefined, undefined])
  })

  test('getCountryLetters returns the letters for a number', () => {
    // Arrange
    const numbers = ['826', '372', '004']

    // Act
    const codes = numbers.map((number) => getCountryLetters(number))

    // Assert
    expect(codes).toEqual(['GB', 'IE', 'AF'])
  })

  test('getCountryLetters returns undefined for a number that is not a country', () => {
    // Arrange
    const numbers = ['999', '900', '4', '']

    // Act
    const codes = numbers.map((number) => getCountryLetters(number))

    // Assert
    expect(codes).toEqual([undefined, undefined, undefined, undefined])
  })
})
