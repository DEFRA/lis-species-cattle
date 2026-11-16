import { describe, expect, it } from 'vitest'

import * as breedsModule from '../src/breeds.js'
import * as earTagsModule from '../src/ear-tags.js'
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

describe('ear tag exports', () => {
  it('re-exports the ear tag formats and lookups from ear-tags.js', () => {
    expect(index.ANY_EAR_TAG_FORMAT).toBe(earTagsModule.ANY_EAR_TAG_FORMAT)
    expect(index.UK_NUMERIC).toBe(earTagsModule.UK_NUMERIC)
    expect(index.XI_NUMERIC).toBe(earTagsModule.XI_NUMERIC)
    expect(index.UK_ALPHANUMERIC).toBe(earTagsModule.UK_ALPHANUMERIC)
    expect(index.UK_CHECK_LETTER).toBe(earTagsModule.UK_CHECK_LETTER)
    expect(index.COUNTRY_NUMERIC).toBe(earTagsModule.COUNTRY_NUMERIC)
    expect(index.NO_COUNTRY_CODE).toBe(earTagsModule.NO_COUNTRY_CODE)
    expect(index.earTagFormat).toBe(earTagsModule.earTagFormat)
    expect(index.isSameEarTag).toBe(earTagsModule.isSameEarTag)
  })
})
