export { definePlugin, useVueRequest, defineModule, defineModules, applyTransforms } from './plugin'

export function intersects(arr1: string[], arr2: string[]) {
  return arr1.find(val => arr2.includes(val))
}

export function getPossiblePrototypes() {
  return [
    ...Object.getOwnPropertyNames(Array.prototype),
    ...Object.getOwnPropertyNames(Object.prototype),
  ]
}
