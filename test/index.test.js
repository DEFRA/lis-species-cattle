import { describe, expect, it } from 'vitest'

import * as breedsModule from '../src/breeds.js'
import * as index from '../src/index.js'

const { species } = index

describe('species', () => {
  it('exports the cattle metadata', () => {
    expect(species).toEqual({
      id: 'cattle',
      label: 'Cattle',
      summary: 'Shared behaviour and wording for cattle journeys.'
    })
  })
})

describe('breed exports', () => {
  it('re-exports the breed lookups from breeds.js', () => {
    expect(index.breeds).toBe(breedsModule.breeds)
    expect(index.getBreedName).toBe(breedsModule.getBreedName)
    expect(index.getBreedCode).toBe(breedsModule.getBreedCode)
  })
})
