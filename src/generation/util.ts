import { set } from 'lodash'

export function removePrototypesFromPaths(paths: string[], prototypes: string[]) {
  return paths.map((path) => {
    if (prototypes.includes(path.split('.').slice(-1)[0]))
      return path.slice(0, path.lastIndexOf('.'))
    return path
  })
}

export function convertPathsToObject(paths: string[]) {
  const gql = {}

  paths
    .sort((a, b) => a.split('.').length - b.split('.').length)
    .forEach((path) => {
      set(gql, path, '__VQL__REPLACE__')
    })

  return gql
}
