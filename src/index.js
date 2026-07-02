import { breeds } from './breeds.js'

export const species = {
  id: 'cattle',
  label: 'Cattle',
  summary: 'Shared behaviour and wording for cattle journeys.'
}

export const comboBreeds = [
  { value: null, text: null },
  ...breeds.map((x) => ({ value: x.code, text: x.name }))
]
