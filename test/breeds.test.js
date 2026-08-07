import { describe, expect, it } from 'vitest'

import { breedsAToK } from '../src/breeds-a-to-k.js'
import { breedsLToZ } from '../src/breeds-l-to-z.js'
import { breeds } from '../src/breeds.js'

describe('breeds', () => {
  it('combines the two breed lists in order', () => {
    expect(breeds).toEqual([...breedsAToK, ...breedsLToZ])
  })

  it('contains breeds with non-empty codes and names', () => {
    expect(breeds.length).toBeGreaterThan(0)

    for (const breed of breeds) {
      expect(breed).toEqual({
        code: expect.stringMatching(/\S/),
        name: expect.stringMatching(/\S/)
      })
    }
  })

  it('contains unique breed codes', () => {
    const codes = breeds.map(({ code }) => code)

    expect(new Set(codes).size).toBe(codes.length)
  })
})
