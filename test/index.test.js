import { describe, expect, it } from 'vitest'

import { breeds } from '../src/breeds.js'
import { comboBreeds, species } from '../src/index.js'

describe('species', () => {
  it('exports the cattle metadata', () => {
    expect(species).toEqual({
      id: 'cattle',
      label: 'Cattle',
      summary: 'Shared behaviour and wording for cattle journeys.'
    })
  })
})

describe('comboBreeds', () => {
  it('starts with an empty option', () => {
    expect(comboBreeds[0]).toEqual({ value: null, text: null })
  })

  it('maps every breed to a combo-box option', () => {
    expect(comboBreeds.slice(1)).toEqual(
      breeds.map(({ code, name }) => ({ value: code, text: name }))
    )
  })
})
