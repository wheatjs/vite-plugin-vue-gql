import urql from '@urql/vue'
import { UserModule } from '~/types'

export const install: UserModule = ({ isClient, app }) => {
  if (!isClient)
    return

  app.use(urql, { url: 'https://spotify-graphql-server.herokuapp.com/graphql' })
}
