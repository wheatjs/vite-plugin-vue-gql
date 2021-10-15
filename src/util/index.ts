export { definePlugin, useVueRequest, defineModule, defineModules, applyTransforms, applyConfigs } from './plugin'

export function intersects(arr1: string[], arr2: string[]) {
  return arr1.find(val => arr2.includes(val))
}

export function getPossiblePrototypes() {
  return [
    ...Object.getOwnPropertyNames(Array.prototype),
    ...Object.getOwnPropertyNames(Object.prototype),
  ]
}

export function isValidHttpUrl(input: string) {
  let url

  try {
    url = new URL(input)
  }
  catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
