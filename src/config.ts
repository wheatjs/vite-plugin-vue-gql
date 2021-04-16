import { UserOptions } from './types'

interface Config {
  root: string
  options: UserOptions
}

export const config: Config = {
  root: '',
  options: {},
}
