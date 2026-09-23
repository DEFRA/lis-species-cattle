import { describe, expect, test } from 'vitest'

import { breeds, getBreedCode, getBreedName } from '../src/breeds.js'

describe('breeds.js', () => {
  test('breeds maps non-empty upper-case codes to non-empty names', () => {
    // Arrange
    const nonBlank = /\S/

    // Act
    const entries = Object.entries(breeds)

    // Assert
    expect(entries.length).toBeGreaterThan(0)
    for (const [code, name] of entries) {
      expect(code).toEqual(code.toUpperCase())
      expect(name).toMatch(nonBlank)
    }
  })

  test('breed names are unique ignoring case, so every name resolves to one code', () => {
    // Arrange
    const names = Object.values(breeds).map((name) => name.toLowerCase())

    // Act
    const uniqueNames = new Set(names)

    // Assert
    expect(uniqueNames.size).toBe(names.length)
  })

  test('getBreedName returns the name for a known code', () => {
    // Arrange
    const code = 'AA'

    // Act
    const result = getBreedName(code)

    // Assert
    expect(result).toEqual('Aberdeen Angus')
  })

  test('getBreedName ignores the case of the code', () => {
    // Arrange
    const code = 'aax'

    // Act
    const result = getBreedName(code)

    // Assert
    expect(result).toEqual('Aberdeen Angus Cross')
  })

  test('getBreedName returns undefined for an unknown code', () => {
    // Arrange
    const code = 'NOT-A-BREED'

    // Act
    const result = getBreedName(code)

    // Assert
    expect(result).toBeUndefined()
  })

  test('getBreedName does not resolve inherited object keys', () => {
    // Arrange
    const code = 'constructor'

    // Act
    const result = getBreedName(code)

    // Assert
    expect(result).toBeUndefined()
  })

  test('getBreedName returns undefined for a missing code', () => {
    // Arrange
    const code = undefined

    // Act
    let result, error
    try {
      result = getBreedName(code)
    } catch (e) {
      error = e
    }

    // Assert
    expect(error).toBeUndefined()
    expect(result).toBeUndefined()
  })

  test('getBreedCode returns the code for a known name', () => {
    // Arrange
    const name = 'Aberdeen Angus'

    // Act
    const result = getBreedCode(name)

    // Assert
    expect(result).toEqual('AA')
  })

  test('getBreedCode ignores the case of the name', () => {
    // Arrange
    const name = 'aberdeen ANGUS cross'

    // Act
    const result = getBreedCode(name)

    // Assert
    expect(result).toEqual('AAX')
  })

  test('getBreedCode matches a straight apostrophe against a curly one', () => {
    // Arrange
    const name = "Blonde D'Aquitaine"

    // Act
    const result = getBreedCode(name)

    // Assert
    expect(result).toEqual('BA')
  })

  test('getBreedCode matches a curly apostrophe', () => {
    // Arrange
    const name = 'blonde d’aquitaine cross'

    // Act
    const result = getBreedCode(name)

    // Assert
    expect(result).toEqual('BAX')
  })

  test('getBreedCode returns undefined for an unknown name', () => {
    // Arrange
    const name = 'Not a breed'

    // Act
    const result = getBreedCode(name)

    // Assert
    expect(result).toBeUndefined()
  })

  test('getBreedCode does not resolve inherited object keys', () => {
    // Arrange
    const name = 'constructor'

    // Act
    const result = getBreedCode(name)

    // Assert
    expect(result).toBeUndefined()
  })

  test('getBreedCode returns undefined for a missing name', () => {
    // Arrange
    const name = undefined

    // Act
    let result, error
    try {
      result = getBreedCode(name)
    } catch (e) {
      error = e
    }

    // Assert
    expect(error).toBeUndefined()
    expect(result).toBeUndefined()
  })

  test('every breed round-trips through getBreedCode and getBreedName', () => {
    // Arrange
    const entries = Object.entries(breeds)

    // Act
    const result = entries.map(([, name]) => getBreedName(getBreedCode(name)))

    // Assert
    expect(result).toEqual(entries.map(([, name]) => name))
  })
})
